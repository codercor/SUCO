/* Veritabanı bağlantısının yapıldığı dosyamız  */

// Mysql işlemlerini yapmamıza yarayan paket
let mysql = require("mysql2");

// veritabanına bağlanacak nesneyi döndürüyor
let connection = mysql.createConnection({
  host: "45.84.189.195",
  port: "3306",
  user: "codercor_admin",
  password: "Filmapp123.",
  database: "codercor_suco",
});
// veritabanı bağlantısını sağlıyor
connection.connect();

setInterval(() => {
  connection.query("SET NAMES 'latin5'");
  connection.query("SET CHARACTER SET latin5");
  connection.query("SET COLLATION_CONNECTION = 'latin5_turkish_ci'");
}, 1000);

// bu bağlantıyı kullanmamız için dışarı veriyor
module.exports = connection;
