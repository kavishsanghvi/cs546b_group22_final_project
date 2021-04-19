const mongoCollections = require('../config/mongoCollections');
const usersObj = mongoCollections.users;

const getStudentData = async function getStudentData() {
    const localUsersObj = await usersObj();
    const getAllUsersData = await localUsersObj.find({}).toArray();
    if (getAllUsersData.length === 0)
        return []
    if (getAllUsersData.length > 0)
        return JSON.parse(JSON.stringify(getAllUsersData));
}

const addUserData = async function addUserData(userInfo) {
    let localUsersObj = await usersObj();
    let addUser = await localUsersObj.insertOne(userInfo);
    if (addUser.insertedCount === 0) throw 'Could not add post';
    return JSON.parse(JSON.stringify(addUser.ops[0]));
}

module.exports = {
    getStudentData,
    addUserData
}