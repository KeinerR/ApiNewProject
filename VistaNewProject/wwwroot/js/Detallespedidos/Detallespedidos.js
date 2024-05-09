var detallesdepedidp = [];

function agregarDetalle(url) {
    var detalle = {
        PedidoId: document.getElementById("pedidoId").value,
        ProductoId: document.getElementById("ProductoId").value,
        Cantidad: document.getElementById("Cantidad").value,
        PrecioUnitario: document.getElementById("PrecioUnitario").value
    };

    detallesdepedidp.push(detalle);
    mostrarDetallesPedido();
    enviarDetallePedido(detalle, url); // Llamar a enviarDetallePedido con el detalle recién agregado
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
        mostrarDetallesPedido(); // Actualizar la tabla de detalles
    })
    .catch((error) => {
        console.error("Error al enviar el detalle del pedido al servidor:", error);
    });

}


function mostrarDetallesPedido() {
    var tablaDetalles = document.getElementById("listaDetallesPedido").getElementsByTagName("tbody")[0];
    tablaDetalles.innerHTML = "";

    detallesdepedidp.forEach(function (detalle) {
        var fila = tablaDetalles.insertRow();
        fila.insertCell(0).innerHTML = detalle.PedidoId;
        fila.insertCell(1).innerHTML = detalle.ProductoId;
        fila.insertCell(2).innerHTML = detalle.Cantidad;
        fila.insertCell(3).innerHTML = detalle.PrecioUnitario;
    });
}







// Obtener el precio unitario del producto seleccionado
$(document).ready(function () {
    $('#ProductoId').change(function () {
        var productId = $(this).val();
        console.log('ProductoId seleccionado:', productId); 
        fetch(`https://localhost:7013/api/Lotes/GetLotes`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los lotes del producto');
                }
                return response.json();
            })
            .then(data => {

                const keiner = data
                console.log(keiner);
                // Filtrar los lotes para encontrar el que coincida con el productoId
                const lote = keiner.find(keiner => keiner.PrecioUnitario === productId);
                if (!lote) {
                    throw new Error('No se encontró un lote para el producto seleccionado');
                }
                // Suponiendo que los datos devueltos tienen la estructura { productoId, precio }
                // Ajusta esta parte según la estructura real de tus datos
                const precio = lote.precio;
                $('#precioUnitario').val(precio);
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al obtener el precio del producto');
            });
    });
});

