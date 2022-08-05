const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    },
    name: {
        type: String
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'brand'
    },
    description: {
        type: String
    },
    start_date: {
        type: Date
    },
    end_date: {
        type: Date
    },
    media: {
        media_type: {
            type: String,
            enum: ['image', 'video']
        },
        url: {
            type: String,
        }
    },
    how_it_works: {
        type: [String]
    },
    terms_and_conditions: {
        type: [String]
    },
    features: {
        type: [String]
    },
    fees_and_charges: {
        type: [String]
    },
    instructions: {
        type: [String]
    },
    process: {
        type: [String]
    },
    document_required: {
        type: [String]
    },
    faq: {
        type: [{
            question: {
                type: String
            },
            answer: {
                type: String
            },
            _id: false
        }]
    },
    commission: {
        type: Number
    },
    list_description: {
        type: {
            title: {
                type: String
            },
            description: {
                type: String
            }
        }
    },
    banner: {
        type: {
            title: {
                type: String
            },
            content: {
                type: String
            }
        }
    },
    image: {
        type: String
    },
    offer_link: {
        type: String,
        required: true
    },
    trending: {
        type: Boolean,
        default: false
    },
    trending_image: {
        type: String,
        select: false
    }
}, {
    timestamps: true,
    toObject: {versionKey: false}
})

const OfferModel = mongoose.model('offer', OfferSchema);
module.exports = OfferModel;