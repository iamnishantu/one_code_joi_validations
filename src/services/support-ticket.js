const {SupportTicketModel} = require('../models');

exports.generateTicket = async (userId, comment) => {
    try {
        const supportTicket = new SupportTicketModel({
            user: userId,
            comment
        });
        await supportTicket.save();
        return {
            msg: 'support ticket generated',
            data: {supportTicket: supportTicket.toObject()}
        }
    } catch (error) {
        throw error;
    }
}