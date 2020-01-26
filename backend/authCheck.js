let jwt = require("jsonwebtoken")
module.exports = async function(req,res,next) {
    let token = req.body.token;
    try {
         jwt.verify(token,require("./config").api_secret_key);     
    } catch (error) {
        res.send("Giriş Yap")
    }
    next();
}