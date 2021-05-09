const express = require('express');
const router = express.Router();
const data = require("../data");
const usersData = data.users;
// const quizDataStudent = data.quiz;
const quizData = data.retriveQuizData;
const categoryData = data.createCategory;
const createQuizData = data.createQuiz;

router.get('/allStudents', async (req, res) => {
    try {
        // let getAllUsersData = await usersData.getStudentData();
        // res.json(getAllUsersData);
        let getAllUsersData = await usersData.getAllStudentUnderProfessorData(req.session.user);
        res.render('posts/users', { getAllStudentUnderProfessorResult: getAllUsersData })
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.get('/category', async (req, res) => {
    try {
        console.log(req.session.user)
        let getAllCategoryData = await usersData.getCategoryData(req.session.user, "category");
        res.render('posts/category', { categoriesResult: getAllCategoryData })
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.get('/category/:category', async (req, res) => {
    try {
        // console.log(req.params.category)
        let getSubCategoryData = await usersData.getSubCategoryOfCategory(req.session.user, req.params.category, "subCategory");
        res.render('posts/sub-category', { subCategoriesResult: getSubCategoryData })
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.get('/category/subCategory/:subCategory', async (req, res) => {
    try {
        let getQuizData = await quizData.getStudentDataUnderProfessor(req.session.user, req.params.subCategory);
        // res.json(getQuizData);
        // let getStudentDetails = await userDataObj.getStudentRecord(getQuizData.userid);
        let getStudentDetails = await usersData.getStudentRecord(req.session.user, getQuizData);
        // console.log(getQuizData)
        // console.log(getStudentDetails)
        res.render('posts/quizReport', { studentResult: getStudentDetails })
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.post('/verifyStudent/', async (req, res) => {
    try {
        console.log(req.body.dataid);
        const updatedData = await usersData.updateStudentStatus(req.session.user, req.body.dataid);
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

router.get('/allquiz', async (req, res) => {
    try {
        let getQuizData = await quizData.getAllQuiz(req.session.user);
        res.render('posts/allQuiz', { allQuizData: getQuizData })
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

        const updatedData = await quizData.updateTimer(req.session.user, req.body.dataid, tagName);
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

// Create Route From Here

router.get('/createQuiz', async (req, res) => {
    if (req.session.user == null) {
        res.redirect('/')
    } else if (req.session.user['userType'] != 'professor') {
        res.redirect('/')
    }
    try {
        const categoryList = await categoryData.getCategories();
        res.render('Create Quiz/createQuiz', { title: 'Create Quiz', categoryList: categoryList });
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.post('/createQuiz/getSubCat', async (req, res) => {
    try {
        if (!req.body.categoryName) throw 'Error: Category Name is required'
        const subCategoryList = await categoryData.getSubCategories(req.body.categoryName);
        res.json(subCategoryList)
    } catch (e) {
        res.status(400).render('Create Quiz/createQuiz', { is_error: 1, message: e, title: 'Create category' });
        console.log('Error', e)
    }
});

router.post('/createQuiz', async (req, res) => {
    const categoryList = await categoryData.getCategories();
    var timerEnabled = true
    var quizReleased = false
    var timer = 30
    try {
        if (!req.body.startDate) throw 'Error: Start Date is required'
        if (!req.body.Categories) throw 'Error: Categories is required'
        if (!req.body.SubCategories) throw 'Error: Sub Categories is required'
        if (!req.body.questionName) throw 'Error: Question Name is required'
        if (!req.body.optionA) throw 'Error: Option A is required'
        if (!req.body.optionB) throw 'Error: Option B is required'
        if (!req.body.optionC) throw 'Error: Option C is required'
        if (!req.body.optionD) throw 'Error: Option D is required'
        if (!req.body.correctAnswer) throw 'Error: Correct Answer is required'

        if (parseInt(req.body.timer)) {
            timer = parseInt(req.body.timer)
            if (timer < 0) throw 'Error: Timer cannot have a negative value'
        }
        const createQuiz = await createQuizData.create(req.body.startDate, req.body.endDate, req.body.Categories, req.body.SubCategories, req.body.questionName, req.body.optionA, req.body.optionB, req.body.optionC, req.body.optionD, req.body.correctAnswer, timerEnabled, quizReleased, timer, req.session.user['userID']);
        res.render('Create Quiz/createQuiz', { success: 1, message: 'Quiz created Successfully ', title: 'Create Quiz', categoryList: categoryList });
    } catch (e) {
        res.status(400).render('Create Quiz/createQuiz', { is_error: 1, message: e, title: 'Create Quiz', categoryList: categoryList });
        console.log('Error', e)
    }
});

router.get('/createCategory', async (req, res) => {
    try {
        let getAllCategoryData = await usersData.getCategoryData(req.session.user, "category");
        console.log('on create category page')
        res.render('Create Category/createCategory', { title: 'Create category', getAllCategoryData });
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.post('/createCategory', async (req, res) => {
    try {
        if (!req.body.category_name) throw 'Error: Category Name is required'
        if (!req.body.sub_category_name) throw 'Error: Sub Category Name is required'
        const categoryInfo = await categoryData.createCategory(req.body.category_name, req.body.sub_category_name, req.session);
        message = `Category "${req.body.category_name}" and Sub Category "${req.body.sub_category_name}" was successsfully created`
        let getAllCategoryData = await usersData.getCategoryData(req.session.user, "category");
        res.render('Create Category/createCategory', { success: 1, message: message, title: 'Create category', getAllCategoryData });
    } catch (e) {
        let getAllCategoryData = await usersData.getCategoryData(req.session.user, "category");
        res.status(400).render('Create Category/createCategory', { is_error: 1, message: e, title: 'Create category', getAllCategoryData });
    }
});

module.exports = router;