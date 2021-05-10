const express = require('express');
const router = express.Router();
const data = require("../data");
const studentData = data.student;
const dashbaordData = data.dashboard;
const quizDataStudent = data.quiz;

router.get('/', async (req, res) => {
    try {
        console.log(req.session.user)
        console.log("hello")
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

router.get('/start-quiz', async (req, res) => {
    try {
        console.log(req.session.user);
        let quiz = await quizDataStudent.getQuiz(req.session.user, "6080a7e37c378456cbcbf278");
        res.render('posts/quiz', { title: "Quiz", quizData: quiz, quizData2: JSON.stringify(quiz), userData: JSON.stringify(req.session.user) });
    } catch (e) {
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

module.exports = router;