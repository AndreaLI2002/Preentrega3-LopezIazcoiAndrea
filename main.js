// Variable para almacenar el monto actual
let montoActual = 1500;

// Función para mostrar un mensaje en el DOM
function showMessage(message) {
    const messageElement = document.createElement("p");
    messageElement.textContent = message;
    document.getElementById("content").appendChild(messageElement);
}

// Función para mostrar un input en el DOM
function showInput(placeholder) {
    const inputElement = document.createElement("input");
    inputElement.setAttribute("type", "text");
    inputElement.setAttribute("placeholder", placeholder);
    return inputElement;
}

// Función para mostrar un botón en el DOM
function showButton(label, onClickHandler) {
    const buttonElement = document.createElement("button");
    buttonElement.textContent = label;
    buttonElement.addEventListener("click", onClickHandler);
    return buttonElement;
}

// Función para guardar un valor en SessionStorage
function saveToSessionStorage(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
}

// Función para obtener un valor de SessionStorage
function getFromSessionStorage(key) {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : null;
}

// Función para iniciar el proceso
function start() {
    const numeroTarjetaInput = document.getElementById("numeroTarjeta");
    const guardarBtn = document.getElementById("guardarBtn");

    guardarBtn.addEventListener("click", function () {
        const numeroTarjeta = numeroTarjetaInput.value;
        if (numeroTarjeta) {
            saveToSessionStorage("Numero de tarjeta", numeroTarjeta);
            showMessage("¿Qué desea hacer?");
            showActions();
        }
    });
}

// Función para mostrar los botones de acción
function showActions() {
    const contentDiv = document.getElementById("content");

    const depositarBtn = showButton("Depositar", depositar);
    const transferirBtn = showButton("Transferir", transferir);
    const verMontoBtn = showButton("Ver Monto", verMonto);
    const verActividadBtn = showButton("Ver Actividad", verActividad);
    const salirBtn = showButton("Salir", salir);

    contentDiv.appendChild(depositarBtn);
    contentDiv.appendChild(transferirBtn);
    contentDiv.appendChild(verMontoBtn);
    contentDiv.appendChild(verActividadBtn);
    contentDiv.appendChild(salirBtn);
}

// Función para realizar un depósito
function depositar() {
    const depositoInput = showInput("¿Cuánto desea depositar?");
    const confirmarBtn = showButton("Confirmar Depósito", function () {
        const deposito = parseFloat(depositoInput.value);
        if (!isNaN(deposito) && deposito > 0) {
            montoActual += deposito;
            saveToSessionStorage("Deposito realizado", deposito);
            showMessage(`Depósito realizado correctamente. Su monto actual es de: ${montoActual}`);
        } else {
            showMessage("Ingrese un monto válido para depositar.");
        }
    });

    const contentDiv = document.getElementById("content");
    contentDiv.appendChild(depositoInput);
    contentDiv.appendChild(confirmarBtn);
}

// Función para realizar una transferencia
function transferir() {
    const aliasInput = showInput("¿A qué cuenta desea transferir? Ingrese alias o CVU");
    const montoInput = showInput("Ingrese el monto a transferir");
    const confirmarBtn = showButton("Confirmar Transferencia", function () {
        const alias = aliasInput.value;
        const monto = parseFloat(montoInput.value);
        if (!isNaN(monto) && monto > 0 && alias) {
            saveToSessionStorage("Transferencia", {
                "Alias/CVU": alias,
                "Monto": monto
            });
            showMessage(`Transferencia realizada correctamente. Cuenta destino: ${alias}, Monto: ${monto}`);
        } else {
            showMessage("Ingrese un alias/destino válido y un monto válido para transferir.");
        }
    });

    const contentDiv = document.getElementById("content");
    contentDiv.appendChild(aliasInput);
    contentDiv.appendChild(montoInput);
    contentDiv.appendChild(confirmarBtn);
}

// Función para ver el monto actual
function verMonto() {
    showMessage(`Su monto actual es de: ${montoActual}`);
}

// Función para ver la actividad (transferencias realizadas)
function verActividad() {
    const transferencia = getFromSessionStorage("Transferencia");
    if (transferencia) {
        showMessage(`Actividad: Transferencia realizada a cuenta ${transferencia["Alias/CVU"]}, Monto: ${transferencia["Monto"]}`);
    } else {
        showMessage("No hay actividad registrada.");
    }
}

// Función para reiniciar el proceso
function salir() {
    sessionStorage.clear();
    document.getElementById("content").innerHTML = '<input type="text" id="numeroTarjeta" placeholder="Ingrese su número de tarjeta"><button id="guardarBtn">Guardar</button>';
    start();
}

// Iniciar el proceso
start();
