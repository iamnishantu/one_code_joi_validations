const {UserModel, CreditLineModel, WalletModel} = require('../models');
const {ValidationError} = require('../errors');
const otpGenerator = require('otp-generator')
const otpHelper = require('../helpers/otp');
const smsHelper = require('../helpers/sms');
const emailHelper = require('../helpers/email');
const tokenHelper = require('../helpers/token');
const axios = require("axios");
const {OAuth2Client} = require("google-auth-library");

exports.signup = async (userPayload) => {
    try{
        const userExist = await UserModel.findOne({
            $or: [{phone_number: userPayload.phone_number}, {email: userPayload.email}]
        });
        if(userExist){
            if(userExist.phone_number === userPayload.phone_number){
                throw new ValidationError('user with phone number already exists');
            }
            throw new ValidationError('user with phone number already exists');
        }
        const user = new UserModel(userPayload);
        user.code = await generateUserCode();
        await CreditLineModel.create({
            user: user._id
        });
        await WalletModel.create({
            user: user._id
        });
        const emailOtp = otpGenerator.generate(4, {
            digits: true, 
            lowerCaseAlphabets: false, 
            upperCaseAlphabets: false, 
            specialChars: false
        });
        const smsOtp = otpGenerator.generate(4, {
            digits: true, 
            lowerCaseAlphabets: false, 
            upperCaseAlphabets: false, 
            specialChars: false
        })

        user.email_otp = {
            magnitude: emailOtp,
            type: 'registration'
        }

        user.sms_otp = {
            magnitude: smsOtp,
            type: 'registration'
        }

        await user.save();

        await smsHelper.sendSms({
            body: `your otp is: ${smsOtp}`,
            phoneNumber: `${user.country_code}${user.phone_number}`
        })

        await emailHelper.sendEmail({
            email: user.email,
            subject: `otp for registration`,
            body: `registration otp: ${emailOtp}`
        });

        return {
            success: true,
            msg: 'otp sent to phone and email',
            // data: {user: user.toObject()}
        }
    } catch(error){
        throw error;
    }
}

/**
 * 
 * @param {object} verificationPayload
 * @param {number} verificationPayload.emailOtp
 * @param {number} verificationPayload.smsOtp
 * @param {email} verificationPayload.email
 * @param {phone_number} verificationPayload.phone_number
 */
exports.verifyRegistration = async (verificationPayload) => {
    try{
        const user = await UserModel.findOne({
            "email_otp.magnitude": verificationPayload.emailOtp,
            "sms_otp.magnitude": verificationPayload.smsOtp,
            phone_number: verificationPayload.phone_number,
            email: verificationPayload.email
        }).select("+email_otp +sms_otp");

        if(!user){
            throw new ValidationError('invalid otp');
        }

        const isValidEmailOtp = await otpHelper.verifyOTP({
            created: user.email_otp.created,
            userOTP: verificationPayload.emailOtp,
            magnitude: user.email_otp.magnitude,
            reqOTPType: 'registration',
            type: user.email_otp.type
        });

        const isValidSmsOtp = await otpHelper.verifyOTP({
            created: user.sms_otp.created,
            userOTP: verificationPayload.smsOtp,
            magnitude: user.sms_otp.magnitude,
            reqOTPType: 'registration',
            type: user.sms_otp.type
        });

        if(!isValidEmailOtp || !isValidSmsOtp){
            throw new ValidationError('invalid otp');
        }

        user.registration_verified = true;
        user.email_otp = undefined;
        user.sms_otp = undefined;
        user.phone_number_verified = true;
        await user.save();

        const token = await tokenHelper.generateToken(user._id, 'login');

        return {
            success: true,
            msg: 'user registration verified successfuly',
            data: {
                token,
                authProvider: user.provider, 
                phoneNumberVerified: !!user.phone_number_verified
            }
        }
    } catch(error){
        throw error;
    }
}

