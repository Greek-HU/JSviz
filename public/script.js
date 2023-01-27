import { request } from "./js/req.mod.js";
const $s = s => document.querySelector(s);
const $sAll = sa => document.querySelectorAll(sa);

var USER = [];
var TIME = [];
var SELTIME = []; //JSON.parse(localStorage.getItem("SELTIME"));
var timesOn = $s('.times');
var timeSave = $s('.tSave');
window.creatId = null;
window.getDay = null;
window.creatTime = null;


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
                    //localStorage.setItem("SELTIME", JSON.stringify(SELTIME));
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

function booked() {
    USER = document.cookie.split(",");
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
function loadTime() {
    request.get("/times", function (res) {
        TIME = JSON.parse(res);        
        getTime(TIME);
    });
    
}
window.onload = loadTime();
