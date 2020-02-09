let jwt = require("jsonwebtoken")
module.exports = async function(req,res,next) {
    let token = req.body.token;
    try {
         jwt.verify(token,require("./config").api_secret_key);   
         next(); 
    } catch (error) {
        res.json({login: "failed"})
    }
    
}