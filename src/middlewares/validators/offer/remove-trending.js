const Joi = require('joi');
const validators = require('../validators');
const {ObjectId} = require('mongoose').Types;

const schema = Joi.object({
    offerId: Joi.custom((value, helper) => {
        if(!ObjectId.isValid(value)){
            throw new Error('invalid videoId');
        }
        return value;
    }).required()
})

module.exports = validators.getBodyValidationMiddleware(schema);