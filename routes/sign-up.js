const express = require('express');
const { users } = require('../data');
const router = express.Router();
const data = require("../data");
const loginData = data.login;



router.get('/', async (req, res) => {
    try {
        res.render('posts/sign-up', {title: "Sign-up"});
    } catch (e) {
        res.status(500).json({
            error: e
        });
    }
});

router.post('/',async (req, res)=>{
    try {
        // res.render("posts/sign-up")
        console.log("post reached")
        let flag = false;
         if(!req.body.firstName) {
            flag = true;
             throw 'Please provide Firstname';
            
         }
    
         if(!req.body.lastName) {
            flag = true;
             throw 'Please provide lastname';
            
         }
         if(!req.body.emailAddress){
            flag = true;
            throw 'Invalid Emailaddress';  
         }
    
         if(!req.body.selectUserType){
            flag = true; 
            throw 'Invalid type';
         }
         if(!req.body.password){ 
             flag = true 
             throw 'Enter password please';
         }
        //  if(!req.body.dateCreated) {flag=true
        //      throw 'Enter a proper date';
        //  }
         if(!req.body.universityName){
             flag = true;
             throw 'Enter University name';
         }
         console.log(req.body.emailaddress+req.body.password)
         let user ={
            
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            email: req.body.emailAddress,
            userType:req.body.selectUserType,
            password: req.body.password,
            universityName:req.body.universityName,
            
         }
         const bloguserdata = user;
         const {firstName, lastName, email, userType, password, universityName} = bloguserdata;
         console.log(user)
         const newUser = await users.createnewuser(firstName, lastName, email, userType, password, universityName);
         console.log(newUser)
         if(newUser == null){
             flag = true
         
         }
         if(!newUser){
             flag = true;
         }

         res.status(200).render('posts/SuccessMessage', {keyobject: newUser});
         
       } catch (e) {
           console.log(e)
         res.json({errors : "No inputs provided" , hasErrors:true});
         res.status(400);
       }
    });
    
    // router.get('user/:id', async (req, res) => {
    //     try {
    //       let user = await users.getuserbyid(req.params.id);
    //       res.status(200).json(user);
    //     } catch (e) {
    //       res.status(404).json({ error: 'User not found' });
    //     }
    //   });


module.exports = router;