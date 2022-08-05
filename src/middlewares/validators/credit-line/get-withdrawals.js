const Joi = require('joi');
const {ObjectId} = require('mongoose').Types;
const validators = require('../validators');

const schema = Joi.object({
    userId: Joi.custom((value, helper) => {
        if(!ObjectId.isValid(value)){
            throw new Error('invalid userId');
        }
    }).optional()
})

module.exports = validators.getQueryValidationMiddleware(schema);