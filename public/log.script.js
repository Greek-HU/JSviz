import { request } from "./js/req.mod.js";
const $s = s => document.querySelector(s);
const $sAll = sa => document.querySelectorAll(sa);
const $ce = el => document.querySelector(el);
var USER = "";
function loadUsers() {
    request.get("/users", function (res) {
        USER = JSON.parse(res);
    });
}
$s('.logIn').onclick = function() {
    var uName = $s('#name').value;
    var pword = $s('#password').value;
    for(let i=0; i<USER.length; i++)
        if(uName == USER[i].name && pword == USER[i].password){
            var uEmail = USER[i].email;
            var uTel = USER[i].tel;
            request.get("/index", function (res) {
                document.cookie = uName +","+ uEmail+","+uTel;
                window.location.href = "page.html";
            });
            
        }else{
            alert("Hibás felhasználónév vagy jelszó!");
        }
    
}
window.onload = loadUsers();
