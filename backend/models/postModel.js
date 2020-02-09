const con = require("./connection");
let postModel = {};

postModel.publishPost = function(MyId,text,images,emotion,date,privacy) {
    return new Promise((resolve,reject)=>{
       let sql = "INSERT INTO gonderiler(paylasanId,metin,duygu,resim,begeni,tarih,gizlilik) VALUES(?,?,?,?,?,?,?)";
       con.query(sql,[MyId,text,emotion,images,0,date,privacy],(err,result)=>{
           if(err) reject(err);
           else resolve(result);
       })
    });
    
}

module.exports = postModel;