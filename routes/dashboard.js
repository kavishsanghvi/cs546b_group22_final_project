const express = require('express');
const router = express.Router();
const data = require("../data");
const dashbaordData = data.dashboard;

router.get('/', async (req, res) => {
    try {
      let score = await dashbaordData.getQuizData(req.session.user)
      res.render('posts/dashboard', { myres : score , userData : JSON.stringify(req.session.user)});
    } catch (e) {
      res.status(404).json({ error: 'No Test Given' });
    }
  });

  module.exports = router;