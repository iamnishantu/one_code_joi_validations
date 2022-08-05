const {offerClickService} = require('../services');
const {ValidationError} = require('../errors');

exports.offerClick = async (req, res, next) => {
    try{
        const result = await offerClickService.generateLead(req.query.userCode, req.query.offerId);

        const redirectUrl = offerClickService.addClickIdTOUrl(
            req.query.redirect, 
            result.data.clickId,
            result.data.offerId,
            result.data.userId
            );
        console.log(redirectUrl);
        res.redirect(redirectUrl);
    } catch(error) {
        if(error instanceof ValidationError){
            error.status = 400;
        }
        next(error);
    }
}

exports.fulfillClick = async (req, res, next) => {
    try{
        const result = await offerClickService.fulfillClick(
            req.body.clickId, 
            req.body.offerId, 
            req.body.status,
            req.body.statusUpdateDate
            );

        return res.sendStatus(200);
    } catch (error) {
        if(error instanceof ValidationError){
            error.status = 400;
        }
        next(error);
    }
}