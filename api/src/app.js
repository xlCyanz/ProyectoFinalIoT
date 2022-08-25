import Koa from "koa";
import Serve from "koa-static";
import { Server } from "http";
import { Server as ServerIO } from "socket.io";
import { iotDevice } from "./awsService.js";
import TrafficLights from "./trafficLight.js";
import mqtt from "./mqttHandler.js";

const app = new Koa();
const port = 2727;

app.use(Serve("./public")); // Para pruebas del ws

const server = Server(app.callback());
const io = new ServerIO(server);

server.listen(process.env.PORT || port, () => {
  console.log(`Running on: http://localhost:${port}`);
});

mqtt.connect();

io.on("connection", (socket) => {

  const trafficLight = TrafficLights(socket);
  trafficLight.start();

  socket.on("requestChangeLight", () => {
    console.log(`Room ${socket.id} request a change light`);
    trafficLight.requestChange();
  });

  iotDevice.on("message", (topic, payload) => {
    socket.emit("light", JSON.parse(JSON.parse(payload.toString()).light));
  });

  socket.on("disconnect", () => {
    trafficLight.stop();
  });
});

mqtt.disconnect();
