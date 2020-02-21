import login from "./js/pages/login.js";
import register from './js/pages/register.js';
let URL = document.URL,
page = URL.split('/')[URL.split('/').length-1]
if(page.search("login.html") == 0) login();
if(page.search("register.html") == 0) register();


