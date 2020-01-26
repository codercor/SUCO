const con = require("./connection");
let userModel = {};


userModel.register = async (user) => {
    let check = await userModel.checkMail(user.eposta);
    // Kayıtlı mı diye kontrol et 
    if (check.length > 0) {
        return new Promise((resolve, reject) => {
            // Kayıtlı ise gerekli cevabı ver
            resolve({ register: false, err: "registered" })
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
userModel.checkMail = (mail) => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM kullanicilar WHERE eposta = "${mail}"`;
        con.query(
            sql, (err, result) => {
                if (err) reject(err)
                resolve(result);
            });
    });
}

userModel.checkUser = (userName, password) => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM kullanicilar WHERE kullaniciAdi = "${userName}" AND sifre="${password}"`;
        con.query(
            sql, (err, result) => {
                if (err) reject(err)
                resolve(result);
            });
    });
}

userModel.getIdbyUserName = (userName) => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT id FROM kullanicilar WHERE kullaniciAdi = "${userName}"`;
        con.query(
            sql, (err, result) => {
                if (err) reject(err)
                resolve(result[0].id);
            });
    });
}

userModel.updatePP = (id, ppPath) => {
    return new Promise((resolve, reject) => {
        let sql = `UPDATE kullanicilar SET profilResmi = "${ppPath}" WHERE id = ${id}`;
        con.query(sql, (err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    });
}
userModel.updateCP = (id, cpPath) => {
    return new Promise((resolve, reject) => {
        let sql = `UPDATE kullanicilar SET kapakResmi = "${cpPath}" WHERE id = ${id}`;
        con.query(sql, (err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    });
}

userModel.getUserByUserName = function (username) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM kullanicilar WHERE kullaniciAdi = "${username}"`;
        con.query(sql, (err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
}

userModel.sendFriendRequest = async function (myId, sentId) {
    let myRequests = await (new Promise((resolve, reject) => {
        let sql = `SELECT istekler FROM kullanicilar WHERE id = ${myId}`;
        con.query(sql, (err, result) => {
            if (err) reject(err);
            resolve(result[0].istekler);
        })
    }));
    let itsRequests = await (new Promise((resolve, reject) => {
        let sql = `SELECT istekler FROM kullanicilar WHERE id = ${sentId}`;
        con.query(sql, (err, result) => {
            if (err) reject(err);
            resolve(result[0].istekler);
        })
    }));
    JSON.parse("[1,2,3]")
    itsRequests = convertJS(itsRequests);
    myRequests = convertJS(myRequests);

    itsRequests.gelen.push(myId);
    myRequests.gonderilen.push(sentId);
    convertString(myRequests);
    
    let updateMyRequests = new Promise((resolve, reject) => {
        let sql = `UPDATE kullanicilar SET istekler=' ${ convertString(myRequests) } ' WHERE id = ${myId}`;
        con.query(sql, (err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    });


    function convertJS(requestData) {
        requestData = JSON.parse(requestData);
        requestData.gelen = JSON.parse(requestData.gelen);
        requestData.gonderilen = JSON.parse(requestData.gonderilen)
        return requestData;
    }
    function convertString(requestData) {
        let stringGelen = JSON.stringify(requestData.gelen);
        let stringGonderilen = JSON.stringify(requestData.gonderilen);
        let stringRequest = `{"gelen":"${stringGelen}","gonderilen":"${stringGonderilen}"}`;
        return stringRequest;
    }
}

module.exports = userModel;