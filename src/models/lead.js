const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    offer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'offer'
    },
    status: {
        type: String,
        enum: ['incomplete', 'completed', 'rejected', 'pending', 'in process'],
        default: 'incomplete'
    },
    date: {
        type: Date,
        default: new Date()
    },
    status_updated_on: {
        type: Date
    }
}, {
    timestamps: true,
    toObject: {versionKey: false}
})

const LeadModel = mongoose.model('lead', LeadSchema);
module.exports = LeadModel;