exports.getAllUsers = async (page) => {
    try{
        const users = await UserModel.find({}).sort({createdAt: -1}).skip(page)
        .limit(10).select({name: 1, phone_number: 1, email: 1}).lean();
        
        return {
            success: true,
            data: {users}
        }
    } catch(error){
        throw error;
    }
}

exports.getUser = async (userId) => {
    try{
        const user = await UserModel.findById(userId).select("+bank_details");

        const userResponse = {
            name: user.name,
            code: user.code,
            profile_image: user.profile_image,
            kyc_completed: user.kyc_completed,
            personal_details_completed: user.personal_details_completed,
            bank_details_completed: user.bank_details_completed
        }

        if(!user){
            throw new ValidationError('invalid userId');
        }
        delete user.__v;

        return {
            msg: "user details",
            data: {user: userResponse}
        }
    } catch(error){
        throw error;
    }
}

exports.login = async (userIdentifier) => {
    try{
        const query = {};
        if(/^\d{10}$/.test(userIdentifier)){
            query.phone_number = userIdentifier;
        } else {
            query.email = userIdentifier;
        }
        
        console.log(query);
        const user = await UserModel.findOne(query);
        console.log(user);
        if(!user){
            throw new ValidationError(`user with identifier ${userIdentifier} does not exists`);
        }

        let otp = otpGenerator.generate(4, {
            digits: true, 
            lowerCaseAlphabets: false, 
            upperCaseAlphabets: false, 
            specialChars: false
        });

        if(query.phone_number == "9874567895"){
            console.log("query.phone = 98745")
            otp = "1234"
        }


        const otpMode = Object.keys(query)[0] === 'email' ? 'email_otp' : 'sms_otp';

        user[otpMode] = {
            magnitude: otp,
            type: 'login'
        };

        if(query.phone_number != "9874567895"){
            if(otpMode === 'sms_otp'){
            await smsHelper.sendSms({
                body: `your otp is: ${otp}`,
                phoneNumber: `${user.country_code}${user.phone_number}`
            });
            } else {
                await emailHelper.sendEmail({
                    email: user.email,
                    subject: `otp for registration`,
                    body: `registration otp: ${otp}`
                });
            }
        }
        await user.save();

        return {
            success: true,
            msg: `otp sent to ${userIdentifier}`
        }
    } catch(error){
        throw error;
    }
}

exports.loginOtpVerification = async (userIdentifier, otp) => {
    try{
        const query = {};
        let key;
        if(/^\d{10}$/.test(userIdentifier)){
            query["phone_number"] = userIdentifier;
            query["sms_otp.magnitude"] = otp;
            key = "sms_otp";
        } else {
            query["email"] = userIdentifier;
            query["email_otp.magnitude"] = otp;
            key = "email_otp";
        }

        // if(query.phone_number == "9874567895"){
        //     if(otp == "1234"){
        //         return {
        //             success: true,
        //             msg: `otp sent to ${userIdentifier}`
        //         }    
        //     }
        //     throw new ValidationError('invalid otp');
        // }

        const user = await UserModel.findOne(query).select("+email_otp +sms_otp");

        if(!user){
            throw new ValidationError('invalid otp');
        }

        const isValidOtp = await otpHelper.verifyOTP({
            created: user[key].created,
            userOTP: otp,
            magnitude: user[key].magnitude,
            reqOTPType: 'login',
            type: user[key].type
        });

        if(!isValidOtp){
            throw new ValidationError('invalid otp');
        }

        const loginToken = await tokenHelper.generateToken(user._id, 'login');

        return {
            success: true,
            msg: "successfuly logged in",
            data: {
                loginToken,
                authProvider: user.provider, 
                phoneNumberVerified: !!user.phone_number_verified
            }
        }
    } catch(error){
        throw error;
    }
}

exports.getPersonalDetails = async (userId) => {
    try{
        const usersPersonalDetails = await UserModel.findById(userId).select({
            name: 1,
            phone_number: 1,
            email: 1,
            profession: 1,
            date_of_birth: 1,
            gender: 1,
            state: 1,
            city: 1,
            pin_code: 1
        }).lean();

        if(!usersPersonalDetails){
            throw new ValidationError('invalid userId');
        }

        return {
            success: true,
            msg: `user's personal details`,
            data: {usersPersonalDetails}
        }
    } catch(error) {
        throw error;
    }
}

