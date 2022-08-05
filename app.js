require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoConnection = require('./mongo-connection');
const path = require('path');

const app = express();
let server;
async function startApp(){
    await mongoConnection();
    app.use(cors());
    
    app.use(express.urlencoded({limit: '25mb', extended: false}));
    app.use(express.json({limit: '25mb'}));
    app.use('/public', express.static(path.join(__dirname, 'public')));
    app.use(require('./src/routes'))

    app.use((req, res, next) => {
        
        console.log(req.path)
        return res.status(404).json({
            error: 'route not found'
        })
    })

    app.use((err, req, res, next) => {
        const status = err.status || 500;
        // console.log(err.status)
        console.log(err);
        return res.status(status).json({error: err.message})
    })

    server = app.listen(process.env.PORT, ()=>{
        console.log(`listening on port ${process.env.PORT}`)
    })

    process.on('SIGINT', () => {
        server.close();
    })
}

startApp();