const mongoCollections = require('../config/mongoCollections');
const studentSubQuizObj = mongoCollections.studentSubmittedQuiz;
const quizDataObj = mongoCollections.quiz;
const objOfObjectID = require('mongodb').ObjectID;
const utilsObj = require('./utils')

const getStudentDataUnderProfessor = async function getStudentDataUnderProfessor(session, subCategoryValue) {
    if(!session.userID) throw { "result": false, status: false, statusCode: 401, "message": "", error: "You're not authorized to perform this operation." }

    let checkSubCategory = await utilsObj.variableSanityCheck(subCategoryValue, "string", "Sub Category");
    if (checkSubCategory.result) subCategoryValue = checkSubCategory.value
    else throw { "result": false, statusCode: 400, "message": "", error: "Please provide a valid data in string.", userData: null }

    const localStudentSubQuizObj = await studentSubQuizObj();
    const getProfessorDetails = await localStudentSubQuizObj.find({ $and: [{ createdBy: objOfObjectID(session.userID), subCategory: subCategoryValue }] }).toArray();
    return JSON.parse(JSON.stringify(getProfessorDetails));
}

const getAllQuiz = async function getAllQuiz(session) {
    if(!session.userID) throw { "result": false, status: false, statusCode: 401, "message": "", error: "You're not authorized to perform this operation." }
    const localQuizDataObj = await quizDataObj();
    const getProfessorDetails = await localQuizDataObj.find({ createdBy: objOfObjectID(session.userID) }).toArray();

    if (getProfessorDetails.length === 0)
        return { data: getProfessorDetails, "result": true, statusCode: 200, "message": "No Records Found!!", error: "" }
    if (getProfessorDetails.length > 0)
        return { data: getProfessorDetails, "result": true, statusCode: 200, "message": "", error: "" }
}

const getQuizDataUsingID = async function getQuizDataUsingID(loggedInUser, quizID) {
    const localQuizDataObj = await quizDataObj();
    let getQuizData = await localQuizDataObj.findOne({ $and: [{ createdBy: objOfObjectID(loggedInUser.userID), _id: objOfObjectID(quizID) }] });
    if (Object.keys(getQuizData).length === 0)
        return "No Data Found!!"
    if (Object.keys(getQuizData).length > 0)
        return getQuizData;
}

const updateTimer = async function updateTimer(loggedInUser, quizID, tagName) {
    if(!loggedInUser.userID) throw { "result": false, status: false, statusCode: 401, "message": "", error: "You're not authorized to perform this operation." }

    let checkID = await utilsObj.variableSanityCheck(quizID, "ObjectID", "ID");
    if (checkID.result) quizID = checkID.value
    else throw { "result": false, statusCode: 400, "message": "", error: "Please provide a valid ID.", userData: null }

    let checkTagName = await utilsObj.variableSanityCheck(tagName, "string", "Category");
    if (checkTagName.result) tagName = checkTagName.value
    else throw { "result": false, statusCode: 400, "message": "", error: "Please provide a valid data in string.", userData: null }

    let returnedQuizData = await getQuizDataUsingID(loggedInUser, quizID);
    let result = { status: returnedQuizData[tagName], message: "" }

    let localQuizDataObj = await quizDataObj();
    if (returnedQuizData[tagName] == true) {
        const updateisTimerIntoDB = await localQuizDataObj.updateOne({ $and: [{ createdBy: objOfObjectID(loggedInUser.userID), _id: objOfObjectID(quizID) }] }, { $set: { [tagName]: false } });
        if (updateisTimerIntoDB.modifiedCount === 0)
            return { status: returnedQuizData[tagName], message: "Unable to update!!" }
        if (updateisTimerIntoDB.modifiedCount === 1)
            return { status: false, message: "Status updated successfully!!" }
    } else if (returnedQuizData[tagName] == false) {
        const updateisTimerIntoDB = await localQuizDataObj.updateOne({ $and: [{ createdBy: objOfObjectID(loggedInUser.userID), _id: objOfObjectID(quizID) }] }, { $set: { [tagName]: true } });
        if (updateisTimerIntoDB.modifiedCount === 0)
            return { status: returnedQuizData[tagName], message: "Unable to update!!" }
        if (updateisTimerIntoDB.modifiedCount === 1)
            return { status: true, message: "Status updated successfully!!" }
    }
}

const updateReleaseAndEndTags = async function updateReleaseAndEndTags(loggedInUser) {
    const localQuizDataObj = await quizDataObj();
    let todayDate = await utilsObj.dateCreationOnly("startDate");
    let endDate = await utilsObj.dateCreationOnly("endDate");
    await localQuizDataObj.updateMany({ $and: [{ startDate: todayDate, quizReleased: false }] }, { $set: { quizReleased: true } });
    await localQuizDataObj.updateMany({ $and: [{ endDate: endDate, quizEnded: false }] }, { $set: { quizEnded: true } });
}

module.exports = {
    getStudentDataUnderProfessor,
    getAllQuiz,
    updateTimer,
    updateReleaseAndEndTags
}