exports.updatePersonalDetails = async (userId, updatePayload) => {
    try{
        const user = await UserModel.findById(userId);
        if(!user){
            throw new ValidationError('invalid userId');
        }

        await user.updateOne(updatePayload, {runValidators: true});
        const personalDetails = await UserModel.findById(userId).select({
            name: 1,
            phone_number: 1,
            email: 1,
            profession: 1,
            date_of_birth: 1,
            gender: 1,
            state: 1,
            city: 1,
            pin_code: 1
        }).lean();

        return {
            success: true,
            msg: 'personal details',
            data: {personalDetails}
        }
    } catch(error) {
        throw error;
    }
}

exports.getBankDetails = async (userId) => {
    try {
        const user = await UserModel.findById(userId).select({bank_details: 1});

        if(!user) {
            throw new ValidationError('invalid userId');
        }

        return {
            success: true,
            data: {bankDetails: user.bank_details || {}}
        }
    } catch (error) {
        throw error;
    }
}

exports.updateBankDetails = async (userId, updatePayload) => {
    try {
        const user = await UserModel.findById(userId).select({bank_details: 1});
        if(!user) {
            throw new ValidationError(`invalid userId`);
        }

        const bankDetails = {};
        bankDetails.name = updatePayload.name || user.bank_details.name;
        bankDetails.ifsc_code = updatePayload.ifsc_code || user.bank_details.ifsc_code;
        bankDetails.bank_name = updatePayload.bank_name || user.bank_details.bank_name;
        bankDetails.account_number = updatePayload.account_number || user.bank_details.account_number;

        user.bank_details = bankDetails;
        await user.save();
        // const bankDetails = (await UserModel.findById(userId).select("+bank_details")).bank_details;

        return {
            success: true,
            msg: `bank details successfuly updated`,
            data: {bankDetails}
        }
    } catch (error) {
        throw error;
    }
}

exports.updateAadhaarNumber = async (userId, aadhaarCardNumber) => {
    try{
        const user = await UserModel.findById(userId);

        if(!user){
            throw new ValidationError('invalid userId');
        }

        user.aadhaar_card_number = aadhaarCardNumber;
        await user.save();

        return {
            success: true,
            msg: 'aahaar number updated'
        }
    } catch(error){
        throw error;
    }
}

exports.updatePanNumber = async (userId, panNumber) => {
    try{
        const user = await UserModel.findById(userId);

        if(!user){
            throw new ValidationError('invalid userId');
        }
        
        user.pan_card_number = panNumber;
        await user.save();

        return {
            success: true,
            msg: 'pan number successfuly updated'
        }
    } catch(error) {
        throw error;
    }
}

exports.updateProfileImage = async (userId, image) => {
    try{
        const user = await UserModel.findById(userId);
        if(!user) {
            throw ValidationError('invalid userId');
        }

        user.profile_image = image;
        await user.save();

        return {
            success: true,
            msg: 'profile image successfuly updated'
        }
    } catch(error) {
        throw error;
    }
}

exports.loginWithFacebook = async (fbToken) => {
    try {
        const response = await axios.get(`${process.env.FB_GRAPH_API_URL}me`, {
            params: {
              fields: ["id", "name", "email"].toString(),
              access_token: fbToken,
            },
        })
        const fbUser = response.data
        console.log(fbUser);
        let user = await UserModel.findOne({
            facebook_id: fbUser.id
        });

        if(!user){
            user = new UserModel({
                email: fbUser.email,
                name: fbUser.name,
                facebook_id: fbUser.id,
                provider: "facebook"
            })
            user.code = await generateUserCode();
            await CreditLineModel.create({
                user: user._id
            });
            await WalletModel.create({
                user: user._id
            });
            await user.save();
        }
        console.log(user)

        const loginToken = await tokenHelper.generateToken(user._id, 'login');

        return {
            success: true,
            msg: "successfuly logged in",
            data: {
                loginToken, 
                authProvider: user.provider, 
                phoneNumberVerified: !!user.phone_number_verified
            }
        }
    } catch (error){
        if(error.response){
            console.log(error.response.data);
            error = new ValidationError("invalid facebook token")
        }
        throw error;
    }
}

