const router = require('express').Router();
const userModel = require('../models/userModel');
let jwt = require('jsonwebtoken');
let auth = require('../authCheck');
router.post('/register', (req, res) => {
    console.log("Yeni Kullanıcı Kayıt İsteği");
    userModel.register(req.body).then((status) => {
        res.json(status);
    });
    console.log(req.body.adSoyad);
});

router.post('/login', (req, res) => {
    let { userName, password } = req.body;
    userModel.checkUser(userName, password).then((result) => {
        if (result.length == 1) {
            let token = jwt.sign({ userName, password }, require("../config").api_secret_key, { expiresIn: 500 })
            res.json({token,login:'successful'});
        }else{
            res.json({login:'failed'});
        }
    });
});

router.post('/updatePP',auth, (req, res) => {
    console.log("PP günceleme isteği");
    
    res.send(req.files)
});

module.exports = router;