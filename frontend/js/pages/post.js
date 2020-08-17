import { Services } from "../classes/Services.js";
import env from "../env.js";
import Dom from "../classes/Dom.js";

export default async function post() {
    Services.standartInit();
    let postId =(new URLSearchParams(window.location.search)).get("postId");
    let postData =(await (await Services.postJson(env.routes.post.post,{id:postId})).json())[0];
    await Dom.postRender(postData);
    Dom.setHomeEvents();
    
}