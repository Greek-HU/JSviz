import { request } from "./js/req.mod.js";
const $s = s => document.querySelector(s);
const $ce = el => document.createElement(el);


var USER = '';
var logBtn = $s('.logIn');
var signBtn = $s('.signIn');

var regTPL = () =>
    `<form action="/signin" method="post">
        <label for="uName">Név:</label>
            <input type="text" name="" id="regname" required><br>
        <label for="uPassword">Jelszó:</label>
            <input type="text" name="password" id="regpassword" required><br>
        <label for="uEmail">Email:</label>
            <input type="text" name="email" id="regemail" required><br>
        <label for="uTel">Tel.:</label>
            <input type="text" name="telnum" id="regtelnum">
    </form>`;
    


function loadUsers() {
    request.get("/users", function (res) {
        USER = JSON.parse(res);
    });
}
logBtn.onclick = function() {
    var uName = $s('#name').value;
    var pword = $s('#password').value;
    var found = false;
    for(let i=0; i<USER.length; i++){ 
        if(uName == USER[i].name && pword == USER[i].password){
            var uEmail = USER[i].email;
            var uTel = USER[i].tel;
            found = true;
            request.get("/index", function (res) {
                localStorage.setItem("USER", JSON.stringify(uName +","+ uEmail+","+uTel))
                //document.cookie = uName +","+ uEmail+","+uTel;
                window.location.href = "page.html";
            });
            
        }
    }
    if(!found){
        alert("Hibás felhasználónév vagy jelszó!");
    }
    
}
signBtn.onclick = function(){
    $s('#login').style.display = 'none';
        var regDiv = '';
        regDiv = regTPL()
        $s('#regDiv').innerHTML = regDiv;
    var sign = $ce('input');
    $s('#regDiv').appendChild(sign);
        sign.classList.add('btn')
        sign.value = 'Regisztrálok';
        sign.type = 'submit';

    sign.onclick = function(){
        var regName = $s('#regname').value;
        var regPassword = $s('#regpassword').value;
        var regEmail = $s('#regemail').value;
        const emailRegEx = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegEx.test(regEmail)) {
          alert("Hibás emailcím!");
          return;
        }
        var regTelnum = $s('#regtelnum').value;
        request.post("/signin",
            { 
                id: '',
                name: regName,
                password: regPassword,
                email: regEmail,
                tel: regTelnum
            }, (res) => {
                alert('Ön sikeresen regisztrált!');
                $s('#regDiv').style.display = 'none';
                $s('#login').style.display = 'block';

            }
            
        );
    }
}

window.onload = loadUsers();

