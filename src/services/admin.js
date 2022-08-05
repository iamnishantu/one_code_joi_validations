const { PayloadContext } = require('twilio/lib/rest/api/v2010/account/recording/addOnResult/payload');
const {AdminModel} = require('../models');
const {ValidationError} = require('../errors');
const passwordHelper = require('../helpers/password');
const tokenHelper = require('../helpers/token');

exports.registerAdmin = async (adminPayload) => {
    try{
        const adminExist = await AdminModel.findOne({
            email: PayloadContext.email
        });

        if(adminExist){
            throw new ValidationError('Admin with email already exists');
        }

        adminPayload.password = await passwordHelper.hashPassword(adminPayload.password);
        const admin = new AdminModel(adminPayload);
        await admin.save();

        const adminDTO = admin.toObject();
        delete adminDTO.password;

        return {
            success: true,
            data: {admin: adminDTO}
        }
    } catch(error){
        throw error;
    }
}

exports.loginAdmin = async (email, password) => {
    try{
        const admin = await AdminModel.findOne({
            email
        }).select("+password");

        if(!admin){
            throw new ValidationError(`wrong credentials`);
        }

        const isPasswordMatch = await passwordHelper.verifyPassword(password, admin.password);

        if(!isPasswordMatch){
            throw new ValidationError(`wrong credentials`);
        }

        const token = await tokenHelper.generateToken(admin._id, 'login');

        return {
            success: true,
            msg: 'login successful',
            data: {token}
        }
    } catch(error){
        throw error;
    }
}