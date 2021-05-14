const express = require('express');
const router = express.Router();
const data = require("../data");
const dashbaordData = data.dashboard;
const usersData = data.users;

// router.get('/', async (req, res) => {
//     try {
//       let score = await dashbaordData.getQuizData(req.session.user)
//       res.render('posts/dashboard', { myres : score , userData : JSON.stringify(req.session.user)});
//     } catch (e) {
//       res.status(404).json({ error: 'No Test Given' });
//     }
//   });

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
  //res.send('Logged out!!');
  //return res.render('posts/index', {error: "You are logout now", title: "Login", notFound: false });
  res.redirect('../login');
})

module.exports = router;