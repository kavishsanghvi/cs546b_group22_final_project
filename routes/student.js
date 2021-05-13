const express = require('express');
const router = express.Router();
const data = require("../data");
const buffer = require('Buffer');
const studentData = data.student;
const dashbaordData = data.dashboard;
const quizDataStudent = data.quiz;
const usersObj = data.users

router.get('/', async (req, res) => {
    try {
        let getAllCategoryData = await studentData.getCategoryData(req.session.user);
        res.render('posts/student', { categoriesResult: getAllCategoryData, userData: JSON.stringify(req.session.user) })
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.get('/my-score', async (req, res) => {
    try {
        let score = await dashbaordData.getQuizData(req.session.user)
        res.render('posts/studentViewScore', { myres: score, userData: JSON.stringify(req.session.user) });
    } catch (e) {
        res.status(404).json({ error: 'No Test Given' });
    }
});

router.get('/category/:category', async (req, res) => {
    try {
        console.log(req.params.category)
        let getSubCategoryData = await studentData.getSubCategoryOfCategory(req.session.user, req.params.category);
        res.render('posts/student-sub-category', { subCategoriesResult: getSubCategoryData, userData: JSON.stringify(req.session.user) })
    } catch (e) {
        res.status(500).json({ error: e });
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
        console.log(req.session.user);
        let getAllCategoryData = await usersObj.getAllCategoryData(req.session.user, "category");
        res.render('posts/enrollNow', { getAllCategoryData, userData: JSON.stringify(req.session.user) });
    } catch (e) {
        console.log(e.err);
    }
})

router.post('/enroll-now', async (req, res) => {
    try {
        console.log(req.session.user);
        let getAllCategoryData = await usersObj.enrollNow(req.session.user, req.body.dataid, req.body.dataValue);
        res.json(getAllCategoryData);
    } catch (e) {
        console.log(e.err);
    }
})

module.exports = router;