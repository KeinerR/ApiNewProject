


var pedido = null; // Inicializamos el pedido como nulo al principio

document.getElementById("formPedido").addEventListener("submit", function (event) {
    event.preventDefault();

    var tipoServicio = document.getElementById("TipoServicio1").value;
    var EstadoPedido = document.getElementById("EstadoPedido1").value;

    // Construir el objeto pedido basado en el tipo de servicio
    if (tipoServicio === "Domicilio") {
        pedido = {
            ClienteId: document.getElementById("ClienteId1").value,
            TipoServicio: tipoServicio,
            FechaPedido: document.getElementById("FechaPedido1").value,
            EstadoPedido: EstadoPedido,
            Detallepedidos: [],
            Domicilios: [] // Corregido el nombre de la propiedad
        };
    } else {
        pedido = {
            ClienteId: document.getElementById("ClienteId1").value,
            TipoServicio: tipoServicio,
            FechaPedido: document.getElementById("FechaPedido1").value,
            EstadoPedido: EstadoPedido,
            Detallepedidos: []
        };
    }

    console.log('Pedido guardado:', pedido);
});

document.getElementById("formDetallePedido").addEventListener("submit", function (event) {
    event.preventDefault();

    // Crear el detalle del pedido
    var detallePedido = {
        ProductoId: document.getElementById("ProductoId2").value,
        Cantidad: document.getElementById("Cantidad2").value,
        PrecioUnitario: document.getElementById("PrecioUnitario2").value
    };

    // Agregar el detalle del pedido a la lista de detalles del pedido
    if (pedido !== null) {
        pedido.Detallepedidos.push(detallePedido);
    } else {
        console.error('No se puede agregar el detalle del pedido sin guardar primero el pedido.');
        return;
    }

    console.log('Detalle de pedido agregado:', detallePedido);

    // Reiniciar el formulario de detalles del pedido
    document.getElementById("formDetallePedido").reset();
});

document.getElementById("formDomicilio").addEventListener("submit", function (event) {
    event.preventDefault();

    // Crear el detalle del domicilio
    var domicilio = {
        UsuarioId: document.getElementById("UsuarioId3").value,
        Observacion: document.getElementById("Observacion3").value,
        FechaEntrega: document.getElementById("FechaEntrega3").value,
        DireccionDomiciliario: document.getElementById("DireccionDomiciliario3").value,
        EstadoDomicilio: pedido ? pedido.EstadoPedido : null // Corregir el nombre de la propiedad
    };

    // Agregar el detalle del domicilio a la lista de domicilios del pedido
    if (pedido !== null) {
        pedido.Domicilios.push(domicilio); // Corregir el nombre de la propiedad
    } else {
        console.error('No se puede agregar el detalle del domicilio sin guardar primero el pedido.');
        return;
    }

    console.log('Detalle de domicilio agregado:', domicilio);
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
        .then(response => {
            if (response.ok) {
                alert('Pedido guardado correctamente.');
                location.reload(true); // Recargar la página después de la actualización
            } else {
                alert("Error en la actualización. Por favor, inténtalo de nuevo más tarde.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Error en la actualización. Por favor, inténtalo de nuevo más tarde.");
        });

    // Limpiar el formulario de pedido y el objeto pedido
    pedido = null;
    document.getElementById("formPedido").reset();
};



document.getElementById("TipoServicio1").addEventListener("change", function () {
    var tipoServicio = this.value;
    var domicilioFormContainer = document.getElementById("formDomicilioContainer");
    if (tipoServicio === "Domicilio") {

        domicilioFormContainer.classList.remove("d-none");
    } else {
        domicilioFormContainer.classList.add("d-none");
    }
});
