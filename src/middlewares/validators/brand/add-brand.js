const Joi = require('joi');
const validators = require('../validators');

const schema = Joi.object({
    name: Joi.string().min(2).max(20).required(),
    url: Joi.string().uri().required(),
    description: Joi.string().optional()
})

module.exports = validators.getBodyValidationMiddleware(schema);