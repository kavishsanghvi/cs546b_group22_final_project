const mongoCollections = require('../config/mongoCollections');
const usersObj = mongoCollections.users;
const bcrypt = require("bcrypt");
const utils = require('./utils');


const login = async function login(email, password) {

    let checkEmail = await utils.variableSanityCheck(email, "string", "Email");
    if (checkEmail.result)  email = checkEmail.value
    else throw  {"result": false,"message": "", statusCode:404, error: checkEmail.message, userData:null};

    let checkPassword = await utils.variableSanityCheck(password, "string", "Password");
    if (checkPassword.result)  password = checkPassword.value
    else throw  {"result": false,"message": "", statusCode:404, error: checkPassword.message, userData:null};


    const localUsersObj = await usersObj();
    const loggerInUser = await localUsersObj.find({email: email}).toArray();
    if (loggerInUser.length === 0)
        return {"result": false, statusCode:404, "message": "User not found!", userData:null};
    if (loggerInUser.length > 0) {
        let checkPassword = await bcrypt.compare(password, loggerInUser[0].password);
            if(!checkPassword) throw {"result": false, "message": "Invalid email or password!", statusCode:404, error: "User not found!", userData:null};
    
        return {"result": true, statusCode:200, "message": "user verified..",  userData:loggerInUser[0]};
    }
}


module.exports = {
    login
}