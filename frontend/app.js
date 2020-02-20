import login from "./js/pages/login.js";
let URL = document.URL,
page = URL.split('/')[URL.split('/').length-1]
if(page == "login.html") login();
