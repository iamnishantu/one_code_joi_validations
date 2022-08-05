const nodemailer = require('nodemailer');

const mailTransporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 587,
    auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY
    }
});

/**
 * 
 * @param {Object} emailPayload
 * @param {string} emailPayload.email
 * @param {string} emailPayload.subject
 * @param {string} emailPayload.body 
 */
exports.sendEmail = async (emailPayload) => {
    try{
        await mailTransporter.sendMail({
            from: `node3flyweis@gmail.com`,
            to: emailPayload.email,
            subject: emailPayload.subject,
            text: emailPayload.body
        });
    } catch(error){
        throw error;
    }
}