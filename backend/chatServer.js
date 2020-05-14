const app = require("express")();
const cors = require("cors");
app.use(cors());
const server = require("http").Server(app);
const io = require("socket.io")(server);
let clients = [];

io.set("origins", "*:*");

io.on("connection", (socket) => {
  console.log("kullanıcı");
  socket.on("disconnect", () => {
    onDisconnect(socket);
  });
  socket.on("online", (userData) => {
    onOnline(socket, userData);
  });
});
function onOnline(socket, userData) {
  clients.push(userData);
  io.emit("online-clients", clients);
}
function onDisconnect(socket) {
  console.log("disconnet");
  clients = clients.filter((item) => {
    if (item.id === socket.id) return false;
    return true;
  });
  io.emit("online-clients", clients);
}

server.listen(84, () => {
  console.log("chat server run");
});
