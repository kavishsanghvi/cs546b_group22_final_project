const express = require('express');
const router = express.Router();
const data = require("../data");
const usersData = data.users;

router.get('/', async (req, res) => {
    try {
        let getAllUsersData = await usersData.getStudentData();
        res.json(getAllUsersData);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.post('/', async (req, res) => {    
    try {
        let userInfo = {
            firstName :req.body.firstName,
            lastName :req.body.lastName,
            email :req.body.email,
            password :req.body.password,
            universityName :req.body.universityName
        }
        let addUser = await usersData.addUserData(userInfo);
        res.json(addUser);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});


module.exports = router;