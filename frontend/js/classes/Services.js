import env from '../env.js';
import User from './User.js';
import Dom from './Dom.js';
export class Services {
    static async postJson(path,data={}){
        if(User.checkToken()) {
            Object.assign(data,data,{token:localStorage.getItem("token")})
        }
        console.log(env.host + path);
        
            return await fetch(env.host + path, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });
    }
    static async getPostData(postId){
       return (await (await Services.postJson(env.routes.post.post, { id: postId })).json());
    }
    static async standartInit(){
        const myUsername = localStorage.getItem("username");
        const token = localStorage.getItem("token");
        if (!User.checkToken()) location.href = "login.html";
        let userData = await User.getUserData(myUsername);
        Dom.standartRender(userData);
    }
}

