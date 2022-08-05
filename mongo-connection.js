const mongoose = require('mongoose');
module.exports = async () => {
    mongoose.connect(process.env.MONGO_URL).then(() => {
        console.log('mongodb connected...')
    }).catch(err => console.log(err.message))

    mongoose.connection.on('connected', () => {
        console.log('Mongoose connected to db...')
    })

    mongoose.connection.on('error', (err) => {
        console.log(err.message)
    })

    mongoose.connection.on('disconnected', (err) => {
        console.log('Mongoose connection is disconnected...')
    })

    process.on('SIGINT', () => {
        mongoose.connection.close(() => {
            console.log('Mongoose connection is disconnected due to app termination...')
        })
    })
}