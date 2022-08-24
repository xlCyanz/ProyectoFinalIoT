import Koa from "koa";
import Serve from "koa-static";
import {
  Server
} from "http";
import {
  Server as ServerIO
} from "socket.io";
import mqtt from "./mqttHandler.js";
import { iotDevice } from "./awsService.js";

const app = new Koa();
const port = 2727;

app.use(Serve("./public")); // Para pruebas del ws

const server = Server(app.callback());
const io = new ServerIO(server);

server.listen(process.env.PORT || port, () => {
  console.log(`Running on: http://localhost:${port}`)
}
);

const RED_STATE = "red";
const GREEN_STATE = "green";
const YELLOW_STATE = "yellow";

let actualState = GREEN_STATE;

// const aws = {
//   on: (listenerAws, callback) => {
//     callback(listenerAws)
//   },
//   emit: (listener, object) => {
//     console.log(`Aws ${listener} emit: ${JSON.stringify(object)}`)
//   }
// }

io.on("connection", (socket) => {

  socket.join(socket.id);

 const changeLight = ( light, timer = 0,  next = null) => {
    
    console.log(`light changed to ${light}`);
    let countdown = timer;

    if(countdown > 0) {
      let interval = setInterval(() => {
        io.to(socket.id).emit('lightTimer', {
          light,
          countdown
        });
        
        if (countdown <= 0) {
          clearInterval(interval);
          if(next !== null) next();
        }
        countdown--;
      }, 1000);
    } else {
      if(next !== null) next();
    }
    // // aws.emit("stopLight", { light });
    io.to(socket.id).emit("light", { light } );
  };

  io.to(socket.id).emit("light", {
    light: actualState
  });

  socket.on("requestChangeLight", () => {
    console.log(`Room ${socket.id} request a change light`);

    if (actualState === YELLOW_STATE)
      return console.log(`Request denied for room ${socket.id}: is changing`);
    if (actualState === RED_STATE)
      return console.log(`Request denied for room ${socket.id}: already stop`);

    console.log(`Request accept for room ${socket.id}`);
    
    mqtt.publish("semaforo", YELLOW_STATE)
    changeLight(YELLOW_STATE, 5, () => {
      mqtt.publish("semaforo", RED_STATE)
      changeLight(RED_STATE , 5, () => {
        mqtt.publish("semaforo", GREEN_STATE)
        changeLight(GREEN_STATE)
      })
    });
  });

  socket.on("disconnect", () => socket.leave(socket.id))

  // aws.on("stopLight", (listener) => {
  //   console.log(`AWS listener: ${listener}`);
  //   // io.to(socket.id).emit("light", { light });
  // });
});

// MQTT Handling
const getMessage = () => {
  // Every time a message is published in the broker it will be captured here
  actualState = mqtt.listenMessage()
}

mqtt.connect()
mqtt.disconnect()
mqtt.reconnect()
mqtt.error()
getMessage() //receive messages from broker

// iotDevice.on("message", (topic, payload) => {
//   actualState =  JSON.parse(payload.toString()).ligth
// })