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
// Función para comparar productos durante la creación
function compararPresentaciones(nuevoPresentacion, presentacionesExistentes) {
    const nombrePresentacionNormalizado = normalizar(nuevoPresentacion.Nombre || '');
    const apellidoPresentacionNormalizado = normalizar(nuevoPresentacion.Apellido || '');
    const telefonoPresentacion = nuevoPresentacion.TelefonoPresentacion || '';
    const correoPresentacion = normalizar(nuevoPresentacion.CorreoPresentacion || '');
    const presentacionAcesso = normalizar(nuevoPresentacion.Presentacion || '');

    const presentacionesDuplicados = [];
    const telefonoDuplicado = [];
    const correoDuplicado = [];
    const presentacionDuplicado = [];

    presentacionesExistentes.forEach(presentacionExistente => {
        const nombrePresentacionExistenteNormalizado = normalizar(presentacionExistente.nombre || '');
        const apellidoPresentacionExistenteNormalizado = normalizar(presentacionExistente.apellido || '');
        const telefonoExistente = presentacionExistente.telefono || '';
        const correoExistente = normalizar(presentacionExistente.correo || '');
        const presentacionAcessoExistente = normalizar(presentacionExistente.presentacion1 || '');
        const correoDefault = normalizar('correo@gmail.com');
        if (
            nombrePresentacionNormalizado === nombrePresentacionExistenteNormalizado &&
            apellidoPresentacionNormalizado === apellidoPresentacionExistenteNormalizado
        ) {
            presentacionesDuplicados.push(presentacionExistente.presentacionId);
        }
        if (telefonoPresentacion && telefonoPresentacion === telefonoExistente) {
            telefonoDuplicado.push(presentacionExistente.presentacionId);
        }
        if (correoPresentacion && correoPresentacion === correoExistente && correoPresentacion && correoPresentacion != correoDefault) {
            correoDuplicado.push(presentacionExistente.presentacionId);
        }
        if (presentacionAcesso && presentacionAcesso === presentacionAcessoExistente) {
            presentacionDuplicado.push(presentacionExistente.presentacionId);
        }
    });

    if (presentacionesDuplicados.length > 0) {
        mostrarAlertaAtencionPersonalizadaConBoton(`Ya existe un presentacion registrado con los mismos nombre y apellido, Presentacion ID: ${presentacionesDuplicados.join(', ')}`);
        return true; // Se encontraron coincidencias
    }
    if (telefonoDuplicado.length > 0) {
        mostrarAlertaAtencionPersonalizadaConBoton(`Ya existe un presentacion registrado con el número de teléfono, Presentacion ID: ${telefonoDuplicado.join(', ')}`);
        return true; // Se encontraron coincidencias
    }
    if (correoDuplicado.length > 0) {
        mostrarAlertaAtencionPersonalizadaConBoton(`Ya existe un presentacion registrado con el correo electrónico, Presentacion ID: ${correoDuplicado.join(', ')}`);
        return true; // Se encontraron coincidencias
    }
    if (presentacionDuplicado.length > 0) {
        mostrarAlertaAtencionPersonalizadaConBoton(`Ya existe un presentacion registrado con el nombre de presentacion, Presentacion ID: ${presentacionDuplicado.join(', ')}`);
        return true; // Se encontraron coincidencias
    }

    return false; // No se encontraron coincidencias
}

