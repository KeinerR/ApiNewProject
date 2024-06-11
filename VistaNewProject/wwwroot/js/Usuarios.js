var usuarios = []; 
function obtenerDatosUsuarios() {
    fetch('/Usuarios/FindUsuarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            usuarios = data;
        })
        .catch(error => console.error('Error al obtener los usuarios:', error));
}
// Función para comparar productos durante la creación
function compararUsuarios(nuevoUsuario, usuariosExistentes) {
    const nombreUsuarioNormalizado = normalizar(nuevoUsuario.Nombre || '');
    const apellidoUsuarioNormalizado = normalizar(nuevoUsuario.Apellido || '');
    const telefonoUsuario = nuevoUsuario.TelefonoUsuario || '';
    const correoUsuario = normalizar(nuevoUsuario.CorreoUsuario || '');
    const usuarioAcesso = normalizar(nuevoUsuario.Usuario || '');

    const usuariosDuplicados = [];
    const telefonoDuplicado = [];
    const correoDuplicado = [];
    const usuarioDuplicado = [];

    usuariosExistentes.forEach(usuarioExistente => {
        const nombreUsuarioExistenteNormalizado = normalizar(usuarioExistente.nombre || '');
        const apellidoUsuarioExistenteNormalizado = normalizar(usuarioExistente.apellido || '');
        const telefonoExistente = usuarioExistente.telefono || '';
        const correoExistente = normalizar(usuarioExistente.correo || '');
        const usuarioAcessoExistente = normalizar(usuarioExistente.usuario1 || '');
        const correoDefault = normalizar('correo@gmail.com');
        if (
            nombreUsuarioNormalizado === nombreUsuarioExistenteNormalizado &&
            apellidoUsuarioNormalizado === apellidoUsuarioExistenteNormalizado
        ) {
            usuariosDuplicados.push(usuarioExistente.usuarioId);
        }
        if (telefonoUsuario && telefonoUsuario === telefonoExistente) {
            telefonoDuplicado.push(usuarioExistente.usuarioId);
        }
        if (correoUsuario && correoUsuario === correoExistente && correoUsuario && correoUsuario != correoDefault) {
            correoDuplicado.push(usuarioExistente.usuarioId);
        }
        if (usuarioAcesso && usuarioAcesso === usuarioAcessoExistente) {
            usuarioDuplicado.push(usuarioExistente.usuarioId);
        }
    });

    if (usuariosDuplicados.length > 0) {
        mostrarAlertaAtencionPersonalizadaConBoton(`Ya existe un usuario registrado con los mismos nombre y apellido, Usuario ID: ${usuariosDuplicados.join(', ')}`);
        return true; // Se encontraron coincidencias
    }
    if (telefonoDuplicado.length > 0) {
        mostrarAlertaAtencionPersonalizadaConBoton(`Ya existe un usuario registrado con el número de teléfono, Usuario ID: ${telefonoDuplicado.join(', ')}`);
        return true; // Se encontraron coincidencias
    }
    if (correoDuplicado.length > 0) {
        mostrarAlertaAtencionPersonalizadaConBoton(`Ya existe un usuario registrado con el correo electrónico, Usuario ID: ${correoDuplicado.join(', ')}`);
        return true; // Se encontraron coincidencias
    }
    if (usuarioDuplicado.length > 0) {
        mostrarAlertaAtencionPersonalizadaConBoton(`Ya existe un usuario registrado con el nombre de usuario, Usuario ID: ${usuarioDuplicado.join(', ')}`);
        return true; // Se encontraron coincidencias
    }

    return false; // No se encontraron coincidencias
}

