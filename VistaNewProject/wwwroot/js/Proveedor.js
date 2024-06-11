var proveedores = [];
function obtenerDatosProveedores() {
    fetch('/Proveedores/FindProveedores', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            proveedores = data;
        })
        .catch(error => console.error('Error al obtener los proveedores:', error));
}
// Función para comparar productos durante la creación
function compararProveedores(nuevoProveedor, proveedoresExistentes) {
    const nombreProveedorNormalizado = normalizar(nuevoProveedor.NombreEmpresa || '');
    const nombreContactoProveedorNormalizado = normalizar(nuevoProveedor.NombreContacto || '');
    const telefonoProveedor = nuevoProveedor.TelefonoProveedor || '';
    const correoProveedor = normalizar(nuevoProveedor.CorreoProveedor || '');
    const direccionProveedor = normalizar(nuevoProveedor.DireccionProveedor || '');

    const proveedoresDuplicados = [];
    const telefonosDuplicados = [];
    const correosDuplicados = [];
  
    proveedoresExistentes.forEach(proveedorExistente => {
        const nombreProveedorExistenteNormalizado = normalizar(proveedorExistente.nombreEmpresa || '');
        const nombreContactoProveedorExistenteNormalizado = normalizar(proveedorExistente.nombreContacto || '');
        const telefonoExistente = proveedorExistente.telefono || '';
        const correoExistente = normalizar(proveedorExistente.correo || '');
        const direccionProveedorExistente = normalizar(proveedorExistente.direccion || '');
        const correoDefault = normalizar('correo@gmail.com');
        if (
            nombreProveedorNormalizado === nombreProveedorExistenteNormalizado &&
            nombreContactoProveedorNormalizado === nombreContactoProveedorExistenteNormalizado &&
            telefonoProveedor && telefonoProveedor === telefonoExistente &&
            correoProveedor && correoProveedor === correoExistente && correoProveedor && correoProveedor != correoDefault &&
            direccionProveedor == direccionProveedorExistente

        ) {
            proveedoresDuplicados.push(proveedorExistente.proveedorId);
        }
        if (
            nombreProveedorExistenteNormalizado != nombreProveedorNormalizado &&
            telefonoExistente == telefonoProveedor
        ) {
            telefonosDuplicados.push(proveedorExistente.proveedorId);
        }
        if (
            nombreProveedorExistenteNormalizado != nombreProveedorNormalizado &&
            correoExistente == correoProveedor
        ) {
            correosDuplicados.push(proveedorExistente.proveedorId);
        }
  
    });

    if (proveedoresDuplicados.length > 0) {
        mostrarAlertaAtencionPersonalizadaConBoton(`Ya existe un proveedor registrado con los mismos datos, Proveedor ID: ${proveedoresDuplicados.join(', ')}`);
        return true; // Se encontraron coincidencias
    }
    if (telefonosDuplicados.length > 0) {
        mostrarAlertaAtencionPersonalizadaConBoton(`Ya existe un proveedor registrado con este telefono, Proveedor ID: ${telefonosDuplicados.join(', ')}`);
        return true; // Se encontraron coincidencias
    }
    if (correosDuplicados.length > 0) {
        mostrarAlertaAtencionPersonalizadaConBoton(`Ya existe un proveedor registrado con este correo, Proveedor ID: ${correosDuplicados.join(', ')}`);
        return true; // Se encontraron coincidencias
    }


    return false; // No se encontraron coincidencias
}

