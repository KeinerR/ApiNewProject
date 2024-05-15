var detallesdepedidp = [];

function agregarDetalle(url) {
    var unidadId = document.getElementById("UnidadId").value; // Corrección aquí

    var cantidad = document.getElementById("Cantidad").value;
    var precioUnitario = document.getElementById("PrecioUnitario").value;

    var detalle = {
        PedidoId: document.getElementById("pedidoId").value,
        ProductoId: document.getElementById("ProductoId").value,
        Cantidad: cantidad,
        PrecioUnitario: precioUnitario,
        UnidadId: unidadId,
        Subtotal: cantidad * precioUnitario // Agregar el subtotal aquí
    };
    detallesdepedidp.push(detalle);
    mostrarDetallesPedido();
    enviarDetallePedido(detalle, url);
    mostrarDetallesActuales();
    // Llamar a enviarDetallePedido con el detalle recién agregado
}



function enviarDetallePedido(detalle, url) {
    fetch(url, {
        method: "POST",
        body: JSON.stringify(detalle),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error al enviar el detalle del pedido al servidor");
            }
            // Procesar la respuesta JSON recibida
            return response.json();
        })
        .then((data) => {
            console.log("Detalle del pedido enviado correctamente:", data.message);
            // Limpiar los campos después de agregar el detalle
            document.getElementById("ProductoId").value = "";
            document.getElementById("Cantidad").value = "";
            document.getElementById("PrecioUnitario").value = "";
            document.getElementById("UnidadId").value = "";


            mostrarDetallesPedido(); // Actualizar la tabla de detalles
        })
        .catch((error) => {
            console.error("Error al enviar el detalle del pedido al servidor:", error);
        });

}




function eliminarDetalle(index) {
    console.log(index);
    $.ajax({
        url: '/DetallePedidos/EliminarDetalle',
        type: 'POST',
        data: { index: index },
        success: function (response) {
            // Manejar la respuesta del servidor, como actualizar la interfaz de usuario
            console.log('Detalle eliminado exitosamente');
            // Eliminar el detalle de la lista detallesdepedidp
            detallesdepedidp.splice(index, 1);
            // Actualizar la tabla de detalles
            mostrarDetallesPedido();
            mostrarDetallesActuales();// Actualizar los detalles mostrados en la tabla

        },
        error: function (xhr, status, error) {
            // Manejar errores, como mostrar un mensaje al usuario
            console.error('Error al eliminar el detalle:', error);
        }
    });
}

function mostrarDetallesPedido() {
    var tablaDetalles = document.getElementById("listaDetallesPedido").getElementsByTagName("tbody")[0];
    tablaDetalles.innerHTML = "";

    detallesdepedidp.forEach(function (detalle, index) {
        var fila = tablaDetalles.insertRow();
        fila.insertCell(0).innerHTML = detalle.PedidoId;
        fila.insertCell(1).innerHTML = detalle.ProductoId;
        fila.insertCell(2).innerHTML = detalle.Cantidad;
        fila.insertCell(3).innerHTML = detalle.PrecioUnitario;
        fila.insertCell(4).innerHTML = detalle.UnidadId; // Aquí se muestra la unidad
        fila.insertCell(5).innerHTML = detalle.Cantidad * detalle.PrecioUnitario; // Subtotal
        // Agregar un botón de eliminar en la última celda de cada fila
        var btnEliminar = document.createElement("button");
        btnEliminar.innerHTML = '<i class="fa-solid fa-trash-can"></i>'; // Icono de eliminación
        btnEliminar.onclick = function () {
            eliminarDetalle(index);
        };
        fila.insertCell(6).appendChild(btnEliminar); // Insertar el botón en la última celda (índice 6)
    });
}

