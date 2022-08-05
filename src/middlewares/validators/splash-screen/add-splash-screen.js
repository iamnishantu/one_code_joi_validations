const Joi = require('joi');
const validators = require('../validators');

const screenSchema = Joi.object({
    image: Joi.string().uri().required(),
    title: Joi.string().required(),
    description: Joi.string().required()
})

const splashScreenSchema = Joi.object({
    video_link: Joi.string().uri().required(),
    screens: Joi.array().length(3).items(screenSchema).required(),
    title: Joi.string().required()
})

module.exports = validators.getBodyValidationMiddleware(splashScreenSchema);