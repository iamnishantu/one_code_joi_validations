const {ValidationError} = require('../errors');

exports.imageUpload = async (req, res, next) => {
    try{
        if(!req.file){
            throw new ValidationError('no image provided');
        }

        return res.status(200).json({
            data: {
                image: `${process.env.BASE_URL}public/images/${req.file.filename}`
            }
        })
    } catch(error){
        if(error instanceof ValidationError){
            error.status = 400;
        }
        next(error);
    }
}