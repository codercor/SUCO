const app = require('express')();
const bodyParser = require("body-parser");
const con = require('./models/connection');
var jwt = require('jsonwebtoken');

app.set("api_secret_key", require("./config").api_secret_key);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
 
app.post('/login',(req,res)=>{
    let {userName,password} = req.body;
    console.log(app.get('api_secret_key'))
    console.log(userName, password);
    let token = jwt.sign({userName,password}, app.get('api_secret_key'), {expiresIn:25} )
    console.log( jwt.verify(token,app.get('api_secret_key')) );
    
    res.json({token});
});
app.post('/home',(req,res)=>{
    let token = req.body.token;
    console.log(token);
    console.log( jwt.verify(token,app.get('api_secret_key')) );
    res.send(200)
});
app.listen(85, () => console.log("Yayın başladı..."));
