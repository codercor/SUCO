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
    cpDiscStorage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, 'public/usercp/');
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
            cb(new Error('Bu bir resim Değil !!'))
        }
    },
    pp = multer({ storage: ppDiscStorage, fileFilter: fileFilter }).single('pp'),
    cp = multer({ storage: cpDiscStorage, fileFilter: fileFilter }).single('pp');

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
            let token = jwt.sign({ userName, password }, require("../config").api_secret_key, { expiresIn: 5000})
            res.json({ token, login: 'successful' });
        } else {
            res.json({ login: 'failed' });
        }
    });
});

router.post('/updatePP', async(req, res) => {
    pp(req, res, async(err) => {

        if (err) res.json({ error: 'file type error' });
        else {
            let token = req.body.token;
            try {
                token = jwt.verify(token, require("../config").api_secret_key);
                // OOOY OY
                let userName = token.userName;
                let userData = await userModel.getIdbyUserName(userName);
                let photoName = token.userName+userData[0].id + '.' + req.file.originalname.split('.')[1];
                fs.renameSync(req.file.path, req.file.destination + photoName);
                await userModel.updatePP(userData[0].id,'/userpp/' + photoName);
                res.send(`<img src="/userpp/${photoName}" />`);
                //res.json({ update: "successfull", src:'/userpp/' + photoName})

            } catch (error) {
                fs.unlinkSync(req.file.path);
                res.send("Giriş Yap");
            }
        }
    });

});


router.post('/updateCP', async(req, res) => {
    cp(req, res, async(err) => {

        if (err) res.json({ error: 'file type error' });
        else {
            let token = req.body.token;
            try {
                token = jwt.verify(token, require("../config").api_secret_key);
                // OOOY OY
                let userName = token.userName;
                let userData = await userModel.getIdbyUserName(userName);
                let photoName = token.userName+userData[0].id + '.' + req.file.originalname.split('.')[1];
                fs.renameSync(req.file.path, req.file.destination + photoName);
                await userModel.updateCP(userData[0].id,'/usercp/' + photoName);
                res.send(`<img src="/usercp/${photoName}" />`);
                //res.json({ update: "successfull", src:'/userpp/' + photoName})

            } catch (error) {
                fs.unlinkSync(req.file.path);
                res.send("Giriş Yap");
            }
        }
    });

});

module.exports = router;