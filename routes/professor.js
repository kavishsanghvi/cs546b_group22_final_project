const express = require('express');
const router = express.Router();
const data = require("../data");
const usersData = data.users;
const quizData = data.retriveQuizData;
const categoryData = data.createCategory;
const createQuizData = data.createQuiz;
const xss = require('xss');
const utilsObj = require('../data/utils')

router.get('/allStudents', async (req, res) => {
    try {
        let getAllUsersData = await usersData.getAllStudentUnderProfessorData(req.session.user);
        res.status(getAllUsersData.statusCode?getAllUsersData.statusCode:200).render('posts/users', { getAllStudentUnderProfessorResult: getAllUsersData.data, message: getAllUsersData.message, error: getAllUsersData.error, userData : JSON.stringify(req.session.user) })
    } catch (e) {
        res.status(e.statusCode?e.statusCode:500).render('posts/users', { getAllUsersData: [], userData : JSON.stringify(req.session.user), message: e.message, error: e.error })
    }
});

router.get('/category', async (req, res) => {
    try {
        let getAllCategoryData = await usersData.getCategoryData(req.session.user, "category");
        res.status(getAllCategoryData.statusCode?getAllCategoryData.statusCode:200).render('posts/category', { categoriesResult: getAllCategoryData.data, message: getAllCategoryData.message, error: getAllCategoryData.error, userData : JSON.stringify(req.session.user) })
    } catch (e) {
        res.status(e.statusCode?e.statusCode:500).render('posts/category', { getAllCategoryData: [], userData : JSON.stringify(req.session.user), message: e.message?e.message:"No categories added yet. Please add a category first.", error: e.error })
    }
});

router.get('/category/:category', async (req, res) => {
    try {
        let checkmainCategory = await utilsObj.variableSanityCheck(xss(req.params.category), "string", "Category");
        if (checkmainCategory.result) req.params.category = checkmainCategory.value
        else throw { "result": false, statusCode: 400, "message": "", error: "Please provide a valid data in string.", userData: null }

        let getSubCategoryData = await usersData.getSubCategoryOfCategory(req.session.user, xss(req.params.category), "subCategory");
        res.status(getSubCategoryData.statusCode?getSubCategoryData.statusCode:200).render('posts/sub-category', { subCategoriesResult: getSubCategoryData.data, message: getSubCategoryData.message, error: getSubCategoryData.error, userData : JSON.stringify(req.session.user) })
    } catch (e) {
        res.status(e.statusCode?e.statusCode:500).render('posts/sub-category', { getSubCategoryData: [], userData : JSON.stringify(req.session.user), message: e.message?e.message:"No sub categories added yet. Please add a category first.", error: e.error })
    }
});

