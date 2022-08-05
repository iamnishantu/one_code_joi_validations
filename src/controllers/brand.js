const {brandService} = require('../services');
const {ValidationError} = require('../errors');

exports.addBrand = async (req, res, next) => {
    try{
        if(!req.file){
            throw new ValidationError('image not provided');
        }

        const image = `${process.env.BASE_URL}public/images/${req.file.filename}`;

        const result = await brandService.addBrand({
            ...req.body,
            image
        });

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

exports.getAllBrands = async (req, res, next) => {
    try{
        const result = await brandService.getAllBrands();

        return res.status(200).json({
            msg: result.msg,
            data: result.data
        })
    } catch(error){
        next(error);
    }
}

exports.deleteBrand = async (req, res, next) => {
    try{
        const result = await brandService.deleteBrand(req.params.brandId);

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

exports.updateBrand = async (req, res, next) => {
    try{
        const payload = req.body;
        if(req.file){
            payload.image = `${process.env.BASE_URL}public/images/${req.file.filename}`;
        }
        const result = await brandService.updateBrand(req.params.brandId, req.body);

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