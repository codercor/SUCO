const app = require('express')();
const bodyParser = require("body-parser");
let jwt = require('jsonwebtoken');
let auth = require('./authCheck');
const userController = require('./controllers/userController');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
 

app.post('/getToken',(req,res)=>{
    let {userName,password} = req.body;
    let token = jwt.sign({userName,password}, require("./config").api_secret_key, {expiresIn:500} )
    res.json({token});
});

app.use('/user',userController);

app.listen(85, () => console.log("Yayın başladı..."));
