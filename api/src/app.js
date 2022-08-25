import Koa from "koa";
import Serve from "koa-static";
import { Server } from "http";
import { Server as ServerIO } from "socket.io";
// import mqtt from "./mqttHandler.js";
// import { iotDevice } from "./awsService.js";
import TrafficLights from "./trafficLight.js";

const app = new Koa();
const port = 2727;

app.use(Serve("./public")); // Para pruebas del ws

const server = Server(app.callback());
const io = new ServerIO(server);

server.listen(process.env.PORT || port, () => {
  console.log(`Running on: http://localhost:${port}`);
});

io.on("connection", (socket) => {
  const trafficLight = TrafficLights(socket);
  trafficLight.start();

  socket.on("requestChangeLight", () => {
    console.log(`Room ${socket.id} request a change light`);
    trafficLight.requestChange();
  });

  // TODO: Cambiar esta linea por AWS
  socket.on("aws", ({ light }) => {
    socket.emit("light", { light });
  });

  socket.on("disconnect", () => {
    trafficLight.stop();
  });
});

// mqtt.publish("semaforo", RED_STATE);
// mqtt.publish("semaforo", GREEN_STATE);

// MQTT Handling
// const getMessage = () => {
//  console.log(mqtt.listenMessage());
//  Every time a message is published in the broker it will be captured here
// };

// mqtt.connect();
// mqtt.disconnect();
// mqtt.reconnect();
// mqtt.error();
// getMessage(); //receive messages from broker

// iotDevice.on("message", (topic, payload) => {
//   console.log(JSON.parse(payload.toString()).light);
// })
