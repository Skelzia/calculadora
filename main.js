const display = document.getElementById('display');
const historyList = document.getElementById('history-list');
const roomInput = document.getElementById('room');
const dateInput = document.getElementById('date');
const notesInput = document.getElementById('notes');

let currentSessionHistory = [];

// Función para agregar un número al display
function appendNumber(number) {
    if (display.innerText === "0" && number !== ".") {
        display.innerText = number;
    } else {
        display.innerText += number;
    }
}

// Función para agregar un operador
function appendOperator(operator) {
    if (!endsWithOperator()) {
        display.innerText += operator;
    }
}

// Función para calcular el resultado
function calculateResult() {
    try {
        const expression = display.innerText;
        const result = eval(expression);

        // Mostrar el resultado en la pantalla
        display.innerText = result;

        // Guardar en el historial de la sesión actual
        currentSessionHistory.push(`${expression} = ${result}`);

    } catch (error) {
        display.innerText = "Error";
    }
}

// Función para limpiar el display
function clearDisplay() {
    display.innerText = "0";
}

// Función para borrar el último caracter
function deleteLast() {
    if (display.innerText.length > 1) {
        display.innerText = display.innerText.slice(0, -1);
    } else {
        display.innerText = "0";
    }
}

// Función para verificar si el display termina con un operador
function endsWithOperator() {
    return /[+\-*/.]$/.test(display.innerText);
}

// Función para guardar el historial de la sesión con la habitación, fecha y observaciones
function saveCalculation() {
    const room = roomInput.value;
    const date = dateInput.value;
    const notes = notesInput.value;

    if (!room || !date || currentSessionHistory.length === 0) {
        alert("Por favor, completa todos los campos y realiza al menos un cálculo antes de guardar.");
        return;
    }

    const record = {
        room: room,
        date: date,
        calculations: currentSessionHistory,
        notes: notes
    };

    // Guardar en localStorage
    let records = JSON.parse(localStorage.getItem('hotelRecords')) || [];
    records.push(record);
    localStorage.setItem('hotelRecords', JSON.stringify(records));

    // Añadir al historial visible
    addToHistory(record);

    // Limpiar los campos y el historial de la sesión actual después de guardar
    clearFields();
}

// Función para añadir el historial de la sesión al historial visible
function addToHistory(record) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
        <strong>Habitación:</strong> ${record.room} |
        <strong>Fecha:</strong> ${record.date} |
        <strong>Observaciones:</strong> ${record.notes} <br>
        <strong>Cálculos:</strong>
        <ul>
            ${record.calculations.map(calc => `<li>${calc}</li>`).join('')}
        </ul>
    `;
    historyList.appendChild(listItem);
}

// Función para limpiar los campos de entrada y el historial de la sesión actual
function clearFields() {
    roomInput.value = '';
    dateInput.value = '';
    notesInput.value = '';
    clearDisplay();
    currentSessionHistory = [];
}

// Función para cargar el historial desde localStorage al iniciar la aplicación
function loadHistory() {
    const records = JSON.parse(localStorage.getItem('hotelRecords')) || [];
    records.forEach(addToHistory);
}

// Evento para manejar las teclas del teclado
document.addEventListener('keydown', function(event) {
    const key = event.key;

    if (/\d/.test(key)) {
        appendNumber(key); // Si la tecla es un número
    } else if (key === '.') {
        appendOperator('.'); // Si la tecla es un punto decimal
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        appendOperator(key); // Si la tecla es un operador
    } else if (key === 'Enter') {
        calculateResult(); // Si la tecla es Enter, calcula el resultado
    } else if (key === 'Backspace') {
        deleteLast(); // Si la tecla es Backspace, borra el último carácter
    } else if (key === 'Escape') {
        clearDisplay(); // Si la tecla es Escape, limpia el display
    }
});

// Cargar el historial al iniciar la aplicación
loadHistory();