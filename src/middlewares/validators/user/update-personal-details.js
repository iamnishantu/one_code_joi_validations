const Joi = require('joi');
const validators = require('../validators');

const schema = Joi.object({
    name: Joi.string().max(30).optional(),
    date_of_birth: Joi.date(),
    email: Joi.string().trim().email().optional(),
    phone_number: Joi.string().length(10).pattern(/^\d{10}$/).optional(),
    profession: Joi.string().lowercase().valid('student', 'salaried', 'businessman').optional(),
    gender: Joi.string().lowercase().valid('male', 'female', 'other').optional(),
    state: Joi.string().lowercase().optional(),
    city: Joi.string().lowercase().optional(),
    pin_code: Joi.string().trim().length(6).pattern(/^\d{6}$/).optional()
})

module.exports = validators.getBodyValidationMiddleware(schema);