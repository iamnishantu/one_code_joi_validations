const {LeadModel, UserModel} = require('../models');
const {ValidationError} = require('../errors');
const {parse} = require('csv');
const fs = require('fs/promises');
const mongoose = require('mongoose');
const moment = require('moment')

exports.getAllLeads = async (page) => {
    try{
        const leads = await LeadModel.find({
            status: {$in: ['completed', 'rejected', 'pending', 'in process']}
        }).sort({createdAt: -1}).skip(page)
        .limit(10).populate('offer', 'name').lean();

        leads.forEach((lead) => {
            delete lead.__v;
            lead.date = moment(lead.date).format('DD-MM-YYYY');
        });

        return {
            success: true,
            data: {leads}
        }
    } catch(error){
        throw error
    }
}

exports.getLeadsOfUser = async (userId, page) => {
    try{
        const user = await UserModel.countDocuments({_id: userId});

        if(!user){
            throw new ValidationError('invalid user id');
        }

        const leads = await LeadModel.find({
            user: userId,
            status: {$in: ['completed', 'rejected', 'pending', 'in process']}
        }).sort({createdAt: -1})
        .skip(page).limit(10).populate('offer', 'name').lean();

        leads.forEach((lead) => {
            delete lead.__v;
            lead.date = moment(lead.date).format('DD-MM-YYYY');
        });

        return {
            msg: 'leads of user',
            data: {leads}
        }
    } catch(error){
        throw error;
    }
}

exports.getCompletedLeadsOfUser = async (userId, page) => {
    try{
        const user = await UserModel.countDocuments({_id: userId});

        if(!user){
            throw new ValidationError('invalid user id');
        }

        const leads = await LeadModel.find({
            user: userId,
            status: 'completed'
        }).sort({createdAt: -1})
        .skip(page).limit(10).populate('offer', 'name').lean();

        leads.forEach((lead) => {
            delete lead.__v;
            lead.date = moment(lead.date).format('DD-MM-YYYY');
        });

        return {
            msg: 'leads of user',
            data: {leads}
        }
    } catch(error){
        throw error;
    }
}

exports.getRejectedLeadsOfUser = async (userId, page) => {
    try{
        const user = await UserModel.countDocuments({_id: userId});

        if(!user){
            throw new ValidationError('invalid user id');
        }

        const leads = await LeadModel.find({
            user: userId,
            status: 'rejected'
        }).sort({createdAt: -1})
        .skip(page).limit(10).populate('offer', 'name').lean();

        leads.forEach((lead) => {
            delete lead.__v;
            lead.date = moment(lead.date).format('DD-MM-YYYY');
        });

        return {
            msg: 'leads of user',
            data: {leads}
        }
    } catch(error){
        throw error;
    }
}

exports.getStatusLead = async (userId, query) => {
    try{
        const user = await UserModel.countDocuments({_id: userId});

        if(!user){
            throw new ValidationError('invalid user id');
        }

        const leads = await LeadModel.find({
            user: userId,
            status: query
        }).sort({createdAt: -1})
        .populate('offer', 'name').lean();

        leads.forEach((lead) => {
            delete lead.__v;
            lead.date = moment(lead.date).format('DD-MM-YYYY');
        });

        return {
            msg: 'leads of user',
            data: {leads}
        }
    } catch(error){
        throw error;
    }
}

exports.getLeadCount = async (userId) => {
    try {
        const leadCounts = await LeadModel.aggregate([
            {
                $match: {
                    user: mongoose.Types.ObjectId(userId),
                    status: {$in: ['completed', 'rejected', 'in process']}
                },
            },
            {
                $group: {
                    _id: "$status",
                    count: {$count: {}}
                }
            }
        ]);
        const leadCountResponse = {
            completed: 0,
            rejected: 0,
            ["in process"]: 0,
            total: 0
        };
        
        leadCounts.forEach((lead) => {
            leadCountResponse[lead._id] = lead.count;
        })

        leadCountResponse.total = leadCountResponse.completed + leadCountResponse.rejected + leadCountResponse["in process"];

        return {
            msg : 'lead count',
            data: {leadCount: leadCountResponse}
        }
    } catch (error) {
        throw error;
    }
}

exports.completeLeads = async (csvFile) => {
    try {
        const fd = await fs.open(csvFile);
        const csvStream = fd.createReadStream();
        const csvParserStream = csvStream.pipe(parse({
            delimiter: ','
        }));

        const completedLeadsId = new Set();
        for await (const record of csvParserStream) {
            console.log(record);
            if(record[1] === 'completed') {
                completedLeadsId.add(record[0])
            }
        }
        console.log(completedLeadsId);

        await LeadModel.updateMany({
            _id: {$in : [...completedLeadsId.values()]}
        }, {status: 'completed'});
        
        return {
            success: true,
            msg: 'leads updated'
        }
    } catch (error) {
        throw error;
    }
}