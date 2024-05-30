function obtenerClienteId(DomicilioId) {

    fetch(`https://localhost:7013/api/Domicilios/GetDomicilioById?Id=${DomicilioId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos');
            }
            return response.json();
        })
        .then(domicilio => {
            console.log(domicilio);

            document.getElementById('DomicilioIdAct').value = domicilio.domicilioId;
            document.getElementById('PedidoIdAct').value = domicilio.pedidoId;
            document.getElementById('UsuarioIdAct').value = domicilio.usuariId;
            document.getElementById('EstadoDomicilioAct').value = domicilio.estadoDomicilio;
            document.getElementById('ObservacionAct').value = domicilio.observacion;
            document.getElementById('DireccionDomiciliarioAct').value = domicilio.direccionDomiciliario;
            document.getElementById('FechaEntregaAct').value = domicilio.fechaEnntrega;
           



            console.log(domicilio);
        })
        .catch(error => {
            console.error("Error :", error)
        });
}

function limpiarFormularioCliente() {
   
    limpiarCampo('DomicilioIdAct');
    limpiarCampo('PedidoIdAct');
    limpiarCampo('UsuarioIdAct');
    limpiarCampo('EstadoDomicilioAct');
    limpiarCampo('ObservacionAct');
    limpiarCampo('DireccionDomiciliarioAct');
    limpiarCampo('FechaEntregaAct');
   

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

function mostrarModalConRetrasoDomicilio(domicilioId) {
    setTimeout(function () {
        actualizarDomicilio(domicilioId);
        setTimeout(function () {
            var modalElement = document.getElementById('ModalDomicilio');
            console.log(modalElement); // Verifica que el elemento modal existe
            if (modalElement) {
                var myModal = new bootstrap.Modal(modalElement);
                myModal.show();
            } else {
                console.error('Modal element not found');
            }
        }, 100); // 100 milisegundos de retraso antes de abrir la modal
    }, 0); // 0 milisegundos de retraso antes de llamar a actualizarProducto
}
function actualizarDomicilio(campo) {
    var domicilioId = campo;
    $.ajax({
        url: '/Domicilios/FindDomicilio', // Ruta relativa al controlador y la acción
        type: 'POST',
        data: { domicilioId: domicilioId },
        success: function (data) {
            console.log(data.estadoDomicilio);
            var formActualizar = $('#FormActualiZarDomicilio');
            formActualizar.find('#ClienteIdAct').val(data.domicilioId);
            formActualizar.find('#PedidoIdAct').val(data.pedidoId);

            // Encontrar el nombre del usuario y asignarlo al input
            var usuarioInput = formActualizar.find('#UsuarioIdActInput');
            var usuarioOption = $("#usuarios option[data-id='" + data.usuarioId + "']");
            usuarioInput.val(usuarioOption.val());
            formActualizar.find('#UsuarioIdActHidden').val(data.usuarioId);

            var estadoDomicilioSelect = formActualizar.find('#EstadoDomicilioAct');
            estadoDomicilioSelect.val(data.estadoDomicilio);

            // Actualiza el campo oculto
            formActualizar.find('#EstadoDomicilioHidden').val(data.estadoDomicilio);
            formActualizar.find('#ObservacionAct').val(data.observacion);
            formActualizar.find('#DireccionDomiciliarioAct').val(data.direccionDomiciliario);
            formActualizar.find('#FechaEntregaAct').val(data.fechaEntrega);

        },
        error: function () {
            alert('Error al obtener los datos del domicilio.');
        }
    });
    $('#FormActualiZarDomicilio').show().css('visibility', 'visible');
}

$(document).ready(function () {
    $('#EstadoDomicilioAct').change(function () {
        $('#EstadoDomicilioHidden').val($(this).val());
    });

    $('#UsuarioIdActInput').on('input', function () {
        var input = $(this).val();
        var option = $("#usuarios option[value='" + input + "']");
        if (option.length) {
            $('#UsuarioIdActHidden').val(option.data('id'));
        } else {
            $('#UsuarioIdActHidden').val('');
        }
    });
});



function actualizarDomi() {


    if (!validarcamposAct()) {
        // Si la validación falla, detener la ejecución y salir de la función
        return;
    }
    var domicilioId = $('#DomicilioIdAct').val();
    var pedidoId = $('#PedidoIdAct').val();
    var usuarioId = $('#UsuarioIdActHidden').val();
    var estadoDomicilio = $('#EstadoDomicilioHidden').val();
    var observacion = $('#ObservacionAct').val();
    var direccionDomiciliario = $('#DireccionDomiciliarioAct').val();
    var fechaEntrega = $('#FechaEntregaAct').val();

    // Crear un objeto con los datos a enviar al controlador
    var data = {
        domicilioId: domicilioId,
        pedidoId: pedidoId,
        usuarioId: usuarioId,
        estadoDomicilio: estadoDomicilio,
        observacion: observacion,
        direccionDomiciliario: direccionDomiciliario,
        fechaEntrega: fechaEntrega
    };

    console.log(data);

    // Realizar la petición AJAX
    $.ajax({
        url: '/Domicilios/Update',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (response) {
            if (response.success) {
                // Muestra una alerta de éxito con SweetAlert
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: response.message,
                    timer: 3000, // Tiempo en milisegundos (3 segundos en este caso)
                    timerProgressBar: true,
                    showConfirmButton: false // Oculta el botón de confirmación
                }).then((result) => {
                    // Redirige o realiza otras acciones si es necesario
                    window.location.href = '/Pedidos/Index'; // Por ejemplo, redirige a la página de pedidos
                });
            } else {
                // Muestra una alerta de error con SweetAlert
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message
                });
            }
        },

    });
}




$('#NombreUsuario').on('input', function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        seleccionarOpcion(this, document.getElementById('usuarioList'), document.getElementById('UsuarioId'));
    }, 650);
});



function validarcampos() {
    var observacion = document.getElementById("ObservacionInput").value;
    var nombreUsuario = document.getElementById("NombreUsuario").value;
    var domiciliario = document.getElementById("DireccionDomiciliario").value;
    if (!validarUsuario(nombreUsuario)) {
        return false;
    }
   

    if (!validarObservacion(observacion)) {
        return false;
    }
    if (!validarDomiciliario(domiciliario)) {
        return false;
    }
    return true;
}
$("#ObservacionInput").on("blur", function () {
    var observacionValue = $(this).val();
    validarObservacion(observacionValue); // Llamar a la función de validación cuando el usuario deje el campo
});
function validarObservacion(observacion) {
    // Expresión regular para validar la observación
    var regex = /^(?!\s{4,})(?![\s\S]*\s{5,})[\w\s]+(?<!\s{4,})(?<![.,]{2,})$/;

    var observacionInput = document.getElementById("ObservacionInput");
    var observacionError = document.getElementById("ObservacionError");

    // Eliminar espacios en blanco al principio y al final del valor
    observacion = observacion.trim();

    if (!regex.test(observacion)) {
        mostrarError(observacionInput, observacionError, "El campo no cumple con los requisitos.");
        return false;
    }

    if (observacion.length < 4 || observacion.length > 60) {
        mostrarError(observacionInput, observacionError, "El campo no puede tener menos de 4 letras o más de 60.");
        return false;
    }

    quitarError(observacionInput, observacionError);
    return true;
}


$("#DireccionDomiciliario").on("blur", function () {
    var observacionValue = $(this).val();
    validarDomiciliario(observacionValue); // Llamar a la función de validación cuando el usuario deje el campo
});
function validarDomiciliario(domiciliario) {
    var regex = /^(?!\s{4,})(?![\s\S]*\s{5,})[\w\s]+(?<!\s{4,})(?<![.,]{2,})$/;
    var domiciliarioInput = document.getElementById("DireccionDomiciliario");
    var domiciliarioError = document.getElementById("DireccionDomiciliariospan");

    // Eliminar espacios en blanco al principio y al final del valor
    domiciliario = domiciliario.trim();

    if (!regex.test(domiciliario)) {
        mostrarError(domiciliarioInput, domiciliarioError, "El campo no cumple con los requisitos.");
        return false;
    }

    if (domiciliario.length < 4 || domiciliario.length > 60) {
        mostrarError(domiciliarioInput, domiciliarioError, "El campo no puede tener menos de 3 letras o más de 60.");
        return false;
    }

    quitarError(domiciliarioInput, domiciliarioError);
    return true;
}


$("#NombreUsuario").on("blur", function () {
    validarUsuario($(this).val()); // Llamar a la función de validación cuando el usuario termina de ingresar datos
});


function validarUsuario(nombreUsuario) {
    var nombreUsuarioInput = document.getElementById("NombreUsuario");
    var nombreUsuarioError = document.getElementById("NombreUsuarioId");
    var usuarioIdInput = document.getElementById("UsuarioId");


    // Eliminar espacios en blanco al principio y al final del valor
    nombreUsuario = nombreUsuario.trim();

    if (!usuarioIdInput.value ||nombreUsuario === "" ) {
        mostrarError(nombreUsuarioInput, nombreUsuarioError, "El Domiciliario no esta  registrado.");
        return false; // Indicar que la validación no pasó
    } else {
        quitarError(nombreUsuarioInput, nombreUsuarioError);
    }
    return true; // Indicar que la validación pasó
}




document.addEventListener('DOMContentLoaded', function () {
    // Verificar si estamos en la vista de domicilio
    var vistaDomicilio = document.getElementById("vista-domicilio");
    if (vistaDomicilio) {
        // Ejecutar el código JavaScript solo si estamos en la vista de domicilio
        var fechaActual = document.getElementById("FechaEntrega");
        var fechaActualDate = new Date();
        var formateada = fechaActualDate.toISOString().slice(0, 16);
        fechaActual.min = formateada;
        fechaActual.value = formateada;
    }
});


function validarcamposAct() {
    var observacion = document.getElementById("ObservacionAct").value;
    var nombreUsuario = document.getElementById("UsuarioIdActInput").value;
    var domiciliario = document.getElementById("DireccionDomiciliarioAct").value;

    if (!validarUsuarioAct(nombreUsuario)) {
        return false;
    }

    if (!validarObervacioAct(observacion)) {
        return false;
    }

    if (!validarDomiciliarioAct(domiciliario)) {
        return false;
    }

    // Llamar a la función para validar la fecha
    if (!validarfecha()) {
        return false;
    }

    return true;
}


$("#ObservacionAct").on("blur", function () {
    var observacionValue = $(this).val();
    validarObervacioAct(observacionValue); // Llamar a la función de validación cuando el usuario deje el campo
});
function validarObervacioAct(observacion) {
    var regex = /^(?!\s{4,})(?![\s\S]*\s{5,})[\w\s]+(?<!\s{4,})(?<![.,]{2,})$/;
    var observacionInput = document.getElementById("ObservacionAct");
    var observacionError = document.getElementById("MensajeObservacion");

    if (!regex.test(observacion)) {
        // Si la expresión regular no coincide, mostrar un mensaje de error
        mostrarError(observacionInput, observacionError, "El campo no cumple con los requisitos.");
        return false;
    }
    if (observacion.length < 4 || observacion.length > 60) {
        // Si la longitud de la observación está fuera del rango, mostrar un mensaje de error
        mostrarError(observacionInput, observacionError, "El campo no puede tener menos de 3 letras o más de 60.");
        return false;
    }

    // Si la validación pasa, quitar la clase de error y limpiar el mensaje de error
    quitarError(observacionInput, observacionError);
    return true;
}

$("#DireccionDomiciliarioAct").on("blur", function () {
    var observacionValue = $(this).val();
    validarDomiciliarioAct(observacionValue); // Llamar a la función de validación cuando el usuario deje el campo
});

function validarDomiciliarioAct(domiciliario) {
    var regex = /^(?!\s{4,})(?![\s\S]*\s{5,})[\w\s]+(?<!\s{4,})(?<![.,]{2,})$/;
    var domiciliarioInput = document.getElementById("DireccionDomiciliarioAct");
    var domiciliarioError = document.getElementById("MensajeDireccionDomiciliario");

    if (!regex.test(domiciliario)) {
        // Si la expresión regular no coincide, mostrar un mensaje de error
        mostrarError(domiciliarioInput, domiciliarioError, "El campo no cumple con los requisitos.");
        return false;
    }
    if (domiciliario.length < 4 || domiciliario.length > 60) {
        // Si la longitud del domiciliario está fuera del rango, mostrar un mensaje de error
        mostrarError(domiciliarioInput, domiciliarioError, "El campo no puede tener menos de 3 letras o más de 60.");
        return false;
    }

    // Si la validación pasa, quitar la clase de error y limpiar el mensaje de error
    quitarError(domiciliarioInput, domiciliarioError);
    return true;
}


$("#NombreUsuario").on("blur", function () {
    validarUsuarioAct($(this).val()); // Llamar a la función de validación cuando el usuario termina de ingresar datos
});


function validarUsuarioAct(nombreUsuario) {
    var nombreUsuarioInput = document.getElementById("UsuarioIdActInput");
    var nombreUsuarioError = document.getElementById("usuarioError");

    // Eliminar espacios en blanco al principio y al final del valor
    nombreUsuario = nombreUsuario.trim();

    if (nombreUsuario === "") {
        // Si el valor está vacío, mostrar un mensaje de advertencia
        mostrarError(nombreUsuarioInput, nombreUsuarioError, "El campo nombre del Domiciliario no puede estar vacío.");
        return false; // Indicar que la validación no pasó
    } else {
        // Si el valor no está vacío, quitar la clase de error y limpiar el mensaje de advertencia
        quitarError(nombreUsuarioInput, nombreUsuarioError);
    }

    return true; // Indicar que la validación pasó
}

// Función para mostrar un mensaje de error y resaltar el campo
function mostrarError(inputElement, errorElement, errorMessage) {
    inputElement.classList.add("is-invalid"); // Agregar clase para resaltar el campo en rojo
    errorElement.textContent = errorMessage; // Mostrar el mensaje de error
    inputElement.value = ''; // Limpiar el valor del campo
}

// Función para quitar la clase de error y el mensaje de error
function quitarError(inputElement, errorElement) {
    inputElement.classList.remove("is-invalid"); // Quitar la clase de error si la validación pasa
    errorElement.textContent = ""; // Limpiar el mensaje de advertencia
}



function validarfecha() {
    var fechaActual = new Date();
    var fechaEntrega = new Date(document.getElementById("FechaEntregaAct").value);
    var domiciliarioError = document.getElementById("Mensajefechaerror");

    // Obtener la fecha máxima permitida (30 días después de la fecha actual)
    var fechaMaxima = new Date();
    fechaMaxima.setDate(fechaMaxima.getDate() + 30);

    // Comparar la fecha seleccionada con la fecha actual y la fecha máxima permitida
    if (fechaEntrega < fechaActual) {
        domiciliarioError.textContent = "La fecha de entrega no puede ser anterior a la fecha actual.";
        document.getElementById("FechaEntregaAct").classList.add("is-invalid");
        return false;
    } else if (fechaEntrega > fechaMaxima) {
        domiciliarioError.textContent = "La fecha de entrega no puede ser mayor a 30 días a partir de la fecha actual.";
        document.getElementById("FechaEntregaAct").classList.add("is-invalid");
        return false;
    } else {
        domiciliarioError.textContent = "";
        document.getElementById("FechaEntregaAct").classList.remove("is-invalid");
    }

    return true;
}


