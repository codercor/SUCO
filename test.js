const messageModel = require("./models/messageModel");

require("./models/messageModel");
let data = messageModel.getMessages("sukru1", "corx", 0, 5);

data.then((data) => {
  data = data.map((item) => {
    return {
      id: item.id,
      gonderici: item.gonderici,
      alici: item.alici,
      icerik: item.icerik,
      tarih: new Date(item.tarih),
    };
  });
});
