import DOM from "./classes/Dom.js";
let socket, connectionInterval;
export default function ilk() {
  //let tag = `<script id="socketiojs" src="http://localhost:84/socket.io/socket.io.js"></script>`;
  //document.head.innerHTML += tag;
  let head = document.getElementsByTagName("head")[0];
  if (document.getElementById("socketiojs") == null) {
    var script = document.createElement("script");
    script.src = "http://localhost:84/socket.io/socket.io.js";
    script.id = "socketiojs";
    head.appendChild(script);
  } else {
    let socketiojs = document.getElementById("socketiojs");
    socketiojs.src = "";
    socketiojs.src = "http://localhost:84/socket.io/socket.io.js";
  }
  DOM.drawChat();
  DOM.messengerConnection(false);

  try {
    socket = io("http://localhost:84/");
    if (socket.connected) {
      // obje.ozellik ,  obje["ozellik"]
      DOM.messengerConnection(true);
      clearInterval(connectionInterval);
      console.log("try cathcden devam 2");
    } else {
      reConnect();
    }
    socket.on("connect", onConnect);
    socket.on("online-clients", onlineClients);
    console.log("try cathcden devam 3");
  } catch (error) {
    console.log("Connection Error");
    reConnect();
  }
}

function reConnect() {
  connectionInterval = setInterval(() => {
    ilk();
    console.log("Sohbete bağlanmaya çalışılıyor...");
  }, 3000);
}

function onConnect() {
  DOM.messengerConnection(true);
  clearInterval(connectionInterval);
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
