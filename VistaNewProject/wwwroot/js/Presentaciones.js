function checkInternetConnection() {
    return navigator.onLine;
}
var presentaciones = []; 
function obtenerDatosPresentaciones() {
    fetch('/Presentaciones/FindPresentaciones', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            presentaciones = data;
        })
        .catch(error => console.error('Error al obtener los presentaciones:', error));
}
function compararPresentaciones(nuevaPresentacion, presentacionesExistentes) {
    const nombrePresentacionNormalizado = normalizar(nuevaPresentacion.NombrePresentacionVista || '');
    const contenidoPresentacionNormalizado = normalizar(nuevaPresentacion.Contenido || '');
    const cantidad = parseInt(nuevaPresentacion.CantidadPorPresentacion);

    const presentacionesDuplicadas = [];

    presentacionesExistentes.forEach(presentacionExistente => {
        const nombrePresentacionExistenteNormalizado = normalizar(presentacionExistente.nombrePresentacion || '');
        const contenidoPresentacionExistenteNormalizado = normalizar(presentacionExistente.contenido || '');
        const cantidadExistente = presentacionExistente.cantidadPorPresentacion || 0;

        // Verificar si la presentación ya existe con los mismos atributos
        if (
            nombrePresentacionNormalizado === nombrePresentacionExistenteNormalizado &&
            contenidoPresentacionNormalizado === contenidoPresentacionExistenteNormalizado &&
            cantidad === cantidadExistente
        ) {
            presentacionesDuplicadas.push(presentacionExistente.presentacionId);

        }
    });

    if (presentacionesDuplicadas.length > 0) {
        mostrarAlertaAtencionPersonalizadaConBoton(`Ya existe una presentacion registrada con el mismo nombre, Presentacion ID: ${presentacionesDuplicadas.join(', ')}`);
        return true; // Se encontraron coincidencias
    }

    return false; // No se encontraron coincidencias
}

function compararPresentacionesAct(nuevaPresentacion, presentacionesExistentes) {
    const nombrePresentacionNormalizado = normalizar(nuevaPresentacion.NombrePresentacionVistaAct || '');
    const contenidoPresentacionNormalizado = normalizar(nuevaPresentacion.ContenidoAct || '');
    const cantidad = parseInt(nuevaPresentacion.CantidadPorPresentacionAct);
    const presentacionesDuplicadas = [];

    presentacionesExistentes.forEach(presentacionExistente => {
        const nombrePresentacionExistenteNormalizado = normalizar(presentacionExistente.nombrePresentacion || '');
        const contenidoPresentacionExistenteNormalizado = normalizar(presentacionExistente.contenido || '');
        const cantidadExistente = presentacionExistente.cantidadPorPresentacion || 0;

        // Verificar si la presentación ya existe con los mismos atributos
        if (
            nombrePresentacionNormalizado === nombrePresentacionExistenteNormalizado &&
            contenidoPresentacionNormalizado === contenidoPresentacionExistenteNormalizado &&
            cantidad === cantidadExistente
        ) {
            if (nuevaPresentacion.PresentacionIdAct == presentacionExistente.presentacionId) {
                return false;
            } else {
                presentacionesDuplicadas.push(presentacionExistente.presentacionId);
            }
        }
    });

    if (presentacionesDuplicadas.length > 0) {
        mostrarAlertaAtencionPersonalizadaConBoton(`Ya existe una presentacion registrada con el mismo nombre, Presentacion ID: ${presentacionesDuplicadas.join(', ')}`);
        return true; // Se encontraron coincidencias
    }

    return false; // No se encontraron coincidencias
}

