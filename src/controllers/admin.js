const {adminService} = require('../services');
const {ValidationError} = require('../errors');

exports.register = async (req, res, next) => {
    try{
        const result = await adminService.registerAdmin(req.body);

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

exports.login = async (req, res, next) => {
    try{
        const result = await adminService.loginAdmin(req.body.email, req.body.password);

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