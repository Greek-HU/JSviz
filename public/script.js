import { request } from "./js/req.mod.js";
const $s = s => document.querySelector(s);
const $sAll = sa => document.querySelectorAll(sa);
const $ce = el => document.querySelector(el);

var TIME = [];
var SELTIME = []; //JSON.parse(localStorage.getItem("SELTIME"));
var timesOn = $s('.times');
var timeSave = $s('.tSave');
window.creatId = null;
window.creatTime = null;
timesOn.style.display = 'none';
console.log(document.cookie);

var dayTPL = (d) =>
    `<div class='dayCss'>${d}</div>`;
var timeTPL = (t, css = "") =>
    `<div id='${t.id}' data-id="${t.id}" data-time="${t.time}" class='${css} Time'>${t.time}</div>`;

function getTime(timeArray) {
    var timeStr = '<div>', cssName = "";
    for (const day in timeArray) {
        timeStr += dayTPL(day);
        for (const ti of timeArray[day]) {
            cssName = ti.booked == false ? "cBooked" : "booked";
            timeStr += timeTPL(ti, cssName);
        }
    }
    timeStr += `</div>`;
    timesOn.innerHTML = timeStr;

    
    $sAll('.cBooked').forEach((timeBox, index) => {
        const tim = timeBox.dataset.id;
        const cBo = $s('.cBooked');
        const sBo = $s('.sBooked');
        
        timeBox.onclick = function () {

            if (timeBox.classList.contains('cBooked')) {
                timeBox.classList.remove('cBooked');
                timeBox.classList.add('sBooked');
                creatId = timeBox.dataset.id;
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
    })
}
function booked() {
    request.post("/times",
        {
            id: creatId,
            name: document.cookie,
            time: creatTime,
        }, function (res) {
        }
    ); 
}
$sAll('#card').forEach((cards)=>{
    cards.onclick = function(){
        if(cards.classList.contains('woman')){
            document.body.style.backgroundColor = 'rgb(241, 211, 216)';
            timesOn.style.display = 'block';
            timeSave.disabled = false;
        }
        
        if(cards.classList.contains('man')){
            document.body.style.backgroundColor = 'lightsalmon';
            timesOn.style.display = 'block';
            timeSave.disabled = false;
        }
        
    }
})
function loadTime() {
    request.get("/times", function (res) {
        TIME = JSON.parse(res);
        
        getTime(TIME);

    });
}
window.onload = loadTime();