function mostrarValoresFormularioInicialPresentacion() {
    const idsCrear = [
        'NombrePresentacionVista',
        'CantidadPorPresentacion',
        'Contenido'
    ];
    const valoresCrear = obtenerValoresFormulario(idsCrear);
    return valoresCrear;
}
function mostrarValoresFormularioPresentacionAct() {
    const idsCrear = [
        'PresentacionIdAct',
        'NombrePresentacionVistaAct',
        'PresentacionIdAct',
        'CantidadPorPresentacionAct',
        'ContenidoAct'
    ];
    const valoresCrear = obtenerValoresFormulario(idsCrear);
    return valoresCrear;
}

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const mostrarAlertaCampoVacio = urlParams.get('mostrarAlertaCampoVacio');
    const presentacionId = urlParams.get('presentacionId');

    if (mostrarAlertaCampoVacio === 'true' && presentacionId) {
        mostrarModalActualizarPresentacion(presentacionId);
    }
    //Evitar el envio de los formularios hasta que todo este validados
    $('.modal-formulario-crear-presentacion').on('submit', function (event) {
        const presentacionFinal = mostrarValoresFormularioInicialPresentacion();
        const presentacionesAll = presentaciones;
        const presentacionRepetida = compararPresentaciones(presentacionFinal, presentacionesAll);
        const campos = [
            { id: 'NombrePresentacionVista', nombre: 'Tipo presentación' },
            { id: 'Contenido', nombre: 'Contenido' },
            { id: 'CantidadPorPresentacion', nombre: 'Cantidad de productos x presentacion' }
        ];

        const camposVacios = verificarCampos(campos, mostrarAlertaCampoVacio);
        if (!camposVacios) {
            event.preventDefault();
            return;
        }
        if (!NoCamposConErroresPresentacion()) {
            event.preventDefault();
            return;
        }

        if (presentacionRepetida) {
            event.preventDefault();
            return;
        }
    });
    $('.modal-formulario-actualizar-presentacion').on('submit', function (event) {
        const presentacionFinal = mostrarValoresFormularioPresentacionAct();
        const presentacionesAll = presentaciones;
        const presentacionRepetida = compararPresentacionesAct(presentacionFinal, presentacionesAll);
        const campos = [
                { id: 'NombrePresentacionVistaAct', nombre: 'Tipo presentación' },
                { id: 'ContenidoAct', nombre: 'Contenido' },
                { id: 'CantidadPorPresentacionAct', nombre: 'Cantidad de productos x presentacion' }
        ];
        const camposVacios = verificarCampos(campos, mostrarAlertaCampoVacio);
        if (!camposVacios) {
            event.preventDefault();
            return;
        }
        if (!NoCamposConErroresPresentacionAct()) {
            event.preventDefault();
            return;
        }

        if (presentacionRepetida) {
            event.preventDefault();
            return;
        }

    });
    // Confirmación de eliminación
    $('.eliminarPresentacion').on('submit', function (event) {
        event.preventDefault(); // Evita que el formulario se envíe automáticamente
        // Mostrar el diálogo de confirmación
        Swal.fire({
            title: '\u00BFEst\u00E1s seguro?',
            text: '\u00A1Esta acci\u00F3n no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'S\u00ED, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Si el usuario confirma, enviar el formulario
                event.target.submit();
            }
        });
    });

    // Validar campos en cada cambio para cambiar el mensaje inicial que aparece arriba de los botones del formulario
    $('.modal-formulario-crear-presentacion input').on('input', function () {
        NoCamposConErroresInicialPresentacion();
    });
    $('.modal-formulario-actualizar-presentacion input, .modal-formulario-actualizar-presentacion select').on('input', function () {
        NoCamposConErroresInicialPresentacionAct();

    });

    
    function NoCamposConErroresPresentacion() {
        const textDangerElements = $('.text-danger');
        const textDangerSlice = textDangerElements.slice(0, 4);
        const camposConTexto = textDangerSlice.filter(function () {
            return $(this).text().trim() !== ''; // Utilizamos trim() para eliminar espacios en blanco al principio y al final del texto.
        }).length;

        if (camposConTexto === 4) { // Cambiamos la condición para verificar si hay campos sin texto.
            mostrarAlertaAtencionPersonalizadaConBoton('Complete correctamente todos los campos');
            $('.MensajeErrores').text('Todos los campos son invalidos.');
            return false;
        }
        if (camposConTexto > 1 && camposConTexto < 4) {
            mostrarAlertaAtencionPersonalizadaConBoton('Complete correctamente los campos');
            $('.MensajeErrores').text('Hay campos invalidos.');
            return false;
        }
        if (camposConTexto === 1) {
            mostrarAlertaAtencionPersonalizadaConBoton('Complete correctamente el campo');
            $('.MensajeErrores').text('Un campo es invalido.');
            return false;
        }
        return true;
    }

    function NoCamposConErroresPresentacionAct() {
        const textDangerElements = $('.text-danger');
        const textDangerSlice = textDangerElements.slice(-4);
        const camposConTexto = textDangerSlice.filter(function () {
            return $(this).text().trim() !== ''; // Utilizamos trim() para eliminar espacios en blanco al principio y al final del texto.
        }).length;



        if (camposConTexto === 4) { // Cambiamos la condición para verificar si hay campos sin texto.
            mostrarAlertaAtencionPersonalizadaConBoton('Complete correctamente todos los campos');
            $('.MensajeErrores').text('Todos los campos son invalidos.');
            return false;
        }
        if (camposConTexto > 1 && camposConTexto < 4) {
            mostrarAlertaAtencionPersonalizadaConBoton('Complete correctamente los campos');
            $('.MensajeErrores').text('Hay campos invalidos.');
            return false;
        }
        if (camposConTexto === 1) {
            mostrarAlertaAtencionPersonalizadaConBoton('Complete correctamente el campo');
            $('.MensajeErrores').text('Un campo es invalido.');
            return false;
        }
        return true;
    }
   
    function NoCamposConErroresInicialPresentacion() {
        const textDangerElements = $('.text-danger');
        const textDangerSlice = textDangerElements.slice(0, 4);
        const todoValido = textDangerSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;
        if (todoValido) {
            $('.MensajeErrores').text('');

        }
        return true;
    }

    function NoCamposConErroresInicialPresentacionAct() {
        const textDangerElements = $('.text-danger');
        const textDangerSlice = textDangerElements.slice(-4);
        const todoValido = textDangerSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;
        console.log('Todos los campos son válidos:', todoValido);
        if (todoValido) {
            $('.MensajeErrores').text('');
        }
        return true;
    }

});
function simularClickPresentacion() {
    obtenerDatosPresentaciones();
}

