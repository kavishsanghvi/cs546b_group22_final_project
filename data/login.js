const mongoCollections = require('../config/mongoCollections');
const usersObj = mongoCollections.users;
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");


const login = async function login(email, password) {
    const localUsersObj = await usersObj();
    const loggerInUser = await localUsersObj.find({email: email}).toArray();
    if (loggerInUser.length === 0)
        return {"result": false,"token": token,"message": "User not found!", userData:null};
    if (loggerInUser.length > 0) {
        let checkPassword = await bcrypt.compare(password, loggerInUser[0].password);
            if(!checkPassword) throw {"result": false,"token": token,"message": "User not found!", error: "User not found!", userData:null};
           
        var token = jwt.sign({loggerInUser}, '3e2c5bea78f9020f7c5e2bb24ac10d8b390c2ddb9fab2560ee12c24ede61d1a7', {expiresIn: '1800s'});
        return {"result": true,"token": token,"message": "user verified..",  userData:loggerInUser[0]};
    }
}


module.exports = {
    login
}