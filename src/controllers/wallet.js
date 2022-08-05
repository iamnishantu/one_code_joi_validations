const {walletService} = require('../services');
const {ValidationError} = require('../errors');

exports.getWallet = async (req, res, next) => {
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

        const result = await walletService.getWallet(userId);

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