/*--------------------Atajo para abrir modal -------------------------------*/
document.addEventListener('keydown', function (event) {
    if (event.ctrlKey && event.key === 'm') {
        try {
            if (esURLValida('Presentaciones')) {
                const modalPresentacion = $('#ModalPresentacion');
                const botonAbrirModal = $('#botonabrirModalPresentacion');

                if (modalPresentacion.length === 0 || botonAbrirModal.length === 0) {
                    console.error('El modal o el botón para abrir el modal no se encontraron en el DOM.');
                    return;
                }
                if (modalPresentacion.hasClass('show')) {
                    modalPresentacion.modal('hide'); // Cerrar la modal
                } else {
                    botonAbrirModal.click();
                }
            }
        } catch (error) {
            console.error('Ocurrió un error al intentar abrir/cerrar la modal de presentacion:', error);
        }
    }
});

function limpiarFormularioPresentacion() {
    limpiarFormularioPresentacionAgregar();
    limpiarFormularioPresentacionAct();
    history.replaceState(null, '', location.pathname);
    // Limpiar campos y elementos específicos
    limpiarCampo('NombrePresentacionVista');
    limpiarCampo('Contenido');
    limpiarCampo('CantidadPorPresentacion');
    limpiarCampo('DescripcionPresentacion');

    // Limpiar campos y elementos específicos de la versión actualizada
    limpiarCampo('NombrePresentacionVistaAct');
    limpiarCampo('ContenidoAct');
    limpiarCampo('CantidadPorPresentacionAct');
    limpiarCampo('DescripcionPresentacionAct');


}
function limpiarFormularioPresentacionAgregar() {
    // Limpiar la URL eliminando los parámetros de consulta
    history.replaceState(null, '', location.pathname);
    // Limpiar mensajes de alerta y *
    var mensajes = document.querySelectorAll('.Mensaje');
    var mensajesText = document.querySelectorAll('.text-danger');

    for (var i = 0; i < mensajes.length - 3; i++) {
        mensajes[i].textContent = '*';
    }
    for (var i = 0; i < mensajesText.length - 4; i++) {
        mensajesText[i].textContent = '';
    }

}
function limpiarFormularioPresentacionAct() {
    history.replaceState(null, '', location.pathname);
  
    // Limpiar mensajes de alerta y asteriscos
    var mensajes = document.querySelectorAll('.Mensaje');
    var mensajesText = document.querySelectorAll('.text-danger');

    for (var i = Math.max(0, mensajes.length - 3); i < mensajes.length; i++) {
        mensajes[i].textContent = '';
    }
    for (var i = Math.max(0, mensajesText.length - 4); i < mensajesText.length; i++) {
        mensajesText[i].textContent = '';
    }
}


