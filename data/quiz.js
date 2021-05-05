const mongoCollections = require('../config/mongoCollections');
const utils = require("./utils");
const ObjectId = require('mongodb').ObjectId;
const quizObj = mongoCollections.quiz;
const studentSubmittedQuizObj = mongoCollections.studentSubmittedQuiz;


const getQuiz = async function getQuiz(quizID){
    let studentQuizObjData = await studentSubmittedQuizObj();
    const isAlreadyTaken = await studentQuizObjData.find({_id : ObjectId("6080a7e37c378456cbcbf278")}).toArray();
    //if(isAlreadyTaken && isAlreadyTaken.length>0) throw {message:"Already taken", err: "Already taken"};
    
    let quizObjData = await quizObj();
    const getQuizData = await quizObjData.find({_id : ObjectId("6080a7e37c378456cbcbf278")}).toArray();
    if(getQuizData && getQuizData.length>0){
        let quizData = getQuizData[0]; 
        let questions = quizData.questions;
        delete quizData.questions;
        
        let questionsWOAns = [];
        questions.forEach(element => {
            delete element.correctAnswer;
            questionsWOAns.push(element);
        });
        quizData.questions = questionsWOAns;
        const addQuizInStudentRes = await addQuizInStudent(quizData,"6080a7557c378456cbcbf274");
        if(addQuizInStudentRes && addQuizInStudentRes === true)
            return quizData;
        else throw {message:"error", err: "error"};
    }else{
        throw {message:"error", err: "error"};
    }
}

const addQuizInStudent = async function addQuizInStudent(quizData, userID){
    delete quizData.userid;
    quizData.userid = ObjectId(userID);
    quizData.quizId = quizData._id;
    delete quizData._id;
    quizData.startDate = await utils.dateCreation();
    let quizObjData = await studentSubmittedQuizObj();

    let addQuizInStudentRes = await quizObjData.insertOne(quizData);
    if (addQuizInStudentRes.insertedCount === 0) throw 'Could not add data in student quiz';
    //return JSON.parse(JSON.stringify(addUser.ops[0]));
    return true;
}

const updateStudentQuiz = async function updateStudentQuiz(quizDataByStudent, userID){
    console.log(quizDataByStudent);
    let questionId = ObjectId(quizDataByStudent.questionId);
    let selectedAns = quizDataByStudent.selectedAns;
    let loggedInUser = ObjectId(userID);

    let studentSubmittedQuiz = await studentSubmittedQuizObj();
    //let bookInfo = await studentSubmittedQuiz.updateOne({_id : userID},{ $set: { reviews: { _id:  bookID}}}, { multi: false });
    // let addQuizInStudentRes = await quizObjData.insertOne(quizData);
    // if (addQuizInStudentRes.insertedCount === 0) throw 'Could not add data in student quiz';
    // //return JSON.parse(JSON.stringify(addUser.ops[0]));
    return true;
}

module.exports = {
    getQuiz,
    updateStudentQuiz
}