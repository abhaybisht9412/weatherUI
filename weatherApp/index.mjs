import http from 'http' ;
import fs from "fs";
import request from 'requests' ;
const log = console.log;
const homeFile = fs.readFileSync('home.html','UTF-8') ;

const replaceVal = (tempVal, orgVal) => {
let temperature = tempVal.replace("{%tempval%}",orgVal.main.temp) ;
temperature = temperature.replace("{%tempmin%}",orgVal.main.temp_min) ;
temperature = temperature.replace("{%tempmax%}",orgVal.main.temp_max) ;
temperature = temperature.replace("{%location%}",orgVal.name) ;
temperature = temperature.replace("{%country%}",orgVal.sys.country) ;
return temperature ;
}

const server = http.createServer((req,res) => {
   if(req.url == '/'){
    request(
       "https://api.openweathermap.org/data/2.5/weather?q=Dehradun&appid=ccc5f92dfed00ee292e44dbfa3d3a342" 
    ) 
    .on("data", (chunk) =>{
       // log(chunk) ;
        const objData = JSON.parse(chunk) ;
        const arrData = [objData] ; 
       // log(arrData); //array of objects
        // log(arrData[0].main.temp);
        const realTimeData = arrData
        .map((val) => replaceVal(homeFile, val))
        .join("");
      res.write(realTimeData);
      // console.log(realTimeData);
    })
    .on("end",(err) =>{
        if (err) return log("connection failed",err);
        res.end();
        log("end");
    });
   }  
});

server.listen(8000,"127.0.0.1") ;
log("listening to port 8000") ;