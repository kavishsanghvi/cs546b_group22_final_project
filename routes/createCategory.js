const express = require('express');
const router = express.Router();
const data = require("../data");
const categoryData = data.createCategory;
const usersData = data.users;

router.get('/', async (req, res) => {
    try {
        let getAllCategoryData = await usersData.getCategoryData("category");
        console.log('on create category page')
        res.render('Create Category/createCategory', { title: 'Create category', getAllCategoryData });
    } catch (e) {
        res.status(500).json({ error: e });
    }
});


router.post('/', async (req, res) => {
    try {
        if (!req.body.category_name) throw 'Error: Category Name is required'
        if (!req.body.sub_category_name) throw 'Error: Sub Category Name is required'
        const categoryInfo = await categoryData.createCategory(req.body.category_name, req.body.sub_category_name);
        message = `Category "${req.body.category_name}" and Sub Category "${req.body.sub_category_name}" was successsfully created`
        let getAllCategoryData = await usersData.getCategoryData("category");
        res.render('Create Category/createCategory', { success: 1, message: message, title: 'Create category', getAllCategoryData });
    } catch (e) {
        let getAllCategoryData = await usersData.getCategoryData("category");
        res.status(400).render('Create Category/createCategory', { is_error: 1, message: e, title: 'Create category', getAllCategoryData});
    }
});

module.exports = router;