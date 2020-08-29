const messageModel = require("./models/messageModel");
const app = require("express")();
const cors = require("cors");
let messages;

app.use(cors());

app.listen(80, () => {
  console.log("Test Sunucusu Çalışıyor...");
});

app.get("/getMessages", async (req, res) => {
  messages = await messageModel.getMessages(
    req.query.from,
    req.query.to,
    req.query.page
  );
  messages = messages.map((item) => {
    return {
      from: item.gonderici,
      to: item.alici,
      content: item.icerik,
    };
  });
  setTimeout(() => {
    res.json(messages);
  }, 1000);
});
