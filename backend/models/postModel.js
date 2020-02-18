const con = require("./connection");
let userModel = require("./userModel");
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
    return new Promise((resolve, reject) => {
        let sql = `SELECT yorumlar FROM gonderiler WHERE id = ${postId}`;
        con.query(sql, (err, result) => {
            if (err) reject(err);
            else resolve(result[0].yorumlar);
        });
    });
}

postModel.sendComment = async function (postId, commentData) {
    let postsComments = await getCommentsByPostId(postId);
    postsComments = commentParse(postsComments);
    postsComments.push(commentData);
    postsComments = commentStringfy(postsComments);
    return new Promise((resolve, reject) => {
        let sql = `UPDATE gonderiler SET yorumlar = '${postsComments}' WHERE id = ${postId}`;
        con.query(sql, (err, result) => {
            if (err) reject(err);
            else resolve(result)
        });
    });
}

postModel.deleteComment = async function (postId, commentData) {
    let postsComments = commentParse(await getCommentsByPostId(postId));
    postsComments = commentStringfy2(postsComments);
    commentData = commentStringfy2([commentData])[0];
    let commentIndex = postsComments.indexOf(commentData);
    postsComments.splice(commentIndex, 1);
    let resultComment = "[";
    postsComments.forEach((el, index) => {
        if (index != postsComments.length - 1) resultComment += el + ",";
        else resultComment += el;
    });
    resultComment += "]";
    return new Promise((resolve, reject) => {
        let sql = `UPDATE gonderiler SET yorumlar = '${resultComment}' WHERE id = ${postId}`;
        con.query(sql, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    });
}

postModel.getHome = async function (id) {
    // GET FRIEND'S POSTS
    let friends = (await userModel.getFriends(id));
    friends.push(id);
    let posts = [];
    await (new Promise(async (resolve, reject) => {
        for (let i = 0; i < friends.length; i++) {
           posts = posts.concat(await this.getPostsByUserId(friends[i]));
        }
        posts.sort((b,a)=>{
            return a.id - b.id;
        })
        resolve(1);
    }));
    return posts;
}

postModel.getPostsByUserId = (userId) => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM gonderiler WHERE paylasanId = ${userId}`;
        con.query(sql, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
}

function commentParse(comment) {
    let arrData;
    eval("arrData =" + comment)
    return arrData;
}

function commentStringfy(comment) {
    let stringData = "[";
    comment.forEach((el, index) => {
        el.myId = `${el.myId}`;
        if (index == comment.length - 1) stringData += `{ "myId":"${el.myId}", "comment":"${el.comment}" }`;
        else stringData += `{ "myId":"${el.myId}", "comment":"${el.comment}" },`;
    });
    stringData += "]";
    return stringData;
}

function commentStringfy2(comment) {
    let convertedArray = [];
    comment.forEach((el, index) => {
        el.myId = `${el.myId}`;
        convertedArray.push(`{ "myId":"${el.myId}", "comment":"${el.comment}" }`);
    });
    return convertedArray;

}
module.exports = postModel;