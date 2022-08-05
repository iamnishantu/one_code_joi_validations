const Joi = require('joi');
const {ObjectId} = require('mongoose').Types;
const validators = require('../validators');

const schema = Joi.object({
    creditLimit: Joi.number().min(0).required(),
    userId: Joi.custom((value, helper) => {
        if(!ObjectId(value)){
            throw new Error('invalid userId');
        }
    })
})

module.exports = validators.getBodyValidationMiddleware(schema);