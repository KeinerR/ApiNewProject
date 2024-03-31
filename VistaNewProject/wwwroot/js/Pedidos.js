var pedido = null; // Inicializamos el pedido como nulo al principio

document.getElementById("formPedido").addEventListener("submit", function (event) {
    event.preventDefault();

    // Creamos el pedido si no existe
    if (pedido === null) {
        pedido = {
            ClienteId: document.getElementById("ClienteId1").value,
            TipoServicio: document.getElementById("TipoServicio1").value,
            FechaPedido: document.getElementById("FechaPedido1").value,
            EstadoPedido: document.getElementById("EstadoPedido1").value,
            Detallepedidos: [] // Inicializamos los detalles del pedido como una lista vacía
        };
        console.log('Cantidad de detalles de pedido agregados:', pedido.Detallepedidos.length);
    }

    console.log('Pedido guardado:', pedido);

});

document.getElementById("formDetallePedido").addEventListener("submit", function (event) {
    event.preventDefault();

    // Creamos el detalle del pedido
    var detallePedido = {
        ProductoId: document.getElementById("ProductoId2").value,
        Cantidad: document.getElementById("Cantidad2").value,
        PrecioUnitario: document.getElementById("PrecioUnitario2").value
    };

    // Agregamos el detalle del pedido a la lista de detalles del pedido
    if (pedido !== null) {
        pedido.Detallepedidos.push(detallePedido);
        console.log('Cantidad de detalles de pedido agregados:', pedido.Detallepedidos.length);
    } else {
        console.error('No se puede agregar el detalle del pedido sin guardar primero el pedido.');
        return;
    }

    console.log('Detalle de pedido agregado:', detallePedido);

    // Reiniciamos el formulario de detalles del pedido
    document.getElementById("formDetallePedido").reset();
});

document.getElementById("btnGuardarPedido").onclick = function () {
    if (pedido === null || pedido.Detallepedidos.length === 0) {
        console.error('No se puede guardar un pedido sin detalles.');
        return;
    }

    // Enviar la solicitud POST al servidor utilizando la Fetch API
    fetch('https://localhost:7013/api/Pedidos/InsertPedidos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pedido)
    })
        // Manejar errores de la solicitud
        .then(response => {
            if (response.ok) {
                alert('pedido guaradao correctamente.');
                location.reload(true); // Recargar la página después de la actualización
            } else {
                alert("Error en la actualización. Por favor, inténtalo de nuevo más tarde.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Error en la actualización. Por favor, inténtalo de nuevo más tarde.");
        });

    // Limpiamos el formulario de pedido y el objeto pedido
    pedido = null;
    document.getElementById("formPedido").reset();
  
};


    document.getElementById("TipoServicio1").addEventListener("change", function() {
        var tipoServicio = this.value;
    var domicilioFormContainer = document.getElementById("formDomicilioContainer");
        if (tipoServicio === "Domicilio") {

        domicilioFormContainer.classList.remove("d-none");
        } else {
        domicilioFormContainer.classList.add("d-none");
        }
    });

