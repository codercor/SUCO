import login from "./js/pages/login.js";
import register from './js/pages/register.js';
import index from './js/pages/index.js';
import post from './js/pages/post.js';
import profile from './js/pages/profile.js';
let URL = document.URL,
page = URL.split('/')[URL.split('/').length-1]
if(page.search("login.html") == 0) login();
if(page.search("register.html") == 0) register();
if(page.search("index.html") == 0) index();
if(page.search("post.html")== 0) post();
if(page.search("profile.html") == 0) profile();




