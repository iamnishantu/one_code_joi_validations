const Joi = require('joi');
const validators = require('../validators');

const schema = Joi.object({
    name: Joi.string().required(),
    url: Joi.string().uri().required()
})

module.exports = validators.getBodyValidationMiddleware(schema);