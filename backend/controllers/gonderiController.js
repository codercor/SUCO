const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
 
let kullaniciVarmi =new Promise(async(resolve,reject)=>{
            setTimeout(()=>{
                resolve({userName:'corx',password:bcrypt.hashSync('123')})
            },1000);
        });
    

 
router.post("/getToken", (request, response, next) => {
    const { userName, password } = request.body;
    kullaniciVarmi.then(data => {
            //Girilen userName değerinde bir kayıt varsa burası çalışacaktır.
            bcrypt.compare(password, data.password) /**crypto */
                .then(data => {
                    //Veritabanındaki şifrelenmiş password ile kullanıcıdan alınan password birbirlerini doğruluyorsa eğer data değeri true gelecektir. Aksi taktirde false değeri gelecektir.
                    if (!data)
                        response.send("Kullanıcı adı veya şifre yanlış...");
                    else {
                        //Eğer data parametresi true değerinde geldiyse token oluşturulacaktır.
                        const payLoad = { userName, password };
                        const token = jwt.sign(payLoad, request.app.get("api_secret_key"), { expiresIn: 120/*dk*/ });
                        response.json({
                            status: true,
                            userName,
                            password,
                            token
                        });
                    }
                });
        })
        .catch(error => console.log("Beklenmeyen bir hatayla karşılaşıldı..."));
});
 
module.exports = router;