// Función para comparar productos durante la actualización
function compararProveedoresAct(nuevoProveedor, proveedoresExistentes) {
    const nombreProveedorNormalizado = normalizar(nuevoProveedor.NombreEmpresaAct || '');
    const nombreContactoProveedorNormalizado = normalizar(nuevoProveedor.NombreContactoAct || '');
    const telefonoProveedor = nuevoProveedor.TelefonoProveedorAct || '';
    const correoProveedor = normalizar(nuevoProveedor.CorreoProveedorAct || '');
    const direccionProveedor = normalizar(nuevoProveedor.DireccionProveedorAct || '');

    const proveedoresDuplicados = [];
    const telefonosDuplicados = [];
    const correosDuplicados = [];

    proveedoresExistentes.forEach(proveedorExistente => {
        const nombreProveedorExistenteNormalizado = normalizar(proveedorExistente.nombreEmpresa || '');
        const nombreContactoProveedorExistenteNormalizado = normalizar(proveedorExistente.nombreContacto || '');
        const telefonoExistente = proveedorExistente.telefono || '';
        const correoExistente = normalizar(proveedorExistente.correo || '');
        const direccionProveedorExistente = normalizar(proveedorExistente.direccion || '');
        const correoDefault = normalizar('correo@gmail.com');
        if (
            nombreProveedorNormalizado === nombreProveedorExistenteNormalizado &&
            nombreContactoProveedorNormalizado === nombreContactoProveedorExistenteNormalizado &&
            telefonoProveedor && telefonoProveedor === telefonoExistente &&
            correoProveedor && correoProveedor === correoExistente && correoProveedor && correoProveedor != correoDefault &&
            direccionProveedor == direccionProveedorExistente

        ) {
            if (nuevoProveedor.ProveedorIdAct == proveedorExistente.proveedorId) {
                return false;
            } else {
                proveedoresDuplicados.push(proveedorExistente.proveedorId);
            }
        }
        if (
            nombreProveedorExistenteNormalizado != nombreProveedorNormalizado &&
            telefonoExistente == telefonoProveedor
        ) {
            if (nuevoProveedor.ProveedorIdAct == proveedorExistente.proveedorId) {
                return false;
            } else {
                telefonosDuplicados.push(proveedorExistente.proveedorId);
            }
        }
        if (
            nombreProveedorExistenteNormalizado != nombreProveedorNormalizado &&
            correoExistente == correoProveedor
        ) {
            if (nuevoProveedor.ProveedorIdAct == proveedorExistente.proveedorId) {
                return false;
            } else {
                correosDuplicados.push(proveedorExistente.proveedorId);
            }
        }

    });

    if (proveedoresDuplicados.length > 0) {
        mostrarAlertaAtencionPersonalizadaConBoton(`Ya existe un proveedor registrado con los mismos datos, Proveedor ID: ${proveedoresDuplicados.join(', ')}`);
        return true; // Se encontraron coincidencias
    }
    if (telefonosDuplicados.length > 0) {
        mostrarAlertaAtencionPersonalizadaConBoton(`Ya existe un proveedor registrado con este telefono, Proveedor ID: ${telefonosDuplicados.join(', ')}`);
        return true; // Se encontraron coincidencias
    }
    if (correosDuplicados.length > 0) {
        mostrarAlertaAtencionPersonalizadaConBoton(`Ya existe un proveedor registrado con este correo, Proveedor ID: ${correosDuplicados.join(', ')}`);
        return true; // Se encontraron coincidencias
    }


    return false; // No se encontraron coincidencias
}

function mostrarValoresFormularioInicialProveedor() {
    const idsCrear = [
        'NombreContacto',
        'NombreEmpresa',
        'TelefonoProveedor',
        'CorreoProveedor',
        'DireccionProveedor'
    ];
    const valoresCrear = obtenerValoresFormulario(idsCrear);
    return valoresCrear;
}

function mostrarValoresFormularioProveedorAct() {
    const idsActualizar = [
        'ProveedorIdAct',
        'NombreContactoAct',
        'NombreEmpresaAct',
        'TelefonoProveedorAct',
        'CorreoProveedorAct',
        'DireccionProveedorAct'
    ];
    const valoresActualizar = obtenerValoresFormulario(idsActualizar);
    return valoresActualizar;
}

