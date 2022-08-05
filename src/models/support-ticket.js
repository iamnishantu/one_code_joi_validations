const mongoose = require('mongoose');

const SupportTicketSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    comment: {
        type: String,
    },
    status: {
        type: String,
        enum: ['active', 'resolved']
    }
}, {
    timestamps: true,
    toObject: {versionKey: false}
})

const SupportTicketModel = mongoose.model('support_ticket', SupportTicketSchema);
module.exports = SupportTicketModel;