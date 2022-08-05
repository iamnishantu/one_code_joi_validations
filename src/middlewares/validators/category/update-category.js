const Joi = require('joi');
const {ObjectId} = require('mongoose').Types;
const validators = require('../validators');

const categoryIdSchema = Joi.object({
    categoryId: Joi.custom((value, helper) => {
        if(!ObjectId.isValid(value)){
            throw new Error('invalid catergoryId');
        }
        return value;
    }).required()
})
const updateSchema = Joi.object({
    name: Joi.string().min(2).max(20).optional(),
    description: Joi.string().min(2).max(50).optional()
})

module.exports = {
    categoryId: validators.getParamsValidationMiddleware(categoryIdSchema),
    updatePayload: validators.getBodyValidationMiddleware(updateSchema)
}