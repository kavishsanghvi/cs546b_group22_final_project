const mongoCollections = require('../config/mongoCollections');
const usersObj = mongoCollections.users;
const jwt = require('jsonwebtoken');

const login = async function login(email,password) {
    console.log(email);
    const localUsersObj = await usersObj();
    const loggerInUser = await localUsersObj.find({email:email,password:password}).toArray();
    if (loggerInUser.length === 0)
        return []
    if (loggerInUser.length > 0){
        var token = jwt.sign({loggerInUser} , '3e2c5bea78f9020f7c5e2bb24ac10d8b390c2ddb9fab2560ee12c24ede61d1a7',{ expiresIn: '1800s' });
        return {"result":true,"token":token, "message":"user verified.."};
    }
}


module.exports = {
    login
}