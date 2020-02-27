import User from '../classes/User.js';
import Dom from '../classes/Dom.js';

export default async ()=>{
    const myUsername = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    if(!User.checkToken()) location.href = "login.html";
    let userData = await User.getUserData(myUsername);
    console.log(userData);
    Dom.standartRender(userData); 
    let homePosts = await User.getHomePosts(token);
    homePosts.forEach(post => {
        Dom.postRender(post);
    });
    
    console.log(homePosts);
    
}