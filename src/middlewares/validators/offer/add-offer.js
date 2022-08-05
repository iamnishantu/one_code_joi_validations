const Joi = require('joi');
const {ObjectId} = require('mongoose').Types;
const validators = require('../validators');

const schema = Joi.object({
    category: Joi.custom((value, handler) => {
        if(!ObjectId.isValid(value)){
            throw new Error('invalid categoryId')
        }
    }).required(),
    brand: Joi.custom((value, handler) => {
        if(!ObjectId.isValid(value)){
            throw new Error('invalid categoryId')
        }
    }).required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    start_date: Joi.date(),
    end_date: Joi.date(),
    media: Joi.object({
        media_type: Joi.string().valid('image', 'video').required(),
        url: Joi.string().uri().required()
    }),
    how_it_works: Joi.array().items(Joi.string()).required(),
    terms_and_conditions: Joi.array().items(Joi.string()).required(),
    features: Joi.array().items(Joi.string()).required(),
    fees_and_charges: Joi.array().items(Joi.string()).required(),
    instructions: Joi.array().items(Joi.string()).required(),
    process: Joi.array().items(Joi.string()).required(),
    document_required: Joi.array().items(Joi.string()).required(),
    faq: Joi.array().items(Joi.object({
        question: Joi.string().required(),
        answer: Joi.string().required()
    })),
    commission: Joi.number().greater(0).required(),
    list_description: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required()
    }),
    banner: Joi.object({
        title: Joi.string().required(),
        content: Joi.string().required()
    }),
    image: Joi.string().uri().required(),
    offer_link: Joi.string().uri().required()
})

module.exports = validators.getBodyValidationMiddleware(schema);