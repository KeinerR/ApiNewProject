/*------------------------------------- Al cargar la vista ------------------------------------------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const mostrarAlerta = urlParams.get('mostrarAlerta');
    const usuarioId = urlParams.get('usuarioId');

    if (mostrarAlerta === 'true' && usuarioId) {
        mostrarModalSinRetrasoUsuario(usuarioId);
    }
    //Evitar el envio de los formularios hasta que todo este validados
    $('.modal-formulario-crear-usuario').on('submit', function (event) {
        if (!NoCamposVacios()) {
            event.preventDefault();
        } else {
            // Obtener los valores de los campos del formulario
            var rolId = $('#RolId').val();

            if (rolId === '') {
                event.preventDefault();
                mostrarAlertaDataList('rol');
            }
        }
    });
    $('.modal-formulario-actualizar-usuario').on('submit', function (event) {
        event.preventDefault();

        if (!NoCamposVaciosAct()) {
            event.preventDefault();
        } else {
            // Obtener los valores de los campos del formulario
            var rolId = $('#rolIdAct').val();

            if (rolId === '') {
                event.preventDefault();
                mostrarAlertaDataList('rol');
            }
        }
    });
    // Confirmación de eliminación
    $('.delete-form-usuario').on('submit', function (event) {
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
    });
        $('.modal-formulario-actualizar-usuario input, .modal-formulario-actualizar-usuario select').on('input', function () {
            NoCamposVaciosInicialAct();
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
    function NoCamposVacios()    {
        const textDangerElements = $('.text-danger');
        const mensajeElements = $('.Mensaje');

        const textDangerSlice = textDangerElements.slice(0, 8);
        const mensajeSlice = mensajeElements.slice(0, 8);
        const todoValido = textDangerSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;

        const todosLlenos = mensajeSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;

        console.log('Todos los campos son válidos:', todoValido);
        console.log('Todos los campos están llenos:', todosLlenos);

        if (!todosLlenos) {
            $('.MensajeInicial').text('Por favor, complete todos los campos obligatorios(*).');
            return false;
        }

        if (!todoValido) {
            $('.MensajeInicial').text('Algunos campos contienen errores.');
            return false;
        }

        $('.MensajeInicial').text('');
        return true;
    }
    function NoCamposVaciosAct() {
        const textDangerElements = $('.text-danger');
        const mensajeElements = $('.Mensaje');

        const textDangerSlice = textDangerElements.slice(-7);
        const mensajeSlice = mensajeElements.slice(-7);

        const todoValido = textDangerSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;

        const todosLlenos = mensajeSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;


        console.log('Todos los campos son válidos:', todoValido);
        console.log('Todos los campos están llenos:', todosLlenos);

        if (!todosLlenos) {
            $('.MensajeInicial').text('Por favor, complete todos los campos obligatorios(*).');
            return false;
        }

        if (!todoValido) {
            $('.MensajeInicial').text('Algunos campos contienen errores.');
            return false;
        }

        $('.MensajeInicial').text('');
        return true;
    }
    function NoCamposVaciosInicial() {
        const textDangerElements = $('.text-danger');
        const mensajeElements = $('.Mensaje');

        const textDangerSlice = textDangerElements.slice(0, 8);
        const mensajeSlice = mensajeElements.slice(0, 8);

        const todoValido = textDangerSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;

        const todosLlenos = mensajeSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;

        if (todosLlenos) {
            $('.MensajeInicial').text('');
            if (todoValido) {
                $('.MensajeInicial').text('');
            }
        }



    }
    function NoCamposVaciosInicialAct() {
        const textDangerElements = $('.text-danger');
        const mensajeElements = $('.Mensaje');

        const textDangerSlice = textDangerElements.slice(-7);
        const mensajeSlice = mensajeElements.slice(-7);

        const todoValido = textDangerSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;

        const todosLlenos = mensajeSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;

        if (todosLlenos) {
            $('.MensajeInicial').text('');
            if (todoValido) {
                $('.MensajeInicial').text('');
            }
        }
    }

});


/*---------------------------------------------------- Al dar click en el boton de agregar usuario  ---------------------------------------------------- */
function simularClickUsuario() {
    //ocultar formulario de actualizar  y mostrar el formulario principal
    $('#FormActualizarUsuario').hide();
    $('#FormPrincipalUsuario').show().css('visibility', 'visible');
    limpiarFormularioUsuarioAct();
    limpiarFormularioUsuarioAgregar();
}

