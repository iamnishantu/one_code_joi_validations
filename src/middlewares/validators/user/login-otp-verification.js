const Joi = require('joi');
const validators = require('../validators');

const schema = Joi.object({
    userIdentifier: Joi.alternatives(Joi.string().email(), Joi.string().length(10).pattern(/^\d{10}$/)).required(),
    otp: Joi.string().length(4).pattern(/^\d{4}$/).required()
})

module.exports = validators.getBodyValidationMiddleware(schema);