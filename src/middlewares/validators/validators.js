exports.getBodyValidationMiddleware = function (schema){
    return async (req, res, next) => {
        try{
            const value = await schema.validateAsync(req.body);
            next();
        } catch(error){
            console.log(error);
            return res.status(400).json({
                msg: 'validation error',
                error: error.details
            })
        }
    }
}

exports.getParamsValidationMiddleware = function (schema){
    return async (req, res, next) => {
        try{
            const value = await schema.validateAsync(req.params);
            next();
        } catch(error){
            console.log(error);
            return res.status(400).json({
                msg: 'validation error',
                error: error.details
            })
        }
    }
}

exports.getQueryValidationMiddleware = function (schema){
    return async (req, res, next) => {
        try{
            const value = await schema.validateAsync(req.query);
            next();
        } catch(error){
            console.log(error);
            return res.status(400).json({
                msg: 'validation error',
                error: error.details
            })
        }
    }
}