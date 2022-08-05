const mongoose = require('mongoose');

const TrainingVideoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    }
},{
    timestamps: true,
    toObject: {versionKey: false}
})

const TrainingVideoModel = mongoose.model('training_video', TrainingVideoSchema);
module.exports = TrainingVideoModel;