const {WalletModel, UserModel} = require('../models');
const {ValidationError} = require('../errors')

exports.getWallet = async (userId) => {
    try{
        const user = await UserModel.findById(userId);

        if(!user){
            throw new ValidationError(`invalid userId`);
        }

        const wallet = await WalletModel.findOne({user: userId}).select({__v: 0});
        // delete wallet.__v;
        console.log(wallet.withdrawable);
        return {
            success: true,
            data: {wallet}
        }
    } catch (error) {
        throw error;
    }
}