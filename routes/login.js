const express = require('express');
const router = express.Router();
const data = require("../data");
const loginData = data.login;


router.post('/', async (req, res) => {
    try {

            let email = req.body.email;
            let password = req.body.password;

        let addUser = await loginData.login(email,password);
        res.json(addUser);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});


module.exports = router;