const Joi = require('joi');
const validators = require('../validators');


const splashScreenSchema = Joi.object({
    title: Joi.string().required()
})

module.exports = validators.getBodyValidationMiddleware(splashScreenSchema);