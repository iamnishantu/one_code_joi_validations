const {TrainingVideoModel} = require('../models');
const {ValidationError} = require('../errors');

exports.addVideo = async (name, videoUrl) => {
    try{
        const trainingVideo = new TrainingVideoModel({
            name,
            url: videoUrl
        })
        await trainingVideo.save();

        return {
            success: true,
            msg: 'training video record created',
            data: {trainingVideo: trainingVideo.toObject()}
        }
    } catch(error){
        throw error;
    }
}

exports.deleteVideo = async (videoId) => {
    try{
        const video = await TrainingVideoModel.findById(videoId);
        if(!video){
            throw new ValidationError('invalid video id');
        }

        await TrainingVideoModel.findByIdAndDelete(videoId);
        return {
            success: true,
            msg: 'training video record deleted successfuly',
        }
    } catch(error){
        throw error;
    }
}

exports.updateVideo = async (videoId, updatePayload) => {
    try{
        const video = await TrainingVideoModel.findById(videoId);
        if(!video){
            throw new ValidationError('invalid video id');
        }

        await video.updateOne(updatePayload);
        const videoDTO = await TrainingVideoModel.findById(videoId).lean();
        delete videoDTO.__v;

        return {
            success: true,
            msg: 'training video record updated successfuly',
            data: {trainingVideo: videoDTO}
        }
    } catch(error){
        throw error;
    }
}

exports.getVideos = async (page) => {
    try{
        const trainingVideos = await TrainingVideoModel.find({})
        .sort({createdAt: -1}).skip(page).limit(10).lean();
        
        trainingVideos.forEach((video) => {
            delete video.__v;
        })

        return {
            success: true,
            msg: 'training videos',
            data: {trainingVideos}
        }
    } catch(error){
        throw error;
    }
} 