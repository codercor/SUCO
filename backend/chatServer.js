const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(80);
// WARNING: app.listen(80) will NOT work here!

app.get('/', (req, res) => {
  
});

io.on('connection', (socket) => {
  console.log("kullanıcı");
  socket.on("disconnect",()=>{
    console.log("disconnet");
  })
});