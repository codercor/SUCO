import DOM from "./classes/Dom.js";
import User from "./classes/User.js";
let socket,
  onlineList = [];
export default async function () {
  let user = await User.getUserData(localStorage.getItem("username"));
  connect();
  DOM.drawChat();
}

function connect() {
  socket = new io.connect("http://localhost:84", {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 50,
  });

  socket.on("connect", () => {
    DOM.messengerConnection(true);
    socket.emit("online", {
      id: socket.id,
      username: localStorage.getItem("username"),
    });
  });
  socket.on("disconnect", () => {
    DOM.messengerConnection(false);
  });
  socket.on("message-received", (data) => {
    let from = data.from;
    let friendBox = document.querySelector(`li[kullaniciadi='${from}']`);
    friendBox.click();
    console.log(data);
    DOM.saveMessagesToStorage({
      from: from,
      to: localStorage.getItem("username"),
      content: data.message,
    });
    console.log("FROM BURADAN VERİLİYOR ->", from);
    DOM.getMessages(from);
    DOM.playBip();
  });
  socket.on("online-list-update", (data) => {
    onlineList = data;
    onlineList = DOM.drawChatFriends(onlineList, socket);
  });
}
