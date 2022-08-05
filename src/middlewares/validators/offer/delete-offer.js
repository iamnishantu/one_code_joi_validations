const Joi = require('joi');
const {ObjectId} = require('mongoose').Types
const validators = require('../validators');

const schema = Joi.object({
    offerId: Joi.custom((value, helper) => {
        if(!ObjectId.isValid(value)){
            throw new Error('invalid offerId');
        }
        return value;
    }).required()
})

module.exports = validators.getParamsValidationMiddleware(schema);