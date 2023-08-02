import { request } from "./js/req.mod.js";
const $s = s => document.querySelector(s);
const $sAll = sa => document.querySelectorAll(sa);
console.log(localStorage);

var USER = localStorage.getItem("USER") != null ? JSON.parse(localStorage.getItem("USER")).split(',') : err() ;
var SELTIME = []; 
var TIME = [];

var timesOn = $s('.times');
var timeSave = $s('.tSave');

window.creatId = null;
window.getDay = null;
window.creatTime = null;

var userTPL = (n) => `Üdvözlöm ${n}`;

var dayTPL = (d) =>
    `<div class='dayCss'>${d}</div>`;

var timeTPL = (t, css = "") =>
    `<div data-id="${t.id}" data-day="${t.day}" data-time="${t.time}" class='${css} Time'>${t.time}</div>`;

function getTime(timeArray) {
    var timeStr = '', cssName = "";
    for (const day in timeArray) {
        timeStr += dayTPL(day);
        for (const ti of timeArray[day]) {
            cssName = ti.booked == false ? "cBooked" : "booked";
            timeStr += timeTPL(ti, cssName);
        }
    }
    timeStr += ``;
    timesOn.innerHTML = timeStr;
    
    $sAll('.cBooked').forEach((timeBox, index) => {
        
        const tim = timeBox.dataset.id;        

        timeBox.onclick = function () {

            if (timeBox.classList.contains('cBooked')) {
                timeBox.classList.remove('cBooked');
                timeBox.classList.add('sBooked');
                timeSave.disabled = false;
                creatId = timeBox.dataset.id;
                getDay = timeBox.dataset.day;
                creatTime = timeBox.dataset.time;
                if (!SELTIME.includes(timeBox.dataset.id)) {
                    SELTIME.push(tim);
                    localStorage.setItem("SELTIME", JSON.stringify(SELTIME));
                }
            }
            else {
                timeBox.classList.remove('sBooked');
                timeBox.classList.add('cBooked');
                SELTIME.splice(SELTIME.indexOf(timeBox.dataset.id, 1));
                localStorage.setItem("SELTIME", JSON.stringify(SELTIME));                
            }
        }
        if (SELTIME.includes(timeBox.dataset.id)) {
            timeBox.classList.remove('cBooked');
            timeBox.classList.add('sBooked');
        }
        timeSave.onclick = function(){
            booked();
            request.post("/edittimes",
                {
                    id: creatId,
                    time: creatTime,
                    booked: true
                }, (res) => {
                    alert('Ön sikeresen időpontot foglalt nálunk, nemsokára találkozunk!');
                }
            );
        }
        
    });
}

function getName(){
    if(USER.length == 0){
        err()
    }
    return $s('.username').innerHTML = userTPL(USER[0]);
}
function booked() {
    
    request.post("/times",
        {
            id: creatId,
            name: USER[0],
            emailaddres: USER[1],
            telnum: USER[2],
            time: getDay+": "+creatTime,
        }, function (res) {
        }
    ); 
}
function err(){
    alert("Ön nincs bejelentkezve!");
    window.location.href = "/"
}
function loadTime() {
    
    request.get("/times", function (res) {
        TIME = JSON.parse(res);        
        getTime(TIME);
    });
    //USER = localStorage.getItem("USER") == null ? [] : JSON.parse(localStorage.getItem("USER")).split(',');
    SELTIME = localStorage.getItem("SELTIME") != null ? JSON.parse(localStorage.getItem("SELTIME")) : [];
    
    getName();
}function mobil_navbar(){
    var nav_a = $s(".nav_links");
    if(nav_a.style.display === "block"){
        nav_a.style.display = "none";
    }else{
        nav_a.style.display = "block"
    }
    
}
$s(".icon").onclick = function(){
    var table = $s('.block');
    if(table.style.display = "none"){
        table.style.display = "block";
    }}
$s('.icon-logout').onclick = function(){
    USER = [];
    localStorage.setItem("USER", JSON.stringify(USER));
    window.location.href = "/"
}
window.onload = loadTime();
