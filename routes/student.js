const express = require('express');
const router = express.Router();
const data = require("../data");
const buffer = require('Buffer');
const studentData = data.student;
const dashbaordData = data.dashboard;
const quizDataStudent = data.quiz;
const usersObj = data.users
const xss = require('xss');
const utilsObj = require('../data/utils')

router.get('/', async (req, res) => {
    try {
        let getAllCategoryData = await studentData.getCategoryData(req.session.user);
        res.render('posts/student', { categoriesResult: getAllCategoryData, userData: JSON.stringify(req.session.user) })
    } catch (e) {
        res.status(e.statusCode?e.statusCode:401).render('posts/student', { getAllCategoryData: [], userData : JSON.stringify(req.session.user), message: e.message, error: e.error })
        // res.status(500).json({ error: e, userData : JSON.stringify(req.session.user) });
    }
});

router.get('/my-score', async (req, res) => {
    try {
        let score = await dashbaordData.getQuizData(req.session.user)
        res.status(score.statusCode?score.statusCode:200).render('posts/studentViewScore', { myres: score.data, message: score.message, error: score.error, userData : JSON.stringify(req.session.user) })
    } catch (e) {
        res.status(404).json({ error: 'No Test Given', userData : JSON.stringify(req.session.user) });
    }
});

router.get('/category/:category', async (req, res) => {
    try {
        let checkmainCategory = await utilsObj.variableSanityCheck(req.params.category, "string", "Category");
        if (checkmainCategory.result) req.params.category = checkmainCategory.value
        else throw { "result": false, statusCode: 400, "message": "", error: "Please provide a valid data in string.", userData: null }

        let getSubCategoryData = await studentData.getSubCategoryOfCategory(req.session.user, xss(req.params.category));
        
        res.status(getSubCategoryData.statusCode?getSubCategoryData.statusCode:200).render('posts/student-sub-category', { subCategoriesResult: getSubCategoryData.data, message: getSubCategoryData.message, error: getSubCategoryData.error, userData : JSON.stringify(req.session.user) })
    } catch (e) {
        res.status(e.statusCode?e.statusCode:401).render('posts/student-sub-category', { getSubCategoryData: [], userData : JSON.stringify(req.session.user), message: e.message, error: e.error })
    }
});


router.get('/start-quiz/:qid', async (req, res) => {
    try {
        //console.log(Buffer.from(req.params.qid, 'base64').toString());
        console.log((Buffer.from(req.params.qid,'base64')).toString());


        let quiz = await quizDataStudent.getQuiz(req.session.user, (Buffer.from(req.params.qid,'base64')).toString());

        res.render('posts/quiz', { title: "Quiz", quizData: quiz, quizData2: JSON.stringify(quiz), userData: JSON.stringify(req.session.user) });
    } catch (e) {
        res.render('posts/401', { title: "Error", userData: JSON.stringify(req.session.user) });
        console.log(e.err);
    }
})

router.post('/quiz-student-update', async (req, res) => {
    try {
        let questionId = req.body.questionId
        let selectedAns = req.body.selectedAns
        let userID = req.session.user.userID;
        let quiz = await quizDataStudent.updateStudentQuiz(userID, req.body);
        res.json(quiz);
    } catch (e) {
        console.log(e.err);
    }
});

router.post('/quiz-student-submit', async (req, res) => {
    try {
        let quizId = req.body.quizId
        let id = req.body.id
        let userID = req.session.user.userID;
        let quiz = await quizDataStudent.submitStudentQuiz(userID, req.body);
        res.json(quiz);
    } catch (e) {
        console.log(e.err);
    }
});

router.get('/enroll-now', async (req, res) => {
    try {
        let getAllCategoryData = await usersObj.getAllCategoryData(req.session.user, "category");
        res.status(getAllCategoryData.statusCode?getAllCategoryData.statusCode:200).render('posts/enrollNow', { getAllCategoryData: getAllCategoryData.data, message: getAllCategoryData.message, error: getAllCategoryData.error, userData : JSON.stringify(req.session.user) })

        // res.render('posts/enrollNow', { getAllCategoryData, userData: JSON.stringify(req.session.user) });
    } catch (e) {
        res.status(e.statusCode?e.statusCode:500).render('posts/enrollNow', { getAllCategoryData: [], userData : JSON.stringify(req.session.user), message: e.message, error: e.error })
    }
})

router.post('/enroll-now', async (req, res) => {
    try {
        let checkID = await utilsObj.variableSanityCheck(xss(req.body.dataid), "ObjectID", "ID");
        if (checkID.result) req.body.dataid = checkID.value
        else throw { "result": false, statusCode: 400, "message": "", error: "Please provide a valid ID.", userData: null }

        let checkDataValue = await utilsObj.variableSanityCheck(req.body.dataValue, "string", "Category");
        if (checkDataValue.result) req.body.dataValue = checkDataValue.value
        else throw { "result": false, statusCode: 400, "message": "", error: "Please provide a valid data in string.", userData: null }
        
        let getAllCategoryData = await usersObj.enrollNow(req.session.user, xss(req.body.dataid), xss(req.body.dataValue));
        res.json(getAllCategoryData);
    } catch (e) {
        res.status(e.statusCode?e.statusCode:500).json({userData : JSON.stringify(req.session.user), message: e.message?e.message:"Something went wrong!!", error: e.error })
    }
})

module.exports = router;