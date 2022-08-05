const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String
    },
    description: {
        type: String,
    },
    image: {
        type: String
    },
    priority: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toObject: {versionKey: false}
});

const CategoryModel = mongoose.model('category', CategorySchema);
module.exports = CategoryModel;