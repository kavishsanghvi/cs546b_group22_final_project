const mongoCollections = require('../config/mongoCollections');
const quiz = mongoCollections.quiz;
var ObjectId = require('mongodb').ObjectID;


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
            if(correctAnswer[i].toLowerCase() == optionA[i].toLowerCase() || correctAnswer[i].toLowerCase() == optionB[i].toLowerCase() || correctAnswer[i].toLowerCase() == optionC[i].toLowerCase() || correctAnswer[i].toLowerCase() == optionD[i].toLowerCase()){
                if (testArray(questionName)['error'] == true) throw testArray(questionName)['message']
                if (testArray(optionA)['error'] == true) throw testArray(optionA)['message']
                if (testArray(optionB)['error'] == true) throw testArray(optionB)['message']
                if (testArray(optionC)['error'] == true) throw testArray(optionC)['message']
                if (testArray(optionD)['error'] == true) throw testArray(optionD)['message']
                if (testArray(correctAnswer)['error'] == true) throw testArray(correctAnswer)['message']
                questions.push({
                    questionID: ObjectId(),
                    question: questionName[i].trim(),
                    answerChoice1: optionA[i].trim(),
                    answerChoice2: optionB[i].trim(),
                    answerChoice3: optionC[i].trim(),
                    answerChoice4: optionD[i].trim(),
                    correctAnswer: correctAnswer[i].trim()
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
