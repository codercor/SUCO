import env from '../env.js';
import User from './User.js';
export class UserServices {
    static async postJson(path,data){
        if(User.checkToken()) {
            Object.assign(data,data,{token:localStorage.getItem("token")})
        }
        console.log(data);
        
        return await fetch(env.host + path, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });
    }
}
export class PostServices {

}

