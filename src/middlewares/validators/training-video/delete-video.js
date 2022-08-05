const {ObjectId} = require('mongoose').Types;
const Joi = require('joi');
const validators = require('../validators');

const schema = Joi.object({
    videoId: Joi.custom((value, helper) => {
        if(!ObjectId.isValid(value)){
            throw new Error('invalid videoId');
        }
        return value;
    })
})

module.exports = validators.getParamsValidationMiddleware(schema);