// Función para comparar productos durante la actualización
function compararUsuariosAct(nuevoUsuario, usuariosExistentes) {
    const nombreUsuarioNormalizado = normalizar(nuevoUsuario.NombreAct || '');
    const apellidoUsuarioNormalizado = normalizar(nuevoUsuario.ApellidoAct || '');
    const telefonoUsuario = nuevoUsuario.TelefonoUsuarioAct || '';
    const correoUsuario = normalizar(nuevoUsuario.CorreoUsuarioAct || '');
    const usuarioAcesso = normalizar(nuevoUsuario.UsuarioAct || '');

    const usuariosDuplicados = [];
    const telefonoDuplicado = [];
    const correoDuplicado = [];
    const usuarioDuplicado = [];

    usuariosExistentes.forEach(usuarioExistente => {
        const nombreUsuarioExistenteNormalizado = normalizar(usuarioExistente.nombre || '');
        const apellidoUsuarioExistenteNormalizado = normalizar(usuarioExistente.apellido || '');
        const telefonoExistente = usuarioExistente.telefono || '';
        const correoExistente = normalizar(usuarioExistente.correo || '');
        const usuarioAcessoExistente = normalizar(usuarioExistente.usuario1 || '');
        const correoDefault = normalizar('correo@gmail.com');
        if (nombreUsuarioNormalizado === nombreUsuarioExistenteNormalizado &&
            apellidoUsuarioNormalizado === apellidoUsuarioExistenteNormalizado
        ) {
            if (usuarioExistente.usuarioId == nuevoUsuario.UsuarioIdAct) {
                return false; // No es un duplicado si es el mismo usuario
            } else {
                usuariosDuplicados.push(usuarioExistente.usuarioId);
            }
        }

        if (telefonoUsuario && telefonoUsuario === telefonoExistente) {
            if (usuarioExistente.usuarioId == nuevoUsuario.UsuarioIdAct) {
                return false; // No es un duplicado si es el mismo usuario
            } else {
                telefonoDuplicado.push(usuarioExistente.usuarioId);
            }
        }

        if (correoUsuario && correoUsuario === correoExistente && correoUsuario !== correoDefault) {
            if (usuarioExistente.usuarioId == nuevoUsuario.UsuarioIdAct) {
                return false; // No es un duplicado si es el mismo usuario
            } else {
                correoDuplicado.push(usuarioExistente.usuarioId);
            }
        }

        if (usuarioAcesso && usuarioAcesso === usuarioAcessoExistente) {
            if (usuarioExistente.usuarioId == nuevoUsuario.UsuarioIdAct) {
                return false; // No es un duplicado si es el mismo usuario
            } else {
                usuarioDuplicado.push(usuarioExistente.usuarioId);
            }
        }
    });

    if (usuariosDuplicados.length > 0) {
        mostrarAlertaAtencionPersonalizadaConBoton(`Ya existe un usuario registrado con los mismos nombre y apellido, Usuario ID: ${usuariosDuplicados.join(', ')}`);
        return true; // Se encontraron coincidencias
    }
    if (telefonoDuplicado.length > 0) {
        mostrarAlertaAtencionPersonalizadaConBoton(`Ya existe un usuario registrado con el número de teléfono, Usuario ID: ${telefonoDuplicado.join(', ')}`);
        return true; // Se encontraron coincidencias
    }
    if (correoDuplicado.length > 0) {
        mostrarAlertaAtencionPersonalizadaConBoton(`Ya existe un usuario registrado con el correo electrónico, Usuario ID: ${correoDuplicado.join(', ')}`);
        return true; // Se encontraron coincidencias
    }
    if (usuarioDuplicado.length > 0) {
        mostrarAlertaAtencionPersonalizadaConBoton(`Ya existe un usuario registrado con el nombre de usuario, Usuario ID: ${usuarioDuplicado.join(', ')}`);
        return true; // Se encontraron coincidencias
    }

    return false; // No se encontraron coincidencias
}

function mostrarValoresFormularioInicialUsuario() {
    const idsCrear = [
        'RolId',
        'Nombre',   
        'Apellido',
        'Usuario',
        'TelefonoUsuario',
        'CorreoUsuario'
    ];
    const valoresCrear = obtenerValoresFormulario(idsCrear);
    return valoresCrear;
}

function mostrarValoresFormularioUsuarioAct() {
    const idsActualizar = [
        'UsuarioIdAct',
        'RolIdAct',
        'NombreAct',
        'ApellidoAct',
        'UsuarioAct',
        'TelefonoUsuarioAct',
        'CorreoUsuarioAct'
    ];
    const valoresActualizar = obtenerValoresFormulario(idsActualizar);
    return valoresActualizar;
}

