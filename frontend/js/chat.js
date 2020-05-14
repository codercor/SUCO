import DOM from "./classes/Dom.js";
let socket;
export default function ilk() {
  DOM.drawChat();
  socket = io("http://localhost:84/");
  socket.on("connect", onConnect);
  socket.on("online-clients", onlineClients);
}

function onConnect() {
  console.log(
    "SOCKET RUN " + socket.id + " uname: " + localStorage.getItem("username")
  );
  socket.emit("online", {
    username: localStorage.getItem("username"),
    id: socket.id,
  });
}

function onlineClients(clients) {
  console.log(clients);
}
