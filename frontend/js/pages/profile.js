import { Services } from "../classes/Services.js";
import User from "../classes/User.js";
import Dom from "../classes/Dom.js";

export default async function profile(){
    let username =(new URLSearchParams(window.location.search)).get("user");
    await Services.standartInit();
    let user;
    setTimeout(()=>{
        if(user == undefined){
           document.getElementById("userCard").innerHTML =  ` <div class="card card-widget widget-user">
           <!-- Add the bg color to the header using any of the bg-* classes -->
           <div id="cp" style="background: blue" class="widget-user-header bg-info">
             <h2> <code> BÖYLE BİR KULLANICI BULUNAMADI... </code> </h2>
           </div>
         </div>`;
         Dom.loading(false);
        }
    },5000);
    user = await User.getUserData(username);
  
    console.log(user);
    await Dom.profileRender(user);
    await new Promise(async (resolve, reject) => {
        for (let i = 0; i < user.posts.length; i++) {
            await Dom.postRender(user.posts[i]);
        }
        resolve();
    });
    await Dom.setHomeEvents();
    Dom.loading(false);
    
}