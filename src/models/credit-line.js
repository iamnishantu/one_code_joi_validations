const mongoose = require('mongoose');

const CreditLineSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    credit_limit: {
        type: Number,
        default: 0
    },
    transactions: {
        type: [{
            date: {
                type: Date,
                default: new Date()
            },
            amount: {
                type: Number
            },
            withdrawal_mode: {
                type: String,
                enum: ['bank', 'paytm']
            }
        }]
    }
})

const CreditLineModel = mongoose.model('credit_line', CreditLineSchema);
module.exports = CreditLineModel;