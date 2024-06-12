
function mostrarModalConRetrasodetalles(detalleId) {
    setTimeout(function () {
        actualizardetalle(detalleId);
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
function actualizardetalle(campo) {
    var detalleId = campo;
    $.ajax({
        url: '/DetallePedidos/finddetalle', // Ruta relativa al controlador y la acción
        type: 'POST',
        data: { detallePedidoId: detalleId },
        success: function (data) {
            console.log(data.cantidad);
            var formActualizar = $('#FormActualiZarDomicilio');
            formActualizar.find('#DetallePedidoId').val(data.detallePedidoId);
            formActualizar.find('#PedidoId').val(data.pedidoId);
            formActualizar.find('#LoteId').val(data.loteId);
            formActualizar.find('#PrecioUnitario').val(data.precioUnitario);
            formActualizar.find('#CantidadTxt').val(data.cantidad);
            formActualizar.find('#SubTotal').val(data.subtotal);

            
            
            // Encontrar el nombre del usuario y asignarlo al input
            var usuarioInput = formActualizar.find('#ProductoIdtxt');
            var usuarioOption = $("#ProductosList option[data-id='" + data.productoId + "']");
            usuarioInput.val(usuarioOption.val());
            formActualizar.find('#ProductoId').val(data.productoId);

            // Encontrar el nombre del usuario y asignarlo al input
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
});
