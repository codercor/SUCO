let kullaniciRouter = require('express').Router();
// /Profil Verileri Çekme
kullaniciRouter.get('/',(req,res)=>{
    res.send('istekle beraber gelen veri yoksa Kendi profili varsa o kullanıcı adının profili');
});
// /Profil verileri güncelleme
kullaniciRouter.post('/guncelle',(req,res)=>{
    res.send('Profil bilgilerini güncelleme');
});
// /Arkadaşlık isteği gönderme
kullaniciRouter.get('/arkadaslikIstekGonder',(req,res)=>{
    res.send('Arkadaşlık isteği gönderme');
});
// /Arkadaşlık isteği gönderme
kullaniciRouter.get('/arkadaslikIstekKontrol',(req,res)=>{
    res.send('Arkadaşlık isteği var mı');
});
module.exports = kullaniciRouter;