const mongoCollections = require('../config/mongoCollections');
const quiz = mongoCollections.quiz;
var ObjectId = require('mongodb').ObjectID;
const utilsObj = require('./utils')

const testString =function testString(testStr){
    try{
        if(testStr == null) throw 'Input cannot be empty!'
        if(typeof testStr != 'string') throw "The input should be a string"
        if(testStr.length <= 1) throw "The length of the input should be greater than 1"
        if(testStr.length == testStr.split(' ').length - 1) throw 'The input string cannot consist of only spaces!'
    }catch(err){
        var error = "Error: " + err
        return {error: true, message: error }
    }
    return {error: false}
}

const testDate = function testDate(dateStr){
    try{
        if(dateStr == null) throw 'Input cannot be empty!'
        if(typeof dateStr != 'string') throw "The input should be an string"
        if(dateStr.length <= 1) throw "The length of the input should be greater than 1"
        if(dateStr.length == dateStr.split(' ').length - 1) throw 'The input string cannot consist of only spaces!'
        var test_pattern = /^(0?[1-9]|1[0-2])\/(0?[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
        if (!(test_pattern.test(dateStr))) throw 'Invalid Date Format! THe format should be mm/dd/yyyy'
        if (!(new Date(dateStr))) throw 'Invalid Date Parsed'
    }catch(err){
        var error = "Error: " + err
        return {error: true, message: error }
    }
    return {error: false}
}

const testArray = function testArray(arr){
    result = []
    try{
    if (Array.isArray(arr) == false) throw 'The parameter should be an array'
    if(arr.length == 0) throw 'The array cannot be empty'
    for(var i=0 ; i<arr.length; i++){
        if(arr[i].trim().length == 0) throw 'The field cannot have empty string.'
        if(typeof arr[i] != 'string') throw 'The array values should be a string'
     }
    }catch(err){
        var error = "Error: " + err
        return {error: true, message: error }
    }
    return {error: false}
}


const getQuizById = async function getQuizById(id) {
    if (!id) throw 'You must provide an id to fetch for'
    if(typeof id != 'string') throw 'id is not a valid string'
    try{
        id = ObjectId(id)
    }catch(e){
        throw 'Invalid Id. Argument passed in must be a single String of 12 bytes or a string of 24 hex characters'
    }
    const quizCollection = await quiz();
    const quizInfo = await quizCollection.findOne({ _id: id });

    if (!quizInfo) throw 'quiz with id: ' + id + 'was not found';
    return quizInfo;    
}

const create = async function create(startDate, endDate, category, subCategory, questionName, optionA, optionB, optionC, optionD, correctAnswer, timerEnabled, quizReleased, quizEnded, timer, userID) {
    try{
        if (testString(category)['error'] == true) throw testString(category)['message']
        if (testString(subCategory)['error'] == true) throw testString(subCategory)['message']            
        if (testDate(startDate)['error'] == true) throw testDate(startDate)['message']
        if (testDate(endDate)['error'] == true) throw testDate(endDate)['message']
        
        if(typeof questionName == 'string'){
            questionName = [questionName]
            optionA = [optionA]
            optionB = [optionB]
            optionC = [optionC]
            optionD = [optionD]
            correctAnswer = [correctAnswer]
        }
        var today = new Date();
        var date = (today.getMonth()+1) + '/' + today.getDate() + '/' +today.getFullYear();
        if (Date.parse(startDate) < Date.parse(date)) throw 'Start Date Cannot be Smaller than the current date'
        if(Date.parse(endDate) < Date.parse(startDate)) throw 'End Date Cannot be smaller than the start Date'

        if(timer < 30 || timer > 360) throw 'Timer can not have less than 30 or more than 360 minutes.'

        var questions = []
        for (i in questionName){
            let checkquestionName = await utilsObj.variableSanityCheck(questionName[i], "string", "Question Name", 1, 200);
            if (checkquestionName.result) questionName[i] = checkquestionName.value
            else throw `${checkquestionName.message}`

            let checkOptionA = await utilsObj.variableSanityCheck(optionA[i], "string", "Option 1", 1, 200);
            if (checkOptionA.result) optionA[i] = checkOptionA.value
            else throw `${checkOptionA.message}`

            let checkOptionB = await utilsObj.variableSanityCheck(optionB[i], "string", "Option 2", 1, 200);
            if (checkOptionB.result) optionB[i] = checkOptionB.value
            else throw `${checkOptionB.message}`

            let checkOptionC = await utilsObj.variableSanityCheck(optionC[i], "string", "Option 3", 1, 200);
            if (checkOptionC.result) optionC[i] = checkOptionC.value
            else throw `${checkOptionC.message}`

            let checkOptionD = await utilsObj.variableSanityCheck(optionD[i], "string", "Option 4", 1, 200);
            if (checkOptionD.result) optionD[i] = checkOptionD.value
            else throw `${checkOptionD.message}`

            let checkcorrectAnswer = await utilsObj.variableSanityCheck(correctAnswer[i], "string", "Correct Answer", 1, 200);
            if (checkcorrectAnswer.result) correctAnswer[i] = checkcorrectAnswer.value
            else throw `${checkcorrectAnswer.message}`

            if(correctAnswer[i].trim().toLowerCase() == optionA[i].trim().toLowerCase() || correctAnswer[i].trim().toLowerCase() == optionB[i].trim().toLowerCase() || correctAnswer[i].trim().toLowerCase() == optionC[i].trim().toLowerCase() || correctAnswer[i].trim().toLowerCase() == optionD[i].trim().toLowerCase()){
                if (testArray(questionName)['error'] == true) throw testArray(questionName)['message']
                if (testArray(optionA)['error'] == true) throw testArray(optionA)['message']
                if (testArray(optionB)['error'] == true) throw testArray(optionB)['message']
                if (testArray(optionC)['error'] == true) throw testArray(optionC)['message']
                if (testArray(optionD)['error'] == true) throw testArray(optionD)['message']
                if (testArray(correctAnswer)['error'] == true) throw testArray(correctAnswer)['message']
                questions.push({
                    questionID: ObjectId(),
                    question: questionName[i].trim().toLowerCase(),
                    answerChoice1: optionA[i].trim().toLowerCase(),
                    answerChoice2: optionB[i].trim().toLowerCase(),
                    answerChoice3: optionC[i].trim().toLowerCase(),
                    answerChoice4: optionD[i].trim().toLowerCase(),
                    correctAnswer: correctAnswer[i].trim().toLowerCase()
                })
            }else{
                throw 'Invalid Correct Answer'
            }
        }
            
        const quizData = {
            category: category,
            subCategory: subCategory,
            startDate: startDate,
            endDate: endDate,
            timer: timer,
            isTimerEnabled: timerEnabled,
            quizReleased: quizReleased,
            quizEnded: quizEnded,
            questions: questions,
            createdBy: ObjectId(userID)
        }
        
        const quizCollection = await quiz();
        const insertInfo = await quizCollection.insertOne(quizData);
        if (insertInfo.insertedCount === 0) throw 'Could not add quiz';

        const quizID = insertInfo.insertedId;
        const quizInfo = await getQuizById(quizID.toString());

        return quizInfo
        
    }catch(err){
        throw 'Error: ' + err
    }
}

module.exports = {
    create
}
