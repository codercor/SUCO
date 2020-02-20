import env from '../env.js';
class Auth {
    static async controlUser(username, password) {
        let response = await fetch(env.host + `/user/login`, {
            method: 'post',
            body: JSON.stringify({ userName: username, password: password }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
        response = await response.json();
        if (response.login == "successful") {
            return {logged:true,token:response.token};
        } else {
            return { logged: false };
        }
    }

}
export default Auth;