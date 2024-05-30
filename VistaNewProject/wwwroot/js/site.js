//Hacer que el menu de oocu¡iones de perfil aparezca u desaparezca ann sweet aoert de confirmacion
function opcionesDePerfil() {
    var profilePopup = document.getElementById("perfilVentanaEmergente");
    if (profilePopup.style.display === "none") {
        profilePopup.style.display = "block";
    } else {
        profilePopup.style.display = "none";
    }
}
function confirmLogout() {
    var result = confirm("¿Estás seguro de que deseas cerrar sesión?");
    if (result) {
        window.location.href = "/Login/Logout"; // Redirige al usuario a la URL definida
    } else {
        window.location.reload();
    }
}


//Funcion que hace desplegar o reducir el menu de navegacion
$(function () {
   $("#menu-toggle").on("click", function (e) {
    e.preventDefault();
    closeSubMenus(); // Cierra todos los submenús al hacer clic en el menú principal
    $("#Menu").toggleClass("menu-hidden");
    $(".container").toggleClass("menu-hidden");
    });
    // Manejar el clic en las opciones del menú
    $(".sidebar-label").on("click", function (e) {
        var optionId = $(this).attr("for");
        showSubMenu(optionId);
    });

    // Cierra los submenús al hacer clic en cualquier parte fuera del menú
    $(document).on("click", function (event) {
        var target = event.target;
        if (!$(target).is("#menu-toggle") && !$(target).closest("#Menu").length) {
            closeSubMenus();
        }
    });

    // Cierra todos los submenús
    function closeSubMenus() {
        var subMenus = document.querySelectorAll('.sub-menu');
        subMenus.forEach(function (subMenu) {
            subMenu.style.maxHeight = '0';
        });
    }

    // Función para mostrar y ocultar los submenús
    function showSubMenu(optionId) {
        var subMenu = $("#" + optionId).next(".sub-menu");

        // Cierra el submenú si ya está abierto
        if (subMenu.css("max-height") !== '0px') {
            subMenu.css("max-height", "0");
        } else {
            // Oculta todos los submenús
            closeSubMenus();

            // Muestra el submenú correspondiente al clicar en la opción
            subMenu.css("max-height", subMenu.prop("scrollHeight") + 'px');
        }
    }
    
});


/*Mostrar la hora actual en un campo solo llamarla i pasarle el id del campo al que se dese aagregar la fecha*/
function setHoraActual(campo) {
    // Crear un nuevo objeto Date que representa la fecha y hora actual
    var fechaHoraActual = new Date();

    // Formatear la fecha y hora en el formato necesario ('YYYY-MM-DDTHH:mm')
    var anio = fechaHoraActual.getFullYear();
    var mes = String(fechaHoraActual.getMonth() + 1).padStart(2, '0');
    var dia = String(fechaHoraActual.getDate()).padStart(2, '0');
    var hora = String(fechaHoraActual.getHours()).padStart(2, '0');
    var minutos = String(fechaHoraActual.getMinutes()).padStart(2, '0');

    var fechaHoraFormateada = `${anio}-${mes}-${dia}T${hora}:${minutos}`;
    var x = campo; 
    // Asignar la fecha y hora formateada al campo datetime-local
    document.getElementById(x).value = fechaHoraFormateada;
}

function reiniciarFormulario() {
    location.reload(); //quitar despues de berig¿ficar que no se usa
}


function mostrarOcultarContrasena(idCampo) {
    var inputContrasena = document.getElementById(idCampo);
    /*var iconoOjo = document.getElementById("MostrarOcultar" + idCampo.charAt(idCampo.length - 1)).querySelector("img");*/

    if (inputContrasena.type === "password") {
        inputContrasena.type = "text";
        // iconoOjo.src = "ruta/para/el/ícono-de-ojo-cerrado.svg";
    } else {
        inputContrasena.type = "password";
        // iconoOjo.src = "ruta/para/el/ícono-de-ojo-abierto.svg";
    }
}

