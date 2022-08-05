const {SplashScreenModel} = require('../models');
const {ValidationError} = require('../errors');

exports.addSplashScreen = async (payload) => {
    try{
        const splashScreenExists = await SplashScreenModel.findOne({});
        if(splashScreenExists){
            throw new ValidationError('splash screen already exists');
        }

        const splashScreen = new SplashScreenModel(payload);
        await splashScreen.save();

        return {
            success: true,
            msg: 'splash screen created',
            data: {splashScreen: splashScreen.toObject()}
        }
    } catch(error){
        throw error;
    }
}

exports.getSplashScreen = async () => {
    try{
        const splashScreen = await SplashScreenModel.findOne({}).lean();
        delete splashScreen.__v;
        
        return {
            success: true,
            data: {splashScreen}
        }
    } catch(error){
        throw error;
    }
}

exports.updateScreens = async (screens) => {
    try {
        const splashScreen = await SplashScreenModel.findOne({});
        screens.forEach((screen) => {
            splashScreen.screens[screen.screenIndex - 1] = screen;
        })

        await splashScreen.save();

        return {
            msg: 'splash screens successfuly updated',
            data: {splashScreen: splashScreen.toObject()}
        }
    } catch (error) {
        throw error;
    }
}

exports.updateVideoLink = async (videoLink) => {
    try {
        const splashScreen = await SplashScreenModel.findOne({});

        splashScreen.video_link = videoLink;
        await splashScreen.save();

        return {
            msg: 'video link updated',
            data: {splashScreen: splashScreen.toObject()}
        }
    } catch (error) {
        throw error;
    }
}

exports.updateAppTitle = async (title) => {
    try {
        const splashScreen = await SplashScreenModel.findOne({});

        splashScreen.title = title;
        await splashScreen.save();

        return {
            msg: 'App title updated',
            data: {splashScreen: splashScreen.toObject()}
        }
    } catch (error) {
        throw error;
    }
}