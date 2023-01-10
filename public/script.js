import { request } from "./js/req.mod.js";
//import { getCalendar } from "./js/calendar.js";
const $s = s => document.querySelector(s);
const $sAll = sa => document.querySelectorAll(sa);
const $ce = el => document.querySelector(el);


var TIME = [];
var SELTIME = []; //JSON.parse(localStorage.getItem("SELTIME"));
window.creatId = null;
window.creatTime = null;

var dayTPL = (d) =>
    `<div class='dayCss' >${d}</div>`;
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
    $s('.times').innerHTML = timeStr;

    $sAll('.cBooked').forEach((timeBox, index) => {
        const tim = timeBox.dataset.id;
        const cBo = $s('.cBooked');
        const sBo = $s('.sBooked');

        timeBox.onclick = function () {

            if (timeBox.classList.contains('cBooked')) {
                timeBox.classList.remove('cBooked');
                timeBox.classList.add('sBooked');
                creatId = tim.id;
                creatTime = timeBox.dataset.time;
                if (!SELTIME.includes(timeBox.dataset.id)) {
                    SELTIME.push(tim);
                    //localStorage.setItem("SELTIME", JSON.stringify(SELTIME));
                    $s('.boo > span:nth-child(1)').innerHTML = SELTIME.length;
                }
            }
            else {
                timeBox.classList.remove('sBooked');
                timeBox.classList.add('cBooked');
                SELTIME.splice(SELTIME.indexOf(timeBox.dataset.id, 1));
                $s('.boo > span:nth-child(1)').innerHTML = SELTIME.length;
            }
        }
        if (SELTIME.includes(timeBox.dataset.id)) {
            timeBox.classList.remove('cBooked');
            timeBox.classList.add('sBooked');
        }
    })
}
$s('.tSave').onclick = function () {
    let name = $s('#name').value;
    /*request.post("/times",
        {
            id: creatId,
            name,
            time: creatTime,
        }, function (res) {
            $s('#name').value = "";
        }
    );*/
    request.post("/edittimes",
        {
            id: creatId,
            time: 0
            //booked: true
        }, (res) => {
            
            console.log('Siker');
        }
    );
}
function loadTime() {
    //getCalendar.generateCalendar();
    request.get("/times", function (res) {
        TIME = JSON.parse(res);
        getTime(TIME);
        //$s('.boo > span:nth-child(1)').innerHTML = SELTIME.length;

    });
}


window.onload = loadTime();