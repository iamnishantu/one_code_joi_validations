const {offerService} = require('../services');
const {ValidationError} = require('../errors');

exports.addOffer = async (req, res, next) => {
    try{
        const result = await offerService.addOffer(req.body);

        return res.status(201).json({
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

exports.getAllOffers = async (req, res, next) => {
    try{
        let page = 0;
        if(req.query.page > 0) {
            page = req.query.page - 1;
        }

        const result = await offerService.getAllOffers(page);

        return res.status(200).json({
            msg: result.msg,
            data: result.data
        })
    } catch(error){
        next(error);
    }
}

exports.getOffersByCategory = async (req, res, next) => {
    try{
        let page = 0;
        if(req.query.page > 0){
            page = req.query.page - 1;
        }
        const result = await offerService.getOffersByCategory(req.params.categoryId, page);

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

exports.deleteOffer = async (req, res, next) => {
    try{
        const result = await offerService.deleteOffer(req.params.offerId);

        return res.status(200).json({
            msg: result.msg
        });

    } catch(error){
        if(error instanceof ValidationError){
            error.status = 400;
        }
        next(error);
    }
}

exports.updateOffer = async (req, res, next) => {
    try{
        const result = await offerService.updateOffer(req.params.offerId, req.body);

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

exports.getOfferById = async (req, res, next) => {
    try{
        const result = await offerService.getOfferById(req.params.offerId);

        if(!req.user.admin) {
            result.data.offer.offer_link = offerService.addUserCodeToOfferLink(
                result.data.offer.offer_link,
                req.user.code,
                req.user._id
            )
        }
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

exports.makeOfferTrending = async (req, res, next) => {
    try {
        // if(!req.file) {
        //     throw new ValidationError('image not provided');
        // }

        // const image = `${process.env.BASE_URL}public/image/${req.file.filename}`;
        const result = await offerService.makeOfferTrending(req.body.offerId, req.body.image);

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

exports.removeFromTrending = async (req, res, next) => {
    try {
        const result = await offerService.removeFromTrending(req.body.offerId);

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

exports.getTrendingOffer = async (req, res, next) => {
    try{
        const result = await offerService.getTrendingOfferImages();

        return res.status(200).json({
            msg: result.msg,
            data: result.data
        })
    } catch (error) {
        next(error);
    }
}