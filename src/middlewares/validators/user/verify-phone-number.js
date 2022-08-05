const Joi = require('joi');
const validators = require('../validators');

const schema = Joi.object({
    phoneNumber: Joi.string().length(10).pattern(/^\d{10}$/).optional(),
    otp: Joi.string().length(4).pattern(/^\d{4}$/).required()
})

module.exports = validators.getBodyValidationMiddleware(schema);