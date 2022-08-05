const Joi = require('joi');
const validators = require('../validators');
const {ObjectId} = require('mongoose').Types;

const schema = Joi.object({
    offerId: Joi.custom((value, helper) => {
        if(!ObjectId.isValid(value)){
            throw new Error('invalid offerId');
        }
    }),
    category: Joi.custom((value, handler) => {
        if(!ObjectId.isValid(value)){
            throw new Error('invalid categoryId')
        }
    }),
    brand: Joi.custom((value, handler) => {
        if(!ObjectId.isValid(value)){
            throw new Error('invalid categoryId')
        }
    }),
    name: Joi.string(),
    description: Joi.string(),
    start_date: Joi.date(),
    end_date: Joi.date(),
    media: Joi.object({
        media_type: Joi.string().valid('image', 'video').required(),
        url: Joi.string().uri().required()
    }),
    how_it_works: Joi.array().items(Joi.string()),
    terms_and_conditions: Joi.array().items(Joi.string()),
    features: Joi.array().items(Joi.string()),
    fees_and_charges: Joi.array().items(Joi.string()),
    instructions: Joi.array().items(Joi.string()),
    process: Joi.array().items(Joi.string()),
    document_required: Joi.array().items(Joi.string()),
    faq: Joi.array().items(Joi.object({
        question: Joi.string().required(),
        answer: Joi.string().required()
    })),
    commission: Joi.number().greater(0),
    list_description: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required()
    }),
    banner: Joi.object({
        title: Joi.string().required(),
        content: Joi.string().required()
    }),
    image: Joi.string().uri(),
    offer_link: Joi.string().uri()
})

module.exports = validators.getBodyValidationMiddleware(schema);