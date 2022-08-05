const Joi = require('joi');
const validators = require('../validators');

const schema = Joi.object({
    phone_number: Joi.string().length(10).pattern(/^\d{10}$/).required(),
    email: Joi.string().email().required(),
    emailOtp: Joi.string().length(4).pattern(/^\d{4}$/).required(),
    smsOtp: Joi.string().length(4).pattern(/^\d{4}$/).required()
})

module.exports = validators.getBodyValidationMiddleware(schema);