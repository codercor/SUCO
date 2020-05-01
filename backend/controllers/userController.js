const router = require('express').Router();
const userModel = require('../models/userModel');
const postModel = require('../models/postModel');
let jwt = require('jsonwebtoken'),
    fs = require('fs'),
    auth = require('../authCheck'),
    multer = require('multer'),
    blockCheck = require('../blockCheck'),
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
    cp = multer({ storage: cpDiscStorage, fileFilter: fileFilter }).single('cp');

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
            let token = jwt.sign({ userName, password }, require("../config").api_secret_key, { expiresIn: 5000 })
            res.json({ token, login: 'successful' });
        } else {
            res.json({ login: 'failed' });
        }
    });
});

router.post('/updatePP', async (req, res) => {
    pp(req, res, async (err) => {

        if (err) res.json({ error: 'file type error' });
        else {
            let token = req.body.token;
            try {
                token = jwt.verify(token, require("../config").api_secret_key);
                // OOOY OY
                let userName = token.userName;
                let userId = await userModel.getIdbyUserName(userName);
                let photoName = token.userName + userId + '.' + req.file.originalname.split('.')[1];
                fs.renameSync(req.file.path, req.file.destination + photoName);
                await userModel.updatePP(userId, '/userpp/' + photoName);
                res.json({ update: "successfull", src: '/userpp/' + photoName })
            } catch (error) {
                fs.unlinkSync(req.file.path); //dosyayı
                res.send("Giriş Yap");
            }
        }
    });

});


router.post('/updateCP', async (req, res) => {
    cp(req, res, async (err) => {
        console.log("1.adım");

        if (err) {
            res.json({ error: 'file type error' }); console.log("2.adım"); console.log(err);
        }

        else {
            let token = req.body.token;
            console.log("3.adım");
            try {
                token = jwt.verify(token, require("../config").api_secret_key);
                // OOOY OY
                console.log("4.adım");
                let userName = token.userName;
                let userId = await userModel.getIdbyUserName(userName);
                console.log("5.adım");
                let photoName = token.userName + userId + '.' + req.file.originalname.split('.')[1];
                fs.renameSync(req.file.path, req.file.destination + photoName);
                await userModel.updateCP(userId, '/usercp/' + photoName);
                res.json({ update: "successfull", src: '/usercp/' + photoName })
            } catch (error) {
                fs.unlinkSync(req.file.path);
                res.send("Giriş Yap");
            }
        }
    });

});
router.post('/getIdByUsername/', async (req, res) => {
    res.json({ username: (await userModel.getUserNamebyId(req.body.id)) });
})
router.post('/passwordControl', auth, async (req, res) => {
    let status = await userModel.checkPassword(req.body.username, req.body.password);
    res.json({ status });
});
router.post('/updatePassword', auth, async (req, res) => {
    let { id, newPassword } = req.body; // let id =  req.body.id , let newPassword = req.body.newPassword
    let status = await userModel.updatePassword(id, newPassword);
    res.json(status);
});
router.post('/updateUsernameAndName', auth, async (req, res) => {
    let { id, newUsername, newName } = req.body; // let id =  req.body.id , let newPassword = req.body.newPassword
    let status = await userModel.updateUsernameAndName(id, newUsername, newName);
    res.json(status);
});
router.post('/search',auth, async (req,res)=>{
    const keyword = req.body.keyword;
    console.log(keyword);
    res.json({data:"selami"});
});
router.post('/updateInfo', auth, async (req, res) => {
    const info = req.body.data,
        id = req.body.id;
    await userModel.updateInfo(id,info);
    res.sendStatus(200)
})
router.post('/:username', auth, blockCheck, async (req, res) => {
    let username = req.params.username;
    let data = await userModel.getUserByUserName(username);
    let tokenUserName = jwt.verify(req.body.token, require("../config").api_secret_key);
    let itsId = await userModel.getIdbyUserName(username);
    let myId = await userModel.getIdbyUserName(tokenUserName.userName);
    let itsPosts = await postModel.getPostsByUserId(itsId);

    let myFriends = await userModel.getFriends(myId);
    if (tokenUserName.userName == username) {
        Object.assign(data[0], data[0], { myProfile: true, friend: true, posts: itsPosts })
    } else {

        if (myFriends.includes(itsId)) {
            Object.assign(data[0], data[0], { friend: true, posts: itsPosts });
        } else {
            Object.assign(data[0], data[0], { friend: false, posts: itsPosts.filter((post) => { if (post.gizlilik == 0) return post; }) });
        }

    }
    if (data[0] != undefined) res.json(data[0]);
    else res.json({ error: "user not found" })
});

async function getUsernamesAndIdes(req) {
    let myUserName = jwt.verify(req.body.token, require("../config").api_secret_key).userName;
    let sentUserName = req.params.username;

    let myId = await userModel.getIdbyUserName(myUserName);
    let sentUserId = await userModel.getIdbyUserName(sentUserName);

    return { myUserName, sentUserName, myId, sentUserId };
}

//FRIEND REQUESTS

router.post('/addFriend/:username', auth, async (req, res) => {
    let { myUserName, sentUserName, myId, sentUserId } = await getUsernamesAndIdes(req);
    await userModel.sendFriendRequest(myId, sentUserId);
    res.send(` istek gönderen username : ${myUserName} id: ${myId} \n Istek gönderilen username: ${sentUserName} id : ${sentUserId} `);
});

router.post('/acceptFriendRequest/:username', auth, async (req, res) => {
    let { myUserName, sentUserName, myId, sentUserId } = await getUsernamesAndIdes(req);
    await userModel.acceptFriendRequest(myId, sentUserId);
    res.send(`${myUserName} kullanıcısı ${sentUserName}'in arkadaşlık isteğini kabul etti.`);
});

router.post('/rejectFriendRequest/:username', auth, async (req, res) => {
    let { myUserName, sentUserName, myId, sentUserId } = await getUsernamesAndIdes(req);
    await userModel.rejectFriendRequest(myId, sentUserId);
    res.send(`${myUserName} adlı kullanıcı ${sentUserName} adlı kullanıcının arkadaşlık isteğini REDDETTİ.`)
});

router.post('/cancelFriendRequest/:username', auth, async (req, res) => {
    let { myUserName, sentUserName, myId, sentUserId } = await getUsernamesAndIdes(req);
    await userModel.cancelFriendRequest(myId, sentUserId);
    res.send(`${myUserName} kişisi ${sentUserName} kişisine gönderdiği isteği iptal etti.`);
});

router.post('/deleteFriend/:username', auth, async (req, res) => {
    let { myUserName, sentUserName, myId, sentUserId } = await getUsernamesAndIdes(req);
    await userModel.deleteFriend(myId, sentUserId);
    res.send(`${myUserName} kişisi ${sentUserName} kişisini arkadaşlıktan çıkardı.`);
});
//FRIEND REQUESTS


//BLOCK USER
router.post('/block/:username', auth, async (req, res) => {
    let { myUserName, sentUserName, myId, sentUserId } = await getUsernamesAndIdes(req);
    await userModel.blockUser(myId, sentUserId)
    res.send(`${myUserName} kişisi ${sentUserName} kişisini engelledi.`);
});

router.post('/cancelBlock/:username', auth, async (req, res) => {
    let { myUserName, sentUserName, myId, sentUserId } = await getUsernamesAndIdes(req);
    await userModel.calcelBlock(myId, sentUserId);
    res.send(`${myUserName} kişisi ${sentUserName} kişisinin engelini kaldırdı.`);
});
//BLOCK USER END




module.exports = router;