/*------------------------------------- Al cargar la vista ------------------------------------------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const mostrarAlertaCampoVacio = urlParams.get('mostrarAlertaCampoVacio');
    const usuarioId = urlParams.get('usuarioId');

    if (mostrarAlertaCampoVacio === 'true' && usuarioId) {
        mostrarModalSinRetrasoUsuario(usuarioId);
    }
    //Evitar el envio de los formularios hasta que todo este validados
    $('.modal-formulario-crear-usuario').on('submit', function (event) {
        const usuarioFinal = mostrarValoresFormularioInicialUsuario();
        const usuariosAll = usuarios;
        const usuarioRepetido = compararUsuarios(usuarioFinal, usuariosAll);

        const campos = [
            { id: 'NombreRol', nombre: 'Rol' },
            { id: 'Nombre', nombre: 'Nombre' },
            { id: 'Apellido', nombre: 'Apellido' },
            { id: 'Usuario', nombre: 'Usuario' },
            { id: 'Contraseña', nombre: 'Contraseña' },
            { id: 'RepetirContraseña', nombre: 'Repetir contraseña' },
            { id: 'TelefonoUsuario', nombre: 'Telefono' },
            { id: 'CorreoUsuario', nombre: 'Correo' }
        ];

        const camposVacios = verificarCampos(campos, mostrarAlertaCampoVacio);
        if (!NoCamposVacios()) {
            event.preventDefault();
            return;
        }

        if (!NoCamposConErrores()) {
            event.preventDefault();
            return;
        }

        if (usuarioRepetido) {
            event.preventDefault();
            return;
        }

        if (!camposVacios) {
            event.preventDefault();
            return;
        }

        const datalist = [
            { id: 'RolId', nombre: 'Rol' }
        ];

        if (!verificarCampos(datalist, mostrarAlertaDataList)) {
            event.preventDefault();
            return;
        }
    });
    $('.modal-formulario-actualizar-usuario').on('submit', function (event) {
        const usuarioFinal = mostrarValoresFormularioUsuarioAct();
        const usuariosAll = usuarios;
        const usuarioRepetido = compararUsuariosAct(usuarioFinal, usuariosAll);

        const campos = [
            { id: 'NombreRolAct', nombre: 'Rol' },
            { id: 'NombreAct', nombre: 'Nombre' },
            { id: 'ApellidoAct', nombre: 'Apellido' },
            { id: 'UsuarioAct', nombre: 'Usuario' },
            { id: 'ContraseñaAct', nombre: 'Contraseña' },
            { id: 'TelefonoUsuarioAct', nombre: 'Telefono' },
            { id: 'CorreoUsuarioAct', nombre: 'Correo' }
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

        if (usuarioRepetido) {
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
    $('.eliminarUsuario').on('submit', function (event) {
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
    $('.modal-formulario-crear-usuario input, .modal-formulario-crear-usuario select').on('input', function () {
        NoCamposVaciosInicial();
        NoCamposConErroresInicial();
    });
        $('.modal-formulario-actualizar-usuario input, .modal-formulario-actualizar-usuario select').on('input', function () {
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
            mostrarAlertaAtencionPersonalizadaConBoton('Completa todos los campos con *');
            $('.MensajeInicial').text('Por favor, complete los campos con *.');
            return false;
        }
        if (camposConTexto > 1 && camposConTexto < 8) { // Cambiamos la condición para verificar si hay campos sin texto.
            mostrarAlertaAtencionPersonalizadaConBoton('Completa los campos con *');
            $('.MensajeInicial').text('Por favor, complete los campos con *.');
            return false;
        }
        if (camposConTexto === 1) { // Cambiamos la condición para verificar si hay campos sin texto.
            mostrarAlertaAtencionPersonalizadaConBoton('Completa el campo con *');
            $('.MensajeInicial').text('Por favor, complete el campo con *.');
            return false;
        }

        return true;
    } 
    function NoCamposConErrores() {
        const textDangerElements = $('.text-danger');
        const textDangerSlice = textDangerElements.slice(0, 8);
        const camposConTexto = textDangerSlice.filter(function () {
            return $(this).text().trim() !== ''; // Utilizamos trim() para eliminar espacios en blanco al principio y al final del texto.
        }).length;

        if (camposConTexto === 8) { // Cambiamos la condición para verificar si hay campos sin texto.
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

    function NoCamposVaciosAct() {
        const mensajeElements = $('.Mensaje');
        const mensajeSlice = mensajeElements.slice(-7);
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
            mostrarAlertaAtencionPersonalizadaConBoton('Completa el campo con *');
            $('.MensajeInicial').text('Por favor, complete el campo con *.');
            return false;
        }

        return true;
    }
    function NoCamposConErroresAct() {
        const textDangerElements = $('.text-danger');
        const textDangerSlice = textDangerElements.slice(-7);
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


/*---------------------------------------------------- Al dar click en el boton de agregar usuario  ---------------------------------------------------- */
function simularClickUsuario() {
    //ocultar formulario de actualizar  y mostrar el formulario principal
    $('#FormActualizarUsuario').hide();
    $('#FormPrincipalUsuario').show().css('visibility', 'visible');
    obtenerDatosUsuarios();
}

