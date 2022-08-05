const Joi = require('joi');
const {ObjectId} = require('mongoose').Types;
const validators = require('../validators');

const schema = Joi.object({
    brandId: Joi.custom((value, helper) => {
        if(!ObjectId.isValid(value)){
            throw new Error('invalid brandId');
        }
        return value;
    })
})

module.exports = validators.getParamsValidationMiddleware(schema);