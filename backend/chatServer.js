const app = require("express")();
const cors = require("cors");
app.use(cors());
const server = require("http").Server(app);
const io = require("socket.io")(server);
let clients = [];

io.set("origins", "*:*");
// Bağlanması
io.on("connection", (socket) => {
  console.log("A user connected...");

  //online olayı tetiklenirse
  socket.on("online", (userData) => {
    //gelen datayı clients arrayine ekle -> {socketid,username}
    //user zaten clients'a ekli ise tempclients dizisine bir eleman eklenir
    let tempClient = clients.filter((c) => {
      if (c.username == userData.username) {
        return true;
      } else {
        return false;
      }
    });

    // tempclient'ın elemanı yoksa ekle
    if (tempClient.length == 0) {
      clients.push(userData);
    }
    //herkese yeni listeyi gönder
    io.emit("online-list-update", clients);
  });
  // Bağlantı kopması
  socket.on("disconnect", () => {
    //disconnect olan kişinin verisini clients'dan siliyor
    clients = clients.filter((c) => {
      return c.id != socket.id;
    });
    //herkese yeni listeyi gönder
    io.emit("online-list-update", clients);
  });
});

server.listen(84, () => {
  console.log("chat server run");
});
