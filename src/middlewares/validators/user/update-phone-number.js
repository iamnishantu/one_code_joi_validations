const Joi = require('joi');
const validators = require('../validators');

const schema = Joi.object({
    phoneNumber: Joi.string().length(10).pattern(/^\d{10}$/).optional(),
})

module.exports = validators.getBodyValidationMiddleware(schema);