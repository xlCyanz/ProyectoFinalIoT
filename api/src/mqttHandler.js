import { iotDevice } from "./awsService.js";

const subscribe = (topic) => iotDevice.subscribe(topic);

const publish = (topic, message) =>
  iotDevice.publish(
    topic,
    JSON.stringify({
      light: message,
    })
  );

const connect = () => {
  iotDevice.on("connect", () => {
    console.log("Device Connected");
    subscribe("semaforo");
  })
};

const disconnect = () =>
  iotDevice.on("offline", () => {
    console.log("Device disconnected");
  });

const reconnect = () =>
  iotDevice.on("resconnect", () => {
    console.log("Reconnecting");
  });

const error = () =>
  iotDevice.on("error", (error) => {
    console.log("There was an error", error);
  });

const mqtt = {
  subscribe,
  publish,
  connect,
  disconnect,
  reconnect,
  error,
};

export default mqtt;
