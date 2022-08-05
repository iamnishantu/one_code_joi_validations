const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = require('twilio')(accountSid, authToken);

/**
 * 
 * @param {object} smsPayload
 * @param {string} smsPayload.body
 * @param {string} smsPayload.phoneNumber 
 */
exports.sendSms = async(smsPayload) => {
    try{
        console.log(smsPayload);
        const message = await twilioClient.messages.create({
            body: smsPayload.body,
            from: process.env.TWILIO_NUMBER,
            to: smsPayload.phoneNumber
        })
        // console.log(message);
    } catch(error){
        console.log(error);
        throw error;
    }
}