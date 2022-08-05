const jwt = require('jsonwebtoken');

const oneMonth = 60*60*24*30;

exports.generateToken = async (id, scope) => {
    try{
        const token = jwt.sign({id, scope}, process.env.JWT_SECRET, {expiresIn: oneMonth});
        return token;
    } catch (error) {
        throw error;
    }
}

exports.passwordResetToken = async (id) => {
    try{
        const token = jwt.sign({id, scope: 'password_reset'}, process.env.JWT_SECRET, {expiresIn: oneMonth});
        return token;
    } catch(error){
        throw error;
    }
}

exports.getDecodedToken = (token) => {
    try{
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log(`decoded token: ${decodedToken.id}`);
        return decodedToken;
    } catch(error){
        throw error;
    }
}