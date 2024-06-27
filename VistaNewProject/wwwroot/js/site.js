//Funcion que hace aparecer las opcione de ir a mi perfil o cerrar sesion
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
/*---------------------------------------------Funciones generales-------------------------------------------------------- */
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

function recargarPagina() {
    location.reload(); //quitar despues de berig¿ficar que no se usa
}



/*---------------------------------------------Funcionalidades generales-------------------------------------------------------- */
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
window.seleccionarOpcion = function (input, dataList, hiddenInput, Peticion) {
    const selectedValue = input.value.trim();
    let selectedOptionByName = Array.from(dataList.options).find(option => option.value === selectedValue);
    let selectedOptionById = Array.from(dataList.options).find(option => option.getAttribute('data-id') === selectedValue);
    if (/^\d+[a-zA-Z]$/.test(selectedValue)) {
        selectedOptionByName = Array.from(dataList.options).find(option => option.value === selectedValue);
    }

    if (!selectedOptionByName && !selectedOptionById && /^\d+$/.test(selectedValue)) {
        if (Peticion == "Categoria" || Peticion == "CategoriaAct") {
            var response = manejarCategoria(selectedValue,Peticion);
            return;
        }
        if (Peticion == "Presentacion" || Peticion == "PresentacionAct") {
            var response = manejarPresentacion(selectedValue, Peticion);
            return;
        }
        if (Peticion == "Marca" || Peticion == "MarcaAct") {
            var response = manejarMarca(selectedValue,Peticion);
            return;
        }
        if (response == null) {
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
    }

    if (selectedOptionByName) {
        input.value = selectedOptionByName.value;
        hiddenInput.value = selectedOptionByName.getAttribute('data-id');
    } else if (selectedOptionById) {
        input.value = selectedOptionById.value;
        hiddenInput.value = selectedOptionById.getAttribute('data-id');
    }
    if (Peticion == "Categoria") {
        if ($('#filtrarxCategoria').prop('checked')) { 
            checkboxFiltrar();
        }
    }
    if (Peticion == "CategoriaAct") {
        if ($('#filtrarxCategoriaAct').prop('checked')) { 
            checkboxFiltrarAct();
        }
    }


}
async function manejarCategoria(selectedValue,Peticion) {
    try {
        var categoria = await buscarCategoria(selectedValue);

        if (categoria != null && categoria !== "null") {
            if (Peticion == "Categoria") {
                console.log(categoria);
                $('#NombreCategoria').val(categoria.nombreCategoria);
                $('#CategoriaId').val(categoria.categoriaId);
            }
            if (Peticion == "CategoriaAct") {
                console.log(categoria);
                $('#NombreCategoriaAct').val(categoria.nombreCategoria);
                $('#CategoriaIdAct').val(categoria.categoriaId);
            }
            
        } else {
            alert("Categoría no encontrada");
            console.log("Categoría no encontrada");
        }
    } catch (error) {
        console.error('Error al manejar la categoría:', error);
    }
}
async function manejarPresentacion(selectedValue, Peticion) {
    try {
        var presentacion = await buscarPresentacion(selectedValue);
        if (presentacion != null && presentacion !== "null") {
            if (Peticion == "Presentacion") {
                console.log(presentacion);
                $('#NombrePresentacion').val(presentacion.nombreCompletoPresentacion);
                $('#PresentacionId').val(presentacion.presentacionId);
            }
            if (Peticion == "PresentacionAct") {
                console.log(presentacion);
                $('#NombrePresentacionAct').val(presentacion.nombreCompletoPresentacion);
                $('#PresentacionIdAct').val(presentacion.presentacionId);
            }
            
        } else {
            alert("Presentacion no encontrada");
        }
    } catch (error) {
        console.error('Error al manejar la Presentacion:', error);
    }
}
async function manejarMarca(selectedValue, Peticion) {
    try {
        var marca = await buscarMarca(selectedValue);

        if (marca != null && marca !== "null") {
            if (Peticion == "Marca") {
                console.log(marca);
                $('#NombreMarca').val(marca.nombreMarca);
                $('#MarcaId').val(marca.marcaId);
            }
            if (Peticion == "MarcaAct") {
                console.log(marca);
                $('#NombreMarcaAct').val(marca.nombreMarca);
                $('#MarcaIdAct').val(marca.marcaId);
            } 
            
        } else {
            alert("Marca no encontrada");
        }
    } catch (error) {
        console.error('Error al manejar la marca:', error);
    }
}
function obtenerValoresFormulario(ids) {
    const valores = {};
    ids.forEach(id => {
        valores[id] = $(`#${id}`).val();
    });
    return valores;
}
//Vuelve el vaor a todoen minusculas para luego ser comparado
function normalizar(texto) {
    return texto ? texto.toLowerCase().replace(/\s/g, '') : '';
}
// Función para formatear números enteros con puntos de mil
function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
// Función para formatear números enteros con puntos de mil y verlo en el input entiempo real
function formatoNumeroINT(input) {
    // Obtener el valor del input y quitar los puntos
    let cleanedValue = input.value.replace(/\./g, '');
    // Eliminar cualquier carácter que no sea número
    cleanedValue = cleanedValue.replace(/[^\d]/g, '');
    // Verificar si el valor es cero y reemplazarlo por uno si es necesario
    if (parseInt(cleanedValue, 10) === 0) {
        cleanedValue = '1';
    }
    // Formatear el valor con puntos para separar los miles
    const formattedValue = cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    // Asignar el valor formateado al campo
    input.value = formattedValue;
}

/*------------------------------------------------------------------------------------------------------------------------------ */
function buscarCategoria(categoriaId) {
    return $.ajax({
        url: `/Categorias/FindCategoria`,
        type: 'GET',
        data: { categoriaId: categoriaId },
        success: function (data) {
            return data;
        },
        error: function () {
            mostrarAlertaAtencionPersonalizadaConBoton('No existe una categoria con este id');
        }
    });
}

function buscarMarca(marcaId) {
    return $.ajax({
        url: `/Marcas/FindMarca`,
        type: 'GET',
        data: { marcaId: marcaId },
        success: function (data) {
            return data;
        },
        error: function () {
            mostrarAlertaAtencionPersonalizadaConBoton('No existe una marca con este id.');
        }
    });
}

function buscarPresentacion(presentacionId) {
    return $.ajax({
        url: `/Presentaciones/FindPresentacion`,
        type: 'GET',
        data: { presentacionId: presentacionId },
        success: function (data) {
            return data;
        },
        error: function () {
            mostrarAlertaAtencionPersonalizadaConBoton('Mo existe una presentacion con este id.');
        }
    });
}



/*------------------------------------------Funciones patra mostrar alertas--------------------------------------------*/

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


//Funcion para mostrar un sweet alert en caso de que se ingrese un numero de id que no tiene coincidencias
function showNoMarcasAlert(input) {

    showAlertIfNoOptions("marcas", "No hay marcas activas", "No hay marcas disponibles en este momento.");
}

function showNoPresentacionesAlert(input) {
    showAlertIfNoOptions("presentaciones", "No hay presentaciones activas", "No hay presentaciones disponibles en este momento.");
}

function showNoCategoriasAlert(input) {
    showAlertIfNoOptions("categorias", "No hay categorias ", "No hay categorias disponibles en este momento.");
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
function mostrarAlertaAtencionPersonalizadaConBoton(mensaje) {
    Swal.fire({
        position: "center",
        icon: 'warning',
        title: '\u00A1Atención!',
        html: `<p>${mensaje}</p>`,
        showConfirmButton: true
    });
}

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


//----------------------------------------------------Funcion para validar campos-------------------------------------------
// Función para verificar los campos
function verificarCamposDataList(lista) {
    for (var i = 0; i < lista.length; i++) {
        var campo = lista[i];
        if ($(`#${campo.id}`).val() === '') {
            mostrarAlertaDataList(campo.nombre);
            return false;
        }
    }
    return true;
}

function verificarCampos(lista) {
    for (var i = 0; i < lista.length; i++) {
        var campo = lista[i];
        if ($(`#${campo.id}`).val() === '') {
            window.mostrarAlertaCampoVacio(campo.nombre);
            return false;
        }
    }
    return true;
}


window.esURLValida = function (parametro) {
    var urlActual = window.location.href;
    // Verificar si la URL contiene el parámetro deseado
    return urlActual.includes(parametro);
}


/*----------------------------------------Funcion para limpiar un campo input por su id--------------- */
// Función auxiliar para limpiar un campo por su ID
function limpiarCampo(idCampo) {
    document.getElementById(idCampo).value = '';
}
function agregarIconoparalimpiarElCampo(input) {
    var $input = $(input); // Get the input element using 'input'
    var $icono = $input.closest('.icono-input').find('i'); // Find the icon within the 'icono-input' container
    var campo = $input.val().trim(); // Get the trimmed value of the input field

    // Check if the field is not empty
    if (campo.length !== 0) {
        $icono.removeClass('noBe'); // Remove the 'noBe' class from the icon
    } else {
        $icono.addClass('noBe'); // Add the 'noBe' class to the icon
    }
}
function agregarIconoParalimpiarElCampoActinput(input) {
    var $input = $(input); // Get the input element using 'input'
    var $icono = $input.closest('.icono-input').find('i'); // Find the icon within the 'icono-input' container
    $icono.removeClass('noBe'); // Add the 'noBe' class to the icon

}
function limpiarCampoIcono(inputId) {
    var $input = $('#' + inputId); // Get the input element by ID
    $input.val(''); // Clear the value of the input field
    agregarIconoParalimpiarElCampoActinput($input); // Call your existing function to handle the icon class
}
function removerIconoparalimpiarElCampo(inputs) {
    if (!Array.isArray(inputs)) {
        inputs = [inputs];
    }
    // Verifica si el array de inputs contiene "NombreCategoria"
    if (inputs.includes("NombreCategoria")) {
        if($('checkboxFiltrar'))
        checkboxFiltrar();
    }
    inputs.forEach(function (input) {
        var $input = $('#' + input); // Obtener el elemento input usando 'input'
        var $icono = $input.closest('.icono-input').find('i'); // Buscar el icono dentro del contenedor 'icono-input'
        const labelForCampo = $('label[for="' + input + '"]');
        const spanVacio = labelForCampo.find('.Mensaje');
        $icono.addClass('noBe');
        spanVacio.text('*');
    });
}
function iconoLimpiarCampo(idsCampos,id) {
    // Iterar sobre cada ID de campo
    idsCampos.forEach(function (idCampo) {
        limpiarCampo(idCampo); // Limpiar el campo
    });
    removerIconoparalimpiarElCampo(id);
}


/*---------------------------- Funciones para detalle de producto ---------------------------------------------- */

// Función para limpiar y rellenar las listas
function fillList(selector, data, nameKey, idKey, stateKey, emptyMessage) {
    const $list = $(selector).empty(); // Limpia la lista

    if (data && data.length > 0) {
        data.forEach(item => {
            const option = `<option value="${item[nameKey]}" data-id="${item[idKey]}" data-estado="${item[stateKey]}">${item[nameKey]}</option>`;
            $list.append(option);
        });
    } else {
        // Si no hay datos, muestra un mensaje
        const option = `<option>${emptyMessage}</option>`;
        $list.append(option);
    }
}
async function checkboxFiltrar() {
    try {
        const filtrar = document.getElementById('filtrarActivos').checked ? 1 : 0;
        const asociar = document.getElementById('filtrarxCategoria').checked ? 1 : 0;
        const filtro = $('#CategoriaId').val(); // Este es el filtro adicional para la categoría

        let url = `/Productos/filtrarDataList/${filtrar}/${asociar}`;

        // Si asociar es 1 y hay un filtro, añadir el filtro a la URL
        if (asociar === 1 && filtro !== "") {
            url += `/${filtro}`;
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ filtrar: filtrar })
        });

        if (!response.ok) {
            throw new Error('Error al cargar los productos');
        }

        const data = await response.json();
        console.log(data);

        // Limpia y rellena las listas utilizando la función fillList
        fillList('#marcas', data.marcas, 'nombreMarca', 'marcaId', 'estadoMarca', 'No hay marcas disponibles');
        fillList('#presentaciones', data.presentaciones, 'nombreCompletoPresentacion', 'presentacionId', 'estadoPresentacion', 'No hay presentaciones disponibles');
        fillList('#categorias', data.categorias, 'nombreCategoria', 'categoriaId', 'estadoCategoria', 'No hay categorías disponibles');

    } catch (error) {
        console.error(error); // Muestra el error en la consola
    }
}
async function checkboxFiltrarAct() {
    try {
        const filtrar = document.getElementById('filtrarActivosAct').checked ? 1 : 0;
        const asociar = document.getElementById('filtrarxCategoriaAct').checked ? 1 : 0;
        const filtro = $('#CategoriaIdAct').val(); // Este es el filtro adicional para la categoría

        let url = `/Productos/filtrarDataList/${filtrar}/${asociar}`;

        // Si asociar es 1 y hay un filtro, añadir el filtro a la URL
        if (asociar === 1 && filtro !== "") {
            url += `/${filtro}`;
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ filtrar: filtrar })
        });

        if (!response.ok) {
            throw new Error('Error al cargar los productos');
        }

        const data = await response.json();
        console.log(data);

        // Limpia y rellena las listas utilizando la función fillList
        fillList('#marcasAct', data.marcas, 'nombreMarca', 'marcaId', 'estadoMarca', 'No hay marcas disponibles');
        fillList('#presentacionesAct', data.presentaciones, 'nombreCompletoPresentacion', 'presentacionId', 'estadoPresentacion', 'No hay presentaciones disponibles');
        fillList('#categoriasAct', data.categorias, 'nombreCategoria', 'categoriaId', 'estadoCategoria', 'No hay categorías disponibles');

    } catch (error) {
        console.error(error); // Muestra el error en la consola
    }
}


function actualizarLotes(id) {
    fetch('/Productos/RedondearPrecios/' + id, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ocurrió un error al obtener la respuesta del servidor.');
            }
            return response.json();
        })
        .then(data => {
            console.log('Respuesta del servidor:', data);
            var formActualizarLotes = $('#FormActualizarLotes');
            formActualizarLotes.find('#precioProducto').val(data.precioProducto);
            formActualizarLotes.find('#precioUnidad').val(data.precioUnidad);
        })
        .catch(error => {
            console.error('Error:', error.message);
        });
}