//Función para limpiar la url si el usuario da fuera de ella 
$('.modal').on('click', function (e) {
    if (e.target === this) {
        // Limpiar la URL eliminando los parámetros de consulta
        history.replaceState(null, '', location.pathname);
        $(this).modal('hide'); // Oculta la modal
    }
});

function AlPerderFocoPresentacion() {
    var displayModal = $('#ModalActualizarPresentacion').css('display');
    if (displayModal == "none") {
        limpiarFormularioPresentacionAct();
    }
}

/*--------------------------------------------------------- Modal de actualizar usuario ---------------------------------------*/

//Modal cuando se hace click en editar en el boton de detalle
function mostrarModalActualizarPresentacion(presentacionId) {
    obtenerDatosPresentaciones();
    actualizarPresentacion(presentacionId);
    setTimeout(function () {
        var myModal = new bootstrap.Modal(document.getElementById('ModalActualizarPresentacion'));
        limpiarFormularioPresentacionAct();
        myModal.show();
        // Aquí puedes llamar a la función actualizarProducto si es necesario
    }, 50); // 50 milisegundos (0.05 segundos) de retraso antes de abrir la modal
}

function actualizarPresentacion(campo) {
    var presentacionId = campo;
    $.ajax({
        url: '/Presentaciones/FindPresentacion', // Ruta relativa al controlador y la acción
        type: 'GET',
        data: { presentacionId: presentacionId },
        success: function (data) {
            var formActualizar = $('#FormActualizarPresentacion');
            formActualizar.find('#PresentacionIdAct').val(data.presentacionId);
            formActualizar.find('#NombrePresentacionVistaAct').val(data.nombrePresentacion);
            formActualizar.find('#ContenidoAct').val(data.contenido);
            formActualizar.find('#CantidadPorPresentacionAct').val(data.cantidadPorPresentacion);
            formActualizar.find('#DescripcionPresentacionAct').val(data.descripcionPresentacion);
            formActualizar.find('#EstadoPresentacionAct').val(data.estadoPresentacion);
            obtenerDatosPresentaciones();
        },
        error: function () {
            alert('Error al obtener los datos de la  presentacion.');
        }
    });
}
function actualizarEstadoPresentacion(PresentacionId) {
    $.ajax({
        url: `/Presentaciones/UpdateEstadoPresentacion/${PresentacionId}`,
        type: 'PATCH',
        contentType: 'application/json',
        success: function (response) {
            // Mostrar SweetAlert
            Swal.fire({
                icon: 'success',
                title: '¡Estado actualizado!',
                showConfirmButton: false,
                timer: 1500 // Duración del SweetAlert en milisegundos
            }).then(() => {
                location.reload(); // Recargar la página después de que la alerta haya terminado
            });
        },

        error: function (xhr, status, error) {
            console.error('Error al actualizar el estado del presentacion:', xhr.responseText);
            // Mostrar SweetAlert de error si es necesario
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al actualizar el estado del presentacion. Por favor, inténtalo de nuevo.'
            });
        }
    });
}

function searchPresentacion() {
    var input = $('#buscarPresentacion').val().trim().toLowerCase();    //Obtiene el valor del buscadpor
    var rows = document.querySelectorAll('.presentacionesPaginado');    //Obtiene el tr de Usuario Paginado.
    var rowsTodos = document.querySelectorAll('.Presentaciones');      //Obtiene el tr de Usuario que esta en none
    var icon = document.querySelector('#btnNavbarSearch i');    //Obtiene el icino de buscar
    var contador = document.querySelector('.contador');        //Obtiene la columna que tiene el # 
    var contadores = document.querySelectorAll('.contadorB'); //Obtiene el contadorB que esta en none y lo hace visible para mostrar el consecutivo y el ID
    var paginationContainer = document.getElementById('paginationContainer');
    if (input === "") {
        rows.forEach(function (row) { //Esconde los usuarios paginado
            row.style.display = '';
        });
        contadores.forEach(function (contador) {
            contador.classList.add('noIs'); // Removemos la clase 'noIs' para mostrar la columna
        });
        icon.className = 'fas fa-search';
        icon.style.color = 'white';
        contador.innerText = '#';
        paginationContainer.classList.remove('noBe'); // Oculta el contenedor de paginación
    } else {
        rows.forEach(function (row) {
            row.style.display = 'none';
        });
        contadores.forEach(function (contador) {
            contador.classList.remove('noIs'); // Removemos la clase 'noIs'
        });
        icon.className = 'fas fa-times';
        icon.style.color = 'white';
        contador.innerText = 'ID';
        paginationContainer.classList.add('noBe'); // Oculta el contenedor de paginación

    }

    rowsTodos.forEach(function (row) {
        if (input === "") {
            row.style.display = 'none';
        } else {
            var presentacionId = row.querySelector('td:nth-child(3)').textContent.trim().toLowerCase();
            var nombreC = row.querySelector('td:nth-child(4)').textContent.trim().toLowerCase();
            row.style.display = (presentacionId.includes(input) || nombreC.includes(input)) ? 'table-row' : 'none';
        }
    });
}

