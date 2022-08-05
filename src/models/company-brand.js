const mongoose = require('mongoose');

const BrandSchema = new mongoose.Schema({
    name: {
        type: String
    },
    url: {
        type: String
    },
    image: {
        type: String
    },
    description: {
        type: String
    }
}, {
    timestamps: true,
    toObject: {versionKey: false}
})

const BrandModel = mongoose.model('brand', BrandSchema);
module.exports = BrandModel;