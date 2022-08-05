const {creditLineService} = require('../services');
const {ValidationError} = require('../errors');

exports.setCreditLine = async (req, res, next) => {
    try{
        const result = await creditLineService.setCreditLimit(req.body.userId, req.body.creditLimit);

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

exports.getWithdrawals = async (req, res, next) => {
    try{
        let userId;
        if(req.user.admin){
            if(!req.query.userId){
                throw new ValidationError('userId not provided');
            }
            userId = req.query.userId;
        } else{
            userId = req.user._id;
        }

        const result = await creditLineService.getCreditWithdrawals(userId);

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
