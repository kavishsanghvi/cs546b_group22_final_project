const mongoCollections = require('../config/mongoCollections');
const utils = require("./utils");
const ObjectId = require('mongodb').ObjectId;
const quizObj = mongoCollections.quiz;
const studentSubmittedQuizObj = mongoCollections.studentSubmittedQuiz;


const getQuiz = async function getQuiz(loggedInUser, quizID){
    console.log(loggedInUser.userID);
    let userId = loggedInUser.userID;
    let studentQuizObjData = await studentSubmittedQuizObj();
    const isAlreadyTaken = await studentQuizObjData.find({quizId : ObjectId(quizID),userid : ObjectId(userId) }).toArray();
    //if(isAlreadyTaken && isAlreadyTaken.length>0) throw {message:"Already taken", err: "error", "statusCode" : 500};
    
    let quizObjData = await quizObj();
    const getQuizData = await quizObjData.find({_id : ObjectId(quizID)}).toArray();
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
        quizData.endDate = "";
        const addQuizInStudentRes = await addQuizInStudent(quizData,userId);
        if(addQuizInStudentRes && addQuizInStudentRes === true)
            return quizData;
        else throw {message:"error", err: "error", "statusCode" : 500};
    }else{
        throw {message:"error", err: "error", "statusCode" : 500};
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

const updateStudentQuiz = async function updateStudentQuiz(userID, quizDataByStudent){
    console.log(quizDataByStudent);
    let questionId = ObjectId(quizDataByStudent.questionId);
    let selectedAns = quizDataByStudent.selectedAns;
    let quizId = quizDataByStudent.quizId;
    let loggedInUser = ObjectId(userID);
    let id = ObjectId(quizDataByStudent.id);


    // db.getCollection('studentSubmittedQuiz').updateOne(
    //     { "questions.questionID" : ObjectId("608f63e22bda4d194de03d72"), quizId : ObjectId("6080a7e37c378456cbcbf278"), userid : ObjectId("6081d5fc3dcd1dbfb511bc78")},
    //     { $set: { "questions.$.selecte" : "Collection, you know, like my Star Wars action figures "} }
    //  )


    let studentSubmittedQuiz = await studentSubmittedQuizObj();
    let updatequestion = await studentSubmittedQuiz.updateOne({_id : id, "questions.questionID" : ObjectId(questionId), quizId : ObjectId(quizId), userid : ObjectId(userID)},
    { $set: { "questions.$.Userchoice" : selectedAns, "lastUpdate":await utils.dateCreation()} }, { multi: false });
    
    if(updatequestion.modifiedCount >= 1 &&  updatequestion.matchedCount >=1){
        return {message:"Question updates", statusCode:200}
    }else if(updatequestion.modifiedCount ===0 &&  updatequestion.matchedCount >=1){
        throw {message:"Modified content not found, we are unable to update book!!", statusCode:400}
    }else{
        throw {message:"Something went wrong!!", statusCode:500}
    }
}

module.exports = {
    getQuiz,
    updateStudentQuiz
}