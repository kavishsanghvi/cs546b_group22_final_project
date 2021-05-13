const mongoCollections = require('../config/mongoCollections');

const mongocall = require("mongodb");
const { users } = require('../config/mongoCollections');
const usersObj = mongoCollections.users;

module.exports={
  
      async updateuser(id, updateduser){
        if(!updateduser.email || ValidateEmail(updateduser.email)== false) throw "Please provide an email address or provided email address is not valid";
        if(!updateduser.password) throw "Provide a password";
        if(!updateduser.firstName || typeof updateduser.firstName != 'string') throw "Provide a first name or provided first name is not string";
        if(!updateduser.lastName || typeof updateduser.lastName != 'string') throw "Provide a last name or provided last name is not string";
        if(!updateduser.universityName || typeof updateduser.universityName != 'string') throw "Provide a universityName or provided universityName is not string";
        if(!updateduser.userType|| typeof updateduser.userType != 'string') throw "Provide a usertype or provided usertype is not string";
        function isvalidDate(d){
            return !isNaN((new Date(d)).getTime())                                                  //reference stackoverflow
          }
          if (!isvalidDate(updateduser.dateCreated)) throw 'Not a proper date';

          const user = await this.get(id);
          let userUpdateInfo = {
            email:updateduser.email,
            password:updateduser.password,
            firstName:updateduser.firstName,
            lastName:updateduser.lastName,
            universityName:updateduser.universityName,
            userType:updateduser.userType,
            isActive,
            dateCreated:updateduser.dateCreated
          }
          const userCollection = await users();
          const updateInfo = await userCollection.updateOne(
            { _id: mongocall.ObjectID(id) },
            { $set: userUpdateInfo }
          );
          if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
            throw 'Update failed';
      
          return await this.get(id);
      }

}