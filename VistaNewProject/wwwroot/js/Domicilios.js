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

function validarcampos() {
    var observacion = document.getElementById("ObservacionInput").value;
    var nombreUsuario = document.getElementById("NombreUsuario").value;
    var domiciliario = document.getElementById("DireccionDomiciliario").value;

    var isValid = true;

    if (!validarUsuario(nombreUsuario)) {
        isValid = false;
    }

    if (!validarObservacion(observacion)) {
        isValid = false;
    }

    if (!validarDomiciliario(domiciliario)) {
        isValid = false;
    }

    if (!validarFechaEntrega()) {
        isValid = false;
    }

    return isValid;
}

function validarUsuario(nombreUsuario) {
    var nombreUsuarioInput = document.getElementById("NombreUsuario");
    var nombreUsuarioError = document.getElementById("NombreUsuarioError");
    var usuarioIdInput = document.getElementById("UsuarioId");

    nombreUsuario = nombreUsuario.trim();

    if (!usuarioIdInput.value || nombreUsuario === "") {
        mostrarError(nombreUsuarioInput, nombreUsuarioError, "El Domiciliario no está registrado.");
        return false;
    } else {
        quitarError(nombreUsuarioInput, nombreUsuarioError);
    }
    return true;
}


function validarObservacion(observacion) {
    var regex = /^(?!\s{4,})(?![\s\S]*\s{5,})[\w\s]+(?<!\s{4,})(?<![.,]{2,})$/;
    var observacionInput = document.getElementById("ObservacionInput");
    var observacionError = document.getElementById("ObservacionError");

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

function validarDomiciliario(domiciliario) {
    var direccionRegex = "^[A-Za-z0-9\s\.,#\-]+$";
    var domiciliarioInput = document.getElementById("DireccionDomiciliario");
    var domiciliarioError = document.getElementById("DireccionDomiciliariospan");

    domiciliario = domiciliario.trim();

    if (!direccionRegex.test(domiciliario)) {
        mostrarError(domiciliarioInput, domiciliarioError, "El campo no cumple con los requisitos.");
        return false;
    }

    if (domiciliario.length < 4 || domiciliario.length > 60) {
        mostrarError(domiciliarioInput, domiciliarioError, "El campo no puede tener menos de 4 letras o más de 60.");
        return false;
    }

    quitarError(domiciliarioInput, domiciliarioError);
    return true;
}

function validarFechaEntrega() {
    var fechaActual = new Date();
    var fechaEntrega = new Date(document.getElementById("FechaEntrega").value);
    var fechaEntregaError = document.getElementById("FechaEntrega").nextElementSibling;

    var fechaMaxima = new Date();
    fechaMaxima.setDate(fechaMaxima.getDate() + 30);

    if (fechaEntrega < fechaActual) {
        mostrarError(document.getElementById("FechaEntrega"), fechaEntregaError, "La fecha de entrega no puede ser anterior a la fecha actual.");
        return false;
    } else if (fechaEntrega > fechaMaxima) {
        mostrarError(document.getElementById("FechaEntrega"), fechaEntregaError, "La fecha de entrega no puede ser mayor a 30 días a partir de la fecha actual.");
        return false;
    } else {
        quitarError(document.getElementById("FechaEntrega"), fechaEntregaError);
    }

    return true;
}
function mostrarError(inputElement, errorElement, errorMessage) {
    inputElement.classList.add("is-invalid");
    errorElement.textContent = errorMessage;
}

function quitarError(inputElement, errorElement) {
    inputElement.classList.remove("is-invalid");
    errorElement.textContent = "";
}


$("#NombreUsuario").on("change", function () {
    var selectedOption = $("#usuarioList option[value='" + $(this).val() + "']");
    if (selectedOption.length) {
        $("#UsuarioId").val(selectedOption.data("id"));
        quitarError(this, document.getElementById("NombreUsuarioError"));
    } else {
        $("#UsuarioId").val("");
    }
});

$("#ObservacionInput").on("input", function () {
    validarObservacion(this.value);
});

$("#DireccionDomiciliario").on("input", function () {
    validarDomiciliario(this.value);
});

$("#FechaEntrega").on("change", function () {
    validarFechaEntrega();
});


function validarcamposAct() {
    var observacion = document.getElementById("ObservacionAct").value;
    var nombreUsuario = document.getElementById("UsuarioIdActInput").value;
    var domiciliario = document.getElementById("DireccionDomiciliarioAct").value;


    var isValid = true;

    if (!validarUsuarioAct(nombreUsuario)) {
        isValid = false;
    }

    if (!validarObservacionAct(observacion)) {
        isValid = false;
    }

    if (!validarDomiciliarioAct(domiciliario)) {
        isValid = false;
    }

    if (!validarFechaEntregaAct()) {
        isValid = false;
    }

    return isValid;
}

function validarUsuarioAct(nombreUsuario) {
    var nombreUsuarioInput = document.getElementById("UsuarioIdActInput");
    var usuarioError = document.getElementById("usuarioError");
    var usuarioIdInput = document.getElementById("UsuarioIdActHidden");
usuarioError
    nombreUsuario = nombreUsuario.trim();

    if (!usuarioIdInput.value || nombreUsuario === "") {
        mostrarError(nombreUsuarioInput, usuarioError, "El Domiciliario no está registrado.");
        return false;
    } else {
        quitarError(nombreUsuarioInput, usuarioError);
    }
    return true;
}

function validarObservacionAct(observacion) {
    var regex = /^(?!\s{4,})(?![\s\S]*\s{5,})[\w\s]+(?<!\s{4,})(?<![.,]{2,})$/;
    var observacionInput = document.getElementById("ObservacionAct");
    var observacionError = document.getElementById("MensajeObservacion");

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

function validarDomiciliarioAct(domiciliario) {
    var direccionRegex = /^[A-Za-z0-9\s\.,#\-]+$/;
    var domiciliarioInput = document.getElementById("DireccionDomiciliarioAct");
    var domiciliarioError = document.getElementById("MensajeDireccionDomiciliario");

    domiciliario = domiciliario.trim();

    if (!direccionRegex.test(domiciliario)) {
        mostrarError(domiciliarioInput, domiciliarioError, "El campo no cumple con los requisitos.");
        return false;
    }

    if (domiciliario.length < 4 || domiciliario.length > 60) {
        mostrarError(domiciliarioInput, domiciliarioError, "El campo no puede tener menos de 4 letras o más de 60.");
        return false;
    }

    quitarError(domiciliarioInput, domiciliarioError);
    return true;
}

function validarFechaEntregaAct() {
    var fechaActual = new Date();
    var fechaEntrega = new Date(document.getElementById("FechaEntregaAct").value);
    var fechaEntregaError = document.getElementById("Mensajefechaerror");

    var fechaMaxima = new Date();
    fechaMaxima.setDate(fechaMaxima.getDate() + 30);

    if (fechaEntrega < fechaActual) {
        mostrarError(document.getElementById("FechaEntregaAct"), fechaEntregaError, "La fecha de entrega no puede ser anterior a la fecha actual.");
        return false;
    } else if (fechaEntrega > fechaMaxima) {
        mostrarError(document.getElementById("FechaEntregaAct"), fechaEntregaError, "La fecha de entrega no puede ser mayor a 30 días a partir de la fecha actual.");
        return false;
    } else {
        quitarError(document.getElementById("FechaEntregaAct"), fechaEntregaError);
    }

    return true;
}


$("#UsuarioIdActInput").on("change", function () {
    var selectedOption = $("#usuarios option[value='" + $(this).val() + "']");
    if (selectedOption.length) {
        $("#UsuarioIdActHidden").val(selectedOption.data("id"));
        quitarError(this, document.getElementById("usuarioError"));
    } else {
        $("#UsuarioIdActHidden").val("");
    }
});
$("#ObservacionAct").on("input", function () {
    validarObservacionAct(this.value);
});

$("#DireccionDomiciliarioAct").on("input", function () {
    validarDomiciliarioAct(this.value);
});

$("#FechaEntregaAct").on("change", function () {
    validarFechaEntregaAct();
});



function searchDomicilio() {
    var input = $('#buscarDomicilio').val().trim().toLowerCase();    //Obtiene el valor del buscadpor
    var rows = document.querySelectorAll('.domiciliosPaginado');    //Obtiene el tr de Usuario Paginado.
    var rowsTodos = document.querySelectorAll('.Domicilios');      //Obtiene el tr de Usuario que esta en none
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
            var domicilioId = row.querySelector('td:nth-child(2)').textContent.trim().toLowerCase();
            var pedidoId = row.querySelector('td:nth-child(3)').textContent.trim().toLowerCase();
            var usuarioId = row.querySelector('td:nth-child(4)').textContent.trim().toLowerCase();
            var observacion = row.querySelector('td:nth-child(5').textContent.trim().toLowerCase();
            var fechaE = row.querySelector('td:nth-child(6').textContent.trim().toLowerCase();
            var direccionD = row.querySelector('td:nth-child(7').textContent.trim().toLowerCase();

            row.style.display = (input === "" || domicilioId.includes(input) || pedidoId.includes(input) || usuarioId.includes(input) || observacion.includes(input) || fechaE.includes(input) || direccionD.includes(input)) ? 'table-row' : 'none';
        }
    });
}

function vaciarInputDomicilio() {
    var paginationContainer = document.getElementById('paginationContainer');
    document.getElementById('buscarDomicilio').value = "";
    var icon = document.querySelector('#btnNavbarSearch i');
    icon.className = 'fas fa-search';
    icon.style.color = 'white';

    var contador = document.querySelector('.contador');
    contador.innerText = '#';
    var contadores = document.querySelectorAll('.contadorB');
    contadores.forEach(function (contador) {
        contador.classList.add('noIs'); // Removemos la clase 'noIs'
    });

    var rows = document.querySelectorAll('.domiciliosPaginado');
    rows.forEach(function (row) {
        row.style.display = 'table-row';
    });

    var rowsTodos = document.querySelectorAll('.Domicilios');

    rowsTodos.forEach(function (row) {
        row.style.display = 'none';
    });
    paginationContainer.classList.remove('noBe'); // Oculta el contenedor de paginación

}

