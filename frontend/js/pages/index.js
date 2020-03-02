import User from '../classes/User.js';
import Dom from '../classes/Dom.js';

export default async () => {
    const myUsername = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    if (!User.checkToken()) location.href = "login.html";
    let userData = await User.getUserData(myUsername);
    console.log(userData);
    Dom.standartRender(userData);
    Dom.loading(true);
    let homePosts = await User.getHomePosts(token);

    await new Promise(async (resolve, reject) => {
        for (let i = 0; i < homePosts.length; i++) {
            await Dom.postRender(homePosts[i]);
        }
        resolve();
    });

    Dom.setHomeEvents();
    Dom.loading(false);
    
}