document.addEventListener('keydown', function (event) {
    // Verificar si se presionó Ctrl + Espacio
    if (event.ctrlKey && event.key === ' ') {
        // Ejecutar la función que deseas al presionar Ctrl + Espacio
        abrirModalUsuario();
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

function limpiarFormularioUsuario() {
    // Limpiar campos y elementos específicos
    limpiarCampo('NombreRol');
    limpiarCampo('RolId');
    limpiarCampo('Nombre');
    limpiarCampo('Apellido');
    limpiarCampo('Usuario');
    limpiarCampo('Contraseña');
    limpiarCampo('RepetirContraseña');
    limpiarCampo('Telefono');
    limpiarCampo('CorreoUsuario');

    // Limpiar campos y elementos específicos de la versión actualizada
    limpiarCampo('UsuarioIdAct');
    limpiarCampo('NombreRolAct');
    limpiarCampo('RolIdAct');
    limpiarCampo('NombreAct');
    limpiarCampo('ApellidoAct');
    limpiarCampo('ContraseñaAct');
    limpiarCampo('TelefonoAct');
    limpiarCampo('CorreoUsuarioAct');

    // Limpiar mensajes de alerta y *
    var mensajes = document.querySelectorAll('.Mensaje');
    var mensajesText = document.querySelectorAll('.text-danger');

    for (var i = Math.max(0, mensajes.length - 7); i < mensajes.length; i++) {
        mensajes[i].textContent = '';
    }
    for (var i = 0; i < mensajes.length - 7; i++) {
        mensajes[i].textContent = '*';
    }
    for (var i = 0; i < mensajesText.length; i++) {
        mensajesText[i].textContent = '';
    }

    document.querySelectorAll('.MensajeInicial').forEach(function (element) {
        element.textContent = '';
    });
    // Limpiar la URL eliminando los parámetros de consulta
    history.replaceState(null, '', location.pathname);
}
function limpiarFormularioUsuarioAgregar() {
    // Limpiar mensajes de alerta y *
    var mensajes = document.querySelectorAll('.Mensaje');
    var mensajesText = document.querySelectorAll('.text-danger');

    for (var i = Math.max(0, mensajes.length - 7); i < mensajes.length; i++) {
        mensajes[i].textContent = '';
    }
    for (var i = 0; i < mensajes.length - 7; i++) {
        mensajes[i].textContent = '*';
    }
    for (var i = 0; i < mensajesText.length; i++) {
        mensajesText[i].textContent = '';
    }

    document.querySelectorAll('.MensajeInicial').forEach(function (element) {
        element.textContent = '';
    }); 
}

function limpiarFormularioUsuarioAct() {
    // Limpiar mensajes de alerta y *
    var mensajes = document.querySelectorAll('.Mensaje');
    var mensajesText = document.querySelectorAll('.text-danger');

    for (var i = Math.max(0, mensajes.length - 7); i < mensajes.length; i++) {
        mensajes[i].textContent = '';
    }
    for (var i = 0; i < mensajes.length - 7; i++) {
        mensajes[i].textContent = '*';
    }
    for (var i = 0; i < mensajesText.length; i++) {
        mensajesText[i].textContent = '';
    }

    document.querySelectorAll('.MensajeInicial').forEach(function (element) {
        element.textContent = '';
    }); 

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
    setTimeout(function () {
        actualizarUsuario(usuarioId);
        setTimeout(function () {
            var myModal = new bootstrap.Modal(document.getElementById('ModalUsuario'));
            myModal.show();
            // Aquí puedes llamar a la función actualizarProducto si es necesario
        }, 500); // 500 milisegundos (0.5 segundos) de retraso antes de abrir la modal
    }, 0); // 0 milisegundos de retraso antes de llamar a actualizarProducto
}
//Modal cuando se hace click en editar en el boton de detalle
function mostrarModalSinRetrasoUsuario(usuarioId) {
    setTimeout(function () {
        actualizarUsuario(usuarioId);
        setTimeout(function () {
            var myModal = new bootstrap.Modal(document.getElementById('ModalUsuario'));
            myModal.show();
            // Aquí puedes llamar a la función actualizarProducto si es necesario
        }, 50); // 50 milisegundos (0.05 segundos) de retraso antes de abrir la modal
    }, 0); // 0 milisegundos de retraso antes de llamar a actualizarProducto
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
            formActualizar.find('#TelefonoAct').val(data.telefono);
            formActualizar.find('#CorreoUsuarioAct').val(data.correo);
            formActualizar.find('#EstadoProductoAct').val(data.correo);
            seleccionarOpcion(document.getElementById('NombreRolAct'), document.getElementById('roles'), document.getElementById('RolIdAct'));
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
            })
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
}

/*---------------------- Llama a la funcion en site.js  ---------------------------*/
function showNoRolesAlert() {
    showAlertIfNoOptions("roles", "No hay roles activos", "No hay roles disponibles en este momento.");
}

/*------------------------ Validaciones---------------*/
//Funciones para mostrar alerta
function mostrarAlerta(campo) {
    Swal.fire({
        position: "center",
        icon: 'warning',
        title: '¡Atención!',
        html: `<p>Completa el campo: ${campo}.</p>`,
        showConfirmButton: false,
        timer: 6000
    });
}
function validarCampoUsuario(campo) {
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
    if (input.is('#TelefonoUsuario') || input.is('#TelefonoUsuarioActU')) {
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
        } else {
            spanErrorApellido.text('');
            spanVacioApellido.text('');
            input.removeClass('is-invalid'); // Agregar la clase de Bootstrap para resaltar el campo vacío
        }
    }

    // Validación de correo electrónico
    if (input.is('#CorreoUsuario') || input.is('#CorreoUsuarioAct')) {
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
    if (input.is('#Usuario') || input.is('#UsuarioAct')) {
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




