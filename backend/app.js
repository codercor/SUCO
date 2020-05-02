let express = require('express');
    app = express(),
    bodyParser = require("body-parser"),
    server = require('http').Server(app);
    cors = require("cors"),
    path = require("path"),
    io = require('socket.io')(server),
    userController = require('./controllers/userController'),
    postController = require('./controllers/postController');
  
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/user', userController);
app.use('/post', postController);

io.on('connection', (socket) => {
    console.log("kullanıcı");
    socket.on("disconnect",()=>{
      console.log("disconnet");
    })
  });

server.listen(85, () => console.log("Yayın başladı..."));