// Función para comparar productos durante la actualización
function compararPresentacionesAct(nuevoPresentacion, presentacionesExistentes) {
    const nombrePresentacionNormalizado = normalizar(nuevoPresentacion.NombreAct || '');
    const apellidoPresentacionNormalizado = normalizar(nuevoPresentacion.ApellidoAct || '');
    const telefonoPresentacion = nuevoPresentacion.TelefonoPresentacionAct || '';
    const correoPresentacion = normalizar(nuevoPresentacion.CorreoPresentacionAct || '');
    const presentacionAcesso = normalizar(nuevoPresentacion.PresentacionAct || '');

    const presentacionesDuplicados = [];
    const telefonoDuplicado = [];
    const correoDuplicado = [];
    const presentacionDuplicado = [];

    presentacionesExistentes.forEach(presentacionExistente => {
        const nombrePresentacionExistenteNormalizado = normalizar(presentacionExistente.nombre || '');
        const apellidoPresentacionExistenteNormalizado = normalizar(presentacionExistente.apellido || '');
        const telefonoExistente = presentacionExistente.telefono || '';
        const correoExistente = normalizar(presentacionExistente.correo || '');
        const presentacionAcessoExistente = normalizar(presentacionExistente.presentacion1 || '');
        const correoDefault = normalizar('correo@gmail.com');
        if (nombrePresentacionNormalizado === nombrePresentacionExistenteNormalizado &&
            apellidoPresentacionNormalizado === apellidoPresentacionExistenteNormalizado
        ) {
            if (presentacionExistente.presentacionId == nuevoPresentacion.PresentacionIdAct) {
                return false; // No es un duplicado si es el mismo presentacion
            } else {
                presentacionesDuplicados.push(presentacionExistente.presentacionId);
            }
        }

        if (telefonoPresentacion && telefonoPresentacion === telefonoExistente) {
            if (presentacionExistente.presentacionId == nuevoPresentacion.PresentacionIdAct) {
                return false; // No es un duplicado si es el mismo presentacion
            } else {
                telefonoDuplicado.push(presentacionExistente.presentacionId);
            }
        }

        if (correoPresentacion && correoPresentacion === correoExistente && correoPresentacion !== correoDefault) {
            if (presentacionExistente.presentacionId == nuevoPresentacion.PresentacionIdAct) {
                return false; // No es un duplicado si es el mismo presentacion
            } else {
                correoDuplicado.push(presentacionExistente.presentacionId);
            }
        }

        if (presentacionAcesso && presentacionAcesso === presentacionAcessoExistente) {
            if (presentacionExistente.presentacionId == nuevoPresentacion.PresentacionIdAct) {
                return false; // No es un duplicado si es el mismo presentacion
            } else {
                presentacionDuplicado.push(presentacionExistente.presentacionId);
            }
        }
    });

    if (presentacionesDuplicados.length > 0) {
        mostrarAlertaAtencionPersonalizadaConBoton(`Ya existe un presentacion registrado con los mismos nombre y apellido, Presentacion ID: ${presentacionesDuplicados.join(', ')}`);
        return true; // Se encontraron coincidencias
    }
    if (telefonoDuplicado.length > 0) {
        mostrarAlertaAtencionPersonalizadaConBoton(`Ya existe un presentacion registrado con el número de teléfono, Presentacion ID: ${telefonoDuplicado.join(', ')}`);
        return true; // Se encontraron coincidencias
    }
    if (correoDuplicado.length > 0) {
        mostrarAlertaAtencionPersonalizadaConBoton(`Ya existe un presentacion registrado con el correo electrónico, Presentacion ID: ${correoDuplicado.join(', ')}`);
        return true; // Se encontraron coincidencias
    }
    if (presentacionDuplicado.length > 0) {
        mostrarAlertaAtencionPersonalizadaConBoton(`Ya existe un presentacion registrado con el nombre de presentacion, Presentacion ID: ${presentacionDuplicado.join(', ')}`);
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
    const idsActualizar = [
        'PresentacionIdAct',
        'NombrePresentacionVistaAct',
        'CantidadPorPresentacionAct',
        'ContenidoAct'
    ];
    const valoresActualizar = obtenerValoresFormulario(idsActualizar);
    return valoresActualizar;
}

/*------------------------------------- Al cargar la vista ------------------------------------------------------------------------------------------ */
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
        const presentacionRepetido = compararPresentaciones(presentacionFinal, presentacionesAll);

        const campos = [
            { id: 'NombrePresentacion', nombre: 'Tipo presentacion' },
            { id: 'Contenido', nombre: 'Conenido' },
            { id: 'CantidadPorPresentacion', nombre: 'Cantidad de productos x presentacion' }
        ];

        const camposVacios = verificarCampos(campos, mostrarAlertaCampoVacio);
        if (!NoCamposVacios()) {
            event.preventDefault();
            return;
        }

        if (!NoCamposConErrores()) {
            event.preventDefault();
            mostrarAlertaAtencionPersonalizadaConBoton('Algunos campos contienen errores');
            return;
        }

        if (presentacionRepetido) {
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
        const presentacionRepetido = compararPresentacionesAct(presentacionFinal, presentacionesAll);

        const campos = 
            { id: 'NombrePresentacionAct', nombre: 'Rol' },
            { id: 'Contenido', nombre: 'Rol' },
            { id: 'CantidadPorPresentacion', nombre: 'Nombre' },
            { id: 'ApellidoAct', nombre: 'Apellido' },
        ];
        const camposVacios = verificarCampos(campos, mostrarAlertaCampoVacio);
        if (!NoCamposVaciosAct()) {
            event.preventDefault();
            return;
        }

        if (!NoCamposConErroresAct()) {
            event.preventDefault();
            mostrarAlertaAtencionPersonalizadaConBoton('Algunos campos contienen errores');
            return;
        }

        if (presentacionRepetido) {
            event.preventDefault();
            return;
        }

        if (!camposVacios) {
            event.preventDefault();
            return;
        }

        const datalist = [
            { id: 'RolIdAct', nombre: 'Rol' }
        ];

        if (!verificarCampos(datalist, mostrarAlertaDataList)) {
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
                // Si el presentacion confirma, enviar el formulario
                event.target.submit();
            }
        });
    });

    // Validar campos en cada cambio para cambiar el mensaje inicial que aparece arriba de los botones del formulario
    $('.modal-formulario-crear-presentacion input, .modal-formulario-crear-presentacion select').on('input', function () {
        NoCamposVaciosInicial();
        NoCamposConErroresInicial();
    });
    $('.modal-formulario-actualizar-presentacion input, .modal-formulario-actualizar-presentacion select').on('input', function () {
        NoCamposVaciosInicialAct();
        NoCamposConErroresInicialAct();

    });
    // Asignar función de selección a los campos data-list
    $('#NombreRol').on('input', function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            seleccionarOpcion(this, document.getElementById('roles'), document.getElementById('RolId'));
        }, 650);
    });
    $('#NombreRolAct').on('input', function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            seleccionarOpcion(this, document.getElementById('roles'), document.getElementById('RolIdAct'));
        }, 650);
    });

    //Este elimina el mensaje inicial u lo agrega de ser necesario el que aparece sobre los botones
    function NoCamposVacios() {
        const mensajeElements = $('.Mensaje');
        const mensajeSlice = mensajeElements.slice(0, 8);
        const camposConTexto = mensajeSlice.filter(function () {
            return $(this).text().trim() !== ''; // Utilizamos trim() para eliminar espacios en blanco al principio y al final del texto.
        }).length;

        console.log('Número de campos sin texto:', camposConTexto);

        if (camposConTexto === 8) { // Cambiamos la condición para verificar si hay campos sin texto.
            mostrarAlertaAtencionPersonalizadaConBoton('Completa todos los campos');
            $('.MensajeInicial').text('Por favor, complete todos los campos obligatorios(*).');
            return false;
        } else if (camposConTexto != 0) { // Cambiamos la condición para verificar si hay campos sin texto.
            $('.MensajeInicial').text('Por favor, complete todos los campos obligatorios(*).');
            return false;
        }

        return true;
    }
    function NoCamposConErrores() {
        const textDangerElements = $('.text-danger');
        const textDangerSlice = textDangerElements.slice(0, 8);
        const todoValido = textDangerSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;
        console.log('Todos los campos son válidos:', todoValido);
        if (!todoValido) {
            $('.MensajeErrores').text('Algunos campos contienen errores.');
            return false;
        }
        return true;
    }

    function NoCamposVaciosAct() {
        const mensajeElements = $('.Mensaje');
        const mensajeSlice = mensajeElements.slice(-7);
        const camposConTexto = mensajeSlice.filter(function () {
            return $(this).text().trim() !== ''; // Utilizamos trim() para eliminar espacios en blanco al principio y al final del texto.
        }).length;

        console.log('Número de campos sin texto:', camposConTexto);

        if (camposConTexto === 8) { // Cambiamos la condición para verificar si hay campos sin texto.
            mostrarAlertaAtencionPersonalizadaConBoton('Completa todos los campos');
            $('.MensajeInicial').text('Por favor, complete todos los campos obligatorios(*).');
            return false;
        } else if (camposConTexto != 0) { // Cambiamos la condición para verificar si hay campos sin texto.
            $('.MensajeInicial').text('Por favor, complete todos los campos obligatorios(*).');
            return false;
        }

        return true;
    }
    function NoCamposConErroresAct() {
        const textDangerElements = $('.text-danger');
        const textDangerSlice = textDangerElements.slice(-7);
        const todoValido = textDangerSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;
        console.log('Todos los campos son válidos:', todoValido);
        if (!todoValido) {
            $('.MensajeErrores').text('Algunos campos contienen errores.');
            return false;
        }
        return true;
    }
    function NoCamposVaciosInicial() {
        const mensajeElements = $('.Mensaje');

        const mensajeSlice = mensajeElements.slice(0, 8);


        const todosLlenos = mensajeSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;


        if (todosLlenos) {
            $('.MensajeInicial').text('');
        }

    }
    function NoCamposConErroresInicial() {
        const textDangerElements = $('.text-danger');
        const textDangerSlice = textDangerElements.slice(0, 8);
        const todoValido = textDangerSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;
        console.log('Todos los campos son válidos:', todoValido);
        if (todoValido) {
            $('.MensajeErrores').text('');
        }
        return true;
    }

    function NoCamposVaciosInicialAct() {
        const mensajeElements = $('.Mensaje');

        const mensajeSlice = mensajeElements.slice(-7);


        const todosLlenos = mensajeSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;


        if (todosLlenos) {
            $('.MensajeInicial').text('');
        }

    }
    function NoCamposConErroresInicialAct() {
        const textDangerElements = $('.text-danger');
        const textDangerSlice = textDangerElements.slice(-7);
        const todoValido = textDangerSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;
        if (!todoValido) {
            $('.MensajeErrores').text('');
        }
        return true;
    }

});


