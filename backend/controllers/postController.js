const router = require("express").Router(),
    auth = require("../authCheck")
    multer = require("multer"),
    storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'public/postImages/')
        },
        filename: (req, file, cb) => {
            cb(null, `${req.params.filename}-${Date.now()}`)
        }
    });

let upload = multer({ storage: storage });
router.post('/publish',  upload.array("image") , (req, res) => {
    
    console.log(req.body);
    console.log(req.files);
});

module.exports = router;