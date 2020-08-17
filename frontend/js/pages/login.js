import User from "../classes/User.js";
export default function () {
    // Click "Giriş Yap" button
    const loginButton = document.getElementById("loginButton");
    console.log(loginButton);
    
    loginButton.addEventListener("click", loginButtonClick);
}

async function loginButtonClick(e) {
    e.preventDefault();
    let username = document.getElementById("username").value,
        password = document.getElementById("password").value;
    let login = await User.login(username, password);
    if (login.logged){
        localStorage.setItem("token",login.token);
        localStorage.setItem("username",username);
        location.href = 'index.html';
    } 
    else alert("Yanlış!");
}