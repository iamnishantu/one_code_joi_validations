const Joi = require('joi');
const validators = require('../validators');

const schema = Joi.object({
    aadhaarCardNumber: Joi.string().length(12).pattern(/^\d+$/).required()
})

module.exports = validators.getBodyValidationMiddleware(schema);