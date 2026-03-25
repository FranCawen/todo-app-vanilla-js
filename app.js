//SELECIONAMOS LOS ELEMENTOS DEL DOM
const buscarInput = document.querySelector('#buscarInput');
const contador = document.querySelector('#contador');
const tareaInput = document.querySelector('#tareaInput');
const agregarBtn = document.querySelector('#agregarBtn');
const listaTareas = document.querySelector('#listaTareas');
let tareas = [];
//Se seleccionan los elementos del HTML que se van a usar en la aplicación:
//buscarInput: input para filtrar tareas
//contador: muestra cuántas tareas están completadas
//tareaInput: input donde el usuario escribe una nueva tarea
//agregarBtn: botón para agregar tareas
//listaTareas: contenedor donde se renderizan las tareas
//tareas: array donde se almacenan todas las tareas

//CARGAMOS LOS DATOS DESDE EL localStorage
const tareasGuardadas = localStorage.getItem('tareas');

if (tareasGuardadas) {
    tareas = JSON.parse(tareasGuardadas);
    actualizarLista();
}
//Se intenta recuperar las tareas guardadas en el navegador:
//localStorage.getItem obtiene los datos guardados
//JSON.parse convierte el texto en un array real
//Si existen tareas, se cargan y se renderizan en pantalla

//CREAMOS LA FUNCION DE agregarTarea PARA QUE CUANDO EL USUARIO INGRESA UN VALOR SE AGREGUE AL ARRAY tareas[i]
function agregarTarea() {
    if (tareaInput.value !== '') { //con este if verificamos que el valor ingresado en la barra de texto no este vacio
        tareas.push({
            texto: tareaInput.value, //texto: tomara y almacenara en el array lo que se ingrese
            completada: false //completada: false es el estado o class con el que comienza almacenada
        });
        tareaInput.value = '';
        actualizarLista();
    }
}
//Permite agregar nuevas tareas:
//Verifica que el input no esté vacío
//Agrega un objeto al array tareas
//Cada tarea tiene:
//texto: lo que escribió el usuario
//completada: estado inicial en false
//Limpia el input
//Vuelve a renderizar la lista

//FUNCION PRINCIPAL
function actualizarLista() { //Esta es la funcion mas importante, actualizarLista se encarga de: mostrar las tareas, aplicar filtros de busqueda, actualizar el estado de la lista
    listaTareas.innerHTML = ''; //Borra el contenido anterior para evitar duplicados.
    const textoBusqueda = buscarInput.value.toLowerCase(); //Permite buscar tareas
    const tareasFiltradas = tareas.filter(t => t.texto.toLowerCase().includes(textoBusqueda)); //convierte el texto en minuscula, filtra las tareas que coincidan y no modifica el array original(tareas[i])
    for (let i = 0; i < tareasFiltradas.length; i++) { //Recorre las tareas filtradas para mostrarlas en pantalla.
        const tareaActual = tareasFiltradas[i]; //Con esta linea se obtiene la tarea que se está mostrando
        const indexReal = tareas.indexOf(tareaActual); //Con esta otra la posición real en el array original 0, 1, 2, 3, etc. Esta linea es clave para poder modificar correctamente los datos y minimizar errores
        const tarea = document.createElement('li'); //Crea dinamicamente los elementos de cada tarea, junto a ('span') y ('button')
        tarea.classList.add(
        "list-group-item",
            "d-flex",
            "justify-content-between",
            "align-items-center"
        );
        tarea.style.cursor = 'pointer';
        tarea.classList.add("list-group-item", "list-group-item-action");
        const texto = document.createElement('span');
        texto.textContent = tareasFiltradas[i].texto;
        const botonBorrar = document.createElement('button');
        botonBorrar.textContent = 'Borrar';
        botonBorrar.classList.add("btn", "btn-outline-danger", "btn-sm", "ms-2");
        botonBorrar.addEventListener('click', function borrar(event) { //Eliminamos una tarea al hacer click en el boton que sea crea junto a la misma.
            event.stopPropagation(); //evito que la accion del click afecte fuera del <li></li>
            tareas.splice(indexReal, 1); //Con .splice eliminamos la tarea selecionada del array
            actualizarLista(); //Se vuelve a renderizar el array con los cambios nuevos
        })
        tarea.addEventListener('click', function completarTarea() { //Usamos esta funcion para marcar como completada una tarea del array
            tareas[indexReal].completada = !tareas[indexReal].completada; //Alternamos el estado de la tarea entre true y false
            actualizarLista();
        })
        if (tareasFiltradas[i].completada) { //Al hacer click y marcar como completada una tarea esta misma se vuelve mas tenua y se tacha con una linea que la atraviesa
            texto.classList.add("text-decoration-line-through", "text-muted");
        }
        tarea.appendChild(texto);
        tarea.appendChild(botonBorrar);
        listaTareas.appendChild(tarea);
    } //los appendChild finales agregan a la lista visible los elementos que creamos

    //Creamos un contador de tareas para llevar una registro de cuantas vamos agregando, muestra en formato x/x completadas.
    const completadas = tareas.filter(t => t.completada).length;
    contador.textContent = `${completadas} / ${tareas.length} completadas`;
    if (tareas.length === 0) { //Este bloque if nos sirve para verificar si no hay ningun valor, en caso de que la condicion sea verdadera nos mostrara un mensaje en la lista visible indicando que no hay tareas.
        listaTareas.innerHTML = '<li class="list-group-item text-muted">De momento no hay tareas</li>';
        return;
    }
    //GUARDAMOS TODO EL PROGRESO ACTUAL DEL ARRAY CON localStorage
    localStorage.setItem('tareas', JSON.stringify(tareas)); //JSON.stringify convierte el array en texto y nos da persistencia a la hora de recargar la pagina
}

buscarInput.addEventListener('input', function () { //Filtra tareas en tiempo real mientras el usuario escribe.
    actualizarLista();
});

agregarBtn.addEventListener('click', agregarTarea); //Agrega una tarea al hacer click en el boton Agregar
tareaInput.addEventListener('keypress', function (event) { //Permite agregar tareas presionando la tecla Enter.
    if (event.key === 'Enter') {
        event.preventDefault();
        agregarTarea();
    }
});

