const Joi = require('joi');
const validators = require('../validators.js');

const schema = Joi.object({
    startDate: Joi.date().required(),
    endDate: Joi.date().required()
})

module.exports = validators.getBodyValidationMiddleware(schema);