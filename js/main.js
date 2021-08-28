var reqastCity = new XMLHttpRequest();
var reqastWeather = new XMLHttpRequest();
const mainEl = document.querySelector(".main");
const cityEl = document.querySelector(".cityName");
const tempEl = document.querySelector(".tempNum");
const statusEl = document.querySelector(".status");
const icon = document.querySelector(".icon");
const waveEl1 = document.querySelector(".wave1");
const waveEl2 = document.querySelector(".wave2");
const btn = document.querySelector(".btn");
const changeBtn = document.querySelector('.changeBtn')
const content = document.querySelector('.content')
const pickCityEl = document.querySelector(".pickCity")
const wavecontEl = document.querySelector(".wavecont")
const cityInputEl = document.querySelector('.cityInput')
const cityListEl = document.querySelector(".cityList")
const closeIconEl = document.querySelector(".closeIcon")
const fourDaysEl = document.querySelector(".fourDays")
const day1El = document.querySelector("#day-1")
const day2El = document.querySelector("#day-2")
const day3El = document.querySelector("#day-3")
const day4El = document.querySelector("#day-4")

/* DRAG VARS*/
var isMouseDown =false
var lastMoveX = 0
var lastMoveY = 0
var mouseX = 0
var mouseY = 0
var start_time;
var now

var days = [day1El, day2El, day3El, day4El]
var allEls = [cityEl, tempEl, statusEl, icon, waveEl2, changeBtn, day1El, day2El, day3El, day4El]
const key = "826326e5a358ebc314eb250fdf04c647"
var doc = document ;
var isOpen = false;
var el = mainEl;
if(window.self !== window.top){
    doc = window.parent.document;
    el = doc.getElementById('weather');     
}
/* DRAG LISTENNERS*/
if (el.dataset.isdragable == "1"){
    document.addEventListener("mousemove", moveHendler);
    document.addEventListener("mousedown", downHendler);
    document.addEventListener("mouseup", upHendler);
    el.fX = el.getBoundingClientRect().left;
    el.fY = el.getBoundingClientRect().top;
    
}

window.addEventListener("load", (e) => {
    document.body.classList = ""
});
cityInputEl.addEventListener("input", inputHendler)
mainEl.addEventListener("click", mouseClick);
changeBtn.addEventListener("click", changeBtnfunc)
closeIconEl.addEventListener("click", cityChousen)


navigator.geolocation.getCurrentPosition(
    (position) => {
        /*console.log(position)
        reqastCity.open("POST", "http://localhost:3000");
        reqastCity.send(JSON.stringify({latitude: position.coords.latitude, longitude: position.coords.longitude}))
        reqastCity.onload = () =>{
            console.log(reqastCity.response);
            var data = JSON.parse(reqastCity.response)
            console.log(data[data.length - 1]);
        }*/
        if(getCookie("city" ).length != 0){
            reqastWeather.open("GET", `https://api.openweathermap.org/data/2.5/forecast?&id=${getCookie("city")}&lang=en&appid=${key}`)
        }else{
            reqastWeather.open("GET", `http://api.openweathermap.org/data/2.5/find?lat=${position.coords.latitude}&lon=${position.coords.longitude}&cnt=1&lang=en&appid=${key}`)
        }
        reqastWeather.send(null)
        reqastWeather.onload = () => {
        var data = JSON.parse(reqastWeather.response)
        if (data.cod == "200")
            parseReqast(data)
        }
        
    },
    (err) => {
        if(err) throw err 
    }
)

    

function mouseClick(e){

    if (now - start_time >= 140 || e.path.find(element => {if(element == pickCityEl || element == changeBtn)return true;}) ) 
        return null
   
    

    isOpen =!isOpen
    if(!isOpen){
        mainEl.style.width = "32px"
        mainEl.style.height = "32px"
        btn.classList.remove("opacity-0")
        if(window.self !== window.top){
            el.width = '32px';
            el.height = '32px';
            allEls.forEach(el =>{
                el.classList.remove("opacity-1");
            })
        }
        return null;
    }
    
    
    
    el.width = '350px';
    el.height = '230px';
    el.style.transition = "width 0.5s ease-in-out, height .5s ease-in-out"
    doc.addEventListener("mousemove", anim);
    
    
    mainEl.style.width = "350px"
    mainEl.style.height = "230px"
    btn.classList.add("opacity-0")
    
    
    
    allEls.forEach(el =>{
        console.log(el)
        el.classList.add("opacity-1");
    })
    
}



