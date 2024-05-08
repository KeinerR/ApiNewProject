
var detallesdepedidp = [];


var detallesdepedidp = [];

function agregarDetalle(url) {
    var pedidoIdJson = new URLSearchParams(window.location.search).get('pedidoId');
    var pedidoId = JSON.parse(pedidoIdJson).pedidoId;
    var detalle = {
        PedidoId: pedidoId,
        ProductoId: document.getElementById("ProductoId").value,
        Cantidad: document.getElementById("Cantidad").value,
        PrecioUnitario: document.getElementById("PrecioUnitario").value
    };

    detallesdepedidp.push(detalle);
    mostrarDetallesPedido();
    enviarDetallesPedido(url); // Llamar a enviarDetallesPedido después de agregar el detalle
}

function enviarDetallesPedido(url) {
    var data = detallesdepedidp;
    console.log(data);
    console.log(url);

    fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error al enviar los detalles del pedido al servidor");
            }
            return response.json(); // Procesar la respuesta si es necesario
        })
        .then((data) => {
            console.log("Detalles del pedido enviados correctamente:", data);
            // Limpiar los campos después de agregar el detalle
            document.getElementById("ProductoId").value = "";
            document.getElementById("Cantidad").value = "";
            document.getElementById("PrecioUnitario").value = "";
            detallesdepedidp = []; // Limpiar la lista de detalles después de enviarlos
            mostrarDetallesPedido(); // Actualizar la tabla de detalles después de limpiar
        })
        .catch((error) => {
            console.error("Error al enviar los detalles del pedido al servidor:", error);
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

