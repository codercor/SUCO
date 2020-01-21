const app = require('express')();
const bodyParser = require("body-parser");
let upload = require("multer")();
const userController = require('./controllers/userController');

app.use(bodyParser.json());
app.use(upload.array());
app.use(bodyParser.urlencoded({ extended: true }));
 


app.use('/user',userController);

app.listen(85, () => console.log("Yayın başladı..."));
