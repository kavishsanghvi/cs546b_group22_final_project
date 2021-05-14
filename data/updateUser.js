const mongoCollections = require('../config/mongoCollections');

const mongocall = require("mongodb");
const { users } = require('../config/mongoCollections');
const usersObj = mongoCollections.users;
const data = require('./users')
const utilsObj = require('./utils')

module.exports={
  
      async updateuser(id, updateduser){
        const userCollections = await usersObj();
    function ValidateEmail(mail) {
        if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)) {
            return (true)
        }
        return (false)
    }
    let checkFirstName = await utilsObj.variableSanityCheck(updateduser.firstName, "string", "First Name");
    if (checkFirstName.result) updateduser.firstName = checkFirstName.value
    else throw { "result": false, statusCode: 400, "message": "", error: "Provide a first name or provided first name is not string.", userData: null }

    let checkLastName = await utilsObj.variableSanityCheck(updateduser.lastName, "string", "Last Name");
    if (checkLastName.result) updateduser.lastName = checkLastName.value
    else throw { "result": false, statusCode: 400, "message": "", error: "Provide a last name or provided last name is not string.", userData: null }

    let checkEmail = await utilsObj.variableSanityCheck(updateduser.email, "string", "Email");
    if (checkEmail.result) updateduser.email = checkEmail.value
    else throw { "result": false, statusCode: 400, "message": "", error: "Please provide valid email address.", userData: null }

    let checkPassword = await utilsObj.variableSanityCheck(updateduser.password, "string", "Password");
    if (checkPassword.result) updateduser.password = checkPassword.value
    else throw { "result": false, statusCode: 400, "message": "", error: "Please enter password.", userData: null }

    let checkUserType = await utilsObj.variableSanityCheck(updateduser.userType, "string", "User Type");
    if (checkUserType.result) updateduser.userType = checkUserType.value
    else throw { "result": false, statusCode: 400, "message": "", error: "Provide a usertype or provided usertype is not string.", userData: null }

    let checkUniversityName = await utilsObj.variableSanityCheck(updateduser.universityName, "string", "User Type");
    if (checkUniversityName.result) updateduser.universityName = checkUniversityName.value
    else throw { "result": false, statusCode: 400, "message": "", error: "Provide a usertype or provided usertype is not string.", userData: null }
    
          const user = await data.getuserbyid(id);
          let userUpdateInfo = {
            email:updateduser.email,
            password:updateduser.password,
            firstName:updateduser.firstName,
            lastName:updateduser.lastName,
            universityName:updateduser.universityName,
            userType:updateduser.userType,
            isActive:updateduser.isActive,
            dateCreated:updateduser.dateCreated
          }
          const userCollection = await users();
          const updateInfo = await userCollection.updateOne(
            { _id: mongocall.ObjectID(id) },
            { $set: userUpdateInfo }
          );
          if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
            throw { "result": false, statusCode: 404, "message": "", error: "Something went wrong!!", userData: null };
          else if(updateInfo.modifiedCount > 0)  
            return { "result": false, statusCode: 404, updatedValue: await data.getuserbyid(id), updatedCount: updateInfo, "message": "", error: "", userData: null } 
      }

}