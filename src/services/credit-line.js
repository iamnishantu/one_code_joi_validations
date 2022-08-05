const {CreditLineModel, UserModel} = require('../models');
const {ValidationError} = require('../errors');

exports.setCreditLimit = async (userId, creditLimit) => {
    try{
        const user = await UserModel.findById(userId);
        if(!user){
            throw new ValidationError('invalid userID')
        }

        await CreditLineModel.findOneAndUpdate({
            user: userId,
            credit_limit: creditLimit
        });

        return {
            success: true,
            msg: 'new credit limit set for the user'
        }
    } catch(error){
        throw error;
    }
}

exports.getCreditWithdrawals = async (userId) => {
    try{
        const user = await UserModel.count({
            _id: userId
        });

        if(!user){
            throw new Error('invalid userId');
        }

        const creditLine = await CreditLineModel.findOne({
            user: userId
        }).lean();

        delete creditLine.__v;

        return {
            success: true,
            msg: 'credit line of user',
            data: {creditLine}
        }
    } catch(error){
        throw error;
    }
}