/*--------------------Atajo para abrir modal -------------------------------*/
document.addEventListener('keydown', function (event) {
    if (event.ctrlKey && event.key === 'm') {
        try {
            if (esURLValida('Usuarios')) {
                const modalProducto = $('#ModalUsuario');
                const botonAbrirModal = $('#botonabrirModalUsuario');

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


function abrirModalUsuario() {
    // Verificar si la modal está abierta
    if ($('#ModalUsuario').hasClass('show')) {
        $('#ModalUsuario').modal('hide'); // Cerrar la modal
    } else {
        simularClickUsuario(); // Simular algún evento antes de abrir la modal
        $('#ModalUsuario').modal('show'); // Abrir la modal
    }
}

/*------------------------------ Limpiar formularios y url ---------------------------------------------------------------------------------------------------- */


function limpiarFormularioUsuarioAgregar() {
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
function limpiarFormularioUsuarioAct() {
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
function limpiarFormularioUsuario() {
    limpiarFormularioUsuarioAgregar();
    limpiarFormularioUsuarioAct();
    history.replaceState(null, '', location.pathname);
    // Limpiar campos y elementos específicos
    limpiarCampo('NombreRol');
    limpiarCampo('RolId');
    limpiarCampo('Nombre');
    limpiarCampo('Apellido');
    limpiarCampo('Usuario');
    limpiarCampo('Contraseña');
    limpiarCampo('RepetirContraseña');
    limpiarCampo('TelefonoUsuario');
    limpiarCampo('CorreoUsuario');

    // Limpiar campos y elementos específicos de la versión actualizada
    limpiarCampo('UsuarioIdAct');
    limpiarCampo('NombreRolAct');
    limpiarCampo('RolIdAct');
    limpiarCampo('NombreAct');
    limpiarCampo('ApellidoAct');
    limpiarCampo('ContraseñaAct');
    limpiarCampo('TelefonoUsuarioAct');
    limpiarCampo('CorreoUsuarioAct');
  
}


//Función para limpiar la url si el usuario da fuera de ella 
$('.modal').on('click', function (e) {
    if (e.target === this) {
        // Limpiar la URL eliminando los parámetros de consulta
        history.replaceState(null, '', location.pathname);
        $(this).modal('hide'); // Oculta la modal
    }
});

function AlPerderFocoUsuario() {
    var displayFormActualizar = $('#FormActualizarUsuario').css('display');
    var displayModal = $('#ModalUsuario').css('display');
    if (displayFormActualizar == "block" && displayModal == "none") {
        limpiarFormularioUsuarioAct();
    }
}

/*--------------------------------------------------------- Modal de actualizar usuario ---------------------------------------*/
function mostrarModalConRetrasoUsuario(usuarioId) {
    limpiarFormularioUsuarioAct();
    actualizarUsuario(usuarioId);
    setTimeout(function () {
        var myModal = new bootstrap.Modal(document.getElementById('ModalUsuario'));
        myModal.show();
        // Aquí puedes llamar a la función actualizarProducto si es necesario
    }, 400); // 500 milisegundos (0.5 segundos) de retraso antes de abrir la modal

}
//Modal cuando se hace click en editar en el boton de detalle
function mostrarModalSinRetrasoUsuario(usuarioId) {
    obtenerDatosUsuarios();
    actualizarUsuario(usuarioId);
    setTimeout(function () {
        limpiarFormularioUsuarioAct();
        var myModal = new bootstrap.Modal(document.getElementById('ModalUsuario'));
        myModal.show();
        // Aquí puedes llamar a la función actualizarProducto si es necesario
    }, 50); // 50 milisegundos (0.05 segundos) de retraso antes de abrir la modal
}

function actualizarUsuario(campo) {
    var usuarioId = campo;
    $.ajax({
        url: '/Usuarios/FindUsuario', // Ruta relativa al controlador y la acción
        type: 'POST',
        data: { usuarioId: usuarioId },
        success: function (data) {
            var formActualizar = $('#FormActualizarUsuario');
            formActualizar.find('#UsuarioIdAct').val(data.usuarioId);
            formActualizar.find('#NombreRolAct').val(data.rolId);
            formActualizar.find('#EstadoUsuarioAct').val(data.estadoUsuario);
            formActualizar.find('#NombreAct').val(data.nombre);
            formActualizar.find('#UsuarioAct').val(data.usuario1);
            formActualizar.find('#ContraseñaAct').val(data.contraseña);
            formActualizar.find('#ApellidoAct').val(data.apellido);
            formActualizar.find('#TelefonoUsuarioAct').val(data.telefono);
            formActualizar.find('#CorreoUsuarioAct').val(data.correo);
            formActualizar.find('#EstadoProductoAct').val(data.correo);
            seleccionarOpcion(document.getElementById('NombreRolAct'), document.getElementById('roles'), document.getElementById('RolIdAct'));
            limpiarFormularioUsuarioAct()
            obtenerDatosUsuarios();
        },
        error: function () {
            alert('Error al obtener los datos del usuario.');
        }
    });
    $('#FormPrincipalUsuario').hide().css('visibility', 'hidden');
    $('#FormActualizarUsuario').show().css('visibility', 'visible');
}


/*------------------- Cambiar estado usuaurio------------------------------------------*/
function actualizarEstadoUsuario(UsuarioId) {
    $.ajax({
        url: `/Usuarios/UpdateEstadoUsuario/${UsuarioId}`,
        type: 'PATCH',
        contentType: 'application/json',
        success: function (response) {
            console.log("Estado actualizado:", EstadoUsuario);
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
            console.error('Error al actualizar el estado del usuario:', xhr.responseText);
            // Mostrar SweetAlert de error si es necesario
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al actualizar el estado del usuario. Por favor, inténtalo de nuevo.'
            });
        }
    });
}



/*---------------------------------------------------------Buscador--------------------------------------------------------- */
function searchUsuario() {
    var input = $('#buscarUsuario').val().trim().toLowerCase();    //Obtiene el valor del buscadpor
    var rows = document.querySelectorAll('.usuariosPaginado');    //Obtiene el tr de Usuario Paginado.
    var rowsTodos = document.querySelectorAll('.Usuarios');      //Obtiene el tr de Usuario que esta en none
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
            var usuarioId = row.querySelector('td:nth-child(2)').textContent.trim().toLowerCase();
            var nombreR = row.querySelector('td:nth-child(3)').textContent.trim().toLowerCase();
            var nombreC = row.querySelector('td:nth-child(4)').textContent.trim().toLowerCase();
            var telefono = row.querySelector('td:nth-child(5)').textContent.trim().toLowerCase();
            var correo = row.querySelector('td:nth-child(6').textContent.trim().toLowerCase();

            row.style.display = (input === "" || usuarioId.includes(input) || nombreR.includes(input) || nombreC.includes(input) || telefono.includes(input) || correo.includes(input)) ? 'table-row' : 'none';
        }
    });
}

function vaciarInputUsuario() {
    var paginationContainer = document.getElementById('paginationContainer');
    document.getElementById('buscarUsuario').value = "";
    var icon = document.querySelector('#btnNavbarSearch i');
    icon.className = 'fas fa-search';
    icon.style.color = 'white';
  
    var contador = document.querySelector('.contador');
    contador.innerText = '#';
    var contadores = document.querySelectorAll('.contadorB');
    contadores.forEach(function (contador) {
        contador.classList.add('noIs'); // Removemos la clase 'noIs'
    });

    var rows = document.querySelectorAll('.usuariosPaginado');
    rows.forEach(function (row) {
        row.style.display = 'table-row';
    });

    var rowsTodos = document.querySelectorAll('.Usuarios');

    rowsTodos.forEach(function (row) {
        row.style.display = 'none';
    });
    paginationContainer.classList.remove('noBe'); // Oculta el contenedor de paginación

}

/*---------------------- Llama a la funcion en site.js  ---------------------------*/
function showNoRolesAlert() {
    showAlertIfNoOptions("roles", "No hay roles activos", "No hay roles disponibles en este momento.");
}

/*------------------------ Validaciones---------------*/

function validarCampoUsuario(input) {
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
        spanError.text('Este campo es obligatorio.');
    } 

    if (inputElement.is('#Nombre') || inputElement.is('#Apellido') || inputElement.is('#NombreAct') || inputElement.is('#ApellidoAct')) {
        var campoNombre = inputElement.is('#Nombre') ? $('#Nombre') : $('#NombreAct');
        var campoApellido = inputElement.is('#Apellido') ? $('#Apellido') : $('#ApellidoAct');
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
            inputElement.removeClass('is-invalid'); // Agregar la clase de Bootstrap para resaltar el campo vacío

        } else {
            if (valorNombre.length < 3) {
                spanErrorNombre.text('Este campo debe tener un mínimo de 3 caracteres.');
                spanVacioNombre.text('');
                inputElement.addClass('is-invalid'); // Agregar la clase de Bootstrap para resaltar el campo vacío
            } else if (/^[a-zA-Z]+\s[a-zA-Z]+$/.test(valorNombre)) {
                spanErrorNombre.text('El nombre no puede contener números ni caracteres especiales (excepto espacios en nombres compuestos).');
                inputElement.addClass('is-invalid'); // Agregar la clase de Bootstrap para resaltar el campo vacío
            } else {
                spanErrorNombre.text('');
                spanVacioNombre.text('');
                inputElement.removeClass('is-invalid');
            }
        }

        // Validaciones de apellido
        if (valorApellido === '') {
            spanErrorApellido.text(' ');
            spanVacioApellido.text('*');
            inputElement.removeClass('is-invalid'); // Agregar la clase de Bootstrap para resaltar el campo vacío
        } else if (valorApellido.length < 3) {
            spanErrorApellido.text('Este campo debe tener un mínimo de 3 caracteres.');
            spanVacioApellido.text('');
            inputElement.addClass('is-invalid'); // Agregar la clase de Bootstrap para resaltar el campo vacío
        } else if (/^[a-zA-Z]+\s[a-zA-Z]+$/.test(valorApellido)) {
            spanErrorApellido.text('El apellido no puede contener números ni caracteres especiales (excepto espacios en apellidos compuestos).');
            spanVacioApellido.text('');
            inputElement.addClass('is-invalid'); // Agregar la clase de Bootstrap para resaltar el campo vacío
        } else {
            spanErrorApellido.text('');
            spanVacioApellido.text('');
            inputElement.removeClass('is-invalid'); // Agregar la clase de Bootstrap para resaltar el campo vacío

        }
    }

    // Validación de teléfono
    if (inputElement.is('#TelefonoUsuario') || inputElement.is('#TelefonoUsuarioActU')) {
        var telefonoValido = /^\d{7,}$/.test(valor); // Permite al menos 6 dígitos

        if (valor === '') {
            spanError.text('');
            spanVacio.text('*');
            inputElement.removeClass('is-invalid'); // Agregar la clase de Bootstrap para resaltar el campo vacío
        } else if (valor.length < 7 && valor.length > 0) {
            spanError.text('El teléfono debe tener mínimo 7 dígitos numéricos.');
            spanVacio.text('');
            inputElement.addClass('is-invalid'); // Agregar la clase de Bootstrap para resaltar el campo vacío

        } else if (!telefonoValido) {
            spanError.text('Este campo no permite letras o espacios.');
            spanVacio.text('');
            inputElement.addClass('is-invalid'); // Agregar la clase de Bootstrap para resaltar el campo vacío
        }
    }

    // Validación de correo electrónico
    if (inputElement.is('#CorreoUsuario') || inputElement.is('#CorreoUsuarioAct')) {
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

    // Validación de usuario
    if (inputElement.is('#Usuario') || inputElement.is('#UsuarioAct')) {
        const usuarioValido = /^[a-zA-Z]{3,}[a-zA-Z0-9_-]{0,16}$/.test(valor); // Verifica que el usuario cumpla con el formato especificado
        if (valor === '') {
            spanVacio.text('*');
        } else if (valor.length < 4 && valor.length > 1) {
            spanVacio.text('');
            spanError.text('El usuario debe contener entre 4 y 16 caracteres y empezar con letras. Ejemplo: juan123');
        } else if (!usuarioValido) {
            spanVacio.text('');
            spanError.text('El usuario debe contener entre 4 y 16 caracteres alfanuméricos, guiones bajos (_) o guiones medios (-).');
        } else {
            spanError.text('');
            spanVacio.text('');
        }
    }

    // Validación de contraseña
    if (inputElement.is('#Contraseña') || inputElement.is('#ContraseñaAct')) {
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

    if (inputElement.is('#RepetirContraseña')) {
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