$(document).ready(function () {
    // Función para obtener y mostrar los detalles del producto seleccionado
    $('#ProductoId').on('input', function () {
        const productId = $(this).val();
        console.log('ProductoId seleccionado:', productId);

        // Llamada a la API para obtener los lotes del producto
        fetch(`https://localhost:7013/api/Lotes/GetLotes`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los lotes del producto');
                }
                return response.json();
            })
            .then(data => {
                // Filtrar los lotes por productId seleccionado
                // Filtrar los lotes por productId seleccionado
                const lotesProducto = data.filter(lote => lote.productoId == productId);
                console.log("Lotes del producto ID:", lotesProducto)
                if (lotesProducto.length > 0) {
                    // Encontrar el lote con la fecha de vencimiento más próxima
                    const loteProximoVencimiento = lotesProducto.reduce((anterior, actual) => {
                        const fechaActual = new Date(actual.fechaVencimiento);
                        const fechaAnterior = anterior ? new Date(anterior.fechaVencimiento) : null;
                        return (!fechaAnterior || fechaActual < fechaAnterior) ? actual : anterior;
                    });

                    console.log("Lote con la fecha de vencimiento más próxima:", loteProximoVencimiento);
                    const precio = loteProximoVencimiento.precioPorUnidadProducto; // Ajusta esta propiedad según la estructura real
                    $('#PrecioUnitario').val(precio);
                } else {
                    // Manejar el caso en que no se encuentren lotes
                    $('#PrecioUnitario').val('');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al obtener los lotes del producto');
            });



        // Llamada a la API de productos para obtener la cantidad total y establecer el marcador de posición
        fetch(`https://localhost:7013/api/Productos/GetProductos`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los productos');
                }
                return response.json();
            })
            .then(data => {
                // Filtrar los productos por productId seleccionado
                const productoSeleccionado = data.find(producto => producto.productoId == productId);


                if (productoSeleccionado) {
                    // Mostrar la cantidad total como marcador de posición en el campo "Cantidad"
                    $('#Cantidad').attr('placeholder', `Cantidad total Disponible en l inventario: ${productoSeleccionado.cantidadTotal}`);
                } else {
                    // Si no se encuentra ningún producto con el productId seleccionado, mostrar un mensaje
                    $('#Cantidad').attr('placeholder', '');
                }

                $('#Cantidad').on('input', function () {
                    const cantidadIngresada = parseFloat($(this).val()); // Convertir el valor a un número flotante
                    console.log(cantidadIngresada);
                    const cantidadDisponible = parseFloat($('#Cantidad').attr('placeholder').split(':')[1].trim());
                    console.log(cantidadDisponible);

                    if (isNaN(cantidadIngresada)) {
                        // Si la cantidad ingresada no es un número válido, mostrar mensaje de error
                        $('#Cantidad').addClass('input-validation-error'); // Agregar la clase de error al campo
                        $('span[data-valmsg-for="Cantidad"]').text('Por favor, ingrese una cantidad válida'); // Mostrar el mensaje de error
                        $('#Cantidad').addClass('is-invalid'); // Agregar la clase de error al campo para los estilos de Bootstrap
                    } else if (cantidadIngresada > cantidadDisponible) {
                        // Si la cantidad ingresada es mayor que la cantidad disponible, mostrar mensaje de error
                        $('#Cantidad').addClass('input-validation-error');
                        // Agregar la clase de error al campo
                        $('span[data-valmsg-for="Cantidad"]').text('La cantidad ingresada no puede ser mayor que la cantidad disponible');
                        $('#btnEnviar').prop('disabled', true);
                        // Mostrar el mensaje de error
                        // Puedes deshabilitar el botón de envío u otra acción según tus necesidades
                        $('#Cantidad').addClass('is-invalid'); // Agregar la clase de error al campo para los estilos de Bootstrap
                    } else if (cantidadIngresada <= 0) {
                        // Si la cantidad ingresada es menor o igual a 0, mostrar mensaje de error
                        $('#Cantidad').addClass('input-validation-error');
                        // Agregar la clase de error al campo
                        $('span[data-valmsg-for="Cantidad"]').text('La cantidad ingresada no puede ser menor o igual a 0');
                        $('#btnEnviar').prop('disabled', true);
                        // Mostrar el mensaje de error
                        // Puedes deshabilitar el botón de envío u otra acción según tus necesidades
                        $('#Cantidad').addClass('is-invalid'); // Agregar la clase de error al campo para los estilos de Bootstrap
                    } else {
                        // Si la cantidad ingresada es válida, quitar la clase de error del campo
                        $('#Cantidad').removeClass('input-validation-error');
                        // Quitar el mensaje de error
                        $('span[data-valmsg-for="Cantidad"]').text('');
                        // Quitar la clase de error del campo para los estilos de Bootstrap
                        $('#Cantidad').removeClass('is-invalid');
                        // Puedes habilitar el botón de envío u otra acción según tus necesidades
                    }
                });


            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al obtener los productos');
            });


        // Evento input para el campo "ProductoId"
        $('#ProductoId').on('input', function () {
            const productId = $(this).val();
            console.log('ProductoId seleccionado:', productId);
            if (productId) {
                // Si hay un productId seleccionado, obtener y mostrar los detalles del producto
            } else {
                // Si el campo está vacío, limpiar los campos relacionados
                $('#PrecioUnitario').val('');
                $('#Cantidad').attr('placeholder', '');
            }
        });

        // Evento input para el campo "Cantidad"

        // Evento input para el campo "Cantidad"
       

    });
});




// Función para obtener y mostrar los detalles actuales
function mostrarDetallesActuales() {
    // Realizar una solicitud al servidor para obtener la lista global de detalles
    $.get('/DetallePedidos/ObtenerDetalles', function (data) {
        // Mostrar los detalles en la consola
        console.log('Detalles actuales:', data);
    });
}








