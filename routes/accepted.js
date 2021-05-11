const express = require('express');
const router = express.Router();
const data = require("../data");
const acceptedData = data.accepted

router.get('/', async (req, res) => {
  try {
    
    let userdata = await acceptedData.getuserData(req.session.user)
    
    if (userdata == true) {
      res.redirect("/student/")
    }
    else {
      res.render('posts/notaccepted')
    }
  } catch (e) {
    res.status(404).json({ error: 'user not found' });
  }
});

module.exports = router;