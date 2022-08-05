const {splashScreenService} = require('../services');
const {ValidationError} = require('../errors');

exports.addSplashScreen = async (req, res, next) => {
    try{
        const result = await splashScreenService.addSplashScreen(req.body);

        return res.status(200).json({
            msg: result.msg,
            data: result.data
        })
    } catch(error){
        if(error instanceof ValidationError){
            error.status = 400;
        }
        next(error);
    }
}

exports.getSplashScreen = async (req, res, next) => {
    try{
        const result = await splashScreenService.getSplashScreen();

        return res.status(200).json({
            msg: result.msg,
            data: result.data
        });
    } catch(error){
        next(error);
    }
}

exports.updateSplashScreen = async (req, res, next) => {
    try {
        const result = await splashScreenService.updateScreens(req.body.screens);

        return res.status(200).json({
            msg: result.msg,
            data: result.data
        })
    } catch (error) {
        next (error);
    }
}

exports.updateVideoUrl = async (req, res, next) => {
    try {
        const result = await splashScreenService.updateVideoLink(req.body.video_link);

        return res.status(200).json({
            msg: result.msg,
            data: result.data
        })
    } catch (error) {
        next (error);
    }
}

exports.updateAppTitle = async (req, res, next) => {
    try {
        const result = await splashScreenService.updateAppTitle(req.body.title);

        return res.status(200).json({
            msg: result.msg,
            data: result.data
        })
    } catch (error) {
        next (error);
    }
}