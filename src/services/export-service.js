const {LeadModel} = require('../models');
const fs = require('fs/promises')
const csv = require('csv');
const path = require('path');
const util = require('util');
const stream = require('stream');

const finished = util.promisify(stream.finished);

exports.leads = async (startDate, endDate) => {
    try {
        const leads = await LeadModel.find({
            createdAt: {$gte: new Date(startDate), $lte: new Date(endDate)},
            status: {$in: ['pending', 'completed']}
        }).lean();
        console.log(leads);
        const filename = `${(new Date()).getTime()}.csv`;
        const fd = await fs.open(path.join('./csv', filename),'w');
        const csvStream = fd.createWriteStream();

        csvStream.write(`leadid,offerid,status`);
        for await(const lead of leads) {
            const record = `\n${lead._id},${lead.offer},${lead.status}`;
            if(!csvStream.write(record)){
                console.log('not written');
            }
        }
        csvStream.end()
        csvStream.close();
        await finished(csvStream);
        return {
            success: true,
            data: {file: filename}
        }
    } catch (error) {
        console.log('error in service')
        throw error;
    }
}