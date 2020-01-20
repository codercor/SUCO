const router = require('express').Router();
const userModel = require('../models/userModel');
router.post('/register', (req,res)=>{
    console.log("Yeni Kullanıcı Kayıt İsteği");
   userModel.register(req.body).then((status)=>{
        res.json(status);
   });
    console.log(req.body.adSoyad);
    
    
});

module.exports = router;