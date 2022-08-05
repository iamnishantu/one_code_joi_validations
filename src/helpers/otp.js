const moment = require('moment')

exports.generateOTP = async function(){
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++ ) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

/**
 * 
 * @param {Object} OTPPayload
 * @param {Number} OTPPayload.created - unix timestamp (in seconds)
 * @param {String} OTPPayload.userOTP - otp sent in request
 * @param {String} OTPPayload.magnitude - otp magnitude
 * @param {String} OTPPayload.reqOTPType - type for which otp verification is invoked (verification, password_reset)
 * @param {String} OTPPayload.type - type for which otp was generated
 * @returns 
 */
exports.verifyOTP = async (OTPPayload) => {
    try{
        console.log(OTPPayload)
        const createdDate = moment.utc(OTPPayload.created);
        const endDate = moment.utc(createdDate).add(15, 'minutes');
        const isValidTime = moment().utc().isBetween(createdDate, endDate);
        const isMatch = (OTPPayload.userOTP === OTPPayload.magnitude);
        const isTypeMatch = (OTPPayload.reqOTPType === OTPPayload.type)
        console.log(createdDate);
        console.log(endDate);
        console.log(moment().utc());
        console.log(isValidTime);
        console.log(isMatch);
        if(!isMatch || !isValidTime || !isTypeMatch){
            return false;
        }

        return true;
    } catch(error){
        throw error;
    }
}