const express = require('express');
const router = express.Router();
const data = require("../data");
const categoryData = data.create_category;

router.get('/', async (req, res) => {
    try {
        console.log('on create category page')
        res.render('Create Category/create_category', { title: 'Create category'});
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

       res.render('Create Category/create_category', { success: 1, message: message, title: 'Create category'});
  } catch (e) {
    res.status(400).render('Create Category/create_category', {is_error: 1, message: e, title: 'Create category'});
  }
});

module.exports = router;