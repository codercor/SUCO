/* Veritabanı bağlantısının yapıldığı dosyamız  */

// Mysql işlemlerini yapmamıza yarayan paket
let mysql = require("mysql2");

// veritabanına bağlanacak nesneyi döndürüyor
let connection = mysql.createPool({
  host: "45.84.189.195",
  port: "3306",
  user: "codercor_admin",
  password: "Filmapp123.",
  database: "codercor_suco",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// bu bağlantıyı kullanmamız için dışarı veriyor
module.exports = connection;
