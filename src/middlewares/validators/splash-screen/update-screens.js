const Joi = require('joi');
const validators = require('../validators');

const screenSchema = Joi.object({
    screenIndex: Joi.number().integer().min(1).max(3).required(),
    image: Joi.string().uri().required(),
    title: Joi.string().required(),
    description: Joi.string().required()
})

const splashScreenSchema = Joi.object({
    screens: Joi.array().max(3).items(screenSchema).required(),
})

module.exports = validators.getBodyValidationMiddleware(splashScreenSchema);