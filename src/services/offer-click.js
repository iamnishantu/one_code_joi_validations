const {LeadModel, UserModel, OfferModel} = require('../models');
const {ValidationError} = require('../errors');
const {ObjectId} = require('mongoose').Types

exports.generateLead = async (userCode, offerId) => {
    try{
        const user = await UserModel.findOne({code: userCode});

        if(!user) {
            throw new ValidationError('invalid userId');
        }

        const offer = await OfferModel.findById(offerId);

        if(!offer) {
            throw new ValidationError('invalid offerId');
        }

        const lead = new LeadModel({
            user: user._id,
            offer: offer._id
        });

        await lead.save();

        return {
            success: true,
            msg: 'lead added as incomplete',
            data: {clickId: lead._id, offerId: offer._id, userId: user._id}
        }
    } catch(error) {
        throw error;
    }
}

exports.addClickIdTOUrl = (url, clickId, offerId, userId) => {
    try{
        const transformedUrl = new URL(url);
        transformedUrl.searchParams.append('clickId', clickId);
        transformedUrl.searchParams.append('userId', userId);
        transformedUrl.searchParams.append('offerId', offerId);

        return transformedUrl.toString();
    } catch(error) {
        throw error;
    }
}

exports.fulfillClick = async (clickId, offerId, status, statusUpdatedDate) => {
    try{
        if(!ObjectId.isValid(clickId)) {
            throw new ValidationError('invalid clickId');
        }
        const lead = await LeadModel.findById(clickId);
        if(!lead) {
            throw new ValidationError('invalid clickId');
        }

        if(lead.offer.toString() !== offerId) {
            throw new ValidationError('invalid clickId');
        }
        lead.status = status;
        lead.status_updated_on = statusUpdatedDate;
        await lead.save();

        return {
            success: true,
            msg: 'click fulfilled'
        }
    } catch ( error ) {
        throw error;
    }
}