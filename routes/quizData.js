const express = require('express');
const router = express.Router();
const data = require("../data");
const quizData = data.retriveQuizData;
const userDataObj = data.users;

// router.get('/:subCategory', async (req, res) => {
//     try {
//         let getQuizData = await quizData.getStudentDataUnderProfessor(req.params.subCategory);
//         // res.json(getQuizData);
//         // let getStudentDetails = await userDataObj.getStudentRecord(getQuizData.userid);
//         let getStudentDetails = await userDataObj.getStudentRecord(getQuizData);
//         // console.log(getQuizData)
//         // console.log(getStudentDetails)
//         res.render('posts/table-list', { studentResult: getStudentDetails})
//     } catch (e) {
//         res.status(500).json({ error: e });
//     }
// });

router.get('/allquiz', async (req, res) => {
    try {
        let getQuizData = await quizData.getAllQuiz();
        res.render('posts/allQuiz', { allQuizData: getQuizData , userData : JSON.stringify(req.session.user)})
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.post('/allquiz/toggleTimer', async (req, res) => {
    try {
        let tagName = "";
        // console.log(req.body.dataid);
        // console.log(req.body.dataVal);
        if (req.body.dataVal == "Timer") {
            tagName = "isTimerEnabled"
        } else if (req.body.dataVal == "Release") {
            tagName = "quizReleased"
        } else
            return "Please provide a valid name."
        const updatedData = await quizData.updateTimer(req.body.dataid, tagName);
        res.json(updatedData);
        // res.render('posts/users', { layout: null, ...updatedData })
        // let getAllReviewOfABook = await reviewsData.getAllReviews(req.params.id);

        // const newBook = await booksData.updateBook(req.params.id, booksPostData);
        // let getSubCategoryData = await usersData.getCategoryData("subCategory");
        // res.render('posts/sub-category', { subCategoriesResult: getSubCategoryData })
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

module.exports = router;