const express = require('express');
const router = express.Router();
const data = require("../data");
const studentData = data.student;

router.get('/', async (req, res) => {
    try {
        console.log(req.session.user)
        console.log("hello")
        let getAllCategoryData = await studentData.getCategoryData(req.session.user);
        res.render('posts/student', { categoriesResult: getAllCategoryData, userData : JSON.stringify(req.session.user)  })
    } catch (e) {
        res.status(500).json({ error: e });
    }
});


router.get('/:category', async (req, res) => {
    try {
        console.log(req.params.category)
        let getSubCategoryData = await studentData.getSubCategoryOfCategory(req.session.user, req.params.category);
        res.render('posts/student-sub-category', { subCategoriesResult: getSubCategoryData, userData : JSON.stringify(req.session.user)  })
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

module.exports = router;