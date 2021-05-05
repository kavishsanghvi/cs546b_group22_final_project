const express = require('express');
const router = express.Router();
const data = require("../data");
const loginData = data.login;



router.get('/', async (req, res) => {
    try {
        res.render('posts/login', {title: "Fibonacci & Prime Number Checker"});
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
            res.render('posts/login', {error: "Please pass the search value!", title:"Shows Found", searchStr:req.body.searchTerm, notFound:false})
            return;
        }


        if (typeof req.body.email !== "string") {
            res.status(400);
            res.render('posts/login', {error: "search value must be string only", title:"Shows Found", searchStr:req.body.searchTerm, notFound:false})
            return;
        }

        if (!req.body.password || req.body.password.trim() == "") {
            res.status(400);
            res.render('posts/login', {error: "Please pass the search value!", title:"Shows Found", searchStr:req.body.searchTerm, notFound:false})
            return;
        }


        if (typeof req.body.password !== "string") {
            res.status(400);
            res.render('posts/login', {error: "search value must be string only", title:"Shows Found", searchStr:req.body.searchTerm, notFound:false})
            return;
        }

        let email = req.body.email.trim();
        let password = req.body.password.trim();

        let addUser = await loginData.login(email, password);
        req.session.user = {
            firstName: addUser.token[0].firstName,
            lastName: addUser.token[0].lastName,
            isActive: addUser.token[0].isActive,
            universityName: addUser.token[0].universityName,
            userType: addUser.token[0].userType

        }
        res.redirect('users/category')
        //res.json(addUser);
    } catch (e) {
        res.status(500).json({
            error: e
        });
    }
});


module.exports = router;