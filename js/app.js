// Declaración de una variable para almacenar eventos como un arreglo vacío.
let events = [];
//

// Selecciona el elemento de entrada de texto con el ID "eventName" y lo almacena en la variable "eventName".
const eventName = document.querySelector("#eventName");

// Selecciona el elemento de entrada de fecha con el ID "eventDate" y lo almacena en la variable "eventDate".
const eventDate = document.querySelector("#eventDate");

// Selecciona el botón con el ID "bAdd" y lo almacena en la variable "buttonAdd".
const buttonAdd = document.querySelector("#bAdd");

// Intenta cargar datos previamente guardados en formato JSON.
const json = load();

// Si se encontraron datos guardados en formato JSON:
if (json) {
  try {
    // Intenta convertir los datos JSON en un arreglo de eventos y almacénalos en la variable "events".
    events = JSON.parse(json);
  } catch (error) {
    // Si ocurre un error al analizar el JSON, imprime un mensaje de error en la consola.
    console.error("Error parsing JSON:", error);
  }
}


// Llama a la función "renderEvents()" para mostrar los eventos en la página.
renderEvents();

// Agrega un evento "submit" al formulario.
document.querySelector("form").addEventListener("submit", (e) => {
  // Evita que se realice la acción predeterminada de envío del formulario, que suele ser recargar la página.
  e.preventDefault();
});


// Agrega un evento de clic al botón con el ID "bAdd".
buttonAdd.addEventListener("click", (e) => {
  // Cuando se hace clic en el botón "Añadir evento", se ejecuta la función "addEvent()".
  addEvent();
});


// Esta función se llama cuando se quiere agregar un nuevo evento.
function addEvent() {
  // Verifica si los campos de nombre de evento o fecha de evento están vacíos.
  if (eventName.value === "" || eventDate.value === "") {
    return; // Si alguno de los campos está vacío, la función se detiene y no se agrega el evento.
  }

  // Verifica si la fecha del evento es en el pasado utilizando la función "datediff".
  if (datediff(eventDate.value) < 0) {
    return; // Si la fecha está en el pasado, la función se detiene y no se agrega el evento.
  }

  // Crea un nuevo objeto de evento con un ID único, nombre y fecha.
  const newEvent = {
    id: (Math.random() * 100).toString(36).slice(2), // Genera un ID único.
    name: eventName.value, // Obtiene el nombre del campo de entrada.
    date: eventDate.value, // Obtiene la fecha del campo de entrada.
  };

  // Agrega el nuevo evento al principio del arreglo "events".
  events.unshift(newEvent);

  // Guarda la lista actualizada de eventos en formato JSON.
  save(JSON.stringify(events));

  // Limpia el campo de entrada del nombre del evento.
  eventName.value = "";

  // Llama a la función "renderEvents()" para actualizar la visualización de eventos en la página.
  renderEvents();
}

// Esta función se llama para renderizar y mostrar la lista de eventos en la página.
function renderEvents() {
  // Mapea la lista de eventos en una lista de representaciones HTML de eventos.
  const eventsHTML = events.map((event) => {
    // Plantilla de cadena de texto para representar un evento en HTML.
    return `
        <div class="task">
            <!-- Muestra la cantidad de días hasta la fecha del evento. -->
            <div class="days">
                <span class="days-number">${datediff(event.date)}</span>
                <span class="days-text">días</span>
            </div>
            
            <!-- Muestra el nombre del evento. -->
            <div class="event-name">${event.name}</div>
            
            <!-- Muestra la fecha del evento. -->
            <div class="event-date">${event.date}</div>
            
            <!-- Agrega un botón "Eliminar" asociado al evento con su ID como atributo de datos. -->
            <div class="actions">
                <button data-id="${event.id}" class="bDelete">Eliminar</button>
            </div>
        </div>`;

  });

  // Actualiza el contenido del elemento con el ID "tasksContainer" con las representaciones HTML de los eventos.
  document.querySelector("#tasksContainer").innerHTML = eventsHTML.join("");

  // Agrega un evento de clic a cada botón de eliminación ("Eliminar") dentro de los eventos.
  document.querySelectorAll(".bDelete").forEach((button) => {
    button.addEventListener("click", (e) => {
      // Obtiene el ID del evento asociado al botón de eliminación.
      const id = button.getAttribute("data-id");
      // Filtra y elimina el evento con el ID correspondiente de la lista de eventos.
      events = events.filter((event) => event.id !== id);
      // Guarda la lista actualizada de eventos en el almacenamiento local.
      save();
      // Vuelve a llamar a la función "renderEvents()" para actualizar la visualización.
      renderEvents();
    });
  });
}


// Calcula la diferencia en días entre una fecha dada y la fecha actual.
function datediff(d) {
  // Convierte la fecha dada en un objeto Date. 
  var date1 = new Date(d);

  // Obtiene la fecha actual.
  var date2 = new Date();

  // Calcula la diferencia entre las dos fechas.
  var difference = date1.getTime() - date2.getTime();

  // Convierte la diferencia en días redondeando hacia arriba.
  var days = Math.ceil(difference / (1000 * 3600 * 24));

  // Retorna la diferencia en días.
  return days;
}


// Almacena datos en el almacenamiento local bajo la clave "items".
function save(data) {
  localStorage.setItem("items", data);
}

// Carga datos del almacenamiento local bajo la clave "items".
function load() {
  return localStorage.getItem("items");
}
