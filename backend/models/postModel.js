const con = require("./connection");
let postModel = {};

postModel.publishPost = function (MyId, text, images, emotion, date, privacy) {
    return new Promise((resolve, reject) => {
        let sql = "INSERT INTO gonderiler(paylasanId,metin,duygu,resim,tarih,gizlilik) VALUES(?,?,?,?,?,?)";
        con.query(sql, [MyId, text, emotion, images, date, privacy], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    });
}

postModel.getPostById = function (id) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM gonderiler WHERE id = ${id}`;
        con.query(sql, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
}


async function getPeopleWhoLike(postId) {
    let peopleWhoLike = await (new Promise((resolve, reject) => {
        let sql = `SELECT begenenler FROM gonderiler WHERE id = ${postId}`;
        con.query(sql, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    }));

    return peopleWhoLike[0].begenenler;
}

postModel.likePost = async function (myId, postId) {
    let peopleWhoLike = JSON.parse(await getPeopleWhoLike(postId));
    console.log(peopleWhoLike);
    if (peopleWhoLike.includes(myId)) {
        console.log("Beğenenler dizisinden sil");
        let myIdIndex = peopleWhoLike.indexOf(myId);
        peopleWhoLike.splice(myIdIndex, 1);
    } else {
        console.log("Beğenenler dizisine ekle");
        peopleWhoLike.push(myId);
    }
    return new Promise((resolve, reject) => {
        let sql = `UPDATE gonderiler SET begenenler = "${JSON.stringify(peopleWhoLike)}" WHERE id = ${postId}`;
        con.query(sql, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
}
function getCommentsByPostId(postId) {
    return new Promise((resolve,reject)=>{
        let sql = `SELECT yorumlar FROM gonderiler WHERE id = ${postId}`;
        con.query(sql,(err,result)=>{
          if(err)reject(err);
          else resolve(result[0].yorumlar);
        });   
    });
}

postModel.sendComment = async function(postId, commentData) {
    let updatedComments = [];
  return new Promise((resolve,reject)=>{
      let sql = `UPDATE gonderiler SET yorumlar = "${commentData}" WHERE id = postId`;
      con.query(sql,(err,result)=>{
        if(err)reject(err);
        else resolve(result)
      });   
  });
  //burada kaldık devam edecek...
}

module.exports = postModel;