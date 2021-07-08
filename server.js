const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const Gpio = require('onoff').Gpio
const PiGpio = require('pigpio').Gpio

const lightSwitchServo = new PiGpio(4, { mode: PiGpio.OUTPUT });
const button = new PiGpio(23, { mode: PiGpio.INPUT, pullUpDown: PiGpio.PUD_UP, alert: true })
const GREENLED = new Gpio(16, 'out');
const BLUELED = new Gpio(21, 'out');
const REDLED = new Gpio(12, 'out');

//add middleware
// app.use(express.static("public")); 
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
  GREENLED.writeSync(1);
  REDLED.writeSync(1);
  BLUELED.writeSync(1);

  console.log("-----------------------------New client connected");
  socket.on('light-off', (data) => {
    if (currentstate !== 'off') {
      lightOff();
    }

    return;

  })
  socket.on('light-on', (data) => {
    if (currentstate !== 'on') {
      lightOn();
    }


    return;

  })
  //A special namespace "disconnect" for when a client disconnects
  socket.on("disconnect", () => console.log("--------------------Client disconnected"));
  GREENLED.writeSync(0);
  REDLED.writeSync(0);
  BLUELED.writeSync(0);
});
button.glitchFilter(10000);
button.on('alert', (level, tick) => {
  if (level === 0) {
    if (currentstate !== 'on') {
      lightOn();
    } else {
      lightOff();
    }
  }
})


const lightOff = () => {
  console.log("light off")
  currentstate = 'off'
  lightSwitchServo.servoWrite(1300)
  //TODO TURN ON RED LIGHT, OFF GREEN LIGHT
  GREENLED.writeSync(0);
  REDLED.writeSync(1);
}

const lightOn = () => {
  currentstate = 'on'
  console.log("light on")
  lightSwitchServo.servoWrite(2200)
  //TODO TURN ON GREEN LIGHT, OFF RED LIGHT
  GREENLED.writeSync(1);
  REDLED.writeSync(0);
}
server.listen(port, () => console.log(`Listening on port ${port}`));