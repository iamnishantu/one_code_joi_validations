const {userService} = require('../services');
const {ValidationError} = require('../errors');

exports.signup = async (req, res, next) => {
    try{
        const result = await userService.signup(req.body);

        return res.status(200).json({
            msg: result.msg
        })
    } catch(error){
        if(error instanceof ValidationError){
            error.status = 400;
        }
        next(error);
    }
}

exports.verifyRegistration = async (req, res, next) => {
    try{
        const result = await userService.verifyRegistration(req.body);

        return res.status(200).json({
            msg: result.msg,
            data: result.data
        })
    } catch(error){
        if(error instanceof ValidationError){
            error.status = 400;
        }
        next(error);
    }
}

exports.getAllUsers = async (req, res, next) => {
    try{
        let page = 0;
        if(req.query.page){
            page = req.query.page - 1;
        }

        const result = await userService.getAllUsers(page);

        return res.status(200).json({
            msg: result.msg,
            data: result.data
        })
    } catch(error){
        next(error);
    }
}

exports.getUserAdmin = async (req, res, next) => {
    try{
        const result = await userService.getUser(req.params.userId);

        return res.status(200).json({
            msg: result.msg,
            data: result.data
        })
    } catch(error){
        if(error instanceof ValidationError){
            error.status = 400;
        }
        next(error);
    }
}

exports.getUser = async (req, res, next) => {
    try{
        const result = await userService.getUser(req.user._id);

        return res.status(200).json({
            msg: result.msg,
            data: result.data
        })
    } catch (error) {
        if(error instanceof ValidationError){
            error.status = 400;
        }
        next(error);
    }
}

exports.login = async (req, res, next) => {
    try{
        const result = await userService.login(req.body.userIdentifier);

        return res.status(200).json({
            msg: result.msg
        })
    } catch(error){
        if(error instanceof ValidationError){
            error.status = 400;
        }
        next(error);
    }
}

exports.loginOtpVerification = async (req, res, next) => {
    try{
        const result = await userService.loginOtpVerification(req.body.userIdentifier, req.body.otp);

        return res.status(200).json({
            msg: result.msg,
            data: result.data
        })
    } catch(error) {
        if(error instanceof ValidationError){
            error.status = 400;
        }
        next(error);
    }
}

exports.loginWithFacebook = async (req, res, next) => {
    try{
        const result = await userService.loginWithFacebook(req.body.fbToken);

        return res.status(200).json({
            msg: result.msg,
            data: result.data
        })
    } catch(error) {
        if(error instanceof ValidationError){
            error.status = 400;
        }
        next(error);
    }
}

exports.getUserPersonalDetails = async (req, res, next) => {
    try{
        const result = await userService.getPersonalDetails(req.user._id);

        return res.status(200).json({
            msg: result.msg,
            data: result.data
        })
    } catch(error){
        if(error instanceof ValidationError){
            error.status = 400;
        }
        next(error);
    }
}

exports.updateUserDetails = async (req, res, next) => {
    try{
        const result = await userService.updatePersonalDetails(req.user._id, req.body);

        return res.status(200).json({
            msg: result.msg,
            data: result.data
        })
    } catch(error) {
        if(error instanceof ValidationError){
            error.status = 400;
        }
        next(error);
    }
}

exports.getBankDetails = async (req, res, next) => {
    try{
        const result = await userService.getBankDetails(req.user._id);

        return res.status(200).json({
            msg: result.msg,
            data: result.data
        })
    } catch (error) {
        if(error instanceof ValidationError){
            error.status = 400;
        }
        next(error);
    }
}

exports.updateBankDetails = async (req, res, next) => {
    try{
        const result = await userService.updateBankDetails(req.user._id, req.body);

        return res.status(200).json({
            msg: result.msg,
            data: result.data
        })
    } catch(error) {
        if(error instanceof ValidationError){
            error.status = 400;
        }
        next(error);
    }
}

exports.updateAadhaarNumber = async (req, res, next) => {
    try{
        const result = await userService.updateAadhaarNumber(req.user._id, req.body.aadhaarCardnumber);

        return res.status(200).json({
            msg: result.msg
        })
    } catch(error){
        if(error instanceof ValidationError){
            error.status = 400;
        }
        next(error);
    }
}

exports.updatePanNumber = async (req, res, next) => {
    try{
        const result = await userService.updatePanNumber(req.user._id, req.body.panNumber);

        return res.status(200).json({
            msg: result.msg
        })
    } catch(error) {
        if(error instanceof ValidationError){
            error.status = 400;
        }
        next(error);
    }
}

exports.updateProfileImage = async (req, res, next) => {
    try{
        if(!req.file){
            throw new ValidationError('profile image not provided');
        }

        const image = `${process.env.BASE_URL}public/images/${req.file.filename}`;

        const result = await userService.updateProfileImage(req.user._id, image);

        return res.status(200).json({
            msg: result.msg
        });
        
    } catch (error) {
        if(error instanceof ValidationError){
            error.status = 400;
        }
        next(error);
    }
}

exports.updatePhoneNumber = async (req, res, next) => {
    try {
        const result = await userService.updatePhoneNumber(req.user._id, req.body.phoneNumber);

        return res.status(200).json({
            msg: result.msg
        })
    } catch(error){
        next(error);
    }
}

exports.verifyPhoneNumber = async (req, res, next) => {
    try {
        const result = await userService.verifyPhoneNumber(
            req.user._id, 
            req.body.phoneNumber, 
            req.body.otp
        );

        return res.status(200).json({
            msg: result.msg
        })
    } catch (error){
        if(error instanceof ValidationError){
            error.status = 400;
        }
        next(error);
    }
}

exports.loginWithGoogle = async (req, res, next) => {
    try{
        const result = await userService.loginWithGoogle(req.body.googleIdToken);

        return res.status(200).json({
            msg: result.msg,
            data: result.data
        })
    } catch(error) {
        if(error instanceof ValidationError){
            error.status = 400;
        }
        next(error);
    }
}