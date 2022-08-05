const {categoryService} = require('../services');
const {ValidationError} = require('../errors');

exports.addCategory = async (req, res, next) => {
    try{
        if(!req.file){
            throw new ValidationError('image not provided');
        }

        const image = `${process.env.BASE_URL}public/images/${req.file.filename}`;

        const result = await categoryService.addCategory({
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

exports.updateCategory = async (req, res, next) => {
    try{
        const updatePayload = req.body;
        if(req.file){
            updatePayload.image = `${process.env.BASE_URL}public/images/${req.file.filename}`;
        }

        const result = await categoryService.updateCategory(req.params.categoryId, updatePayload);

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

exports.setPriority = async (req, res, next) => {
    try{
        const result = await categoryService.setPriority(req.params.categoryId);

        return res.status(200).json({
            msg: result.msg,
        })
    } catch(error){
        if(error instanceof ValidationError){
            error.status = 400;
        }
        next(error);
    }
}

exports.removePriority = async (req, res, next) => {
    try{
        const result = await categoryService.removePriority(req.params.categoryId);

        return res.status(200).json({
            msg: result.msg,
        })
    } catch(error){
        if(error instanceof ValidationError){
            error.status = 400;
        }
        next(error);
    }
}

exports.getPriorityCategories = async (req, res, next) => {
    try{
        const result = await categoryService.getPriorityCategories();

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

exports.deleteCategory = async (req, res, next) => {
    try{
        const result = await categoryService.deleteCategory(req.params.categoryId);

        return res.status(200).json({
            msg: result.msg,
        })
    } catch(error){
        if(error instanceof ValidationError){
            error.status = 400;
        }
        next(error);
    }
}

exports.getCategories = async (req, res, next) => {
    try{
        let page = 0;
        if(req.query.page >= 1){
            page = req.query.page - 1;
        }

        const result = await categoryService.getCategories(page);

        return res.status(200).json({
            msg: result.msg,
            data: result.data
        })
    } catch(error){
        next(error);
    }
}