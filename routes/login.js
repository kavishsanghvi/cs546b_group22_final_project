const express = require('express');
const router = express.Router();
const xss = require('xss');
const data = require("../data");
const loginData = data.login;
const utils = require('../data/utils');

router.get('/', async (req, res) => {
    try {
        res.render('posts/login', {});
    } catch (e) {
        res.status(500).json({
            error: e
        });
    }
});

router.post('/', async (req, res) => {
    try {
        let email;
        let checkEmail = await utils.variableSanityCheck(xss(req.body.email), "string", "Email");
        if (checkEmail.result)  email = (checkEmail.value).toLowerCase()
        else{
            res.status(400).render('posts/login', { error: "Incorrect user input", "message":"", title: "Quizmania  - Login", notFound: false, userData:null})
            return;
        } 
        
        let password;
        let checkPassword = await utils.variableSanityCheck(xss(req.body.password), "string", "Password");
        if (checkPassword.result)  password = checkPassword.value
        else{
            res.status(400).render('posts/login', { error: "Incorrect user input", "message":"", title: "Quizmania  - Login", notFound: false, userData:null})
            return;
        }

        let logInUser = await loginData.login(xss(email), xss(password));
        if (logInUser && logInUser.userData!=null) {            
            req.session.user = {
                firstName: logInUser.userData.firstName,
                lastName: logInUser.userData.lastName,
                isActive: logInUser.userData.isActive,
                universityName: logInUser.userData.universityName,
                userType: logInUser.userData.userType,
                userID: logInUser.userData._id,
                universityDomain: logInUser.userData.email.substring(logInUser.userData.email.indexOf('@') + 1)
            }
            if (req.session.user.userType === "student")
                res.redirect('accepted/')
            else if (req.session.user.userType === "professor")
                res.redirect('professor/category')
        }else{
            res.status(404).render('posts/login', { error: "Incorrect email or password!", title: "Quizmania  - Login",  notFound: false });
        }
        
    } catch (e) {
        res.status(e.statusCode?e.statusCode:500).render('posts/login', { error: e.error, title: "Quizmania  - Login",  notFound: false })
    }
});

module.exports = router;