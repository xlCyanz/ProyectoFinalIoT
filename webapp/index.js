const socket = io.connect("ws://localhost:2727");

const ctrlPaso = document.getElementById("ctrlPaso");
const encender = document.getElementById("encender");
const apagar = document.getElementById("apagar");
const foco = document.getElementsByClassName("foco");
const divContador = document.getElementById("divContador");
const customers = document.getElementById("customers");
const customersBody = document.getElementById("customers_body");
const btnTable = document.getElementById("btnTable");

const GREEN_LIGHT = "green";
const YELLOW_LIGHT = "yellow";
const RED_LIGHT = "red";

let focos = null;
let contar = null;
let control1 = 1;
let control2 = 0;
let contador = 0;
let semaforo = 1;

encender.addEventListener("click", iniciarSemaforo, false);
apagar.addEventListener("click", detenerSemaforo, false);
btnTable.addEventListener("click", () => {
  let display = customers.style.display;

  if(display === "none") {
    customers.style.display = "";
    btnTable.innerHTML = "Esconder tabla"
  } else {
    customers.style.display = "none";
    btnTable.innerHTML = "Mostrar tabla"
  }
})

ctrlPaso.addEventListener("click", () => {
  socket.emit("requestChangeLight");
});

const createElement = (element, children, attributes) => {
  const newElement = document.createElement(element);
  if (attributes)
    Object.entries(attributes).forEach(([key, value]) =>
      newElement.setAttribute(key, value)
    );
  if (children) newElement.innerText = children;
  return newElement;
};

const addReport = () => {
  const tr = createElement("tr");

  const tdId = createElement("td", socket.id);
  const tdPaso = createElement("td", "1");
  const tdMetros = createElement("td", "10 metros");

  tr.append(tdId, tdPaso, tdMetros);

  customersBody.appendChild(tr);
};

const iniciar = (data) => {
  foco[0].className = "foco gris centrar-div";
  foco[1].className = "foco gris centrar-div";
  foco[2].className = "foco gris centrar-div";

  switch (JSON.parse(data.light).name) {
    case GREEN_LIGHT:
      foco[2].className = "foco verde centrar-div";
      break;

    case RED_LIGHT:
      foco[0].className = "foco rojo centrar-div";
      break;

    case YELLOW_LIGHT:
      foco[1].className = "foco amarillo centrar-div";
      break;
  }

  contador = data.time;

  if (control1 == 1) {
    divContador.innerHTML = contador;

    contar = setInterval(function () {
      contador--;
      if (contador < 0) {
        contador = 0;
      }
      divContador.innerHTML = contador;
    }, 1000);
    control1 = 0;
    control2 = 1;
  }
};

function iniciarSemaforo() {
  if (control1 == 1) {
    divContador.innerHTML = contador;

    contar = setInterval(function () {
      contador--;
      if (contador < 0) {
        contador = 0;
      }
      divContador.innerHTML = contador;
    }, 1000);
    control1 = 0;
    control2 = 1;
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

socket.on("light", iniciar);
socket.on("changeLightAccepted", addReport);
