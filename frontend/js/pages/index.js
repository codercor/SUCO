import User from '../classes/User.js';
import Dom from '../classes/Dom.js';
import { Services } from '../classes/Services.js';

export default async () => {
    Services.standartInit();
    let homePosts = await User.getHomePosts(localStorage.getItem("token"));

    await new Promise(async (resolve, reject) => {
        for (let i = 0; i < homePosts.length; i++) {
            await Dom.postRender(homePosts[i]);
        }
        resolve();
    });

    Dom.setHomeEvents();
    Dom.loading(false);
    
}