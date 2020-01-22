const express = require('express');
const app = express();
const bodyParser = require("body-parser");

const userController = require('./controllers/userController');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/user',userController);

app.listen(85, () => console.log("Yayın başladı..."));
