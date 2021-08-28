const nearestCities = require('find-nearest-cities');
const fs  = require('fs');
const http = require("http");
var reqast = ""
var list = []
fs.readFile("./city.list.json", (err, data) => {
    if(err) throw err
    JSON.parse(data).forEach(element => {
        list.push({name:element.name, id:element.id})
    });
    console.log(list)
})
const server = http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    req.on("data",(data) => {
        reqast += data;
    });
    req.on("end", () => {
        reqast = JSON.parse(reqast);
        console.log(reqast);




    })
    
    
});

server.listen(3000)


