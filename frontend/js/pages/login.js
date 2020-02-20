import Auth from "../classes/Auth.js";
export default function () {
    // Click "Giriş Yap" button
    const loginButton = document.getElementById("loginButton");

    loginButton.addEventListener("click", loginButtonClick);


}

async function loginButtonClick(e) {
    e.preventDefault();

    let username = document.getElementById("username").value,
        password = document.getElementById("password").value;
    let login = await Auth.controlUser(username, password);
    if (login.logged){
        localStorage.setItem("token",login.token);
        location.href = 'index.html';
    } 
    else alert("Yanlış!");
}