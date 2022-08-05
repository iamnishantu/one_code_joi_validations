const {leadService} = require('../services');
const {ValidationError} = require('../errors');

exports.getAllLeads = async (req, res, next) => {
    try{
        let page = 0;
        if(req.query.page > 0){
            page = req.query.page - 1;
        }
        const result = await leadService.getAllLeads(page);

        return res.status(200).json({
            msg: result.msg,
            data: result.data
        })
    } catch(error){
        next(error);
    }
}

exports.getLeadsOfUser = async (req, res, next) => {
    try{
        let page = 0;
        if(req.query.page > 0){
            page = req.query.page - 1;
        }
        let userId;
        if(req.user.admin){
            if(!req.query.userId){
                throw new ValidationError('userId not provided');
            }
            userId = req.query.userId;
        } else{
            userId = req.user._id;
        }
        
        const result = await leadService.getLeadsOfUser(userId, page);

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

exports.getStatusLeads = async (req, res, next) => {
    try {
        const result = await leadService.getStatusLead(req.user._id, req.query.status);
        return res.status(200).json({
            msg: result.msg,
            data: result.data
        })
    } catch (error) {
        if(error instanceof ValidationError){
            error.status = 400;
        }
        next(error);
    }
}

exports.completeLeads = async (req, res, next) => {
    try {
        if(!req.file){
            throw new ValidationError('csv file not provided');
        }

        const result = await leadService.completeLeads(req.file.path);

        return res.status(200).json({
            msg: result.msg
        })
    } catch (error) {
        if(error instanceof ValidationError){
            error.status = 400;
        }
        next(error);
    }
}

exports.getLeadCount = async (req, res, next) => {
    try {
        const result = await leadService.getLeadCount(req.user._id);

        return res.status(200).json({
            msg: result.msg,
            data: result.data
        })
    } catch (error) {
        next(error);
    }
}