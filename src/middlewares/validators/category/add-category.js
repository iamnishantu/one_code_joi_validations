const Joi = require('joi');
const validators = require('../validators');

const schema = Joi.object({
    name: Joi.string().min(2).max(20).required(),
    description: Joi.string().min(2).max(50).required(),
})

module.exports = validators.getBodyValidationMiddleware(schema);