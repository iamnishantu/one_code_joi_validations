const Joi = require('joi');
const {ObjectId} = require('mongoose').Types;
const validators = require('../validators');

const schema = Joi.object({
    categoryId: Joi.custom((value, helper) => {
        if(!ObjectId.isValid(value)){
            throw new Error('invalid categoryId');
        }
        return value;
    })
})

module.exports = validators.getParamsValidationMiddleware(schema);