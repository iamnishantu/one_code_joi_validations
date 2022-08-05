const {exportService} = require('../services');
const path = require('path');
exports.leads = async (req, res, next) => {
    try{
        const result = await exportService.leads(req.body.startDate, req.body.endDate);

        res.download(path.join('./csv', result.data.file));
    } catch (error) {
        next(error);
    }
}