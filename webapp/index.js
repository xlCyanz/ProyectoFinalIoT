
window.addEventListener("load", iniciar, false);
var focos = null;
var contar = null;
var foco = null;
var control1 = 1;
var control2 = 0;
var contador = 30;
var semaforo = 1;
var ctrlPaso = document.getElementById("ctrlPaso");

const socket = io.connect("ws://localhost:2727");

function iniciar() {
  //funcion  para iniciar el semaforo
  iniciarSemaforo();

  //botones para encender y apagar el semaforo
  var encender = document.getElementById("encender");
  encender.addEventListener("click", iniciarSemaforo, false);
  var apagar = document.getElementById("apagar");
  apagar.addEventListener("click", detenerSemaforo, false);

  ctrlPaso.addEventListener("click", () => {
    socket.emit("requestChangeLight")
  })

  socket.on("light", data => {

    switch(JSON.parse(data.light).name) {
        case "green" : 
            foco[2].className = "foco verde centrar-div";
            foco[0].className = "foco gris centrar-div";
            break
        
        case "red": 
            foco[0].className = "foco rojo centrar-div";
            foco[1].className = "foco gris centrar-div";
            break;

        case "yellow":
            foco[2].className = "foco gris centrar-div";
            foco[1].className = "foco amarillo centrar-div";
            break;

        }
    contador = data.time
  })

  //focos del semaforo
  foco = document.getElementsByClassName("foco");
}
function iniciarSemaforo() {
  if (control1 == 1) {
    var divContador = document.getElementById("divContador");
    divContador.innerHTML = contador;

    contar = setInterval(function () {
      
      contador--;
      if(contador < 0) {
        contador = 0
      }
      divContador.innerHTML = contador;

    }, 1000);
    control1 = 0;
    control2 = 1;
  } else {
    alert("El semaforo esta encendido");
  }
}
function detenerSemaforo() {
  if (control2 == 1) {
    clearInterval(contar);
    control1 = 1;
    control2 = 0;
  } else {
    alert("El semaforo esta apagado");
  }
}
function semaforo() {}