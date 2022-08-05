const {OfferModel, BrandModel, CategoryModel, UserModel} = require('../models');
const {ValidationError} = require('../errors');

exports.addOffer = async (offerPayload) => {
    try{
        const brandExist = await BrandModel.countDocuments({_id: offerPayload.brand});
        if(!brandExist){
            throw new ValidationError('invalid brandId provided');
        }
        
        const categoryExist = await CategoryModel.countDocuments({_id: offerPayload.category});
        if(!categoryExist){
            throw new ValidationError('invalid categoryId provided');
        }

        const offerExists = await OfferModel.countDocuments({name: offerPayload.name});
        if(offerExists){
            throw new ValidationError('offer with name already exists');
        }

        const offer = new OfferModel(offerPayload);
        offer.offer_link = transformOfferUrl(offer.offer_link, offer._id);
        await offer.save();

        return {
            success: true,
            msg: 'offer added',
            data: {offer: offer.toObject()}
        }
    } catch(error){
        throw error;
    }
}

exports.getAllOffers = async (page) => {
    try{
        const offers = await OfferModel.find({}).sort({createdAt: -1}).skip(page).limit(10).lean();

        offers.forEach((offer) => {
            delete offer.__v;
        });

        return {
            success: true,
            msg: 'all offers',
            data: {offers}
        }
    } catch(error){
        throw error;
    }
}

exports.getOffersByCategory = async (categoryId, page) => {
    try{
        const category = await CategoryModel.countDocuments({_id: categoryId});
        if(!category){
            throw new ValidationError('invalid categoryId');
        }
        const offers = await OfferModel.find({category: categoryId}).sort({createdAt: -1})
        .skip(page).limit(10).select({
            list_description: 1,
            image: 1
        }).lean();

        offers.forEach((offer) => {
            delete offer.__v;
        });

        return {
            success: true,
            msg: 'offers in category',
            data: {offers}
        }
    } catch(error){
        throw error;
    }
}

exports.deleteOffer = async (offerId) => {
    try{
        const offer = await OfferModel.findById(offerId);
        if(!offer){
            throw new ValidationError('invalid offerId');
        }

        await OfferModel.findByIdAndDelete(offerId);

        return {
            success: true,
            msg: 'offer deleted',
        }
    } catch(error){
        throw error;
    }
}

exports.updateOffer = async (offerId, updatePayload) => {
    try{
        console.log(offerId);
        const offer = await OfferModel.findById(offerId);
        if(!offer){
            throw new ValidationError('invalid offerId')
        }

        if(updatePayload.name && offer.name !== updatePayload.name){
            const offerWithName = await OfferModel.countDocuments({name: updatePayload.name});
            if(offerWithName){
                throw new ValidationError('offer with name already exists');
            }
        }

        if(updatePayload.offer_link){
            updatePayload.offer_link = transformOfferUrl(updatePayload.offer_link, offer._id);
        }
        await offer.updateOne(updatePayload);
        const updatedOffer = await OfferModel.findById(offerId).lean();
        delete updatedOffer.__v;

        return {
            success: true,
            data: {offer: updatedOffer}
        }
    } catch(error){
        throw error;
    }
}

exports.getOfferById = async (offerId) => {
    try{
        const offer = await OfferModel.findById(offerId).lean();
        if(!offer) {
            throw new ValidationError('invalid offerId');
        }

        delete offer.__v;
        return {
            success: true,
            msg: 'offer',
            data: {offer}
        }
    } catch(error) {
        throw error;
    }
}

exports.makeOfferTrending = async (offerId, image) => {
    try {
        const offer = await OfferModel.findById(offerId);

        if(!offer) {
            throw new ValidationError('invalid offerId');
        }

        offer.trending = true;
        offer.trending_image = image;

        await offer.save();

        return {
            success: true,
            msg: 'successfuly marked the offer as trending'
        }
    } catch (error) {
        throw error;
    }
}

exports.removeFromTrending = async (offerId) => {
    try {
        const offer = await OfferModel.findById(offerId);
        if(!offer) {
            throw new ValidationError('invalid offerId');
        }

        offer.trending = false;
        await offer.save();
        return {
            success: true,
            msg: 'removed the offer from trending'
        }
    } catch(error) {
        throw error;
    }
}

exports.getTrendingOfferImages = async () => {
    try {
        const offers = await OfferModel.find({trending: true}).select({
            trending_image: 1
        }).lean();

        return {
            success: true,
            msg: 'trending offers images',
            data: {offers}
        }
    } catch (error) {
        throw error;
    }
}

const transformOfferUrl = (url, offerId) => {
    const transformedUrl = new URL(`${process.env.BASE_URL}offer-click/`);
    transformedUrl.searchParams.append('redirect', url);
    transformedUrl.searchParams.append('offerId', offerId);
    return transformedUrl.toString();
}

exports.addUserCodeToOfferLink = (url, userCode, userId) => {
    const transformedUrl = new URL(url);
    transformedUrl.searchParams.append('userCode', userCode);
    transformedUrl.searchParams.append('userId', userId);
    return transformedUrl.toString();
}