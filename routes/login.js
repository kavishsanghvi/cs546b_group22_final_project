const express = require('express');
const router = express.Router();
const data = require("../data");
const loginData = data.login;



router.get('/', async (req, res) => {
    try {
        res.render('posts/login', { title: "Fibonacci & Prime Number Checker" });
    } catch (e) {
        res.status(500).json({
            error: e
        });
    }
});


router.post('/', async (req, res) => {
    try {

        if (!req.body.email || req.body.email.trim() == "") {
            res.status(400);
            res.render('posts/login', { error: "Please pass the email", title: "Quizmania  - Login", notFound: false })
            return;
        }


        if (typeof req.body.email !== "string") {
            res.status(400);
            res.render('posts/login', { error: "search value must be string only", title: "Quizmania  - Login", notFound: false })
            return;
        }

        if (!req.body.password || req.body.password.trim() == "") {
            res.status(400);
            res.render('posts/login', { error: "Please pass the search value!", title: "Quizmania  - Login",  notFound: false })
            return;
        }


        if (typeof req.body.password !== "string") {
            res.status(400);
            res.render('posts/login', { error: "search value must be string only", title: "Quizmania  - Login",  notFound: false })
            return;
        }

        let email = req.body.email.trim();
        let password = req.body.password.trim();

        let logInUser = await loginData.login(email, password);
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
            res.render('posts/login', { error: "Incorrect email or password!", title: "Quizmania  - Login",  notFound: false });
        }
        
    } catch (e) {
        // res.status(500).json({
        //     error: e
        // });
        res.render('posts/login', { error: e.message, title: "Quizmania  - Login",  notFound: false })
    }
});


module.exports = router;