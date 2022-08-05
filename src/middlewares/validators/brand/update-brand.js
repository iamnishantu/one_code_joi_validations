const Joi = require('joi');
const {ObjectId} = require('mongoose').Types;
const validators = require('../validators');

const updateSchema = Joi.object({
    name: Joi.string().min(2).max(20).optional(),
    description: Joi.string().optional(),
    url: Joi.string().uri().optional()
})

const brandId = Joi.object({
    brandId: Joi.custom((value, helper) => {
        if(!ObjectId.isValid(value)){
            throw new Error('invalid brandId')
        }
    })
})

module.exports = {
    brandId: validators.getParamsValidationMiddleware(brandId),
    updatePayload: validators.getBodyValidationMiddleware(updateSchema)
}