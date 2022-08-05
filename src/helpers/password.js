const bcrypt = require('bcrypt');

exports.hashPassword = async (password) => {
    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
    } catch (error) {
        throw error;
    }
}

exports.verifyPassword = async (password, hashedPassword) => {
    try{
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    } catch(error) {
        throw error;
    }
}