const mongoose = require('mongoose');
const otpSchema = require('./schema/otp');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        sparse: true,
    },
    phone_number: {
        type: String,
        unique: true,
        sparse: true
    },
    phone_number_verified: {
        type: Boolean,
        default: false
    },
    country_code: {
        type: String,
        default: "+91"
    },
    state: {
        type: String
    },
    city: {
        type: String
    },
    pin_code: {
        type: String,
        validate: {
            validator: (value) => {
                return /^\d{6}$/.test(value)
            },
            message: (props) => {
                console.log(props);
                return `${props.value} is not valid pin code`
            } 
        }
    },
    name: {
        type: String
    },
    date_of_birth: {
        type: Date
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other']
    },
    profession: {
        type: String,
        enum: ['student', 'salaried', 'businessman']
    },
    provider: {
        type: String,
        enum: ['password', 'google', 'facebook'],
        default: 'password'
    },
    facebook_id: {
        type: String,
        select: false
    },
    google_id: {
        type: String,
        select: false
    },
    aadhaar_card_number: {
        type: String,
        select: false
    },
    pan_card_number: {
        type: String,
        select: false
    },
    kyc_completed: {
        type: Boolean,
        default: false
    },
    personal_details_completed: {
        type: Boolean,
        default: false,
        get : function (){
            return !!(this.name && this.date_of_birth && 
                this.email && this.profession && this.gender && this.state && 
                this.city && this.pin_code);
        }
    },
    bank_details_completed: {
        type: Boolean,
        default: false,
        get: function () {
            return !!(this.bank_details)
        }
    },
    credit_line: {
        type: Number,
        default: 0
    },
    email_otp: {
        type: otpSchema,
        select: false
    },
    sms_otp: {
        type: otpSchema,
        select: false
    },
    bank_details: {
        type: new mongoose.Schema({
            name: {
                type: String
            },
            bank_name: {
                type: String
            },
            ifsc_code: {
                type: String
            },
            account_number: {
                type: String
            }
        }, {_id: false}),
        select: false
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    profile_image: {
        type: String
    }
}, {
    timestamps: true,
    toObject: {versionKey: false}
})

const UserModel = mongoose.model('user', UserSchema);
module.exports = UserModel;