import login from "./js/pages/login.js";
import register from "./js/pages/register.js";
import index from "./js/pages/index.js";
import post from "./js/pages/post.js";
import profile from "./js/pages/profile.js";
import settings from "./js/pages/settings.js";
import search from "./js/pages/search.js";
import chat from "./js/chat.js";

let URL = document.URL,
  page = URL.split("/")[URL.split("/").length - 1];
if (page.search("login.html") == 0) login();
if (page.search("register.html") == 0) register();
if (page.search("index.html") == 0) index();
if (page.search("post.html") == 0) post();
if (page.search("profile.html") == 0) profile();
if (page.search("settings.html") == 0) settings();
if (page.search("search.html") == 0) search();

chat();

document.getElementsByClassName("wrapper")[0].insertAdjacentHTML(
  "afterbegin",
  `<div class="loading-placeholder" style="background-color: gray; width: 200px; height: 100%; position: absolute;border-radius: 10px; ">
</div>`
);
document.getElementsByClassName("wrapper")[0].insertAdjacentHTML(
  "afterbegin",
  ` <div class="loading-placeholder" style="background-color: gray; width: 100%; height: 80px; position: absolute;border-radius: 10px; ">
</div>`
);
