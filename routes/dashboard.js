const express = require('express');
const router = express.Router();
const data = require("../data");
const usersData = data.users;
const xss = require('xss');
const updatedUserObj = data.updateUser;

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
  res.redirect('../login');
})

router.get('/editProfile', async (req, res) => {
  try {
    console.log(req.session.user.userID)
    let user = await usersData.getuserbyid(req.session.user.userID);
    res.status(200).render('posts/editProfile', { keyobject: user,  userData : JSON.stringify(req.session.user) });
  } catch (e) {
    res.status(404).json({ error: 'User not found' });
  }
});

router.post('/editProfile', async (req, res) => {
    try {
        let flag = false;
        if (!req.body.firstName) {
            flag = true;
            throw { "result": false, statusCode: 400, "message": "", error: "Please provide first name." };
        }

        if (!req.body.lastName) {
            flag = true;
            throw { "result": false, statusCode: 400, "message": "", error: "Please provide last name." }
        }

        
    const requestBody = req.body;
    console.log(requestBody);
    let updatedObject = {};
    updatedObject = await usersData.getuserbyid(req.session.user.userID);
    
      const oldPost = await usersData.getuserbyid(req.session.user.userID);
      if (requestBody.firstName && requestBody.firstName !== oldPost.firstName)
       updatedObject.firstName = xss(requestBody.firstName);
      if (requestBody.lastName && requestBody.lastName !== oldPost.lastName ) 
         updatedObject.lastName = xss(requestBody.lastName);
    
    if (Object.keys(requestBody).length !== 0) {
      
        const updateduser = await updatedUserObj.updateuser(
          req.session.user.userID,
          updatedObject
        );
        if(updateduser.updatedCount.modifiedCount > 0){
          req.session.user.firstName = updateduser.updatedValue.firstName;
          req.session.user.lastName = updateduser.updatedValue.lastName;
        }
        res.redirect('./userProfile');
    }
}
    catch (e) {
        res.status(e.statusCode ? e.statusCode : 400).render('posts/userProfile', { message: e.message, error: e.error })
    }
    
});

module.exports = router;