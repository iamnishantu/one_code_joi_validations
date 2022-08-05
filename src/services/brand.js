const {BrandModel} = require('../models');
const {ValidationError} = require('../errors');

exports.addBrand = async (brandPayload) => {
    try{
        const brand = new BrandModel(brandPayload);
        await brand.save();

        return {
            success: true,
            msg: 'brand added',
            data: {brand: brand.toObject()}
        }
    } catch(error){
        throw error;
    }
}

exports.getAllBrands = async (page) => {
    try{
        const brands = await BrandModel.find({}).lean();
        brands.forEach((brand) => {
            delete brand.__v
        });

        return {
            success: true,
            msg: 'brands',
            data: {brands}
        }
    } catch(error){
        throw error;
    }
}

exports.deleteBrand = async (brandId) => {
    try{
        const brand = await BrandModel.findById(brandId);
        if(!brand){
            throw new ValidationError('invalid brandId');
        }

        await BrandModel.findByIdAndDelete(brandId);

        return {
            success: true,
            msg: 'brand deleted successfuly'
        }
    } catch(error){
        throw error;
    }
}

exports.updateBrand = async (brandId, updatePayload) => {
    try{
        const brand = await BrandModel.findById(brandId);
        if(!brand){
            throw new ValidationError('invalid brandId');
        }

        await brand.updateOne(updatePayload);
        const brandDTO = await BrandModel.findById(brandId);
        delete brandDTO.__v;

        return {
            msg: 'brand info updated',
            data: {brand: brandDTO}
        }
    } catch(error){
        throw error;
    }
}