/*---------------------------------------------------- Al dar click en el boton de agregar presentacion  ---------------------------------------------------- */
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
                const modalProducto = $('#ModalPresentacion');
                const botonAbrirModal = $('#botonabrirModalPresentacion');

                if (modalProducto.length === 0 || botonAbrirModal.length === 0) {
                    console.error('El modal o el botón para abrir el modal no se encontraron en el DOM.');
                    return;
                }
                if (modalProducto.hasClass('show')) {
                    modalProducto.modal('hide'); // Cerrar la modal
                } else {
                    botonAbrirModal.click();
                }
            }
        } catch (error) {
            console.error('Ocurrió un error al intentar abrir/cerrar la modal de producto:', error);
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

/*------------------------------ Limpiar formularios y url ---------------------------------------------------------------------------------------------------- */


function limpiarFormularioPresentacionAgregar() {
    history.replaceState(null, '', location.pathname);
    // Limpiar mensajes de alerta y *
    var mensajes = document.querySelectorAll('.Mensaje');
    var mensajesText = document.querySelectorAll('.text-danger');

    for (var i = 0; i < mensajes.length - 7; i++) {
        mensajes[i].textContent = '*';
    }
    for (var i = 0; i < mensajesText.length - 6; i++) {
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
    // Limpiar mensajes de alerta y *
    var mensajes = document.querySelectorAll('.Mensaje');
    var mensajesText = document.querySelectorAll('.text-danger');

    for (var i = Math.max(0, mensajes.length - 7); i < mensajes.length; i++) {
        mensajes[i].textContent = '';
    }
    for (var i = Math.max(0, mensajesText.length - 7); i < mensajesText.length; i++) {
        mensajesText[i].textContent = '';
    }

    document.querySelectorAll('.MensajeInicial').forEach(function (element) {
        element.textContent = '';
    });

}
function limpiarFormularioPresentacion() {
    limpiarFormularioPresentacionAgregar();
    limpiarFormularioPresentacionAct();
    history.replaceState(null, '', location.pathname);
    // Limpiar campos y elementos específicos
    limpiarCampo('NombreRol');
    limpiarCampo('RolId');
    limpiarCampo('Nombre');
    limpiarCampo('Apellido');
    limpiarCampo('Presentacion');
    limpiarCampo('Contraseña');
    limpiarCampo('RepetirContraseña');
    limpiarCampo('TelefonoPresentacion');
    limpiarCampo('CorreoPresentacion');

    // Limpiar campos y elementos específicos de la versión actualizada
    limpiarCampo('PresentacionIdAct');
    limpiarCampo('NombreRolAct');
    limpiarCampo('RolIdAct');
    limpiarCampo('NombreAct');
    limpiarCampo('ApellidoAct');
    limpiarCampo('ContraseñaAct');
    limpiarCampo('TelefonoPresentacionAct');
    limpiarCampo('CorreoPresentacionAct');

}


//Función para limpiar la url si el presentacion da fuera de ella 
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

/*--------------------------------------------------------- Modal de actualizar presentacion ---------------------------------------*/
function mostrarModalConRetrasoPresentacion(presentacionId) {
    limpiarFormularioPresentacionAct();
    actualizarPresentacion(presentacionId);
    setTimeout(function () {
        var myModal = new bootstrap.Modal(document.getElementById('ModalPresentacion'));
        myModal.show();
        // Aquí puedes llamar a la función actualizarProducto si es necesario
    }, 400); // 500 milisegundos (0.5 segundos) de retraso antes de abrir la modal

}
//Modal cuando se hace click en editar en el boton de detalle
function mostrarModalSinRetrasoPresentacion(presentacionId) {
    obtenerDatosPresentaciones();
    actualizarPresentacion(presentacionId);
    setTimeout(function () {
        limpiarFormularioPresentacionAct();
        var myModal = new bootstrap.Modal(document.getElementById('ModalPresentacion'));
        myModal.show();
        // Aquí puedes llamar a la función actualizarProducto si es necesario
    }, 50); // 50 milisegundos (0.05 segundos) de retraso antes de abrir la modal
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
            formActualizar.find('#NombreRolAct').val(data.rolId);
            formActualizar.find('#EstadoPresentacionAct').val(data.estadoPresentacion);
            formActualizar.find('#NombreAct').val(data.nombre);
            formActualizar.find('#PresentacionAct').val(data.presentacion1);
            formActualizar.find('#ContraseñaAct').val(data.contraseña);
            formActualizar.find('#ApellidoAct').val(data.apellido);
            formActualizar.find('#TelefonoPresentacionAct').val(data.telefono);
            formActualizar.find('#CorreoPresentacionAct').val(data.correo);
            formActualizar.find('#EstadoProductoAct').val(data.correo);
            seleccionarOpcion(document.getElementById('NombreRolAct'), document.getElementById('roles'), document.getElementById('RolIdAct'));
            limpiarFormularioPresentacionAct()
            obtenerDatosPresentaciones();
        },
        error: function () {
            alert('Error al obtener los datos del presentacion.');
        }
    });
    $('#FormPrincipalPresentacion').hide().css('visibility', 'hidden');
    $('#FormActualizarPresentacion').show().css('visibility', 'visible');
}


