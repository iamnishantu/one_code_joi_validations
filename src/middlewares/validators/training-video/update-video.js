const {ObjectId} = require('mongoose').Types;
const Joi = require('joi');
const validators = require('../validators');

const videoIdSchema = Joi.object({
    videoId: Joi.custom((value, helper) => {
        if(!ObjectId.isValid(value)){
            throw new Error('invalid videoId');
        }
        return value;
    })
})

const updatePayloadSchema = Joi.object({
    name: Joi.string(),
    url: Joi.string().uri()
})

module.exports = {
    videoId: validators.getParamsValidationMiddleware(videoIdSchema),
    updatePayload: validators.getBodyValidationMiddleware(updatePayloadSchema)
}