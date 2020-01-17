const app = require('express')();
const kullaniciController = require('./controllers/kullaniciController');

app.use('/kullanici',kullaniciController);

app.listen(85);
