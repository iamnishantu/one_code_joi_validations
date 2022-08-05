const Joi = require('joi');
const validators = require('../validators');

const schema = Joi.object({
    name: Joi.string().min(2).max(30).required(),
    phone_number: Joi.string().length(10).pattern(/^\d{10}$/),
    email: Joi.string().email().required(),
    state: Joi.string().required(),
    city: Joi.string().required(),
    referal_code: Joi.string().alphanum().length(9).optional()
})

module.exports = validators.getBodyValidationMiddleware(schema);