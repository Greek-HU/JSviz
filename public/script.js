import { request } from "./js/req.mod.js";
const $s = s => document.querySelector(s);
const $sAll = sa => document.querySelectorAll(sa);
const $ce = el => document.querySelector(el);


var TIME = [];
var SELTIME = [];
console.log(SELTIME);
var dayTPL = (d) => 
`<div class='dayCss' >${d}</div><br>`;
var timeTPL = (t, css = "") => 
`<div id='sTime' class='${css}'>${t.time}</div>`;

function getTime(timeArray){ 
    /*let timeStr = `<div>`;
    for(let day in timeArray){
        timeStr += `<div>`+day+`</div>`;
        for (let tim of timeArray[day]){
            timeStr += `<div>`+tim.id+`</div><div>`+tim.time+`</div>`;
        }
    }
    timeStr += `</div>`;
    $s('.nap').innerHTML = timeStr;*/
    var timeStr = '<div>', cssName = "";
    for(const day in timeArray){
        timeStr += dayTPL(day);
        for(const ti of timeArray[day]){
            cssName = ti.booked == false ? "cBooked":"booked";
            timeStr += timeTPL(ti, cssName);
        }
    }
    timeStr += `</div>`;        
    $s('.times').innerHTML = timeStr;

    $sAll('.cBooked').forEach((timeBox, index) => {
        const tim = TIME.find( ti => ti.id === timeBox.dataset.id);
        const isIn = SELTIME.indexOf(timeBox.dataset.event);
        const cBo = $s('.cBooked');
        const sBo = $s('.sBooked');
        timeBox.onclick = function(){
            
            if(timeBox.classList.contains('cBooked')){
                timeBox.classList.remove('cBooked');
                timeBox.classList.add('sBooked');
                    if(!SELTIME.includes(tim)){
                        SELTIME.push(tim);
                        console.log(SELTIME);
                        $s('.boo > span:nth-child(1)').innerHTML = SELTIME.length;
                    }            
            }
            else{
                timeBox.classList.remove('sBooked');
                timeBox.classList.add('cBooked');
                if(SELTIME.includes(tim)){
                    SELTIME.splice(SELTIME.indexOf(tim, 1));
                    
                    console.log(SELTIME);
                    $s('.boo > span:nth-child(1)').innerHTML = SELTIME.length;
                }
            }
        }    
    })

}
function getDay(timeArray){
    var dayStr = '';
    for(let dayList in timeArray)
        dayStr += dayTPL(dayList)
    $s('.nap').innerHTML = dayStr;
}
function loadTime(){
    request.get("/times", function(res){
        TIME = JSON.parse(res);
        //getDay(TIME);
        getTime(TIME)
        
    });
}
function saveTime() {
    var data = {};
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      var value = localStorage.getItem(key);
      data[key] = value;
    }
  
    var file = new Blob([JSON.stringify(data)], {type: 'application/json'});
    var a = document.createElement('a');
    var url = URL.createObjectURL(file);
    a.href = url;
    a.url = 'foglalasok.json';
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);  
    }, 0);
  }
window.addEventListener('load', loadTime());
$s('.tSave').onclick = function(){
    saveTime()
}


