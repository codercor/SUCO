const con = require("./connection");
let userModel = {};


userModel.register = async (user) => {
    let check = await userModel.check(user.eposta);
 // Kayıtlı mı diye kontrol et 
    if (check.length > 0) {
        return new Promise((resolve, reject) => {
            // Kayıtlı ise gerekli cevabı ver
            resolve({ register: false, err:"registered" })
        });
    }
    // Kayıtlı değil ise kaydet
    return new Promise((resolve, reject) => {
        let sql = `INSERT INTO kullanicilar(kullaniciAdi,adSoyad,kisiselBilgi,sifre,profilResmi,kapakResmi,eposta,arkadaslari,istekler,ayarlar) VALUES (?,?,?,?,?,?,?,?,?,?)`;
        con.query(
            sql, Object.values(user), (err, result) => {
                if (err) reject(err)
                resolve({ register: true });
            });
    });


}
// Verilen eposta adresi kayıtlı mı diye kontrol et
userModel.check = (mail) => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM kullanicilar WHERE eposta = "${mail}"`;
        con.query(
            sql, (err, result) => {
                if (err) reject(err)
                resolve(result);
            });
    });
}
module.exports = userModel;