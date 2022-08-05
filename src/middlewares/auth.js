const jwt = require('jsonwebtoken');
const tokenHelper = require('../helpers/token');
const {AdminModel, UserModel} = require('../models')
const {AuthError} = require('../errors')

exports.user = async (req, res, next) => {
    try{
        console.log('user auth')
        const decodedToken = await getDecodedToken(req.get('Authorization'));
        console.log(decodedToken);
        if(decodedToken.scope !== 'login'){
            throw new AuthError('invalid auth token provided');
        }
        const user = await getUser(decodedToken.id);
        console.log(user);
        if(!user){
            throw new AuthError('invalid auth token provided');
        }
        console.log(`user name ${user.name}`)
        req.user = user;
        console.log(user);
        next();
    } catch(error){
        handleAuthErrors(next, error);
    }
}

exports.admin = async (req, res, next) => {
    try{
        console.log('admin auth')
        const decodedToken = await getDecodedToken(req.get('Authorization'));
        if(decodedToken.scope !== 'login'){
            throw new AuthError('invalid auth token provided');
        }
        const user = await getAdmin(decodedToken.id);
        if(!user){
            throw new AuthError('invalid auth token provided');
        }
        console.log(`user name ${user.name}`)
        req.user = user;
        next();
    } catch(error){
        handleAuthErrors(next, error);
    }
}

exports.userOrAdmin = async (req, res, next) => {
    try{
        console.log('useroradmin')
        const decodedToken = await getDecodedToken(req.get('Authorization'));
        if(decodedToken.scope !== 'login'){
            throw new AuthError('invalid auth token provided');
        }
        const user = await getAdmin(decodedToken.id) || await getUser(decodedToken.id);
        if(!user){
            throw new AuthError('invalid auth token provided');
        }
        console.log(`user name ${user.name}`)
        req.user = user;
        next();
    } catch(error){
        handleAuthErrors(next, error);
    }
}

const handleAuthErrors = (next, error) => {
    try{
        console.log(error);
        if(error instanceof AuthError || error instanceof jwt.TokenExpiredError || error instanceof jwt.JsonWebTokenError){
            error.status = 401;
        }
        next(error);
    } catch(error){
        console.log(error);
        next(error);
    }
}

const getDecodedToken = async (authHeader) => {
    try{
        console.log('entered get decoded token utility....');
        if(!authHeader){
            throw new AuthError('token not provided or user not logged in')
        }
        const authHeaderStringSplit = authHeader.split(' ');
        if(!authHeaderStringSplit[0] || authHeaderStringSplit[0].toLowerCase() !== 'bearer' || !authHeaderStringSplit[1]){
            throw new AuthError('token not provided or user not logged in');
        }
        
        const token = authHeaderStringSplit[1];
        const decodedToken = tokenHelper.getDecodedToken(token);
        return decodedToken;
    } catch(error){
        throw error;
    }
}

const getUser = async (userId) => {
    try{
        const user = await UserModel.findById(userId).lean();
        return user;
    } catch(error){
        throw error;
    }
}

const getAdmin = async (adminId) => {
    try{
        const admin = await AdminModel.findById(adminId).lean();
        if(admin){
            admin.admin = true;
        }
        return admin;
    } catch(error){
        throw error;
    }
}