// Función para manejar la selección de opciones en los datalist
window.seleccionarOpcion = function (input, dataList, hiddenInput) {
    const selectedValue = input.value.trim();
    let selectedOptionByName = Array.from(dataList.options).find(option => option.value === selectedValue);
    let selectedOptionById = Array.from(dataList.options).find(option => option.getAttribute('data-id') === selectedValue);

    if (/^\d+[a-zA-Z]$/.test(selectedValue)) {
        selectedOptionByName = Array.from(dataList.options).find(option => option.value === selectedValue);
    }

    if (!selectedOptionByName && !selectedOptionById && /^\d+$/.test(selectedValue)) {
        Swal.fire({
            icon: 'warning',
            title: 'No se encontró ningún resultado con este ID',
            showConfirmButton: false,
            timer: 1800
        });
        input.value = '';
        input.dispatchEvent(new Event('input'));
        return;
    }

    if (selectedOptionByName) {
        input.value = selectedOptionByName.value;
        hiddenInput.value = selectedOptionByName.getAttribute('data-id');
    } else if (selectedOptionById) {
        input.value = selectedOptionById.value;
        hiddenInput.value = selectedOptionById.getAttribute('data-id');
    }
}
/*------------------------------------------Funciones patra mostrar alertas--------------------------------------------*/
//Funcion para mostrar un sweet alert en caso de que se ingrese un numero de id que no tiene coincidencias
function mostrarAlertaDataList(campo) {
    Swal.fire({
        position: "center",
        icon: 'warning',
        title: '\u00A1Atencion!',
        html: `<p style="margin: 0;">Recuerda que debes seleccionar la ${campo} dando click en la opci\u00F3n que deseas</p>
            <div class="text-center" style="margin: 0; padding: 0;">
            <p style="margin: 0;">O</p>
            </div>
            <p style="margin: 0;">En su defecto, escribir el ID de la ${campo} o nombre exactamente igual.</p>`,

        showConfirmButton: false, // Mostrar botón de confirmación
        timer: 6000

    });
}


// Función general para mostrar el Sweet Alert si no hay opciones disponibles
function showAlertIfNoOptions(elementId, alertTitle, alertText) {
    var options = document.getElementById(elementId).getElementsByTagName("option");
    if (options.length === 0) {
        Swal.fire({
            icon: 'info',
            title: alertTitle,
            text: alertText,
            timer: 3000,
            timerProgressBar: true
        });
    }
}


function mostrarAlertaCampoVacio(campo) {
    Swal.fire({
        position: "center",
        icon: 'warning',
        title: '\u00A1Atenci\u00F3n!',
        html: `<p>Completa el campo: ${campo}.</p>`,
        showConfirmButton: false,
        timer: 6000
    });
}
function mostrarAlertaCampoVacioPersonalizada(mensaje) {
    Swal.fire({
        position: "center",
        icon: 'warning',
        title: '\u00A1Atención!',
        html: `<p>${mensaje}</p>`,
        showConfirmButton: false,
        timer: 6000
    });
}

//----------------------------------------------------Funcion para validar campos-------------------------------------------
// Función para verificar los campos
window.verificarCampos = function (lista, mostrarAlerta) {
    for (var i = 0; i < lista.length; i++) {
        var campo = lista[i];
        if ($(`#${campo.id}`).val() === '') {
            mostrarAlerta(campo.nombre);
            return false;
        }
    }
    return true;
}

function obtenerValoresFormulario(ids) {
    const valores = {};
    ids.forEach(id => {
        valores[id] = $(`#${id}`).val();
    });
    return valores;
}


/*----------------------------------------Funcion para limpiar un campo input por su id--------------- */
// Función auxiliar para limpiar un campo por su ID
function limpiarCampo(idCampo) {
    document.getElementById(idCampo).value = '';
}
function normalizar(texto) {
    return texto ? texto.toLowerCase().replace(/\s/g, '') : '';
}
/*---------------------------- Funciones para detalle de producto ---------------------------------------------- */
var precioProducto = 0;
var precioUnidadProducto = 0;
function editarFuncion() {
    // Valida si los campos ya no tienen el atributo readonly
    if ($('#precioProducto').prop('readonly') === false && $('#precioUnidad').prop('readonly') === false) {
        // Muestra una alerta indicando que los campos ya son editables
        alert('Los Campos ya son Editables');
    } else {
        // Quita el atributo readonly de los campos de entrada
        $('#precioProducto').removeAttr('readonly');
        $('#precioUnidad').removeAttr('readonly');
        // Otro código que desees ejecutar después de quitar el atributo readonly
        var p = $('#precioProducto').val();
        var u = $('#precioUnidad').val();
        console.log(p, u);
    }
}

// Obtener productos 

var usuarios = []; // Inicializamos la variable usuarios como un objeto vacío
// Obtener usuarios al dar click en agregar usuario
function obtenerDatosUsuarios() {
    fetch('/Usuarios/FindUsuarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            productos = data;
            console.log(productos);
        })
        .catch(error => console.error('Error al obtener los usuarios:', error));
}

