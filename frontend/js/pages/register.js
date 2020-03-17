import User from "../classes/User.js";
export default function () {
    let registerButton = document.getElementById("registerButton");
    registerButton.addEventListener("click", registerUser)
}

async function registerUser(e) {
    e.preventDefault();
    let name = document.getElementById("name").value,
        username = document.getElementById("username").value,
        email = document.getElementById("email").value,
        password = document.getElementById("password").value,
        repassword = document.getElementById("repassword").value,
        userData = { name, username, email, password};
    if (password != repassword) {
        alert("Şifreler eşleşmiyor");
        return;
    }
    if (!ValidateEmail(email)) {
        return;
    }

    let msgBox = document.getElementsByClassName("login-box-msg")[0]
    msgBox.style.color = "green";
    msgBox.innerHTML = "Kaydınız alınıyor....";
    let registerStatus;
    setTimeout(async () => {
        registerStatus = await User.register(userData);
        if (!registerStatus.register) {
            msgBox.style.color = "red";
            msgBox.innerHTML = "Kayıtlı Kullanıcı....";
        }

    }, 1000);
console.log(userData);


}
function ValidateEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return true;
    }
    alert("Eposta adresi hatalı");
    return false;
}