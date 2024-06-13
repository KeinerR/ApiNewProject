

function actualizarproductoId( detalleId,productoId ) {
    $.ajax({
        url: '/Productos/FindProductos', // Ruta relativa al controlador y la acción
        type: 'POST',
        data: { productoId: productoId },
        success: function (data) {
            var producto = data.find(item => item.productoId == productoId);
            if (producto != null) {
                var cantidadDisponible = producto.cantidadTotal - producto.cantidadReservada;
                var nombre = producto.nombreProducto;
                console.log(nombre);
                $('#CantidadDisponibleLabel').text('Cantidad disponible: ' + cantidadDisponible);
                console.log(cantidadDisponible);
                $('#CantidadHidden').val(cantidadDisponible);

                $('#ProductoIdtxt').val(nombre);
                // Assuming detalleId is globally available or can be retrieved
                actualizardetalle(detalleId, productoId);
            }
        },
        error: function () {
            alert('Error al obtener los datos del producto.');
        }
    });
}

function actualizardetalle(detalleId, productoId) {

    console.log(detalleId)
    var modalElement = document.getElementById('ModalDomicilio');
    if (modalElement) {
        var myModal = new bootstrap.Modal(modalElement);
        myModal.show();
    } else {
        console.error('Modal element not found');
    }

    $.ajax({
        url: '/DetallePedidos/GetDetalles', // Ruta relativa al controlador y la acción
        type: 'POST',
        data: { detallePedidoId: detalleId },
        success: function (data) {
            console.log(data);
            var formActualizar = $('#FormActualiZarDomicilio');
            formActualizar.find('#DetallePedidoId').val(data.detallePedidoId);
            formActualizar.find('#PedidoId').val(data.pedidoId);
            formActualizar.find('#LoteId').val(data.loteId);
            formActualizar.find('#PrecioUnitario').val(data.precioUnitario);
            formActualizar.find('#SubTotal').val(data.subtotal);


            var productoInput = formActualizar.find('#ProductoIdtxt');
            var productoOption = $("#ProductosList option[data-id='" + productoId + "']");
            productoInput.val(productoOption.val());
            formActualizar.find('#ProductoId').val(productoId);

            var unidadInput = formActualizar.find('#UnidadId');
            var unidadOption = $("#UnidadIdList option[data-id='" + data.unidadId + "']");
            unidadInput.val(unidadOption.val());
            formActualizar.find('#unidadHidden').val(data.unidadId);
        },
        error: function () {
            alert('Error al obtener los datos del domicilio.');
        }
    });

    $('#FormActualiZarDomicilio').show().css('visibility', 'visible');
}


$(document).ready(function () {
    // Manejo de eventos para los campos de entrada
    $('#CantidadTxt').on('input', function () {
        calcularSubtotal();
    });

  
    $('#ProductoIdtxt').on('input', function () {
        var input = $(this).val();
        var option = $("#ProductosList option[value='" + input + "']");
        if (option.length) {
            $('#ProductoId').val(option.data('id'));
        } else {
            $('#ProductoId').val('');
        }
    });

    $('#UnidadId').on('input', function () {
        var input = $(this).val();
        var option = $("#UnidadIdList option[value='" + input + "']");
        if (option.length) {
            $('#unidadHidden').val(option.data('id'));
        } else {
            $('#unidadHidden').val('');
        }
    });

    $('#FormActualiZarDomicilio').submit(function (event) {
        event.preventDefault();
        ActualizarDetalle();
    });
});

function calcularSubtotal() {
    var cantidad = parseFloat($('#CantidadTxt').val()) || 0;
    var precio = parseFloat($('#PrecioUnitario').val()) || 0;
    var subtotal = cantidad * precio;
    $('#SubTotal').val(subtotal.toFixed(2));
}

function ActualizarDetalle() {
    var detalleid = $('#DetallePedidoId').val();
    var pedidoId = $('#PedidoId').val();
    var productoId = $('#ProductoId').val();
    var loteId = $('#LoteId').val();
    var unidadId = $('#unidadHidden').val();
    var cantidad = $('#CantidadTxt').val();
    var precio = $('#PrecioUnitario').val();
    var subtotal = $('#SubTotal').val();

    if (!validarenviada()) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text:  'el formulario no cumple con los requisitos'
        });
        return false; // Detiene el envío del formulario si la validación falla
    }

    var data = {
        detallePedidoId: detalleid,
        pedidoId: pedidoId,
        productoId: productoId,
        loteId: loteId,
        unidadId: unidadId,
        precioUnitario: precio,
        subtotal: subtotal,
        cantidad: cantidad
    };

    $.ajax({
        url: '/DetallePedidos/Update',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (response) {
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: response.message,
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false
                }).then((result) => {
                    window.location.href = '/Movimientos/Index';
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message
                });
            }
        },
        error: function () {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al actualizar el detalle.'
            });
        }
    });
}

function validarenviada() {
    var cantidad = $('#CantidadTxt').val();
    return validarcantidad(cantidad);
}

function validarcantidad(cantidad) {
    var cantidadInput = $('#CantidadTxt');
    var cantidadHiddenInput = parseFloat($('#CantidadHidden').val()); // Obtener el valor numérico del input oculto
    var cantidadError = $('#CantidadError');

    cantidad = parseFloat(cantidad); // Convertir la cantidad ingresada a número flotante

    if (isNaN(cantidad)) {
        mostrarError(cantidadInput, cantidadError, "Ingrese un número válido.");
        return false;
    }

    if (cantidad <= 0 || cantidad=="") {
        mostrarError(cantidadInput, cantidadError, "La cantidad debe ser mayor a cero.");
        return false;
    }

    if (cantidad > cantidadHiddenInput) {
        mostrarError(cantidadInput, cantidadError, "La cantidad no puede ser mayor a la cantidad disponible.");
        return false;
    }

    quitarError(cantidadInput, cantidadError);
    return true;
}

$(document).ready(function () {
    $('#CantidadTxt').on('input', function () {
        validarcantidad(this.value);
    });

    $('#FormActualiZarDomicilio').submit(function (event) {
        event.preventDefault();
        if (validarenviada()) {
            ActualizarDetalle();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error de validación',
                text: 'No se puede enviar el formulario porque hay errores de validación.'
            });
        }
    });
});

function mostrarError(inputElement, errorElement, errorMessage) {
    inputElement.addClass("is-invalid");
    errorElement.text(errorMessage);
}

function quitarError(inputElement, errorElement) {
    inputElement.removeClass("is-invalid");
    errorElement.text("");
}

