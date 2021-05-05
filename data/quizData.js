const mongoCollections = require('../config/mongoCollections');
const studentSubQuizObj = mongoCollections.studentSubmittedQuiz;
const quizDataObj = mongoCollections.quiz;
const objOfObjectID = require('mongodb').ObjectID;

const getStudentDataUnderProfessor = async function getStudentDataUnderProfessor(subCategoryValue) {
    const localStudentSubQuizObj = await studentSubQuizObj();
    const getProfessorDetails = await localStudentSubQuizObj.find({ $and: [{ createdBy: objOfObjectID("6080a6e17c378456cbcbf273"), subCategory: subCategoryValue }] }).toArray();

    // if (getProfessorDetails.length === 0)
    //     return []
    // if (getProfessorDetails.length > 0)
    return JSON.parse(JSON.stringify(getProfessorDetails));
}

const getAllQuiz = async function getAllQuiz() {
    const localQuizDataObj = await quizDataObj();
    const getProfessorDetails = await localQuizDataObj.find({ createdBy: objOfObjectID("6080a6e17c378456cbcbf273") }).toArray();
    return JSON.parse(JSON.stringify(getProfessorDetails));
}

const getQuizDataUsingID = async function getQuizDataUsingID(quizID) {
    const localQuizDataObj = await quizDataObj();
    let getQuizData = await localQuizDataObj.findOne({ _id: objOfObjectID(quizID) });
    if (Object.keys(getQuizData).length === 0)
        return "No Data Found!!"
    if (Object.keys(getQuizData).length > 0)
        return getQuizData;
}

// const updateTimer = async function updateTimer(quizID, tagName) {
//     let returnedQuizData = await getQuizDataUsingID(quizID);
//     let result = { status: returnedQuizData.isTimerEnabled, message: "" }
//     // if (Object.keys(getStudentData).length > 0) {
//     // let localQuizDataObj = await quizDataObj();
//     let localQuizDataObj = await quizDataObj();
//     if (returnedQuizData.isTimerEnabled == true) {
//         const updateisTimerIntoDB = await localQuizDataObj.updateOne({ _id: objOfObjectID(quizID) }, { $set: { "isTimerEnabled": false } });
//         if (updateisTimerIntoDB.modifiedCount === 0)
//             return { status: returnedQuizData.isTimerEnabled, message: "Unable to update!!" }
//         if (updateisTimerIntoDB.modifiedCount === 1)
//             return { status: false, message: "Status updated successfully!!" }
//     } else if (returnedQuizData.isTimerEnabled == false) {
//         const updateisTimerIntoDB = await localQuizDataObj.updateOne({ _id: objOfObjectID(quizID) }, { $set: { "isTimerEnabled": true } });
//         if (updateisTimerIntoDB.modifiedCount === 0)
//             return { status: returnedQuizData.isTimerEnabled, message: "Unable to update!!" }
//         if (updateisTimerIntoDB.modifiedCount === 1)
//             return { status: true, message: "Status updated successfully!!" }
//     }
// }


const updateTimer = async function updateTimer(quizID, tagName) {
    let returnedQuizData = await getQuizDataUsingID(quizID);
    let result = { status: returnedQuizData[tagName], message: "" }
    // if (Object.keys(getStudentData).length > 0) {
    // let localQuizDataObj = await quizDataObj();
    let localQuizDataObj = await quizDataObj();
    if (returnedQuizData[tagName] == true) {
        // let stringValue = String(tagName);
        const updateisTimerIntoDB = await localQuizDataObj.updateOne({ _id: objOfObjectID(quizID) }, { $set: { [tagName]: false } });
        if (updateisTimerIntoDB.modifiedCount === 0)
            return { status: returnedQuizData[tagName], message: "Unable to update!!" }
        if (updateisTimerIntoDB.modifiedCount === 1)
            return { status: false, message: "Status updated successfully!!" }
    } else if (returnedQuizData[tagName] == false) {
        const updateisTimerIntoDB = await localQuizDataObj.updateOne({ _id: objOfObjectID(quizID) }, { $set: { [tagName]: true } });
        if (updateisTimerIntoDB.modifiedCount === 0)
            return { status: returnedQuizData[tagName], message: "Unable to update!!" }
        if (updateisTimerIntoDB.modifiedCount === 1)
            return { status: true, message: "Status updated successfully!!" }
    }
}


module.exports = {
    getStudentDataUnderProfessor,
    getAllQuiz,
    updateTimer
}