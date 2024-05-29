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


