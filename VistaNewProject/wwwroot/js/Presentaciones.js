var presentaciones = [];

function obtenerDatosPresentaciones() {
    fetch('/Presentaciones/FindPresentaciones', {
        method: 'POST',
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

    const presentacionesDuplicadas = [];


    presentacionesExistentes.forEach(presentacionExistente => {
        const nombrePresentacionExistenteNormalizado = normalizar(presentacionExistente.nombrePresentacion || '');

        if (
            nombrePresentacionNormalizado === nombrePresentacionExistenteNormalizado
        ) {
            presentacionesDuplicadas.push(presentacionExistente.presentacionId);
        }
    });

    if (presentacionesDuplicadas.length > 0) {
        mostrarAlertaAtencionPersonalizadaConBoton(`Ya existe una presentacion registrada con el mismo nombre , Presentacion ID: ${presentacionesDuplicadas.join(', ')}`);
        return true; // Se encontraron coincidencias
    }

    return false; // No se encontraron coincidencias
}
function compararPresentacionesAct(nuevaPresentacion, presentacionesExistentes) {
    const nombrePresentacionNormalizado = normalizar(nuevaPresentacion.NombrePresentacionVista || '');

    const presentacionesDuplicadas = [];


    presentacionesExistentes.forEach(presentacionExistente => {
        const nombrePresentacionExistenteNormalizado = normalizar(presentacionExistente.nombrePresentacion || '');

        if (
            nombrePresentacionNormalizado === nombrePresentacionExistenteNormalizado
        ) {
            if (presentacionExistente.presentacionId == nuevaPresentacion.PresentacionIdAct) {
                return false; // No es un duplicado de alguna presentacion
            } else {
                presentacionesDuplicadas.push(presentacionExistente.presentacionId);
            }
        }
    });

    if (presentacionesDuplicadas.length > 0) {
        mostrarAlertaAtencionPersonalizadaConBoton(`Ya existe una presentacion registrada con el mismo nombre , Presentacion ID: ${presentacionesDuplicadas.join(', ')}`);
        return true; // Se encontraron coincidencias
    }

    return false; // No se encontraron coincidencias
}


function mostrarValoresFormularioInicialPresentacion() {
    const idsCrear = [
        'NombrePresentacionVista',
        'Contenido',
        'Cantidad'
    ];
    const valoresCrear = obtenerValoresFormulario(idsCrear);
    return valoresCrear;
}
function mostrarValoresFormularioPresentacionAct() {
    const idsCrear = [
        'PresentacionIdAct',
        'NombrePresentacionVistaAct',
        'CantidadAct',
        'ContenidoAct'
    ];
    const valoresCrear = obtenerValoresFormulario(idsCrear);
    return valoresCrear;
}

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const mostrarAlerta = urlParams.get('mostrarAlerta');
    const presentacionId = urlParams.get('presentacionId');

    if (mostrarAlerta === 'true' && presentacionId) {
        mostrarModalSinRetrasoPresentacion(presentacionId);
    }
    //Evitar el envio de los formularios hasta que todo este validados
    $('.modal-formulario-crear-presentacion').on('submit', function (event) {
        const presentacionFinal = mostrarValoresFormularioInicialPresentacion();
        const presentacionesAll = presentaciones;
        const presentacionRepetida = compararPresentaciones(presentacionFinal, presentacionesAll);
        console.log(presentacionesAll, presentacionFinal);
        const campos = [
            { id: 'NombrePresentacionVista', nombre: 'Nombre' },
            { id: 'Contenido', nombre: 'Contenido' },
            { id: 'CantidadPorPresentacion', nombre: 'Cantidad de productospresentacion' }
        ];

        const camposVacios = verificarCampos(campos, mostrarAlertaCampoVacio);
        if (!NoCamposVaciosPresentacion()) {
            event.preventDefault();
            return;
        }

        if (!NoCamposConErroresPresentacion()) {
            event.preventDefault();
            mostrarAlertaAtencionPersonalizadaConBoton('El campo no es valido');
            return;
        }

        if (presentacionRepetida) {
            event.preventDefault();
            return;
        }

        if (!camposVacios) {
            event.preventDefault();
            return;
        }
    });
    $('.modal-formulario-actualizar-presentacion').on('submit', function (event) {
        const presentacionFinal = mostrarValoresFormularioPresentacionAct();
        const presentacionesAll = presentaciones;
        const presentacionRepetida = compararPresentacionesAct(presentacionFinal, presentacionesAll);

        const campos = [
            { id: 'NombrePresentacionVistaAct', nombre: 'Presentacion' },
            { id: 'ContenidoAct', nombre: 'Contenido' },
            { id: 'CantidadPorPresentacionAct', nombre: 'Cantidad de productospresentacion' }
        ];
        const camposVacios = verificarCampos(campos, mostrarAlertaCampoVacio);
        if (!NoCamposVaciosPresentacionAct()) {
            event.preventDefault();
            return;
        }

        if (!NoCamposConErroresPresentacionAct()) {
            event.preventDefault();
            mostrarAlertaAtencionPersonalizadaConBoton('Algunos campos contienen errores');
            return;
        }

        if (presentacionRepetida) {
            event.preventDefault();
            return;
        }

        if (!camposVacios) {
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
        NoCamposVaciosInicialPresentacion();
        NoCamposConErroresInicialPresentacion();
    });
    $('.modal-formulario-actualizar-presentacion input, .modal-formulario-actualizar-presentacion select').on('input', function () {
        NoCamposVaciosInicialPresentacionAct();
        NoCamposConErroresInicialPresentacionAct();

    });

    //Este elimina el mensaje inicial u lo agrega de ser necesario el que aparece sobre los botones
    function NoCamposVaciosPresentacion() {
        const mensajeElements = $('.Mensaje');
        const mensajeSlice = mensajeElements.slice(0, 3);
        const camposConTexto = mensajeSlice.filter(function () {
            return $(this).text().trim() !== ''; // Utilizamos trim() para eliminar espacios en blanco al principio y al final del texto.
        }).length;

        console.log('Número de campos sin texto:', camposConTexto);

        if (camposConTexto === 3) { // Cambiamos la condición para verificar si hay campos sin texto.
            mostrarAlertaAtencionPersonalizadaConBoton('Completa todos los campos');
            $('.MensajeInicial').text('Por favor, complete todos los campos obligatorios(*).');
            return false;
        } else if (camposConTexto != 0) { // Cambiamos la condición para verificar si hay campos sin texto.
            $('.MensajeInicial').text('Por favor, complete todos los campos obligatorios(*).');
            return false;
        }

        return true;
    }
    function NoCamposConErroresPresentacion() {
        const textDangerElements = $('.text-danger');
        const textDangerSlice = textDangerElements.slice(0, 3);
        const todoValido = textDangerSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;
        console.log('Todos los campos son válidos:', todoValido);
        if (!todoValido) {
            $('.MensajeErrores').text('Este nombre no es valido..');
            return false;
        }
        return true;
    }

    function NoCamposVaciosPresentacionAct() {
        const mensajeElements = $('.Mensaje');
        const mensajeSlice = mensajeElements.slice(-3);
        const camposConTexto = mensajeSlice.filter(function () {
            return $(this).text().trim() !== ''; // Utilizamos trim() para eliminar espacios en blanco al principio y al final del texto.
        }).length;

        console.log('Número de campos sin texto:', camposConTexto);

        if (camposConTexto === 3) { // Cambiamos la condición para verificar si hay campos sin texto.
            mostrarAlertaAtencionPersonalizadaConBoton('Completa todos los campos');
            $('.MensajeInicial').text('Por favor, complete todos los campos obligatorios(*).');
            return false;
        } else if (camposConTexto != 0) { // Cambiamos la condición para verificar si hay campos sin texto.
            $('.MensajeInicial').text('Por favor, complete todos los campos obligatorios(*).');
            return false;
        }

        return true;
    }
    function NoCamposConErroresPresentacionAct() {
        const textDangerElements = $('.text-danger');
        const textDangerSlice = textDangerElements.slice(-3);
        const todoValido = textDangerSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;
        console.log('Todos los campos son válidos:', todoValido);
        if (!todoValido) {
            $('.MensajeErrores').text('Este nombre no es valido.');
            return false;
        }
        return true;
    }
    function NoCamposVaciosInicialPresentacion() {
        const mensajeElements = $('.Mensaje');

        const mensajeSlice = mensajeElements.slice(0, 3);


        const todosLlenos = mensajeSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;


        if (todosLlenos) {
            $('.MensajeInicial').text('');
        }

    }
    function NoCamposConErroresInicialPresentacion() {
        const textDangerElements = $('.text-danger');
        const textDangerSlice = textDangerElements.slice(0, 3);
        const todoValido = textDangerSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;
        if (todoValido) {
            $('.MensajeErrores').text('');

        }
        return true;
    }

    function NoCamposVaciosInicialPresentacionAct() {
        const mensajeElements = $('.Mensaje');

        const mensajeSlice = mensajeElements.slice(-3);


        const todosLlenos = mensajeSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;


        if (todosLlenos) {
            $('.MensajeInicial').text('');
        }

    }
    function NoCamposConErroresInicialPresentacionAct() {
        const textDangerElements = $('.text-danger');
        const textDangerSlice = textDangerElements.slice(-3);
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
    //ocultar formulario de actualizar  y mostrar el formulario principal
    $('#FormActualizarPresentacion').hide();
    $('#FormPrincipalPresentacion').show().css('visibility', 'visible');
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


function abrirModalPresentacion() {
    // Verificar si la modal está abierta
    if ($('#ModalPresentacion').hasClass('show')) {
        $('#ModalPresentacion').modal('hide'); // Cerrar la modal
    } else {
        simularClickPresentacion(); // Simular algún evento antes de abrir la modal
        $('#ModalPresentacion').modal('show'); // Abrir la modal
    }
}

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
    for (var i = 0; i < mensajesText.length - 3; i++) {
        mensajesText[i].textContent = '';
    }

    document.querySelectorAll('.MensajeInicial').forEach(function (element) {
        element.textContent = '';
    });
    document.querySelectorAll('.MensaErrores').forEach(function (element) {
        element.textContent = '';
    });

}
function limpiarFormularioPresentacionAct() {
    history.replaceState(null, '', location.pathname);
    document.querySelectorAll('.MensajeInicial').forEach(function (element) {
        element.textContent = '';
    });
    document.querySelectorAll('.MensaErrores').forEach(function (element) {
        element.textContent = '';
    });

    // Limpiar mensajes de alerta y asteriscos
    var mensajes = document.querySelectorAll('.Mensaje');
    var mensajesText = document.querySelectorAll('.text-danger');

    for (var i = Math.max(0, mensajes.length - 3); i < mensajes.length; i++) {
        mensajes[i].textContent = '';
    }
    for (var i = Math.max(0, mensajesText.length - 3); i < mensajesText.length; i++) {
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
    var displayFormActualizar = $('#FormActualizarPresentacion').css('display');
    var displayModal = $('#ModalPresentacion').css('display');
    if (displayFormActualizar == "block" && displayModal == "none") {
        limpiarFormularioPresentacionAct();
    }
}

/*--------------------------------------------------------- Modal de actualizar usuario ---------------------------------------*/
function mostrarModalConRetrasoPresentacion(PresentacionId) {
    limpiarFormularioPresentacionAct();
    actualizarPresentacion(PresentacionId);
    setTimeout(function () {
        var myModal = new bootstrap.Modal(document.getElementById('ModalPresentacion'));
        myModal.show();
        // Aquí puedes llamar a la función actualizarProducto si es necesario
    }, 400); // 500 milisegundos (0.5 segundos) de retraso antes de abrir la modal

}
//Modal cuando se hace click en editar en el boton de detalle
function mostrarModalSinRetrasoPresentacion(PresentacionId) {
    obtenerDatosPresentacions();
    actualizarPresentacion(PresentacionId);
    setTimeout(function () {
        var myModal = new bootstrap.Modal(document.getElementById('ModalPresentacion'));
        limpiarFormularioPresentacionAct();
        myModal.show();
        // Aquí puedes llamar a la función actualizarProducto si es necesario
    }, 600); // 50 milisegundos (0.05 segundos) de retraso antes de abrir la modal
}


function actualizarPresentacion(campo) {
    var presentacionId = campo;
    $.ajax({
        url: '/Presentaciones/FindPresentacion', // Ruta relativa al controlador y la acción
        type: 'POST',
        data: { presentacionId: presentacionId },
        success: function (data) {
            var formActualizar = $('#FormActualizarPresentacion');
            formActualizar.find('#PresentacionIdAct').val(data.presentacionId);
            formActualizar.find('#NombrePresentacionVistaAct').val(data.nombrePresentacion);
            formActualizar.find('#ContenidoAct').val(data.contenido);
            formActualizar.find('#CantidadPorPresentacionAct').val(data.cantidadPorPresentacion);
            formActualizar.find('#DescripcionPresentacionAct').val(data.descripcionPresentacion);
            formActualizar.find('#EstadoPresentacionAct').val(data.estadoPresentacion);
            limpiarFormularioPresentacionAct()
            obtenerDatosPresentaciones();
            console.log(data);
        },
        error: function () {
            alert('Error al obtener los datos de la  presentacion.');
        }
    });
    $('#FormPrincipalPresentacion').hide().css('visibility', 'hidden');
    $('#FormActualizarPresentacion').show().css('visibility', 'visible');
}
function actualizarEstadoPresentacion(PresentacionId) {
    $.ajax({
        url: `/Presentaciones/UpdateEstadoPresentacion/${PresentacionId}`,
        type: 'PATCH',
        contentType: 'application/json',
        success: function (response) {
            console.log("Estado actualizado:", EstadoPresentacion);
            // Mostrar SweetAlert
            Swal.fire({
                icon: 'success',
                title: '¡Estado actualizado!',
                showConfirmButton: false,
                timer: 1500 // Duración del SweetAlert en milisegundos
            })
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

    }

    rowsTodos.forEach(function (row) {
        if (input === "") {
            row.style.display = 'none';
        } else {
            var presentacionId = row.querySelector('td:nth-child(2)').textContent.trim().toLowerCase();
            var nombreC = row.querySelector('td:nth-child(3)').textContent.trim().toLowerCase();
            row.style.display = (input === "" || presentacionId.includes(input) || nombreC.includes(input)) ? 'table-row' : 'none';
        }
    });
}

function vaciarInputPresentacion() {
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
    if (campo === 'NombrePresentacionVista' || campo === 'NombrePresentacionVistaAct') {
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
    return true; // Devuelve el estado de validación al finalizar la función
}







