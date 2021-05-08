const mongoCollections = require('../config/mongoCollections');
const usersObj = mongoCollections.users;
let { ObjectId } = require('mongodb');

const getuserData = async function getuserData(session) {
    try {
        if (!session.userID) throw 'Invalid ID';
        if (session.userID) {
            let parsedId = ObjectId(session.userID)
            const usersCollection = await usersObj();
            const valid_user = await usersCollection.findOne({ _id: parsedId });
            if (valid_user.isActive === true) {
                return valid_user.isActive
            }
            else {
                throw 'Not Yet Approved by the proffesor'
            }
        }
        else throw `Not a valid user.`
    } catch (error) {
        return error
    }
}
module.exports = {
    getuserData
}
