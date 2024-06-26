function obtenerClienteId(DomicilioId) {

    fetch(`/Domicilios/GetDomicilioById?Id=${DomicilioId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos');
            }
            return response.json();
        })
        .then(domicilio => {
            console.log(domicilio);

            // Asignar valores a los campos de formulario o donde los necesites
            document.getElementById('DomicilioIdAct').value = domicilio.domicilioId;
            document.getElementById('PedidoIdAct').value = domicilio.pedidoId;
            document.getElementById('ClientesAct').value = domicilio.usuariId;
            document.getElementById('EstadoDomicilioAct').value = domicilio.estadoDomicilio;
            document.getElementById('ObservacionAct').value = domicilio.observacion;
            document.getElementById('DireccionDomiciliarioAct').value = domicilio.direccionDomiciliario;
            document.getElementById('FechaEntregaAct').value = domicilio.fechaEntrega; // Corregido fechaEntrega seg�n la respuesta del servidor

            console.log(domicilio);
        })
        .catch(error => {
            console.error("Error:", error);
            // Aqu� podr�as mostrar un mensaje de error al usuario si lo deseas
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
    // Limpiar la URL eliminando los par�metros de consulta
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
        url: '/Domicilios/FindDomicilio', // Ruta relativa al controlador y la acci�n
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
        paginationContainer.classList.remove('noBe'); // Oculta el contenedor de paginaci�n

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
        paginationContainer.classList.add('noBe'); // Oculta el contenedor de paginaci�n


    }

    rowsTodos.forEach(function (row) {
        if (input === "") {
            row.style.display = 'none';
        } else {
            var domicilioId = row.querySelector('td:nth-child(2)').textContent.trim().toLowerCase();
            var pedidoId = row.querySelector('td:nth-child(3)').textContent.trim().toLowerCase();
            var usuarioId = row.querySelector('td:nth-child(4)').textContent.trim().toLowerCase();
            var observacion = row.querySelector('td:nth-child(5)').textContent.trim().toLowerCase();
            var fechaE = row.querySelector('td:nth-child(6)').textContent.trim().toLowerCase();
            var direccionD = row.querySelector('td:nth-child(7)').textContent.trim().toLowerCase();
            var Estado = row.querySelector('td:nth-child(8)').textContent.trim().toLowerCase();

            row.style.display = (input === "" || domicilioId.includes(input) || pedidoId.includes(input) || Estado.includes(input) || usuarioId.includes(input) || observacion.includes(input) || fechaE.includes(input) || direccionD.includes(input)) ? 'table-row' : 'none';
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
    paginationContainer.classList.remove('noBe'); // Oculta el contenedor de paginaci�n

}



function actualizarDomi() {


    if (!validarcamposAct()) {
        // Si la validaci�n falla, detener la ejecuci�n y salir de la funci�n
        return;
    }
    var domicilioId = $('#DomicilioIdAct').val();
    var pedidoId = $('#PedidoIdAct').val();
    var usuarioId = $('#ClinteHidenAct').val();
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

    // Realizar la petici�n AJAX
    $.ajax({
        url: '/Domicilios/Update',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (response) {
            if (response.success) {
                // Muestra una alerta de �xito con SweetAlert
                Swal.fire({
                    icon: 'success',
                    title: '�xito',
                    text: response.message,
                    timer: 3000, // Tiempo en milisegundos (3 segundos en este caso)
                    timerProgressBar: true,
                    showConfirmButton: false // Oculta el bot�n de confirmaci�n
                }).then((result) => {
                    // Redirige o realiza otras acciones si es necesario
                    window.location.href = '/Pedidos/Index'; // Por ejemplo, redirige a la p�gina de pedidos
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
        // Ejecutar el c�digo JavaScript solo si estamos en la vista de domicilio
        var fechaActual = document.getElementById("FechaEntrega");
        var fechaActualDate = new Date();
        var formateada = fechaActualDate.toISOString().slice(0, 16);
        fechaActual.min = formateada;
        fechaActual.value = formateada;
    }
});
// Funci�n principal para validar campos
function validarcampos() {
    var observacion = document.getElementById("ObservacionInput").value;
    var nombreUsuario = document.getElementById("Clientes").value;
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

// Funci�n para validar el usuario
function validarUsuario(nombreUsuario) {
    var nombreUsuarioInput = document.getElementById("Clientes");
    var nombreUsuarioError = document.getElementById("clienteerror");
    var usuarioIdInput = document.getElementById("ClinteHiden");

    if (!nombreUsuarioInput || !nombreUsuarioError || !usuarioIdInput) {
        console.error("Uno de los elementos no se encontr� en el DOM");
        return false;
    }

    nombreUsuario = nombreUsuario.trim();

    if (!usuarioIdInput.value || nombreUsuario === "") {
        mostrarError(nombreUsuarioInput, nombreUsuarioError, "El usuario no est� registrado.");
        return false;
    } else {
        quitarError(nombreUsuarioInput, nombreUsuarioError);
    }
    return true;
}

// Funci�n para validar la observaci�n
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
        mostrarError(observacionInput, observacionError, "El campo no puede tener menos de 4 letras o m�s de 60.");
        return false;
    }

    quitarError(observacionInput, observacionError);
    return true;
}

// Funci�n para validar el domiciliario
function validarDomiciliario(domiciliario) {
    var domiciliarioInput = document.getElementById("DireccionDomiciliario");
    var domiciliarioError = document.getElementById("DireccionDomiciliariospan");

    domiciliario = domiciliario.trim();

    if (domiciliario.length < 4 || domiciliario.length > 60) {
        mostrarError(domiciliarioInput, domiciliarioError, "El campo no puede tener menos de 4 letras o m�s de 60.");
        return false;
    }

    quitarError(domiciliarioInput, domiciliarioError);
    return true;
}

// Funci�n para validar la fecha de entrega
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
        mostrarError(document.getElementById("FechaEntrega"), fechaEntregaError, "La fecha de entrega no puede ser mayor a 30 d�as a partir de la fecha actual.");
        return false;
    } else {
        quitarError(document.getElementById("FechaEntrega"), fechaEntregaError);
    }

    return true;
}

// Eventos para validar en tiempo real
$("#Clientes").on("change", function () {
    var selectedOption = $("#Clientes option[value='" + $(this).val() + "']");
    if (selectedOption.length) {
        $("#ClinteHiden").val(selectedOption.data("id"));
        quitarError(this, document.getElementById("clienteerror"));
    } else {
        $("#ClinteHiden").val("");
        mostrarError(this, document.getElementById("clienteerror"), "El usuario no est� registrado.");
    }
});

$("#ObservacionInput").on("input", function () {
    validarObservacion($(this).val());
});

$("#DireccionDomiciliario").on("input", function () {
    validarDomiciliario(this.value);
});

$("#FechaEntrega").on("change", function () {
    validarFechaEntrega();
});

// Funci�n para mostrar errores
function mostrarError(inputElement, errorElement, errorMessage) {
    inputElement.classList.add("is-invalid");
    errorElement.textContent = errorMessage;
}

// Funci�n para quitar errores
function quitarError(inputElement, errorElement) {
    inputElement.classList.remove("is-invalid");
    errorElement.textContent = "";
}

// Funci�n principal para validar campos en la actualizaci�n
function validarcamposAct() {
    var observacion = document.getElementById("ObservacionAct").value;
    var nombreUsuario = document.getElementById("ClientesAct").value;
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

// Funci�n para validar el usuario en la actualizaci�n
function validarUsuarioAct(nombreUsuario) {
    var nombreUsuarioInput = document.getElementById("ClientesAct");
    var usuarioError = document.getElementById("clienteerrorAct");
    var usuarioIdInput = document.getElementById("ClinteHidenAct");

    if (!nombreUsuarioInput || !usuarioError || !usuarioIdInput) {
        console.error("Uno de los elementos no se encontr� en el DOM");
        return false;
    }

    nombreUsuario = nombreUsuario.trim();

    if (!usuarioIdInput.value || nombreUsuario === "") {
        mostrarError(nombreUsuarioInput, usuarioError, "El Domiciliario no est� registrado.");
        return false;
    } else {
        quitarError(nombreUsuarioInput, usuarioError);
    }
    return true;
}

// Funci�n para validar la observaci�n en la actualizaci�n
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
        mostrarError(observacionInput, observacionError, "El campo no puede tener menos de 4 letras o m�s de 60.");
        return false;
    }

    quitarError(observacionInput, observacionError);
    return true;
}

// Funci�n para validar el domiciliario en la actualizaci�n
function validarDomiciliarioAct(domiciliario) {
    var domiciliarioInput = document.getElementById("DireccionDomiciliarioAct");
    var domiciliarioError = document.getElementById("MensajeDireccionDomiciliario");

    domiciliario = domiciliario.trim();

    if (domiciliario.length < 4 || domiciliario.length > 60) {
        mostrarError(domiciliarioInput, domiciliarioError, "El campo no puede tener menos de 4 letras o m�s de 60.");
        return false;
    }

    quitarError(domiciliarioInput, domiciliarioError);
    return true;
}

// Funci�n para validar la fecha de entrega en la actualizaci�n
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
        mostrarError(document.getElementById("FechaEntregaAct"), fechaEntregaError, "La fecha de entrega no puede ser mayor a 30 d�as a partir de la fecha actual.");
        return false;
    } else {
        quitarError(document.getElementById("FechaEntregaAct"), fechaEntregaError);
    }

    return true;
}

// Eventos para validar en tiempo real en la actualizaci�n
$("#ClientesAct").on("change", function () {
    var selectedOption = $("#clientesAct option[value='" + $(this).val() + "']");
    if (selectedOption.length) {
        $("#ClinteHidenAct").val(selectedOption.data("id"));
        quitarError(this, document.getElementById("clienteerrorAct"));
    } else {
        $("#ClinteHidenAct").val("");
        mostrarError(this, document.getElementById("clienteerrorAct"), "El usuario no est� registrado.");
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

// Funci�n para mostrar errores
function mostrarError(inputElement, errorElement, errorMessage) {
    inputElement.classList.add("is-invalid");
    errorElement.textContent = errorMessage;
}

// Funci�n para quitar errores
function quitarError(inputElement, errorElement) {
    inputElement.classList.remove("is-invalid");
    errorElement.textContent = "";
}

$("#Clientes").on("change", function () {
    var inputValue = $(this).val();
    var selectedOption = $("#clientes option").filter(function () {
        return $(this).val() === inputValue || $(this).data("id") == inputValue; // Ensure type coercion for numeric comparison
    });

    if (selectedOption.length) {
        $("#ClinteHiden").val(selectedOption.data("id"));
        $("#Clientes").val(selectedOption.val()); // Set the Clientes input to the name of the entity
        quitarError(this, document.getElementById("clienteerror"));
    } else {
        // Check if the entered value is a number
        if (!isNaN(parseFloat(inputValue)) && isFinite(inputValue)) {
            var option = $("#clientes option[data-id='" + inputValue + "']");
            if (option.length) {
                $("#ClinteHiden").val(inputValue);
                $("#Clientes").val(option.val()); // Set the Clientes input to the name of the entity
            } else {
                $("#ClinteHiden").val("");
                $("#Clientes").val(""); // Clear the Clientes input if no entity is found
            }
        } else {
            $("#ClinteHiden").val("");
            $("#Clientes").val(""); // Clear the Clientes input if the value is not a valid number
        }
    }
});
