

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
function ActualizarDetalle(tipomovimineto) {
    var detalleid = $('#DetallePedidoId').val();
    var pedidoId = $('#PedidoId').val();
    var productoId = $('#ProductoId').val();
    var loteId = $('#LoteId').val();
    var unidadId = $('#unidadHidden').val();
    var cantidad = $('#CantidadTxt').val();
    var precio = $('#PrecioUnitario').val();
    var subtotal = $('#SubTotal').val();

    console.log(tipomovimineto)
    if (!validarenviada()) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El formulario no cumple con los requisitos'
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
        cantidad: cantidad,
        tipomovimineto: tipomovimineto // Añadir el tipo de movimiento
    };

    $.ajax({
        url: `/DetallePedidos/Update?tipomovimineto=${encodeURIComponent(tipomovimineto)}`,
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



$(document).ready(function () {
    $('#TipoAccion').change(function () {
        var tipo = $(this).val();
        var url = '';

        if (tipo === "Pedido") {
            url = 'https://localhost:7013/api/Pedidos/GetPedidosRealizado';
        } else if (tipo === "Compra") {
            url = 'https://localhost:7013/api/Compras/GetComprasRealizada';
        }

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los datos');
                }
                return response.json();
            })
            .then(data => {
                // Limpiar el campo de búsqueda y datalist
                console.log(data);
                const dataList = document.getElementById('buscarList');
                dataList.innerHTML = ''; // Limpiar opciones existentes


                // Agregar nuevas opciones al datalist
                data.forEach(item => {
                    let option = document.createElement('option');
                    option.value = tipo === "Pedido" ? item.pedidoId : item.compraId;
                    dataList.appendChild(option);
                });
            })
             
           
            .catch(error => {
                console.error('Error:', error);
                alert('Error al obtener los datos');
            });
    });
});
function actualizardetallelotes(detalleId) {
    console.log(detalleId);
    var modalElement = document.getElementById('ModalDomicilio');
    if (modalElement) {
        var myModal = new bootstrap.Modal(modalElement);
        myModal.show();
    } else {
        console.error('Modal element not found');
    }

    $.ajax({
        url: '/Lotes/findDlotes', // Ruta relativa al controlador y la acción
        type: 'POST',
        data: { detalleCompraId: detalleId },
        success: function (data) {
            console.log(data);

            // Verifica si data es un array y tiene al menos un objeto
            if (Array.isArray(data) && data.length > 0) {
                var lote = data[0];
                var productoNombre = lote.productoId; // Asume que estás interesado en el primer lote
                productosnombre(productoNombre);

                // Asegúrate de que los campos de entrada existen antes de asignar valores
                var formActualizar = $('#FormActualiZarDomicilio');
                var fields = {
                    '#DetalleCompraId': lote.detalleCompraId,
                    '#LoteId': lote.loteId,
                    '#Cantidad': lote.cantidad,
                    '#FechaVencimiento': lote.fechaVencimiento,
                    '#NumeroLote': lote.numeroLote,
                    '#PrecioCompra': lote.precioCompra,
                    '#PrecioPorPresentacion': lote.precioPorPresentacion,
                    '#PrecioPorUnidadProducto': lote.precioPorUnidadProducto
                };

                for (var fieldId in fields) {
                    var field = formActualizar.find(fieldId);
                    if (field.length) {
                        field.val(fields[fieldId]);
                    } else {
                        console.error(`Field ${fieldId} not found`);
                    }
                }
            } else {
                console.error('No data received or data is not an array');
            }
        },
        error: function () {
            alert('Error al obtener los datos del domicilio.');
        }
    });

    $('#FormActualiZarDomicilio').show().css('visibility', 'visible');
}



function productosnombre(productoNombre) {
    console.log(productoNombre);

    $.ajax({
        url: '/Productos/FindProducto', // Ruta relativa al controlador y la acción
        type: 'POST',
        data: { productoId: productoNombre },
        success: function (data) {
            console.log("producto",data);

            $("#ProductoId").val(data.nombreProducto);
            

        },
        error: function () {
            alert('Error al obtener los datos del domicilio.');
        }
    });


};

function ActualizarLotes(tipomovimineto) {
    var detalleid = $('#DetalleCompraId').val();
    var LoteId = $('#LoteId').val();
    var productoId = $('#ProductoId').val();
    var Cantidad = $('#Cantidad').val();
    var FechaVencimiento = $('#FechaVencimiento').val();
    var NumeroLote = $('#NumeroLote').val();
    var PrecioCompra = $('#PrecioCompra').val();
    var PrecioPorPresentacion = $('#PrecioPorPresentacion').val();
    var PrecioPorUnidadProducto = $('#PrecioPorUnidadProducto').val();

    console.log(tipomovimineto)
    if (!validarenviadaCompra()) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El formulario no cumple con los requisitos'
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
        cantidad: cantidad,
        tipomovimineto: tipomovimineto // Añadir el tipo de movimiento
    };

    $.ajax({
        url: `/DetallePedidos/Update?tipomovimineto=${encodeURIComponent(tipomovimineto)}`,
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



$(document).ready(function () {
    // Obtener la fecha actual en formato ISO (yyyy-mm-ddThh:mm)
    var fechaActualISO = new Date().toISOString().slice(0, 16);

    // Establecer el valor del campo FechaMovimiento
    $('#FechaMovimiento').val(fechaActualISO);
});
