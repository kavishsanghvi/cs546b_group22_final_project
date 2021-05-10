const mongoCollections = require('../config/mongoCollections');

const mongocall = require("mongodb");
const { users } = require('../config/mongoCollections');
const usersObj = mongoCollections.users;

module.exports={
    async create(email, password, firstName, lastName, universityName, userType, isActive, dateCreated){
        const userCollections = await usersObj();
        function ValidateEmail(mail) 
{
 if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(myForm.emailAddr.value))
  {
    return (true)
  }
    return (false)
}
        if(!email || ValidateEmail(email)== false) throw "Please provide an email address or provided email address is not valid";
        if(!password) throw "Provide a password";
        if(!firstName || typeof firstName != 'string') throw "Provide a first name or provided first name is not string";
        if(!lastName || typeof lastName != 'string') throw "Provide a last name or provided last name is not string";
        if(!universityName || typeof universityName != 'string') throw "Provide a universityName or provided universityName is not string";
        if(!userType|| typeof userType != 'string') throw "Provide a usertype or provided usertype is not string";
        function isvalidDate(d){
            return !isNaN((new Date(d)).getTime())                                                  //reference stackoverflow
          }
          if (!isvalidDate(dateCreated)) throw 'Not a proper date';

          let newUser = {
              email:email,
              password:password,
              firstName:firstName,
              lastName:lastName,
              universityName:universityName,
              userType:userType,
              isActive,
              dateCreated:dateCreated
          }
          const insertInfo = await userCollections.inserOne(newUser);
        if (insertInfo.insertedCount === 0) throw 'Could not add user';
    
        const newId = insertInfo.insertedId;
    
        const user = await this.get(newId.toString());
        return user;

    },
    async get(id) {
        if (!id) throw "You must provide an id to search for";
        if (typeof id != 'string') throw 'Id is not a String.';
        
        const userCollections = await users();
        const result = await userCollections.findone({ _id: mongocall.ObjectID(id) }); 
        if (result === null) throw `No books with that id : ${id}`;
        result._id = result._id.toString();
    
        return result;
    },
    async removebook(id) {
        if (!id) throw "You must provide an id to search for";
        const userCollections = await users();
        const deletionInfo = await userCollections.removeOne({ _id: mongocall.ObjectID(id) });
        if (deletionInfo.deletedCount === 0) {
          throw `Could not delete user with id of ${id}`;
        }
       const able = {'reviwedId': id.toString(), "deleted" : true}
       return able + '.'
      },
      getAllbooks: async () => {
        const userCollection = await users();
        const userList = await userCollection.find({},{ projection: { _id: 1, title: 1 }}).toArray();
        return userList;
      },  
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