/*------------------------------------- Al cargar la vista ------------------------------------------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const mostrarAlertaCampoVacio = urlParams.get('mostrarAlertaCampoVacio');
    const proveedorId = urlParams.get('proveedorId');

    if (mostrarAlertaCampoVacio === 'true' && proveedorId) {
        mostrarModalSinRetrasoProveedor(proveedorId);
    }
    //Evitar el envio de los formularios hasta que todo este validados
    $('.modal-formulario-crear-proveedor').on('submit', function (event) {

        const proveedorFinal = mostrarValoresFormularioInicialProveedor();
        const proveedoresAll = proveedores;
        const proveedorRepetido = compararProveedores(proveedorFinal, proveedoresAll);

        const campos = [
            { id: 'NombreContacto', nombre: 'Nombre contacto' },
            { id: 'NombreEmpresa', nombre: 'Nombre empresa' },
            { id: 'TelefonoProveedor', nombre: 'Telefono' },
            { id: 'CorreoProveedor', nombre: 'Correo' },
            { id: 'DireccionProveedor', nombre: 'Direccion' }
        ];
        console.log(proveedorFinal,proveedoresAll);
        const camposVacios = verificarCampos(campos, mostrarAlertaCampoVacio);
        if (!NoCamposVacios()) {
            event.preventDefault();
            return;
        }

        if (!NoCamposConErrores()) {
            event.preventDefault();
            return;
        }

        if (proveedorRepetido) {
            event.preventDefault();
            return;
        }

        if (!camposVacios) {
            event.preventDefault();
            return;
        }

        
    });
    $('.modal-formulario-actualizar-proveedor').on('submit', function (event) {
        const proveedorFinal = mostrarValoresFormularioProveedorAct();
        const proveedoresAll = proveedores;
        const proveedorRepetido = compararProveedoresAct(proveedorFinal, proveedoresAll);

        const campos = [
            { id: 'NombreContactoAct', nombre: 'Nombre contacto' },
            { id: 'NombreEmpresaAct', nombre: 'Nombre empresa' },
            { id: 'TelefonoProveedorAct', nombre: 'Telefono' },
            { id: 'CorreoProveedorAct', nombre: 'Correo' },
            { id: 'DireccionProveedorAct', nombre: 'Direccion' }
        ];

        const camposVacios = verificarCampos(campos, mostrarAlertaCampoVacio);
        if (!NoCamposVaciosAct()) {
            event.preventDefault();
            return;
        }

        if (!NoCamposConErroresAct()) {
            event.preventDefault();
            return;
        }

        if (proveedorRepetido) {
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
    $('.eliminarProveedor').on('submit', function (event) {
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
                // Si el proveedor confirma, enviar el formulario
                event.target.submit();
            }
        });
    });

    // Validar campos en cada cambio para cambiar el mensaje inicial que aparece arriba de los botones del formulario
    $('.modal-formulario-crear-proveedor input, .modal-formulario-crear-proveedor select').on('input', function () {
        NoCamposVaciosInicial();
        NoCamposConErroresInicial();
    });
    $('.modal-formulario-actualizar-proveedor input, .modal-formulario-actualizar-proveedor select').on('input', function () {
        NoCamposVaciosInicialAct();
        NoCamposConErroresInicialAct();

    });

    //Este elimina el mensaje inicial u lo agrega de ser necesario el que aparece sobre los botones
    function NoCamposVacios() {
        const mensajeElements = $('.Mensaje');
        const mensajeSlice = mensajeElements.slice(0, 5);
        const camposConTexto = mensajeSlice.filter(function () {
            return $(this).text().trim() !== ''; // Utilizamos trim() para eliminar espacios en blanco al principio y al final del texto.
        }).length;

        console.log('Número de campos sin texto:', camposConTexto);

        if (camposConTexto === 5) { // Cambiamos la condición para verificar si hay campos sin texto.
            mostrarAlertaAtencionPersonalizadaConBoton('Completa todos los campos con *');
            $('.MensajeInicial').text('Por favor, complete los campos con *.');
            return false;
        }
        if (camposConTexto > 1 && camposConTexto < 5) { // Cambiamos la condición para verificar si hay campos sin texto.
            mostrarAlertaAtencionPersonalizadaConBoton('Completa los campos con *');
            $('.MensajeInicial').text('Por favor, complete los campos con *.');
            return false;
        }
        if (camposConTexto === 1) { // Cambiamos la condición para verificar si hay campos sin texto.
            $('.MensajeInicial').text('Por favor, complete el campo con *.');
            return false;
        }

        return true;
    }
    function NoCamposConErrores() {
        const textDangerElements = $('.text-danger');
        const textDangerSlice = textDangerElements.slice(0, 5);
        const camposConTexto = textDangerSlice.filter(function () {
            return $(this).text().trim() !== ''; // Utilizamos trim() para eliminar espacios en blanco al principio y al final del texto.
        }).length;

        if (camposConTexto === 5) { // Cambiamos la condición para verificar si hay campos sin texto.
            mostrarAlertaAtencionPersonalizadaConBoton('Complete correctamente todos los campos');
            $('.MensajeErrores').text('Todos los campos son invalidos.');
            return false;
        }
        if (camposConTexto > 1 && camposConTexto < 5) {
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

    function NoCamposVaciosAct() {
        const mensajeElements = $('.Mensaje');
        const mensajeSlice = mensajeElements.slice(-5);
        const camposConTexto = mensajeSlice.filter(function () {
            return $(this).text().trim() !== ''; // Utilizamos trim() para eliminar espacios en blanco al principio y al final del texto.
        }).length;

        if (camposConTexto === 7) { // Cambiamos la condición para verificar si hay campos sin texto.
            mostrarAlertaAtencionPersonalizadaConBoton('Completa todos los campos con *');
            $('.MensajeInicial').text('Por favor, complete los campos con *.');
            return false;
        }
        if (camposConTexto > 1 && camposConTexto < 7) { // Cambiamos la condición para verificar si hay campos sin texto.
            mostrarAlertaAtencionPersonalizadaConBoton('Completa los campos con *');
            $('.MensajeInicial').text('Por favor, complete los campos con *.');
            return false;
        }
        if (camposConTexto === 1) { // Cambiamos la condición para verificar si hay campos sin texto.
            $('.MensajeInicial').text('Por favor, complete el campo con *.');
            return false;
        }

        return true;
    }
    function NoCamposConErroresAct() {
        const textDangerElements = $('.text-danger');
        const textDangerSlice = textDangerElements.slice(-5);
        const camposConTexto = textDangerSlice.filter(function () {
            return $(this).text().trim() !== ''; // Utilizamos trim() para eliminar espacios en blanco al principio y al final del texto.
        }).length;

        if (camposConTexto === 7) { // Cambiamos la condición para verificar si hay campos sin texto.
            mostrarAlertaAtencionPersonalizadaConBoton('Complete correctamente todos los campos');
            $('.MensajeErrores').text('Todos los campos son invalidos.');
            return false;
        }
        if (camposConTexto > 1 && camposConTexto < 7) {
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
    function NoCamposVaciosInicial() {
        const mensajeElements = $('.Mensaje');

        const mensajeSlice = mensajeElements.slice(0, 5);


        const todosLlenos = mensajeSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;


        if (todosLlenos) {
            $('.MensajeInicial').text('');
        }

    }
    function NoCamposConErroresInicial() {
        const textDangerElements = $('.text-danger');
        const textDangerSlice = textDangerElements.slice(0, 5);
        const todoValido = textDangerSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;
        if (todoValido) {
            $('.MensajeErrores').text('');
        }
        return true;
    }

    function NoCamposVaciosInicialAct() {
        const mensajeElements = $('.Mensaje');

        const mensajeSlice = mensajeElements.slice(-5);


        const todosLlenos = mensajeSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;


        if (todosLlenos) {
            $('.MensajeInicial').text('');
        }

    }
    function NoCamposConErroresInicialAct() {
        const textDangerElements = $('.text-danger');
        const textDangerSlice = textDangerElements.slice(-5);
        const todoValido = textDangerSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;
        if (!todoValido) {
            $('.MensajeErrores').text('');
        }
        return true;
    }

});


/*---------------------------------------------------- Al dar click en el boton de agregar proveedor  ---------------------------------------------------- */
function simularClickProveedor() {
    //ocultar formulario de actualizar  y mostrar el formulario principal
    $('#FormActualizarProveedor').hide();
    $('#FormPrincipalProveedor').show().css('visibility', 'visible');
    obtenerDatosProveedores();
}

