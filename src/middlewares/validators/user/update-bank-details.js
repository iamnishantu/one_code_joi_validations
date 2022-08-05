const Joi = require('joi');
const validators = require('../validators');

const schema = Joi.object({
    name: Joi.string().min(2).max(30).optional(),
    ifsc_code: Joi.string().length(11).optional(),
    bank_name: Joi.string().min(5).max(30).optional(),
    account_number: Joi.string().min(9).max(18).optional(),
    confirm_account_number: Joi.ref("account_number")
}).with('account_number', 'confirm_account_number')

module.exports = validators.getBodyValidationMiddleware(schema);