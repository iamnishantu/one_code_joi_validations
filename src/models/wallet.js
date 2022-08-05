const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    balance: {
        type: Number,
        default: 0
    },
    withdrawable: {
        type: Number,
        default: function () {
            return this.balance * 0.75;
        },
        get: function(){
            return this.balance * 0.75;
        }
    },
    transactions: {
        type:[{
            type: {
                type: String,
                enum: ['deposit', 'withdraw']
            },
            amount: {
                type: Number
            },
            date: {
                type: Date,
                default: new Date()
            },
            withdrawal_mode: {
                type: String,
                enum: ['bank', 'paytm']
            },
            credit_lead: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'lead'
            },
            _id: false
        }]
    }
})

const WalletModel = mongoose.model('wallet', WalletSchema);
module.exports = WalletModel;