/*------------------- Cambiar estado usuaurio------------------------------------------*/
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



/*---------------------------------------------------------Buscador--------------------------------------------------------- */
function searchPresentacion() {
    var input = $('#buscarPresentacion').val().trim().toLowerCase();    //Obtiene el valor del buscadpor
    var rows = document.querySelectorAll('.presentacionesPaginado');    //Obtiene el tr de Presentacion Paginado.
    var rowsTodos = document.querySelectorAll('.Presentaciones');      //Obtiene el tr de Presentacion que esta en none
    var icon = document.querySelector('#btnNavbarSearch i');    //Obtiene el icino de buscar
    var contador = document.querySelector('.contador');        //Obtiene la columna que tiene el # 
    var contadores = document.querySelectorAll('.contadorB'); //Obtiene el contadorB que esta en none y lo hace visible para mostrar el consecutivo y el ID
    if (input === "") {
        rows.forEach(function (row) { //Esconde los presentaciones paginado
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
            var nombreR = row.querySelector('td:nth-child(3)').textContent.trim().toLowerCase();
            var nombreC = row.querySelector('td:nth-child(4)').textContent.trim().toLowerCase();
            var telefono = row.querySelector('td:nth-child(5)').textContent.trim().toLowerCase();
            var correo = row.querySelector('td:nth-child(6').textContent.trim().toLowerCase();

            row.style.display = (input === "" || presentacionId.includes(input) || nombreR.includes(input) || nombreC.includes(input) || telefono.includes(input) || correo.includes(input)) ? 'table-row' : 'none';
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

/*---------------------- Llama a la funcion en site.js  ---------------------------*/
function showNoRolesAlert() {
    showAlertIfNoOptions("roles", "No hay roles activos", "No hay roles disponibles en este momento.");
}

/*------------------------ Validaciones---------------*/

function validarCampoPresentacion(campo) {
    const input = $(campo); // Convertir el input a objeto jQuery
    var valor = input.val().trim(); // Obtener el valor del campo y eliminar espacios en blanco al inicio y al final
    var spanError = input.next('.text-danger'); // Obtener el elemento span de error asociado al input
    var spanVacio = input.prev('.Mensaje'); // Obtener el elemento span vacío asociado al input

    // Limpiar el mensaje de error previo
    spanError.text('');
    spanVacio.text('');

    // Validar el campo y mostrar mensaje de error si es necesario
    if (valor === '') {
        spanVacio.text('*');
        spanError.text('Este campo es obligatorio.');
    }

    if (input.is('#Nombre') || input.is('#Apellido') || input.is('#NombreAct') || input.is('#ApellidoAct')) {
        var campoNombre = input.is('#Nombre') ? $('#Nombre') : $('#NombreAct');
        var campoApellido = input.is('#Apellido') ? $('#Apellido') : $('#ApellidoAct');
        var spanErrorNombre = campoNombre.next('.text-danger');
        var spanErrorApellido = campoApellido.next('.text-danger');
        var valorNombre = campoNombre.val().trim();
        var valorApellido = campoApellido.val().trim();
        var spanVacioNombre = campoNombre.prev('.Mensaje');
        var spanVacioApellido = campoApellido.prev('.Mensaje');

        // Validaciones de nombre
        if (valorNombre === '') {
            spanErrorNombre.text('');
            spanVacioNombre.text('*');
            input.removeClass('is-invalid'); // Agregar la clase de Bootstrap para resaltar el campo vacío

        } else {
            if (valorNombre.length < 3) {
                spanErrorNombre.text('Este campo debe tener un mínimo de 3 caracteres.');
                spanVacioNombre.text('');
                input.addClass('is-invalid'); // Agregar la clase de Bootstrap para resaltar el campo vacío
            } else if (/^[a-zA-Z]+\s[a-zA-Z]+$/.test(valorNombre)) {
                spanErrorNombre.text('El nombre no puede contener números ni caracteres especiales (excepto espacios en nombres compuestos).');
                input.addClass('is-invalid'); // Agregar la clase de Bootstrap para resaltar el campo vacío
            } else {
                spanErrorNombre.text('');
                spanVacioNombre.text('');
                input.removeClass('is-invalid');
            }
        }

        // Validaciones de apellido
        if (valorApellido === '') {
            spanErrorApellido.text(' ');
            spanVacioApellido.text('*');
            input.removeClass('is-invalid'); // Agregar la clase de Bootstrap para resaltar el campo vacío
        } else if (valorApellido.length < 3) {
            spanErrorApellido.text('Este campo debe tener un mínimo de 3 caracteres.');
            spanVacioApellido.text('');
            input.addClass('is-invalid'); // Agregar la clase de Bootstrap para resaltar el campo vacío
        } else if (/^[a-zA-Z]+\s[a-zA-Z]+$/.test(valorApellido)) {
            spanErrorApellido.text('El apellido no puede contener números ni caracteres especiales (excepto espacios en apellidos compuestos).');
            spanVacioApellido.text('');
            input.addClass('is-invalid'); // Agregar la clase de Bootstrap para resaltar el campo vacío
        } else {
            spanErrorApellido.text('');
            spanVacioApellido.text('');
            input.removeClass('is-invalid'); // Agregar la clase de Bootstrap para resaltar el campo vacío

        }
    }

    // Validación de teléfono
    if (input.is('#TelefonoPresentacion') || input.is('#TelefonoPresentacionActU')) {
        var telefonoValido = /^\d{7,}$/.test(valor); // Permite al menos 6 dígitos

        if (valor === '') {
            spanError.text('');
            spanVacio.text('*');
            input.removeClass('is-invalid'); // Agregar la clase de Bootstrap para resaltar el campo vacío
        } else if (valor.length < 7 && valor.length > 0) {
            spanError.text('El teléfono debe tener mínimo 7 dígitos numéricos.');
            spanVacio.text('');
            input.addClass('is-invalid'); // Agregar la clase de Bootstrap para resaltar el campo vacío

        } else if (!telefonoValido) {
            spanError.text('Este campo no permite letras o espacios.');
            spanVacio.text('');
            input.addClass('is-invalid'); // Agregar la clase de Bootstrap para resaltar el campo vacío
        }
    }

    // Validación de correo electrónico
    if (input.is('#CorreoPresentacion') || input.is('#CorreoPresentacionAct')) {
        const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor); // Verifica el formato de correo electrónico
        if (valor === '') {
            spanError.text('Este campo es necesario. Si desea omitirlo, use: correo@gmail.com');
            spanVacio.text(' *');
        } else if (valor.toLowerCase() === 'correo@gmail.com') {
            spanError.text('');
            spanVacio.text('');
        } else if (!correoValido) {
            spanError.text('Ingrese un correo electrónico válido.');
            spanVacio.text('');
        }
    }

    // Validación de presentacion
    if (input.is('#Presentacion') || input.is('#PresentacionAct')) {
        const presentacionValido = /^[a-zA-Z]{3,}[a-zA-Z0-9_-]{0,16}$/.test(valor); // Verifica que el presentacion cumpla con el formato especificado
        if (valor === '') {
            spanVacio.text('*');
        } else if (valor.length < 4 && valor.length > 1) {
            spanVacio.text('');
            spanError.text('El presentacion debe contener entre 4 y 16 caracteres y empezar con letras. Ejemplo: juan123');
        } else if (!presentacionValido) {
            spanVacio.text('');
            spanError.text('El presentacion debe contener entre 4 y 16 caracteres alfanuméricos, guiones bajos (_) o guiones medios (-).');
        } else {
            spanError.text('');
            spanVacio.text('');
        }
    }

    // Validación de contraseña
    if (input.is('#Contraseña') || input.is('#ContraseñaAct')) {
        var spanErrorContraseña = $('#Contraseña').next('.text-danger'); // Obtén el elemento span correspondiente al campo Contraseña
        var spanErrorRepetir = $('#RepetirContraseña').next('.text-danger'); // Obtén el elemento span correspondiente al campo Repetir Contraseña
        var spanVacioContraseña = $('#Contraseña').prev('.text-danger'); // Obtén el elemento span correspondiente al campo Contraseña vacía
        var valorContraseña = $('#Contraseña').val(); // Obtén el valor del campo Contraseña
        const contraseñaValida = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/.test(valorContraseña); // Expresión regular actualizada

        if (valorContraseña === '') {
            spanErrorContraseña.text('');
            spanVacioContraseña.text('*');
        } else if (!contraseñaValida) {
            spanErrorContraseña.text('La contraseña debe contener al menos 5 caracteres, una letra mayúscula, una letra minúscula y un número.');
            spanVacioContraseña.text('');
        } else {
            spanErrorContraseña.text('');
            spanVacioContraseña.text('*');
        }

        var repetirContraseña = $('#RepetirContraseña').val(); // Obtén el valor del campo Repetir Contraseña

        if (repetirContraseña !== '') {
            if (repetirContraseña !== valorContraseña) {
                spanErrorRepetir.text('Las contraseñas no coinciden');
            } else {
                spanErrorRepetir.text('');
            }
        } else {
            spanErrorRepetir.text('');
        }
    }

    if (input.is('#RepetirContraseña')) {
        const contraseña = $('#Contraseña').val();
        const repetirContraseña = valor;

        if (contraseña !== repetirContraseña) {
            spanError.text('Las contraseñas no coinciden.');
            spanVacio.text('');
        } else {
            spanError.text('');
            spanVacio.text('');
        }
    }

    return true; // Devuelve el estado de validación al finalizar la función
}




/*Util*/
//$('.modal').on('click', function (e) {
//    if (e.target === this) {
//        limpiarFormulario(); // Limpia el formulario si se hace clic fuera de la modal
//        $(this).modal('hide'); // Oculta la modal
//    }
//});




