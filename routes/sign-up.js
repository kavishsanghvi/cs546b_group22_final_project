const express = require('express');
const { users } = require('../data');
const router = express.Router();
const data = require("../data");
const loginData = data.login;
const xss = require('xss');

router.get('/', async (req, res) => {
    try {
        res.render('posts/sign-up', {title: "Sign-up"});
    } catch (e) {
        res.status(500).json({
            error: e
        });
    }
});

router.post('/', async (req, res) => {

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

        if (!req.body.emailAddress) {
            flag = true;
            throw { "result": false, statusCode: 400, "message": "", error: "Please provide valid email address." }
        }

        if (!req.body.selectUserType) {
            flag = true;
            throw { "result": false, statusCode: 400, "message": "", error: "Please select user type." }
        }

        if (!req.body.password) {
            flag = true
            throw { "result": false, statusCode: 400, "message": "", error: "Please enter password." }
        }

        if (!req.body.universityName) {
            flag = true;
            throw { "result": false, statusCode: 400, "message": "", error: "Please select university." }
        }
        let user = {
            firstName: xss(req.body.firstName),
            lastName: xss(req.body.lastName),
            email: xss(req.body.emailAddress),
            userType: xss(req.body.selectUserType),
            password: xss(req.body.password),
            universityName: xss(req.body.universityName),
        }

        const bloguserdata = user;
        const { firstName, lastName, email, userType, password, universityName } = bloguserdata;
        const newUser = await users.createnewuser(firstName, lastName, email, userType, password, universityName);

        if (newUser == null) {
            flag = true
        }
        if (!newUser) {
            flag = true;
        }
        res.status(newUser.statusCode?newUser.statusCode:200).render('posts/SuccessMessage', { keyobject: newUser.data, message: newUser.message, error: newUser.error })
    } catch (e) {
        res.status(e.statusCode ? e.statusCode : 400).render('posts/sign-up', { message: e.message, error: e.error })
    }
});

module.exports = router;