function vaciarInputPresentacion() {
    var paginationContainer = document.getElementById('paginationContainer');
    document.getElementById('buscarPresentacion').value = "";
    var icon = document.querySelector('#btnNavbarSearch i');
    icon.className = 'fas fa-search';
    icon.style.color = 'white';

    var contador = document.querySelector('.contador');
    contador.innerText = '#';
    var contadores = document.querySelectorAll('.contadorB');
    contadores.forEach(function (contador) {
        contador.classList.add('noIs'); // Removemos la clase 'noIs'
    });

    var rows = document.querySelectorAll('.presentacionesPaginado');
    rows.forEach(function (row) {
        row.style.display = 'table-row';
    });

    var rowsTodos = document.querySelectorAll('.Presentaciones');

    rowsTodos.forEach(function (row) {
        row.style.display = 'none';
    });
    paginationContainer.classList.remove('noBe'); // Oculta el contenedor de paginación

}
function validarCampoPresentacion(input) {
    const inputElement = $(input); // Convertir el input a objeto jQuery
    const campo = inputElement.attr('id'); // Obtener el id del input actual como nombre de campo
    const valor = inputElement.val().trim(); // Obtener el valor del campo y eliminar espacios en blanco al inicio y al final
    const spanError = inputElement.next('.text-danger'); // Obtener el elemento span de error asociado al input
    const labelForCampo = $('label[for="' + campo + '"]');
    const spanVacio = labelForCampo.find('.Mensaje');

    // Limpiar el mensaje de error previo
    spanError.text('');
    spanVacio.text('');

    // Validar el campo y mostrar mensaje de error si es necesario
    if (valor === '') {
        spanVacio.text('*');
        spanError.text('');
    }


    // Validación de usuario
    if (inputElement.is('#NombrePresentacionVista') || inputElement.is('#NombrePresentacionVistaAct')) {
        const nombreValido = /^[a-zA-Z]{3,}[a-zA-Z0-9_-]{0,16}$/.test(valor); // Verifica que el usuario cumpla con el formato especificado
        if (valor === '') {
            spanVacio.text('*');
        } else if (valor.length < 4 && valor.length > 1) {
            spanVacio.text('');
            spanError.text('El usuario debe contener entre 4 y 16 caracteres y empezar con letras. Ejemplo: juan123');
        } else if (!nombreValido) {
            spanVacio.text('');
            spanError.text('El usuario debe contener entre 4 y 16 caracteres alfanuméricos, guiones bajos (_) o guiones medios (-).');
        } else {
            spanError.text('');
            spanVacio.text('');
        }
    }
    if (inputElement.is('#Contenido') || inputElement.is('#ContenidoAct')) {
        const nombreValido = /^[a-zA-Z0-9\s]{2,}$/.test(valor); 

        if (valor === '') {
            spanVacio.text('*');
        } else if (valor.length < 2 && valor.length > 1) {
            spanVacio.text('');
            spanError.text('El contenido debe contener entre 2 y 16 caracteres y empezar con letras. Ejemplo: 2L');
        } else if (!nombreValido) {
            spanVacio.text('');
            spanError.text('El contenido debe contener entre 2 y 16 caracteres y empezar con letras. Ejemplo: 2L');
        } else {
            spanError.text('');
            spanVacio.text('');
        }
    }
    return true; // Devuelve el estado de validación al finalizar la función
}







