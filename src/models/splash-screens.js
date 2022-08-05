const mongoose = require('mongoose');

const SplashScreenSchema = new mongoose.Schema({
    video_link: {
        type: String,
    },
    screens: {
        type: [{
            image: {
                type: String,
                required: true
            },
            title: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            _id: false
        }]
    },
    // screen_images: {
    //     type: [String],
    // },
    title: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    toObject: {versionKey: false}
})

const SplashScreenModel = mongoose.model('splash_screen', SplashScreenSchema);
module.exports = SplashScreenModel;