function mostrarModalConRetrasodetalles(detalleId, productoId) {
    setTimeout(function () {
        actualizardetalle(detalleId);
        mostrarModal(productoId);
        setTimeout(function () {
            var modalElement = document.getElementById('ModalDomicilio');
            if (modalElement) {
                var myModal = new bootstrap.Modal(modalElement);
                myModal.show();
            } else {
                console.error('Modal element not found');
            }
        }, 100); // Retraso antes de abrir el modal
    }, 0); // Retraso antes de llamar a actualizarProducto
}

function mostrarModal(productoId) {
    setTimeout(function () {
        actualizarproductoId(productoId);
    }, 0);
}

function actualizarproductoId(productoId) {
    $.ajax({
        url: '/Productos/FindProductos', // Ruta relativa al controlador y la acción
        type: 'POST',
        data: { productoId: productoId },
        success: function (data) {
            var producto = data.find(item => item.productoId == productoId);
            if (producto != null) {
                var cantidadDisponible = producto.cantidadTotal - producto.cantidadReservada;
                $('#CantidadDisponibleLabel').text('Cantidad disponible: ' + cantidadDisponible);
                actualizardetalle(productoId, cantidadDisponible); // Llama a actualizardetalle con productoId y cantidadDisponible
            }
        },
        error: function () {
            alert('Error al obtener los datos del producto.');
        }
    });
}

function actualizardetalle(detalleId, cantidadDisponible) {
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
            formActualizar.find('#CantidadTxt').val(data.cantidad);
            formActualizar.find('#SubTotal').val(data.subtotal);
            formActualizar.find('#CantidadTxthidden').val(data.cantidad);

            formActualizar.find('#CantidadDisponibleLabel').text('Cantidad disponible: ' + cantidadDisponible);

            var usuarioInput = formActualizar.find('#ProductoIdtxt');
            var usuarioOption = $("#ProductosList option[data-id='" + data.productoId + "']");
            usuarioInput.val(usuarioOption.val());
            formActualizar.find('#ProductoId').val(data.productoId);

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

    $('#CantidadTxt').on('input', function () {
        var cantidad = parseFloat($(this).val());
        var cantidadHidden = parseFloat($('#CantidadTxthidden').val());
        var cantidadSuperar = parseFloat($('#CantidadDisponibleLabel').text().split(':')[1].trim());
        var precioUnitario = parseFloat($('#PrecioUnitario').val());

        if (!isNaN(cantidad) && !isNaN(precioUnitario)) {
            if (cantidad >= cantidadHidden && cantidad <= cantidadSuperar) {
                var subtotal = cantidad * precioUnitario;
                $('#SubTotal').val(subtotal);
                $('#SubTotalError').text('');
            } else {
                $('#SubTotal').val('');
                $('#SubTotalError').text('La cantidad debe estar entre ' + cantidadHidden + ' y ' + cantidadSuperar + '.');
            }
        } else {
            $('#SubTotal').val('');
            $('#SubTotalError').text('Por favor ingrese un número válido en Cantidad.');
        }
    });

    $('#FormActualiZarDomicilio').submit(function (event) {
        event.preventDefault();
        ActualizarDetalle();
    });
});

function ActualizarDetalle() {
    var detalleid = $('#DetallePedidoId').val();
    var pedidoId = $('#PedidoId').val();
    var productoId = $('#ProductoId').val();
    var loteId = $('#LoteId').val();
    var unidadId = $('#unidadHidden').val();
    var cantidad = $('#CantidadTxt').val();
    var precio = $('#PrecioUnitario').val();
    var subtotal = $('#SubTotal').val();

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