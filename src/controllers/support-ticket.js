const {supportTicketService} = require('../services');

exports.generateTicket = async (req, res, next) => {
    try {
        const result = await supportTicketService.generateTicket(req.user._id, req.body.comment);

        return res.status(200).json({
            msg: result.msg,
            data: result.data
        })
    } catch (error) {
        next(error);
    }
}