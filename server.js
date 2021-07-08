const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
// const gpio = require('rpi-gpio');
// const gpiop = gpio.promise;
const webroot = __dirname + '/../../build';
http.listen(8080); //listen to port 8080
app.use(express.static(webroot));

// const PiServo = require('pi-servo');
 
// // pass the GPIO number
// const sv1 = new PiServo(4); 
 
// sv1.open().then(() =>{  
//   sv1.setDegree(100); // 0 - 180
// });