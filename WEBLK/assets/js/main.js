function signup(e){
    event.preventDefault();
    var username = document.getElementById(username).value;
    var username = document.getElementById(password).value;
    var username = document.getElementById(sdt).value;
    var username = document.getElementById(Email).value;
    var user = {
        username : username,
        Email : Email,
        sdt : sdt,
        password : password,
    }
    var json = JSON.stringify(user);
    localStorage.setItem(username,json);
    alert("Đăng Kí Thành Công!")
}