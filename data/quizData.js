const mongoCollections = require('../config/mongoCollections');
const studentSubQuizObj = mongoCollections.studentSubmittedQuiz;
const objOfObjectID = require('mongodb').ObjectID;

const getStudentDataUnderProfessor = async function getStudentDataUnderProfessor(subCategoryValue) {
    const localstudentSubQuizObj = await studentSubQuizObj();
    const getProfessorDetails = await localstudentSubQuizObj.find({$and: [{createdBy: objOfObjectID("6080a6e17c378456cbcbf273"), subCategory: subCategoryValue}]}).toArray();

    // if (getProfessorDetails.length === 0)
    //     return []
    // if (getProfessorDetails.length > 0)
    return JSON.parse(JSON.stringify(getProfessorDetails));
}

module.exports = {
    getStudentDataUnderProfessor
}