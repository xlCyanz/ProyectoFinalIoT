import Koa from "koa";
import Serve from "koa-static";
import { Server } from "http";
import { Server as ServerIO } from "socket.io";

const app = new Koa();
const port = 2727;

app.use(Serve("./public")) // Para pruebas del ws

const server = Server(app.callback())
const io = new ServerIO(server);

server.listen(process.env.PORT || port, () =>
  console.log(`Running on: http://localhost:${port}`)
);

io.on("connection", (socket) => {
  console.log("socket initialization completed");
  socket.on("say", (data) => {
    console.log(data, "received information");
    socket.emit("message", { hello: "who are you" });
  });
});
