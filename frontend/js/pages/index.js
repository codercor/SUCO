import User from '../classes/User.js';
import env from '../env.js';
export default async ()=>{
    const myUsername = localStorage.getItem("username");
    if(!User.checkToken()) location.href = "login.html";
    let userData = await User.getUserData(myUsername);
    console.log(userData);
    // burda kaldık index'i işlicez
    
}