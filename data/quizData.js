const mongoCollections = require('../config/mongoCollections');
const studentSubQuizObj = mongoCollections.studentSubmittedQuiz;
const quizDataObj = mongoCollections.quiz;
const objOfObjectID = require('mongodb').ObjectID;
const utilsObj = require('./utils')

const getStudentDataUnderProfessor = async function getStudentDataUnderProfessor(session, subCategoryValue) {
    const localStudentSubQuizObj = await studentSubQuizObj();
    const getProfessorDetails = await localStudentSubQuizObj.find({ $and: [{ createdBy: objOfObjectID(session.userID), subCategory: subCategoryValue }] }).toArray();
    return JSON.parse(JSON.stringify(getProfessorDetails));
}

const getAllQuiz = async function getAllQuiz(loggedInUser) {
    const localQuizDataObj = await quizDataObj();
    const getProfessorDetails = await localQuizDataObj.find({ createdBy: objOfObjectID(loggedInUser.userID) }).toArray();

    if (getProfessorDetails.length === 0)
        return { data: getProfessorDetails, "result": true, statusCode: 200, "message": "No Records Found!!", error: "" }
    if (getProfessorDetails.length > 0)
        return { data: getProfessorDetails, "result": true, statusCode: 200, "message": "", error: "" }
}

const getQuizDataUsingID = async function getQuizDataUsingID(loggedInUser, quizID) {
    const localQuizDataObj = await quizDataObj();
    let getQuizData = await localQuizDataObj.findOne({ $and: [{ createdBy: objOfObjectID(loggedInUser.userID), _id: objOfObjectID(quizID) }] });
    // let getQuizData = await localQuizDataObj.findOne({ _id: objOfObjectID(quizID) });
    if (Object.keys(getQuizData).length === 0)
        return "No Data Found!!"
    if (Object.keys(getQuizData).length > 0)
        return getQuizData;
}

const updateTimer = async function updateTimer(loggedInUser, quizID, tagName) {
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
    await localQuizDataObj.updateMany({ $and: [{ startDate: await utilsObj.dateCreationOnly("startDate"), quizReleased: false }] }, { $set: { quizReleased: true } });
    await localQuizDataObj.updateMany({ $and: [{ endDate: await utilsObj.dateCreationOnly("endDate"), quizEnded: false }] }, { $set: { quizEnded: true } });
}

module.exports = {
    getStudentDataUnderProfessor,
    getAllQuiz,
    updateTimer,
    updateReleaseAndEndTags
}