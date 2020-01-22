const router = require('express').Router();
const userModel = require('../models/userModel');
let jwt = require('jsonwebtoken');
let auth = require('../authCheck');
var multer  = require('multer');
let token = "";
let ppDiscStorage = multer.diskStorage({
    // dosya yolunu callback function'ın 2. parametresinde belirtiyoruz.
    destination: function (req, file, callback) {
      callback(null, 'public/userpp/');
      
    },
    // dosya ismini ve uzantısını burada oluşturuyoruz.
    filename: function (req, file, callback) {
      // HTML input'tan gelen body verisini filename olarak kullanıyoruz.
      var fileName = file.originalname;
      
    //   let token = jwt.verify(req.body.token,require('../config').api_secret_key);
    //   console.log(token);
      
      // mimetype'ın tam listesini araştırıp bulabilirsiniz. 
      // burada örnek olarak 3 tanesini kullandım.
      var extension = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/gif': '.gif' };
      callback(null, fileName + '-' + Date.now() + extension[file.mimetype]);
    },

  });
var pp = multer({storage:ppDiscStorage}).single('pp');

    
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

router.post('/updatePP',(req,res)=>{  

    
    pp(req,res,(err)=>{
        if(err) res.json({error:'file type error'});
        var imagePath = req.file.path.replace(/^public\/userpp\//, '');
        console.log(imagePath);
        
        res.redirect(imagePath);
    });
    
});

module.exports = router;