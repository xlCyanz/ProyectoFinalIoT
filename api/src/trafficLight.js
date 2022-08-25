import {
  GREEN_STATE,
  GREEN_STATE_TIME,
  RED_STATE,
  RED_STATE_TIME,
  YELLOW_STATE,
  YELLOW_STATE_TIME,
} from "./constants.js";

const TrafficLights = (socket) => {
  let running = true;
  let broked = false;

  const stages = [
    {
      name: GREEN_STATE,
    },
    {
      name: YELLOW_STATE,
    },
    {
      name: RED_STATE,
    },
  ];

  const seconds_every_step = [
    GREEN_STATE_TIME,
    YELLOW_STATE_TIME,
    RED_STATE_TIME,
  ];

  let stage = 0;
  let steps = 0;
  let timer = null;

  const start = () => {
    running = true;
    changeLight();
  };

  const stop = () => {
    running = false;
    clearInterval(timer);
  };

  const requestChange = () => {
    if (stage === 1 && broked)
      return console.log(`Request denied for room ${socket.id}: is changing`);
    if (stage === 2 && broked)
      return console.log(`Request denied for room ${socket.id}: already stop`);

    if (running) {
      broked = true;
      console.log(`Request accept for room ${socket.id}`);

      stop();

      stage = 1;
      socket.emit("aws", { light: stages[stage] }); // TODO: Cambiar esta linea por AWS

      setTimeout(() => {
        stage = 2;
        socket.emit("aws", { light: stages[stage] }); // TODO: Cambiar esta linea por AWS
      }, 5000);

      setTimeout(() => {
        steps = 0;
        stage = 3;

        start();
        broked = false;
      }, 15000);
    }
  };

  const changeLight = () => {
    if (!running) {
      clearTimeout(timer);
      return;
    } else {
      if (stage >= stages.length) stage = 0;
      if (steps >= seconds_every_step.length) steps = 0;

      let wait_seconds = seconds_every_step[steps];

      socket.emit("aws", { light: stages[stage] }); // TODO: Cambiar esta linea por AWS

      stage++;
      steps++;

      timer = setTimeout(changeLight, wait_seconds * 1000);
    }
  };

  return {
    start,
    stop,
    requestChange,
    actualStage: stages[stage - 1],
  };
};

export default TrafficLights;
