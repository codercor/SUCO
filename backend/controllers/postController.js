const router = require("express").Router(),
    auth = require("../authCheck"),
    multer = require("multer"),
    jwt = require("jsonwebtoken"),
    fs = require("fs"),
    postModel = require("../models/postModel"),
    userModel = require("../models/userModel"),
    userController = require("./userController"),
    storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'public/postImages/')
        },
        filename: (req, file, cb) => {
            let fileName = Math.ceil(Math.random() * 1000000000);
            let ext = (file.originalname).split(".")[file.originalname.split(".").length - 1];
            file.originalname = fileName + "." + ext;
            cb(null, `${file.originalname}`)
        }
    });

let postImage = multer({ storage: storage }).array("image");
router.post('/publish', (req, res) => {
    let token;
    postImage(req, res, async() => {
        try {
            token = jwt.verify(req.body.token, require("../config").api_secret_key);
            let images = [];
            let myId = await userModel.getIdbyUserName(token.userName);
            let zaman = (new Date()).toISOString();
            zaman = zaman.split("T")[0];
            req.files.forEach((file)=>{
                let photoName = `${token.userName}-${zaman}-${Math.ceil(Math.random() * 1000000000)}.${file.originalname.split(".")[file.originalname.split(".").length -1]}`;        
                fs.renameSync(file.path, file.destination+photoName);
                images.push(photoName);
            });
            console.log(req.body.kitle);
            
            postModel.publishPost(myId,req.body.text,JSON.stringify(images),req.body.duygu,zaman,req.body.kitle);
            res.json({publish:"OK"});
        } catch (error) {
            req.files.forEach((file)=>{
                fs.unlinkSync(file.path);
            });
            res.json({ login: "failed" })
        }
    });
});


router.get("/:id",async (req,res)=>{
    let postId = req.params.id;
    let postData = await postModel.getPostById(postId);
   res.send(postData);
});

router.post('/like/:id', auth, async(req,res)=>{
    let postId = req.params.id;
    let myId = await getIdbyUserName(req);
    let status = await postModel.likePost(myId,postId);
    res.send(status)
});

router.post('/comment/:id',auth, async(req,res)=>{
    let postId = req.params.id;
    let myId = await getIdbyUserName(req);
    let comment = req.body.comment;
    console.log( postId, {myId,comment} );
    
});

async function getIdbyUserName(req) {
    let myUserName = jwt.verify(req.body.token, require("../config").api_secret_key).userName;
    let myId = await userModel.getIdbyUserName(myUserName);
    return myId;
}
module.exports = router;

