const con = require("./connection");

let messageModel = {
  saveMessage(message) {
    let sql = `INSERT INTO mesajlar (id, gonderici, alici, icerik, tarih) VALUES (NULL, '${
      message.gonderici
    }', '${message.alici}', '${message.icerik}', '${getDate()}');`;
    con.query(sql);
  },
  async getMessages(arkadas1, arkadas2, baslangic, uzunluk) {
    let sql = `SELECT * FROM mesajlar WHERE 
                (gonderici = '${arkadas1}' OR gonderici = '${arkadas2}')
                AND 
                (alici = '${arkadas1}' OR alici = '${arkadas2}') 
                ORDER BY tarih DESC LIMIT ${baslangic},${uzunluk}`;
    let mesajlar = [];
    await new Promise((resolve, reject) => {
      con.query(sql, (err, result) => {
        mesajlar = result;
        resolve();
      });
    });

    return mesajlar;
  },
};
module.exports = messageModel;
// message = { gonderici:'',alici:'',icerik:'',tarih:'' }
// örnek tarih 2020-08-25 16:32:25

function getDate() {
  let date = new Date(),
    year = date.getFullYear(),
    month = date.getMonth() + 1,
    day = date.getDate(),
    hours = date.getHours(),
    minutes = date.getMinutes(),
    seconds = date.getSeconds();
  return (
    year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds
  );
}
