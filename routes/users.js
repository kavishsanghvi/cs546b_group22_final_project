const express = require('express');
const router = express.Router();
const data = require("../data");
const usersData = data.users;
const quizData = data.retriveQuizData;

router.get('/', async (req, res) => {
    try {
        // let getAllUsersData = await usersData.getStudentData();
        // res.json(getAllUsersData);
        let getAllUsersData = await usersData.getAllStudentUnderProfessorData();
        res.render('posts/users', { getAllStudentUnderProfessorResult: getAllUsersData })
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.post('/', async (req, res) => {
    try {
        let userInfo = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            universityName: req.body.universityName
        }
        let addUser = await usersData.addUserData(userInfo);
        res.json(addUser);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

// router.get('/users', async (req, res) => {
//     try {
//         let getAllProfessorData = await usersData.getProfessorData();
//         res.json(getAllProfessorData);
//     } catch (e) {
//         res.status(500).json({ error: e });
//     }
// });

router.get('/category', async (req, res) => {
    try {
        let getAllCategoryData = await usersData.getCategoryData("category");
        res.render('posts/category', { categoriesResult: getAllCategoryData })
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.get('/category/:category', async (req, res) => {
    try {
        // console.log(req.params.category)
        let getSubCategoryData = await usersData.getSubCategoryOfCategory(req.params.category, "subCategory");
        res.render('posts/sub-category', { subCategoriesResult: getSubCategoryData })
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.post('/verifyStudent/', async (req, res) => {
    try {
        console.log(req.body.dataid);
        const updatedData = await usersData.updateStudentStatus(req.body.dataid);
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

router.get('/category/subCategory/:subCategory', async (req, res) => {
    try {
        let getQuizData = await quizData.getStudentDataUnderProfessor(req.params.subCategory);
        // res.json(getQuizData);
        // let getStudentDetails = await userDataObj.getStudentRecord(getQuizData.userid);
        let getStudentDetails = await usersData.getStudentRecord(getQuizData);
        // console.log(getQuizData)
        // console.log(getStudentDetails)
        res.render('posts/table-list', { studentResult: getStudentDetails})
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

module.exports = router;