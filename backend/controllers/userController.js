const router = require('express').Router();
const userModel = require('../models/userModel');
let jwt = require('jsonwebtoken'),
    fs = require('fs'),
    auth = require('../authCheck'),
    multer = require('multer'),
    ppDiscStorage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, 'public/userpp/');
        },
        filename: function (req, file, callback) {
            var fileName = file.originalname;
            var extension = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/gif': '.gif' };
            callback(null, fileName + '-' + Date.now() + extension[file.mimetype]);
        },

    }),
    fileFilter = function (req, file, cb) {
        let isImage = (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/gif')
        if (isImage) {
            cb(null, true)
        } else {
            cb(null, false)
            cb(new Error('I don\'t have a clue!'))
        }
    },
    pp = multer({ storage: ppDiscStorage, fileFilter }).single('pp');


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
            res.json({ token, login: 'successful' });
        } else {
            res.json({ login: 'failed' });
        }
    });
});

router.post('/updatePP', (req, res) => {


    pp(req, res, (err) => {

        if (err) res.json({ error: 'file type error' });
        else {
            let token = req.body.token;
            try {
                token =  jwt.verify(token, require("../config").api_secret_key);
                // OOOY OY
                fs.renameSync(req.file.path,req.file.destination+token.userName+'.'+req.file.originalname.split('.')[1]);
                
                console.log(req.file);
                
            } catch (error) {
                fs.unlinkSync(req.file.path);
                
                res.send("Giriş Yap");
                
            }
        }

    });

});

module.exports = router;