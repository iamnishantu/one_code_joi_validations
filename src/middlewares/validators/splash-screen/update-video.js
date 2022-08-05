const Joi = require('joi');
const validators = require('../validators');

const splashScreenSchema = Joi.object({
    video_link: Joi.string().uri().required(),
})

module.exports = validators.getBodyValidationMiddleware(splashScreenSchema);