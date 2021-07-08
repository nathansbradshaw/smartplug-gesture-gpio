const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
// const gpio = require('rpi-gpio');
// const gpiop = gpio.promise;
// const PiServo = require('pi-servo');
 
// // pass the GPIO number
// const sv1 = new PiServo(4); 
 


//Port from environment variable or default - 4001
const port = process.env.PORT || 8000;

//Setting up express and adding socketIo middleware
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  }
});

let currentstate = 'none';


//Setting up a socket with the namespace "connection" for new sockets
io.on("connection", socket => {

  console.log("-----------------------------New client connected");
    socket.on('light-off', (data) => {
      if(currentstate !== 'off') {
        console.log("light off")
        currentstate = 'off'
      // sv1.open().then(() =>{  
      //   sv1.setDegree(180); // 0 - 180
      // });
      //TODO TURN ON RED LIGHT, OFF GREEN LIGHT

      }
   
      return;
      
    })
    socket.on('light-on', (data) => {
      if(currentstate !== 'on') {
        currentstate = 'on'
        console.log("light on")
      // sv1.open().then(() =>{  
      //   sv1.setDegree(0); // 0 - 180
      // });
      //TODO TURN ON GREEN LIGHT, OFF RED LIGHT

      }


      return;
      
    })
  //A special namespace "disconnect" for when a client disconnects
  socket.on("disconnect", () => console.log("--------------------Client disconnected"));
});




server.listen(port, () => console.log(`Listening on port ${port}`));