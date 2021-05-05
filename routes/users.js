const express = require('express');
const router = express.Router();
const data = require("../data");
const usersData = data.users;
const quizData = data.quiz;

router.get('/', async (req, res) => {
    try {
        let getAllUsersData = await usersData.getStudentData();
        res.json(getAllUsersData);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.post('/', async (req, res) => {    
    try {
        let userInfo = {
            firstName :req.body.firstName,
            lastName :req.body.lastName,
            email :req.body.email,
            password :req.body.password,
            universityName :req.body.universityName
        }
        let addUser = await usersData.addUserData(userInfo);
        res.json(addUser);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.get('/category', async (req, res) => {
    try {
        let quiz = await quizData.getQuiz("6080a7e37c378456cbcbf278");
        res.render('posts/quiz', {title: "Quiz", quizData : quiz, quizData2 : JSON.stringify(quiz)});
    } catch (e) {
        console.log(e.err);
        res.status(500).json({ error: e });
    }
});


router.post('/quiz-student-update', async (req, res) => {
    try {
        let questionId = req.body.questionId 
        let selectedAns = req.body.selectedAns

        let quiz = await quizData.updateStudentQuiz(req.body,"6080a7e37c378456cbcbf278");
        res.json(quiz);
    } catch (e) {
        console.log(e.err);
        res.status(500).json({ error: e });
    }
});


module.exports = router;