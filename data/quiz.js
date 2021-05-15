const arrayShuffle = require('array-shuffle');
const mongoCollections = require('../config/mongoCollections');
const utils = require("./utils");
const ObjectId = require('mongodb').ObjectId;
const quizObj = mongoCollections.quiz;
const studentSubmittedQuizObj = mongoCollections.studentSubmittedQuiz;
const usersObj = mongoCollections.users;


const getQuiz = async function getQuiz(loggedInUser, quizID){
    let userId = loggedInUser.userID;
    let studentQuizObjData = await studentSubmittedQuizObj();
    const isAlreadyTaken = await studentQuizObjData.find({quizId : ObjectId(quizID),userid : ObjectId(userId) }).toArray();
    if(isAlreadyTaken && isAlreadyTaken.length>0) throw {message:"Already taken", err: "error", "statusCode" : 500};

       
    let quizObjData = await quizObj();
    const getQuizData = await quizObjData.find({_id : ObjectId(quizID)}).toArray();
    if(getQuizData && getQuizData.length>0){

        let usersObjData = await usersObj();
        let categoryNameStd = `enrolledStudents.${getQuizData[0].category}`;
        const isInvalidAccessStd = await usersObjData.find({[categoryNameStd] : ObjectId(userId)}).toArray();

        let categoryNamePro = `enrolledIn.categoryName`;
        let professorIDPro = `enrolledIn.professorID`;
        const isInvalidAccessPro = await usersObjData.find({_id : ObjectId(userId), [professorIDPro]: getQuizData[0].createdBy, [categoryNamePro] : getQuizData[0].category}).toArray();
        
        if(isInvalidAccessStd && isInvalidAccessPro &&  isInvalidAccessStd.length<1 && isInvalidAccessPro.length<1) throw {message:"Authorised Access", err: "error", "statusCode" : 500};

        
        let quizData = getQuizData[0]; 
        let questions = quizData.questions;
        delete quizData.questions;
        
        let questionsWOAns = [];
        const randomArray = await arrayShuffle([1,2,3,4]);
        questions.forEach((element) => {
            let el = element;
            delete element.correctAnswer;
            // element.answerChoice1 = el['answerChoice'+randomArray[0]]
            // element.answerChoice2 = el['answerChoice'+randomArray[1]]
            // element.answerChoice3 = el['answerChoice'+randomArray[2]]
            // element.answerChoice4 = el['answerChoice'+randomArray[3]]

            questionsWOAns.push(element);
        });

        // for (const element of questions) {
        //     let el = element;
        //     await delete element.correctAnswer;
        //     element.answerChoice1 = el['answerChoice'+randomArray[0]]
        //     element.answerChoice2 = el['answerChoice'+randomArray[1]]
        //     element.answerChoice3 = el['answerChoice'+randomArray[2]]
        //     element.answerChoice4 = el['answerChoice'+randomArray[3]]

        //     await questionsWOAns.push(element);
        //   }

        quizData.questions = await arrayShuffle(questionsWOAns);
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
    let questionCount = quizData.questions.length;
    quizData.totalQuizScore = questionCount;

    let addQuizInStudentRes = await quizObjData.insertOne(quizData);
    if (addQuizInStudentRes.insertedCount === 0) throw 'Could not add data in student quiz';
    //return JSON.parse(JSON.stringify(addUser.ops[0]));
    return true;
}

const updateStudentQuiz = async function updateStudentQuiz(userID, quizDataByStudent){
    let questionId = ObjectId(quizDataByStudent.questionId);
    let selectedAns = quizDataByStudent.selectedAns;
    let quizId = ObjectId(quizDataByStudent.quizId);
    let loggedInUser = ObjectId(userID);
    let id = ObjectId(quizDataByStudent.id);


    let studentSubmittedQuiz = await studentSubmittedQuizObj();
    let updatequestion = await studentSubmittedQuiz.updateOne({_id : id, "questions.questionID" : questionId, quizId : quizId, userid : ObjectId(userID)},
    { $set: { "questions.$.Userchoice" : selectedAns, "lastUpdate":await utils.dateCreation()} }, { multi: false });
    
    if(updatequestion.modifiedCount >= 1 &&  updatequestion.matchedCount >=1){
        return {message:"Question updates", statusCode:200}
    }else if(updatequestion.modifiedCount ===0 &&  updatequestion.matchedCount >=1){
        throw {message:"Modified content not found, we are unable to update record!!", statusCode:400}
    }else{
        throw {message:"Something went wrong!!", statusCode:500}
    }
}


const submitStudentQuiz = async (userID, quizDataByStudent) =>{
    let quizId = quizDataByStudent.quizId;
    let loggedInUser = ObjectId(userID);
    let id = ObjectId(quizDataByStudent.id);



    let studentSubmittedQuiz = await studentSubmittedQuizObj();
    let submitQuiz = await studentSubmittedQuiz.updateOne({_id : id, quizId : ObjectId(quizId), userid : ObjectId(userID)},
    { $set: { "endDate":await utils.dateCreation()} }, { multi: false });
    
    if(submitQuiz.modifiedCount >= 1 &&  submitQuiz.matchedCount >=1){
        let stdData = {quizId,loggedInUser,studentQuizSubmittedID : id}
        let calculateScoreRes = await calculateScore(stdData,"Individual");
        if(calculateScoreRes && calculateScoreRes.status){
            let updateScore = await studentSubmittedQuiz.updateOne({_id : id, quizId : ObjectId(quizId), userid : ObjectId(userID)},
            { $set: { totalScore : calculateScoreRes.score} }, { multi: false });
            if(updateScore.modifiedCount >= 1 &&  updateScore.matchedCount >=1){
                return {message:"Quiz Submitted", statusCode:200}
            }else if(updateScore.modifiedCount ===0 &&  updateScore.matchedCount >=1){
                return {message:"Quiz Submitted", statusCode:200}
                //throw {message:"Modified content not found, we are unable to update record!!", statusCode:400}
            }else{
                throw {message:"Something went wrong!!", statusCode:500}
            }
        }else{
            throw {message:"Something went wrong!!", statusCode:500}
        }
    }else if(submitQuiz.modifiedCount ===0 &&  submitQuiz.matchedCount >=1){
        throw {message:"Modified content not found, we are unable to update record!!", statusCode:400}
    }else{
        throw {message:"Something went wrong!!", statusCode:500}
    }
}

const calculateScore = async (studentData,type)=>{
    let userId = studentData.loggedInUser;
    let studentQuizObjData = await studentSubmittedQuizObj();
    const getStudentQuiz = await studentQuizObjData.find({_id : ObjectId(studentData.studentQuizSubmittedID), quizId : ObjectId(studentData.quizId),userid : ObjectId(userId) }).toArray();
    if(getStudentQuiz && getStudentQuiz.length>0){
        let quizObjData = await quizObj();
        const getQuizData = await quizObjData.find({_id : ObjectId(studentData.quizId)}).toArray();
        if(getQuizData && getQuizData.length>0){
            let studentQuizQuestions = getQuizData[0].questions;
            let professorQuizQuestions = getStudentQuiz[0].questions;
            let score = 0;
            studentQuizQuestions.forEach((element, index, array) => { 
                professorQuizQuestions.find((elementQdata, index) => { 
                    if( element.correctAnswer == elementQdata.Userchoice  && JSON.stringify(element.questionID) == JSON.stringify(elementQdata.questionID)){
                        score = score+1;
                    }
                })
            })
            return {status : true, score};
            
        }else{
            throw {message:"Modified content not found, we are unable to update record!!", statusCode:400}
        }
    }else{
        throw {message:"Modified content not found, we are unable to update record!!", statusCode:400}
    }
}

const autoCalculateScore = async () => {
    let quizSubmitObj = await studentSubmittedQuizObj();
    let studentsList = quizSubmitObj.find({endDate : ""});
    studentsList.forEach(async (std) => {
        
        let startDate = new Date(std.startDate);
        let currentDate = await utils.dateCreation();
        let diffMs =  new Date(currentDate) - startDate;
        let diffDays = Math.floor(diffMs / 86400000); // days
        let diffHrs = Math.floor((diffMs % 86400000) / 3600000);
        let diffMinss = Math.round(((diffMs % 86400000) % 3600000) / 60000);
        let totalMin = diffDays*24*60 + diffHrs*60 + diffMinss
        if(totalMin>std.timer){
            await submitStudentQuiz(String(std.userid),{quizId:String(std.quizId),id : String(std._id)})        
        }
    });

}

    
module.exports = {
    getQuiz,
    updateStudentQuiz,
    submitStudentQuiz,
    autoCalculateScore
}