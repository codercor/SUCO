const userModel = require("./models/userModel");
let jwt = require('jsonwebtoken');
async function getUsernamesAndIdes(req) {
    let myUserName = jwt.verify(req.body.token, require("./config").api_secret_key).userName;
    let sentUserName = req.params.username;

    let myId = await userModel.getIdbyUserName(myUserName);
    let itsId = await userModel.getIdbyUserName(sentUserName);

    return { myUserName, sentUserName, myId, itsId };
}
module.exports = async function (req, res, next) {
    let { myUserName, sentUserName, myId, itsId } = await getUsernamesAndIdes(req);
    let myBlockeds = await userModel.getBlockedUsers(myId);
    let itsBlockeds = await userModel.getBlockedUsers(itsId)
    console.log(myBlockeds, itsBlockeds);
    let isBlocked = false;
    for (let i = 0; i < myBlockeds.length; i++) {
        if (myBlockeds[i] == itsId) isBlocked = true;
    }
    for (let i = 0; i < itsBlockeds.length; i++) {
        if (itsBlockeds[i] == myId) isBlocked = true;
    }
    if(isBlocked){
        res.send("Engellenmiş Kullanıcı");
    }else{
        next(); 
    }
   
}