function parseReqast(data) {
    
    mess = data
    console.log(mess)
    
    cityEl.innerText = mess.city.name
    tempEl.innerText = gettemp(mess.list[0].main.temp)
    
    icon.style.backgroundImage = `url(../icons/${mess.list[0].weather[0].icon}.svg)`
    statusEl.innerText = mess.list[0].weather[0].description
    days.forEach(el => {
        day = mess.list[parseInt(el.id.split("-")[1]) * 8 - 1];
        el.querySelector(".dayIcon").style.backgroundImage = `url(../icons/${day.weather[0].icon}.svg)`
        el.querySelector(".dayName").innerText = new Intl.DateTimeFormat('en-US', {weekday:"short"}).format(new Date(day.dt_txt))
        el.querySelector(".dayTemp").innerText = gettemp(day.main.temp)
         
    });
    
}
function gettemp(temp){
    if (temp -  273,15 > 0) {
        return ("+" + (temp -  273.15)).slice(0, 3)
    }else {
        return (temp -  273.15).toString().slice(0, 3)
    
    }
}
function anim(e){
    var Kx = e.clientX / doc.body.clientWidth;
    var Ky = e.clientY / doc.body.clientHeight;
    
    waveEl1.style.transform = `translate3d(-${Kx * 5}px, ${Ky * 2.5}px, 0)`
    waveEl2.style.transform = `translate3d(-${Kx * 20 + 100}px, -${Ky * 5 + 10}px, -100px)`
}
/* DRAG FUNCTIONS*/
function moveHendler(e){
    if (isMouseDown){
        el.style.transform = `translate3d(${lastMoveX + e.x - mouseX}px, ${lastMoveY + e.y -mouseY}px, -100px)`
        lastMoveX =  lastMoveX + e.x - mouseX
        lastMoveY = lastMoveY + e.y -mouseY
    }
}
function downHendler(e){
    if(cityInputEl.parentElement == e.path.find(element => {if(element == cityInputEl.parentElement)return true;}))
        return null
    start_time = new Date();

    downEl = e.target
    isMouseDown = true;
    rect = downEl.getBoundingClientRect()
    mouseX = e.x
    mouseY = e.y
}
function upHendler(e){
    isMouseDown = false;
    now = new Date();
}
function changeBtnfunc(){
    if (now - start_time >= 140)
        return null
    allEls.forEach(el =>{
        el.classList.remove("opacity-1");
    })
    wavecontEl.style.transform = `translate3d(0, -140px, 0)`
    content.style.transform =  `translate3d(0, -270px, 0)`
    pickCityEl.style.transform =  `translate3d(0, -250px, 0)`
    cityInputEl.focus({preventScroll:true})
}
function inputHendler(){
    reqastCity.open("POST", "http://localhost:3000/get");
    reqastCity.send(JSON.stringify({type:"search", data:cityInputEl.value}));
    reqastCity.addEventListener("load", response)
}
function response(){
    var res = JSON.parse(reqastCity.response)
    if(res.type == "search"){
        cityListEl.innerHTML = ""
        res.data.forEach(el => {
            var p = document.createElement("p");
            p.innerText = el.name
            p.id = el.id
            p.addEventListener("click", cityChousen)
            cityListEl.appendChild(p)
        });
    }
}
function cityChousen(e){
    if (e.target.id.length != 0){
        reqastWeather.open("GET", `https://api.openweathermap.org/data/2.5/forecast?id=${e.target.id}&lang=en&appid=${key}`)
        reqastWeather.send(null)
        reqastWeather.onload = () => {
            var data = JSON.parse(reqastWeather.response)
            if (data.cod == "200")
                parseReqast(data)
        }
        setCookie("city", e.target.id)
    }
    
    wavecontEl.style.transform = ``
    content.style.transform =  ``
    pickCityEl.style.transform =  ``
    allEls.forEach(el =>{
        el.classList.add("opacity-1");
    })
    
}
/*COOKIE */
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}
function setCookie(name, value, options = {}) {

    options = {
      path: '/',
      
    };
  
    if (options.expires instanceof Date) {
      options.expires = options.expires.toUTCString();
    }
  
    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
  
    for (let optionKey in options) {
      updatedCookie += "; " + optionKey;
      let optionValue = options[optionKey];
      if (optionValue !== true) {
        updatedCookie += "=" + optionValue;
      }
    }
  
    document.cookie = updatedCookie;
  }
function deleteCookie(name) {
    setCookie(name, "", {
      'max-age': -1
    })
  }