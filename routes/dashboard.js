const express = require('express');
const router = express.Router();
const data = require("../data");
const usersData = data.users;

router.get('/userProfile', async (req, res) => {
  try {
    console.log(req.session.user.userID)
    let user = await usersData.getuserbyid(req.session.user.userID);
    res.status(200).render('posts/userProfile', { keyobject: user,  userData : JSON.stringify(req.session.user) });
  } catch (e) {
    res.status(404).json({ error: 'User not found' });
  }
});

router.get('/logout', async (req, res) => {
  req.session.destroy();
})

module.exports = router;