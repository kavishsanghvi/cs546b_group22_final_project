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

module.exports = {
    getStudentData
}