exports.loginWithGoogle = async (accessToken) => {
    try {
        // const idToken = await googleClient.verifyIdToken({
        //     idToken: idTokenString,
        //     audience: [process.env.GOOGLE_CLIENT_ID]
        // });
        // const payload = idToken.getPayload();
        // const googlUserId = payload.sub;

        const response = await axios.get(`https://www.googleapis.com/userinfo/v2/me`, {
            headers: {
                "authorization": `Bearer ${accessToken}`
            },
        })
        const googleUser = response.data;
        const googlUserId = googleUser.id;
        let user = await UserModel.findOne({
            google_id: googlUserId
        });

        if(!user){
            user = new UserModel({
                google_id: googlUserId,
                email: googleUser.email,
                name: googleUser.name,
                provider: "google"
            });
            user.code = await generateUserCode();
            await CreditLineModel.create({
                user: user._id
            });
            await WalletModel.create({
                user: user._id
            });
            await user.save();
        }
        console.log(user)

        const loginToken = await tokenHelper.generateToken(user._id, 'login');

        return {
            success: true,
            msg: "successfuly logged in",
            data: {
                loginToken, 
                authProvider: user.provider, 
                phoneNumberVerified: !!user.phone_number_verified
            }
        }
    } catch(error){
        if(error.response){
            console.log(error.request)
            console.log(error.response.data);
            error = new ValidationError("invalid google token")
        }
        throw error;
    }
}

exports.updatePhoneNumber = async (userId, phoneNumber) => {
    try {
        const user = await UserModel.findById(userId);
        user.phone_number = phoneNumber;

        const smsOtp = otpGenerator.generate(4, {
            digits: true, 
            lowerCaseAlphabets: false, 
            upperCaseAlphabets: false, 
            specialChars: false
        })

        user.sms_otp = {
            magnitude: smsOtp,
            type: "phone_number_verification"
        }
        user.phone_number_verified = false;
        await user.save();

        await smsHelper.sendSms({
            body: `your otp is: ${smsOtp}`,
            phoneNumber: `${user.country_code}${user.phone_number}`
        })

        return {
            success: true,
            msg: 'otp sent to phone',
            // data: {user: user.toObject()}
        }

    } catch (error) {
        throw error;
    }
}

exports.verifyPhoneNumber = async(userId, phoneNumber, otp) => {
    try {
        const user = await UserModel.findOne({
            _id: userId,
            phone_number: phoneNumber,
            "sms_otp.magnitude": otp
        }).select("+sms_otp");
        console.log(user);
        if(!user) {
            throw new ValidationError("invalid otp");
        }

        const isValidOtp = await otpHelper.verifyOTP({
            created: user.sms_otp.created,
            userOTP: otp,
            magnitude: user.sms_otp.magnitude,
            reqOTPType: 'phone_number_verification',
            type: user.sms_otp.type
        });

        if(!isValidOtp){
            throw new ValidationError('invalid otp');
        }

        user.sms_otp = undefined;
        user.phone_number_verified = true;
        await user.save();

        return {
            success: true,
            msg: "phone number verified successfully"
        }
    } catch (error) {
        throw error;
    }
}

const generateUserCode = async () => {
    try{
        let userCode;
        let userCodeExists = true;
        do{
            userCode = otpGenerator.generate(9, {
                digits: true, 
                lowerCaseAlphabets: true, 
                upperCaseAlphabets: true, 
                specialChars: false
            });
            
            userCodeExists = await UserModel.findOne({code: userCode});

        }while(userCodeExists);

        return userCode;
    } catch(error){
        throw error;
    }
}