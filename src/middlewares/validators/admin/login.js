const Joi = require('joi');
const validators = require('../validators');

const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
})

module.exports = validators.getBodyValidationMiddleware(schema);