router.get('/category/subCategory/:subCategory', async (req, res) => {
    try {
        let getQuizData = await quizData.getStudentDataUnderProfessor(req.session.user, xss(req.params.subCategory));
        let getStudentDetails = await usersData.getStudentRecord(req.session.user, getQuizData);
        res.render('posts/quizReport', { studentResult: getStudentDetails, userData : JSON.stringify(req.session.user) })
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.post('/verifyStudent/', async (req, res) => {
    try {
        let checkID = await utilsObj.variableSanityCheck(xss(req.body.dataid), "ObjectID", "ID");
        if (checkID.result) req.body.dataid = checkID.value
        else throw { "result": false, statusCode: 400, "message": "", error: "Please provide a valid ID.", userData: null }

        const updatedData = await usersData.updateStudentStatus(req.session.user, xss(req.body.dataid));
        res.json(updatedData);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.get('/allquiz', async (req, res) => {
    try {
        let getQuizData = await quizData.getAllQuiz(req.session.user);

        res.status(getQuizData.statusCode?getQuizData.statusCode:200).render('posts/allQuiz', { allQuizData: getQuizData.data, message: getQuizData.message, error: getQuizData.error, userData : JSON.stringify(req.session.user) })
    } catch (e) {
        res.status(e.statusCode?e.statusCode:500).render('posts/allQuiz', { getQuizData: [], userData : JSON.stringify(req.session.user), message: e.message?e.message:"No quizzes found!!", error: e.error })
    }
});

router.post('/allquiz/toggleTimer', async (req, res) => {
    try {

        let checkID = await utilsObj.variableSanityCheck(xss(req.body.dataid), "ObjectID", "ID");
        if (checkID.result) req.body.dataid = checkID.value
        else throw { "result": false, statusCode: 400, "message": "", error: "Please provide a valid ID.", userData: null }
    
        let checkTagName = await utilsObj.variableSanityCheck(xss(req.body.dataVal), "string", "Category");
        if (checkTagName.result) req.body.dataVal = checkTagName.value
        else throw { "result": false, statusCode: 400, "message": "", error: "Please provide a valid data in string.", userData: null }

        let tagName = "";
        if (xss(req.body.dataVal) == "Timer") {
            tagName = "isTimerEnabled"
        } else if (xss(req.body.dataVal) == "Release") {
            tagName = "quizReleased"
        } else
            return "Please provide a valid name."

        const updatedData = await quizData.updateTimer(req.session.user, xss(req.body.dataid), tagName);
        res.json(updatedData);
    } catch (e) {
        res.status(e.statusCode?e.statusCode:500).json({userData : JSON.stringify(req.session.user), message: e.message?e.message:"Something went wrong!!", error: e.error })
    }
});

// Create Route From Here
router.get('/createQuiz', async (req, res) => {
    if (req.session.user == null) {
        res.redirect('/')
    } else if (req.session.user['userType'] != 'professor') {
        res.redirect('/')
    }
    try {
        const categoryList = await categoryData.getCategories(req.session.user);
        res.render('Create Quiz/createQuiz', { title: 'Create Quiz', categoryList: categoryList, userData : JSON.stringify(req.session.user) });
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.post('/createQuiz/getSubCat', async (req, res) => {
    try {
        if (!xss(req.body.categoryName)) throw 'Error: Category Name is required'
        const subCategoryList = await categoryData.getSubCategories(req.session.user, xss(req.body.categoryName));
        res.json(subCategoryList)
    } catch (e) {
        res.status(400).render('Create Quiz/createQuiz', { is_error: 1, message: e, title: 'Create category', userData : JSON.stringify(req.session.user) });
    }
});

router.post('/createQuiz', async (req, res) => {
    const categoryList = await categoryData.getCategories(req.session.user);
    var timerEnabled = true
    var quizReleased = false
    var quizEnded = false
    var timer = 30
    try {
        if (!xss(req.body.startDate)) throw 'Error: Start Date is required'
        if (!xss(req.body.Categories)) throw 'Error: Categories is required'
        if (!xss(req.body.SubCategories)) throw 'Error: Sub Categories is required'
        if (!xss(req.body.questionName)) throw 'Error: Question Name is required'
        if (!xss(req.body.optionA)) throw 'Error: Option A is required'
        if (!xss(req.body.optionB)) throw 'Error: Option B is required'
        if (!xss(req.body.optionC)) throw 'Error: Option C is required'
        if (!xss(req.body.optionD)) throw 'Error: Option D is required'
        if (!xss(req.body.correctAnswer)) throw 'Error: Correct Answer is required'

        if (parseInt(xss(req.body.timer))) {
            timer = parseInt(req.body.timer)
            if (timer < 0) throw 'Error: Timer cannot have a negative value'
        }
        const createQuiz = await createQuizData.create(xss(req.body.startDate), xss(req.body.endDate), xss(req.body.Categories), xss(req.body.SubCategories), req.body.questionName, req.body.optionA, req.body.optionB, req.body.optionC, req.body.optionD, req.body.correctAnswer, timerEnabled, quizReleased, quizEnded, xss(timer), req.session.user['userID']);
        res.render('Create Quiz/createQuiz', { success: 1, message: 'Quiz created Successfully ', title: 'Create Quiz', categoryList: categoryList, userData : JSON.stringify(req.session.user) });
    } catch (e) {
        res.status(400).render('Create Quiz/createQuiz', { is_error: 1, message: e, title: 'Create Quiz', categoryList: categoryList, userData : JSON.stringify(req.session.user) });
    }
});

router.get('/createCategory', async (req, res) => {
    try {
        let getAllCategoryData = await usersData.getCategoryData(req.session.user, "category");
        res.render('Create Category/createCategory', { title: 'Create category', getAllCategoryData: getAllCategoryData.data, userData : JSON.stringify(req.session.user) });
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.post('/createCategory', async (req, res) => {
    try {
        if (!req.body.category_name) throw 'Error: Category Name is required'
        if (!req.body.sub_category_name) throw 'Error: Sub Category Name is required'
        const categoryInfo = await categoryData.createCategory(xss(req.body.category_name), xss(req.body.sub_category_name), req.session);
        message = `Category "${xss(req.body.category_name)}" and Sub Category "${xss(req.body.sub_category_name)}" was successsfully created`
        let getAllCategoryData = await usersData.getCategoryData(req.session.user, "category");
        res.render('Create Category/createCategory', { success: 1, message: message, title: 'Create category', getAllCategoryData: getAllCategoryData.data, userData : JSON.stringify(req.session.user) });
    } catch (e) {
        let getAllCategoryData = await usersData.getCategoryData(req.session.user, "category");
        res.status(400).render('Create Category/createCategory', { is_error: 1, message: e, title: 'Create category', getAllCategoryData: getAllCategoryData.data, userData : JSON.stringify(req.session.user) });
    }
});

module.exports = router;