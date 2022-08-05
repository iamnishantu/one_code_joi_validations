const mongoose = require('mongoose');
const moment = require('moment')
const OTPSchema = new mongoose.Schema({
    magnitude: {
        type: String,
        required: true,
        index: true
    },
    created: {
        type: Date,
        // default: moment().utc()
        default: function () {
            return moment().utc();
        }
    },
    type: {
        type: String,
        enum: ['registration', 'password_reset', 'login', "phone_number_verification"]
    }
}, {
    _id: false,
    versionKey: false
});

module.exports = OTPSchema;