const express = require('express'),
    app = express(),
    bodyParser = require("body-parser"),
    cors = require("cors"),
    
    userController = require('./controllers/userController'),
    postController = require('./controllers/postController');
  
app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/user', userController);
app.use('/post', postController);

app.listen(85, () => console.log("Yayın başladı..."));
