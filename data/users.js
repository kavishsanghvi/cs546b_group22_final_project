const mongoCollections = require('../config/mongoCollections');
const quizObj = mongoCollections.quiz;
const usersObj = mongoCollections.users;
const categoryObj = mongoCollections.categories;
const objOfObjectID = require('mongodb').ObjectID;

// const getStudentData = async function getStudentData() {
//     const localUsersObj = await usersObj();
//     const getAllUsersData = await localUsersObj.find({}).toArray();
//     if (getAllUsersData.length === 0)
//         return []
//     if (getAllUsersData.length > 0)
//         return JSON.parse(JSON.stringify(getAllUsersData));
// }

const addUserData = async function addUserData(userInfo) {
    let localUsersObj = await usersObj();
    let addUser = await localUsersObj.insertOne(userInfo);
    if (addUser.insertedCount === 0) throw 'Could not add post';
    return JSON.parse(JSON.stringify(addUser.ops[0]));
}

const getQuiz = async function getQuiz(){
    let quizObjData = await quizObj();
    const getAllUsersData = await quizObjData.find({}).toArray();
    return getAllUsersData[0];
}

const getProfessorData = async function getProfessorData() {
    const localUsersObj = await usersObj();
    const getProfessorDetails = await localUsersObj.findOne({ $and: [{ _id: objOfObjectID("6080a6e17c378456cbcbf273"), userType: "professor" }] });
    // if (getProfessorDetails.length === 0)
    //     return []
    // if (getProfessorDetails.length > 0)
    // return JSON.parse(JSON.stringify(getProfessorDetails));

    return getProfessorDetails;
}

const getStudentRecord = async function getStudentRecord(studentUserIDs) {
    const localUsersObj = await usersObj();
    // console.log("Inside User Data")
    // console.log(studentUserIDs.length)
    const getStudentRecord = []
    //Working Line
    // const getStudentRecord = await localUsersObj.findOne({ _id: objOfObjectID(studentUserID) });
    // Working above

    for (let i = 0; i < studentUserIDs.length; i++) {
        // const a = studentUserIDs[i]
        // const b = await localUsersObj.findOne({ _id: objOfObjectID(studentUserIDs[i].userid) })

        // console.log(studentUserIDs[i].concat(await localUsersObj.findOne({ _id: objOfObjectID(studentUserIDs[i].userid) })))
        getStudentRecord.push(Object.assign(studentUserIDs[i], await localUsersObj.findOne({ _id: objOfObjectID(studentUserIDs[i].userid) })));
        // getStudentRecord.push(await localUsersObj.findOne({ _id: objOfObjectID(studentUserIDs[i].userid) }));
        // console.log(employee)
    }


    // const getProfessorDetails = await localUsersObj.findOne({ userid: "606a4b854e01be2ba0a16ea0" });

    // if (getProfessorDetails.length === 0)
    //     return []
    // if (getProfessorDetails.length > 0)
    // return JSON.parse(JSON.stringify(getStudentRecord));
    return getStudentRecord;
}

const getCategoryData = async function getCategoryData(reqType) {
    const localCategoryObj = await categoryObj();
    // const getAllCategoryData = await localCategoryObj.find({}).toArray();
    let getProfessorCategories = await localCategoryObj.distinct(reqType, { createdBy: objOfObjectID("6080a6e17c378456cbcbf273") })
    // console.log(a)
    return getProfessorCategories
}

const getSubCategoryOfCategory = async function getSubCategoryOfCategory(mainCategory, subCategory) {
    const localCategoryObj = await categoryObj();
    // const getAllCategoryData = await localCategoryObj.find({}).toArray();
    let getProfessorCategories = await localCategoryObj.distinct(subCategory, { createdBy: objOfObjectID("6080a6e17c378456cbcbf273"), category: mainCategory })
    // console.log(a)
    return getProfessorCategories
}

const getAllStudentUnderProfessorData = async function getAllStudentUnderProfessorData() {
    // let localUsersObj = await usersObj();
    let returnDataFromProfessor = await getProfessorData();
    const getStudentsUnderProfessorRecord = []
    for (let i = 0; i < Object.keys(returnDataFromProfessor.enrolledStudents).length; i++) {
        let keyName = Object.keys(returnDataFromProfessor.enrolledStudents)[i];
        for (let j = 0; j < returnDataFromProfessor.enrolledStudents[keyName].length; j++) {
            getStudentsUnderProfessorRecord.push(returnDataFromProfessor.enrolledStudents[keyName][j])
        }
        // console.log(returnDataFromProfessor.enrolledStudents[i]);
    }
    let returnStudentData = await getOneStudentRecord(getStudentsUnderProfessorRecord);
    // const getAllCategoryData = await localCategoryObj.find({}).toArray();
    // let getInActiveUserData = await localUsersObj.find({isActive: false}).toArray();
    // console.log(a)
    return returnStudentData
}

const getOneStudentRecord = async function getOneStudentRecord(studentUserIDs) {
    let localUsersObj = await usersObj();
    const getStudentRecord = []
    for (let i = 0; i < studentUserIDs.length; i++)
        getStudentRecord.push(await localUsersObj.findOne({ _id: objOfObjectID(studentUserIDs[i]) }));
    return getStudentRecord;
}

const getIsActiveFalseUserData = async function getIsActiveFalseUserData() {
    // let localUsersObj = await usersObj();
    // let returnDataFromProfessor = await getProfessorData();
    // const getStudentsUnderProfessorRecord = []
    // for(let i = 0; i<Object.keys(returnDataFromProfessor.enrolledStudents).length; i++){
    //     let keyName = Object.keys(returnDataFromProfessor.enrolledStudents)[i];
    //     for(let j = 0; j<returnDataFromProfessor.enrolledStudents[keyName].length; j++){
    //         getStudentsUnderProfessorRecord.push(returnDataFromProfessor.enrolledStudents[keyName][j])
    //     }
    //     // console.log(returnDataFromProfessor.enrolledStudents[i]);
    // }

    // // const getAllCategoryData = await localCategoryObj.find({}).toArray();
    // // let getInActiveUserData = await localUsersObj.find({isActive: false}).toArray();
    // // console.log(a)
    // return getStudentsUnderProfessorRecord
}

const fetchStudentData = async function fetchStudentData(id) {
    let localUsersObj = await usersObj();
    return await localUsersObj.findOne({ _id: objOfObjectID(id) })
}

const updateStudentStatus = async function updateStudentStatus(id) {
    let getStudentData = await fetchStudentData(id);
    let result = { status: false, message: "" }
    // if (Object.keys(getStudentData).length > 0) {
    if (getStudentData.isActive == false) {
        let localUsersObj = await usersObj();
        const updateisActiveIntoDB = await localUsersObj.updateOne({ _id: objOfObjectID(id) }, { $set: { "isActive": true } });
        if (updateisActiveIntoDB.modifiedCount === 0)
            return { status: false, message: "Not Verified!!" }
        if (updateisActiveIntoDB.modifiedCount === 1)
            return { status: true, message: "Verified Successfully!!" }
    } else {
        return { status: false, message: "Not Verified!!" }
    }
}

module.exports = {
    // getStudentData,
    addUserData,
    getStudentRecord,
    getCategoryData,
    getSubCategoryOfCategory,
    // getIsActiveFalseUserData,
    getProfessorData,
    getAllStudentUnderProfessorData,
    updateStudentStatus,
    getQuiz
}
    