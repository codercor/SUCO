const app = require('express')();
const con = require('./models/connection');
let upload = require("multer")();
module.exports =  function(req,res,next) {
    res.send(req.body)
    let token = req.body.token;
    try {
         jwt.verify(token,require("./config").api_secret_key);
    } catch (error) {
        res.send("Giriş Yap")
    }
    next();
}