const app = require('express')();
const con = require('./models/connection');
let jwt = require('jsonwebtoken');

module.exports =  function(req,res,next) {
    let token = req.body.token;
    try {
         jwt.verify(token,require("./config").api_secret_key);
    } catch (error) {
        res.send("Giriş Yap")
    }
    next();
}