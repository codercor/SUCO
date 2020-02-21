import env from '../env.js';
import  { UserServices } from './Services.js';
class User {
    static async register(userData) {
        userData = {
            kullaniciAdi: userData.username,
            adSoyad: userData.name,
            kisiselBilgi: "",
            sifre: userData.password,
            profilResmi: "",
            kapakResmi: "",
            eposta: userData.email,
            ayarlar: ""
        }
       
        userData = JSON.stringify(userData);
        let response = await UserServices.postJson(env.routes.user.register,userData);
        response = await response.json();
        userData = JSON.parse(userData);
        if(response.register){
            let loginData = await this.login(userData.kullaniciAdi,userData.sifre);
            if(loginData.logged){
                localStorage.setItem("token",loginData.token);
                localStorage.setItem("username", userData.kullaniciAdi);
                location.href = "index.html";
            }
        }
        return response;
        
        
    }
    static async login(username, password) {
        let response = await UserServices.postJson(env.routes.user.login,{ userName: username, password: password })
        response = await response.json();
        if (response.login == "successful") {
            return { logged: true, token: response.token };
        } else {
            return { logged: false };
        }
    }
    static checkToken(){
        if(localStorage.getItem("token") != null) return true;
        else { return false };
    }
    static async getUserData(username){
        return await((await UserServices.postJson(env.routes.user.user + username,{})).json());
    }   
}
export default User;