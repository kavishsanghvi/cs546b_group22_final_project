const express = require('express');
const router = express.Router();
const data = require("../data");
const categoryData = data.createCategory;
const quizData = data.createQuiz;


router.get('/', async (req, res) => {
    if(req.session.user == null){
        res.redirect('/')
    }else if(req.session.user['userType'] != 'professor'){
        res.redirect('/')
    }
    try {
        const categoryList = await categoryData.getCategories();
        res.render('Create Quiz/createQuiz', { title: 'Create Quiz', categoryList: categoryList, userData : JSON.stringify(req.session.user)});
    } catch (e) {
        res.status(500).json({ error: e });
    }
});


router.post('/', async (req, res) => {
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

       
//       if (req.body.isTimerEnabled == 'enabled') {
//           timerEnabled = true
//       }
//       
//        if (req.body.quizReleased == 'enabled') {
//           quizReleased = true
//       }
       
        if (parseInt(req.body.timer)) {
           timer = parseInt(req.body.timer)
            if (timer < 0) throw 'Error: Timer cannot have a negative value'
       }
       
       
       const createQuiz = await quizData.create(req.body.startDate, req.body.endDate, req.body.Categories, req.body.SubCategories, req.body.questionName, req.body.optionA, req.body.optionB, req.body.optionC, req.body.optionD, req.body.correctAnswer, timerEnabled, quizReleased, timer, req.session.user['userID']);
       
       res.render('Create Quiz/createQuiz', { success: 1, message: 'Quiz created Successfully ', title: 'Create Quiz', categoryList: categoryList, userData : JSON.stringify(req.session.user)});
  } catch (e) {
    res.status(400).render('Create Quiz/createQuiz', {is_error: 1, message: e, title: 'Create Quiz', categoryList: categoryList, userData : JSON.stringify(req.session.user)});
      console.log('Error', e)
  }
});


router.post('/getSubCat', async (req, res) => {
   try {
       if (!req.body.categoryName) throw 'Error: Category Name is required'
       const subCategoryList = await categoryData.getSubCategories(req.body.categoryName);
       res.json(subCategoryList)
  } catch (e) {
    res.status(400).render('Create Quiz/createQuiz', {is_error: 1, message: e, title: 'Create category'});
      console.log('Error', e)
  }
});

module.exports = router;