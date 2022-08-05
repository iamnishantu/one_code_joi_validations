const Joi = require('joi');
const validators = require('../validators');

const schema = Joi.object({
    panNumber: Joi.string().length(10).uppercase().alphanum().required()
})

module.exports = validators.getBodyValidationMiddleware(schema);