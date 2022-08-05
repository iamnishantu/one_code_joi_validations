const mongoose = require('mongoose');
const otpSchema = require('./schema/otp');

const AdminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
    },
    phone_number: {
        type: String,
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    image: {
        type: String,
    },
    otp: {
        type: otpSchema,
        select: false
    }
}, {
    timestamps: true,
    toObject: {versionKey: false}
})

const AdminModel = mongoose.model('admin', AdminSchema);
module.exports = AdminModel;