/*--------------------Atajo para abrir modal -------------------------------*/
document.addEventListener('keydown', function (event) {
    if (event.ctrlKey && event.key === 'm') {
        try {
            if (esURLValida('Proveedores')) {
                const modalProducto = $('#ModalProveedor');
                const botonAbrirModal = $('#botonabrirModalProveedor');

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


function abrirModalProveedor() {
    // Verificar si la modal está abierta
    if ($('#ModalProveedor').hasClass('show')) {
        $('#ModalProveedor').modal('hide'); // Cerrar la modal
    } else {
        simularClickProveedor(); // Simular algún evento antes de abrir la modal
        $('#ModalProveedor').modal('show'); // Abrir la modal
    }
}

/*------------------------------ Limpiar formularios y url ---------------------------------------------------------------------------------------------------- */


function limpiarFormularioProveedorAgregar() {
    history.replaceState(null, '', location.pathname);
    // Limpiar mensajes de alerta y *
    var mensajes = document.querySelectorAll('.Mensaje');
    var mensajesText = document.querySelectorAll('.text-danger');

    for (var i = 0; i < mensajes.length - 5; i++) {
        mensajes[i].textContent = '*';
    }
    for (var i = 0; i < mensajesText.length - 5; i++) {
        mensajesText[i].textContent = '';
    }
    $('.MensajeInicial').text('');
    $('.MensajeErrores').text('');
}
function limpiarFormularioProveedorAct() {
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

    for (var i = Math.max(0, mensajes.length - 5); i < mensajes.length; i++) {
        mensajes[i].textContent = '';
    }
    for (var i = Math.max(0, mensajesText.length - 5); i < mensajesText.length; i++) {
        mensajesText[i].textContent = '';
    }

    $('.MensajeInicial').text('');
    $('.MensajeErrores').text('');

}
function limpiarFormularioProveedor() {
    limpiarFormularioProveedorAgregar();
    limpiarFormularioProveedorAct();
    history.replaceState(null, '', location.pathname);
    // Limpiar campos y elementos específicos
    limpiarCampo('NombreEmpresa');
    limpiarCampo('NombreContacto');
    limpiarCampo('TelefonoProveedor');
    limpiarCampo('CorreoProveedor');
    limpiarCampo('DireccionProveedor');
    

    // Limpiar campos y elementos específicos de la versión actualizada
    limpiarCampo('NombreEmpresaAct');
    limpiarCampo('NombreContactoAct');
    limpiarCampo('TelefonoProveedorAct');
    limpiarCampo('CorreoProveedorAct');
    limpiarCampo('DireccionProveedorAct');

}


//Función para limpiar la url si el proveedor da fuera de ella 
$('.modal').on('click', function (e) {
    if (e.target === this) {
        // Limpiar la URL eliminando los parámetros de consulta
        history.replaceState(null, '', location.pathname);
        $(this).modal('hide'); // Oculta la modal
    }
});

function AlPerderFocoProveedor() {
    var displayFormActualizar = $('#FormActualizarProveedor').css('display');
    var displayModal = $('#ModalProveedor').css('display');
    if (displayFormActualizar == "block" && displayModal == "none") {
        limpiarFormularioProveedorAct();
    }
}

/*--------------------------------------------------------- Modal de actualizar proveedor ---------------------------------------*/
function mostrarModalConRetrasoProveedor(proveedorId) {
    limpiarFormularioProveedorAct();
    actualizarProveedor(proveedorId);
    setTimeout(function () {
        var myModal = new bootstrap.Modal(document.getElementById('ModalProveedor'));
        obtenerDatosProveedores();
        myModal.show();
        // Aquí puedes llamar a la función actualizarProducto si es necesario
    }, 400); // 500 milisegundos (0.5 segundos) de retraso antes de abrir la modal

}
//Modal cuando se hace click en editar en el boton de detalle
function mostrarModalSinRetrasoProveedor(proveedorId) {
    actualizarProveedor(proveedorId);
    setTimeout(function () {
        limpiarFormularioProveedorAct();
        obtenerDatosProveedores();
        var myModal = new bootstrap.Modal(document.getElementById('ModalProveedor'));
        myModal.show();
        // Aquí puedes llamar a la función actualizarProducto si es necesario
    }, 50); // 50 milisegundos (0.05 segundos) de retraso antes de abrir la modal
}

function actualizarProveedor(campo) {
    var proveedorId = campo;
    $.ajax({
        url: '/Proveedores/FindProveedor', // Ruta relativa al controlador y la acción
        type: 'POST',
        data: { proveedorId: proveedorId },
        success: function (data) {
            var formActualizar = $('#FormActualizarProveedor');
            formActualizar.find('#ProveedorIdAct').val(data.proveedorId);
            formActualizar.find('#NombreEmpresaAct').val(data.nombreEmpresa);
            formActualizar.find('#NombreContactoAct').val(data.nombreContacto);
            formActualizar.find('#TelefonoProveedorAct').val(data.telefono);
            formActualizar.find('#CorreoProveedorAct').val(data.correo);
            formActualizar.find('#DireccionProveedorAct').val(data.direccion);
            formActualizar.find('#EstadoProveedorAct').val(data.estadoProveedor);
            limpiarFormularioProveedorAct()
            obtenerDatosProveedores();
        },
        error: function () {
            alert('Error al obtener los datos del proveedor.');
        }
    });
    $('#FormPrincipalProveedor').hide().css('visibility', 'hidden');
    $('#FormActualizarProveedor').show().css('visibility', 'visible');
}


/*------------------- Cambiar estado usuaurio------------------------------------------*/
function actualizarEstadoProveedor(ProveedorId) {
    $.ajax({
        url: `/Proveedores/UpdateEstadoProveedor/${ProveedorId}`,
        type: 'PATCH',
        contentType: 'application/json',
        success: function (response) {
            // Mostrar SweetAlert
            Swal.fire({
                icon: 'success',
                title: '\u00A1Estado actualizado!',
                showConfirmButton: false,
                timer: 1500 // Duración del SweetAlert en milisegundos
            }).then(() => {
                location.reload(); // Recargar la página después de que la alerta haya terminado
            });
        },
        error: function (xhr, status, error) {
            console.error('Error al actualizar el estado del proveedor:', xhr.responseText);
            // Mostrar SweetAlert de error si es necesario
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al actualizar el estado del proveedor. Por favor, inténtalo de nuevo.'
            });
        }
    });
}



/*---------------------------------------------------------Buscador--------------------------------------------------------- */
function searchProveedor() {
    var input = $('#buscarProveedor').val().trim().toLowerCase();    //Obtiene el valor del buscadpor
    var rows = document.querySelectorAll('.proveedoresPaginado');    //Obtiene el tr de Proveedor Paginado.
    var rowsTodos = document.querySelectorAll('.Proveedores');      //Obtiene el tr de Proveedor que esta en none
    var icon = document.querySelector('#btnNavbarSearch i');    //Obtiene el icino de buscar
    var contador = document.querySelector('.contador');        //Obtiene la columna que tiene el # 
    var contadores = document.querySelectorAll('.contadorB'); //Obtiene el contadorB que esta en none y lo hace visible para mostrar el consecutivo y el ID
    var paginationContainer = document.getElementById('paginationContainer');
    if (input === "") {
        rows.forEach(function (row) { //Esconde los proveedores paginado
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
            var proveedorId = row.querySelector('td:nth-child(2)').textContent.trim().toLowerCase();
            var nombreR = row.querySelector('td:nth-child(3)').textContent.trim().toLowerCase();
            var nombreC = row.querySelector('td:nth-child(4)').textContent.trim().toLowerCase();
            var telefono = row.querySelector('td:nth-child(5)').textContent.trim().toLowerCase();
            var correo = row.querySelector('td:nth-child(6').textContent.trim().toLowerCase();

            row.style.display = (input === "" || proveedorId.includes(input) || nombreR.includes(input) || nombreC.includes(input) || telefono.includes(input) || correo.includes(input)) ? 'table-row' : 'none';
        }
    });
}

function vaciarInputProveedor() {
    var paginationContainer = document.getElementById('paginationContainer');
    document.getElementById('buscarProveedor').value = "";
    var icon = document.querySelector('#btnNavbarSearch i');
    icon.className = 'fas fa-search';
    icon.style.color = 'white';

    var contador = document.querySelector('.contador');
    contador.innerText = '#';
    var contadores = document.querySelectorAll('.contadorB');
    contadores.forEach(function (contador) {
        contador.classList.add('noIs'); // Removemos la clase 'noIs'
    });

    var rows = document.querySelectorAll('.proveedoresPaginado');
    rows.forEach(function (row) {
        row.style.display = 'table-row';
    });

    var rowsTodos = document.querySelectorAll('.Proveedores');

    rowsTodos.forEach(function (row) {
        row.style.display = 'none';
    });
    paginationContainer.classList.remove('noBe'); // Oculta el contenedor de paginación

}

/*------------------------ Validaciones---------------*/

function validarCampoProveedor(input) {
    const inputElement = $(input); // Convertir el input a objeto jQuery
    const campo = inputElement.attr('id'); // Obtener el id del input actual como nombre de campo
    const valor = inputElement.val().trim(); // Obtener el valor del campo y eliminar espacios en blanco al inicio y al final
    const spanError = inputElement.next('.text-danger'); // Obtener el elemento span de error asociado al input
    const labelForCampo = $('label[for="' + campo + '"]');
    const spanVacio = labelForCampo.find('.Mensaje');

    console.log('Oaku');
    // Limpiar el mensaje de error previo
    spanError.text('');
    spanVacio.text('');

    // Validar el campo y mostrar mensaje de error si es necesario
    if (valor === '') {
        spanVacio.text('*');
        spanError.text('');
    }

    
    // Validación de correo electrónico
    if (inputElement.is('#CorreoProveedor') || inputElement.is('#CorreoProveedorAct')) {
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


    return true; // Devuelve el estado de validación al finalizar la función
}




/*Util*/
//$('.modal').on('click', function (e) {
//    if (e.target === this) {
//        limpiarFormulario(); // Limpia el formulario si se hace clic fuera de la modal
//        $(this).modal('hide'); // Oculta la modal
//    }
//});




