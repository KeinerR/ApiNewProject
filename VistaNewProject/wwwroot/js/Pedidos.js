var pedido = null; // Inicializamos el pedido como nulo al principio

document.getElementById("formPedido").addEventListener("submit", function (event) {
    event.preventDefault();

    var tipoServicio = document.getElementById("TipoServicio1").value;
    var EstadoPedido = document.getElementById("EstadoPedido1").value;

    if (tipoServicio === "Domicilio") {
        pedido = {
            ClienteId: document.getElementById("ClienteId1").value,
            TipoServicio: tipoServicio,
            FechaPedido: document.getElementById("FechaPedido1").value,
            EstadoPedido: EstadoPedido,
            Detallepedidos: [],
            Domicilios: []
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

    console.log('Pedido guardado:', pedido); // Mostrar el objeto pedido en la consola del navegador
});

// Función para actualizar la tabla de detalles del pedido
function actualizarTablaDetalle() {
    var detalleTableBody = document.getElementById("detalleTableBody");
    detalleTableBody.innerHTML = "";

    pedido.Detallepedidos.forEach(function (detallePedido, index) {
        var row = detalleTableBody.insertRow();
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);

        cell1.textContent = detallePedido.ProductoId;
        cell2.textContent = detallePedido.Cantidad;
        cell3.textContent = detallePedido.PrecioUnitario;

        var editButton = document.createElement("button");
        editButton.innerHTML = "✏️"; // Emoji de lápiz para editar
        editButton.classList.add("btn", "btn-primary", "btn-editar-detalle");
        editButton.dataset.index = index;
        cell4.appendChild(editButton);

        // Agregar botón de eliminar con emoji
        var deleteButton = document.createElement("button");
        deleteButton.innerHTML = "❌"; // Emoji de cruz para eliminar
        deleteButton.classList.add("btn", "btn-danger", "btn-eliminar-detalle");
        deleteButton.dataset.index = index;
        cell4.appendChild(deleteButton);
    });

    // Agregar eventos de clic a los botones de "Editar"
    agregarEventoEditar();
    agregarEventoEliminar();
}

// Función para agregar eventos de clic a los botones de "Editar"
function agregarEventoEditar() {
    var botonesEditar = document.querySelectorAll(".btn-editar-detalle");
    botonesEditar.forEach(function (boton) {
        boton.addEventListener("click", function () {
            var index = this.dataset.index;
            editarDetalle(index);
        });
    });
}
function agregarEventoEliminar() {
    var botonesEliminar = document.querySelectorAll(".btn-eliminar-detalle");
    botonesEliminar.forEach(function (boton) {
        boton.addEventListener("click", function () {
            var index = this.dataset.index;
            eliminarDetalle(index);
        });
    });
}

// Función para eliminar un detalle del pedido
function eliminarDetalle(index) {
    pedido.Detallepedidos.splice(index, 1); // Eliminar el detalle del pedido de la lista de detalles
    actualizarTablaDetalle(); // Actualizar la tabla de detalles del pedido después de eliminar un detalle
}
// Función para editar un detalle del pedido
function editarDetalle(index) {
    var detallePedido = pedido.Detallepedidos[index];

    // Rellenar los campos del formulario de edición con los datos del detalle del pedido
    document.getElementById("ProductoId2").value = detallePedido.ProductoId;
    document.getElementById("Cantidad2").value = detallePedido.Cantidad;
    document.getElementById("PrecioUnitario2").value = detallePedido.PrecioUnitario;

    // Mostrar el formulario de edición de detalles del pedido
    document.getElementById("detallecontainer").classList.remove("d-none");

    // Eliminar el detalle del pedido de la lista de detalles
    pedido.Detallepedidos.splice(index, 1);

    // Actualizar la tabla de detalles del pedido
    actualizarTablaDetalle();
}

// Llama a la función actualizarTablaDetalle() cuando se envía el formulario de detalles del pedido
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
    // Reiniciar el formulario de detalles del pedido
    document.getElementById("formDetallePedido").reset();

    // Actualizar la tabla de detalles del pedido después de agregar un nuevo detalle
    actualizarTablaDetalle();
});


document.getElementById("formDomicilio").addEventListener("submit", function (event) {
    event.preventDefault();

    // Crear el detalle del domicilio
    var domicilio = {
        UsuarioId: document.getElementById("UsuarioId3").value,
        Observacion: document.getElementById("Observacion3").value,
        FechaEntrega: document.getElementById("FechaEntrega3").value,
        DireccionDomiciliario: document.getElementById("DireccionDomiciliario3").value,
        EstadoDomicilio: pedido ? pedido.EstadoPedido : null
    };

    // Agregar el detalle del domicilio a la lista de domicilios del pedido
    if (pedido !== null) {
        pedido.Domicilios.push(domicilio);
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
document.getElementById("asignardetalle").onclick = function () {
    var detalleContainer = document.getElementById("detallecontainer");
    if (detalleContainer.classList.contains("d-none")) {
        detalleContainer.classList.remove("d-none");
    } else {
        detalleContainer.classList.add("d-none");
    }
};


document.getElementById("cerrardetalle").onclick = function () {
    var detalleContainer = document.getElementById("detallecontainer");
    if (!detalleContainer.classList.contains("d-none")) {
        detalleContainer.classList.add("d-none");
    }
};

document.getElementById("cerradomicilio").onclick = function () {
    var domicilioContainer = document.getElementById("formDomicilioContainer");
    if (!domicilioContainer.classList.contains("d-none")) {
        domicilioContainer.classList.add("d-none");
    }
};

