const {trainingVideoService} = require('../services');
const {ValidationError} = require('../errors');

exports.addVideo = async (req, res, next) => {
    try{
        const result = await trainingVideoService.addVideo(req.body.name, req.body.url);

        return res.status(200).json({
            msg: result.msg,
            data: result.data
        })
    } catch(error){
        next(error);
    }
}

exports.deleteVideo = async (req, res, next) => {
    try{
        const result = await trainingVideoService.deleteVideo(req.params.videoId);

        return res.status(200).json({
            msg: result.msg
        })
    } catch(error){
        if(error instanceof ValidationError){
            error.status = 400;
        }
        next(error);
    }
}

exports.updateVideo = async (req, res, next) => {
    try{
        const result = await trainingVideoService.updateVideo(req.params.videoId, req.body);

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

exports.getVideos = async (req, res, next) => {
    try{
        let page = 0;
        if(req.query.page > 0){
            page = req.query.page - 1;
        }

        const result = await trainingVideoService.getVideos(page);
        return res.status(200).json({
            msg: result.msg,
            data: result.data
        })
    } catch(error){
        next(error);
    }
}