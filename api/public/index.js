const socket = io.connect('http://localhost:2727');

const buttonChangeSemaphore = document.getElementById("button_change_semaphore");
const semaforo = document.getElementById("semaforo");

socket.on("light", (data) => {
    console.log("🚀 ~ file: index.js ~ line 7 ~ socket.on ~ data", data)
    semaforo.style.backgroundColor = data.light;
})

buttonChangeSemaphore.addEventListener("click", () => {
    socket.emit("changeLight", semaforo.style.backgroundColor);
})