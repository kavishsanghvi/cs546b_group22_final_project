const express = require('express');
const router = express.Router();
const data = require("../data");
const quizData = data.retriveQuizData;
const userDataObj = data.users;

router.get('/:subCategory', async (req, res) => {
    try {
        let getQuizData = await quizData.getStudentDataUnderProfessor(req.params.subCategory);
        // res.json(getQuizData);
        // let getStudentDetails = await userDataObj.getStudentRecord(getQuizData.userid);
        let getStudentDetails = await userDataObj.getStudentRecord(getQuizData);
        // console.log(getQuizData)
        // console.log(getStudentDetails)
        res.render('posts/table-list', { studentResult: getStudentDetails})
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

module.exports = router;