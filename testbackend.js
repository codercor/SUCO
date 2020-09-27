const messageModel = require("./models/messageModel");
const app = require("express")();
const bodyParser = require("body-parser");
const cors = require("cors");
let messages;

app.use(bodyParser.json({ extended: true }));
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

app.post("/saveMessage", (req, res) => {
  let to = "selami",
    from = "sahin",
    content = req.body.message,
    messageModel = require("./models/messageModel");
  console.log({ gonderici: from, alici: to, icerik: content });
  messageModel
    .saveMessage({ gonderici: from, alici: to, icerik: content })
    .then(() => {
      res.sendStatus(200);
    });
});
