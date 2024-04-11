var compra = null;

document.getElementById("formCompra").addEventListener("submit", function (event) {
    event.preventDefault();

    compra = {
        ProveedorId: document.getElementById("ProveedorId").value,
        NumeroFactura: document.getElementById("NumeroFactura").value,
        FechaCompra: document.getElementById("FechaCompra").value,
        EstadoCompra: document.getElementById("EstadoCompra").value,
        DetalleCompra: [],
        Lotes: []
    };
    console.log(compra);
});

// Función para agregar detalles a la tabla
function agregarDetalleATabla(detalleCompra, lote) {
    var detalleTableBody = document.getElementById("detalleTableBody");
    var row = detalleTableBody.insertRow();
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);
    var cell7 = row.insertCell(6);
    var cell8 = row.insertCell(7);
    var cell9 = row.insertCell(8);
    var cell10 = row.insertCell(9);

    // Mostrar los detalles de compra
    cell1.textContent = detalleCompra.ProductoId;
    cell2.textContent = detalleCompra.Cantidad;

    // Mostrar los detalles del lote
    cell3.textContent = lote.NumeroLote;
    cell4.textContent = lote.PrecioCompra;
    cell5.textContent = lote.PrecioDetal;
    cell6.textContent = lote.PrecioxMayor;
    cell7.textContent = lote.FechaVencimiento;
    cell8.textContent = lote.Cantidad;
    cell9.textContent = lote.EstadoLote;

    var editButton = document.createElement("button");
    editButton.innerHTML = "✏️"; // Emoji de lápiz para editar
    editButton.classList.add("btn", "btn-primary", "btn-editar-detalle");
    editButton.dataset.index = detalleTableBody.rows.length - 1;
    cell10.appendChild(editButton);

    // Agregar botón de eliminar con emoji
    var deleteButton = document.createElement("button");
    deleteButton.innerHTML = "❌"; // Emoji de cruz para eliminar
    deleteButton.classList.add("btn", "btn-danger", "btn-eliminar-detalle");
    deleteButton.dataset.index = detalleTableBody.rows.length - 1;
    cell10.appendChild(deleteButton);
}

// Función para eliminar un detalle del pedido
function eliminarDetalle(index) {
    compra.DetalleCompra.splice(index, 1); // Eliminar el detalle del pedido de la lista de detalles
    compra.Lotes.splice(index, 1); // Eliminar el lote asociado al detalle
    actualizarTablaDetalle(); // Actualizar la tabla de detalles del pedido después de eliminar un detalle
}

// Función para editar un detalle del pedido
function editarDetalle(index) {
    var detalleCompra = compra.DetalleCompra[index];
    var lote = compra.Lotes[index];

    // Rellenar los campos del formulario de edición con los datos del detalle del pedido
    document.getElementById("ProductoId").value = detalleCompra.ProductoId;
    document.getElementById("Cantidad").value = detalleCompra.Cantidad;
    document.getElementById("NumeroLote").value = lote.NumeroLote;
    document.getElementById("PrecioCompra").value = lote.PrecioCompra;
    document.getElementById("PrecioDetal").value = lote.PrecioDetal;
    document.getElementById("PrecioxMayor").value = lote.PrecioxMayor;
    document.getElementById("FechaVencimiento").value = lote.FechaVencimiento;
    document.getElementById("EstadoLote").value = lote.EstadoLote;

    // Mostrar el formulario de edición de detalles del pedido
    document.getElementById("detallecontainer").classList.remove("d-none");

    // Eliminar el detalle del pedido de la lista de detalles
    compra.DetalleCompra.splice(index, 1);
    compra.Lotes.splice(index, 1);

    // Actualizar la tabla de detalles del pedido
    actualizarTablaDetalle();
}

document.getElementById("formDetallecompra").addEventListener("submit", function (event) {
    event.preventDefault();

    var productoIdDetalleCompra = document.getElementById("ProductoId").value;

    // Crear el detalle del pedido
    var detalleCompra = {
        ProductoId: document.getElementById("ProductoId").value,
        Cantidad: document.getElementById("Cantidad").value
    };

    var lote = {
        ProductoId: productoIdDetalleCompra,
        NumeroLote: document.getElementById("NumeroLote").value,
        PrecioCompra: document.getElementById("PrecioCompra").value,
        PrecioDetal: document.getElementById("PrecioDetal").value,
        PrecioxMayor: document.getElementById("PrecioxMayor").value,
        FechaVencimiento: document.getElementById("FechaVencimiento").value,
        Cantidad: document.getElementById("Cantidad").value,
        EstadoLote: document.getElementById("EstadoLote").value
    };

    // Agregar el detalle del pedido y el lote a las respectivas listas
    compra.DetalleCompra.push(detalleCompra);
    compra.Lotes.push(lote);

    // Reiniciar el formulario de detalles del pedido
    document.getElementById("formDetallecompra").reset();

    // Actualizar la tabla de detalles del pedido después de agregar un nuevo detalle
    actualizarTablaDetalle();
});

document.getElementById("btnGuardarCompra").onclick = function () {
    if (compra === null || compra.DetalleCompra.length === 0 || compra.Lotes.length === 0) {
        console.error('No se puede guardar una compra sin detalles.');
        return;
    }

    // Enviar la solicitud POST al servidor utilizando la Fetch API
    fetch('https://localhost:7013/api/Compras/InsertCompras', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(compra)
    })
        .then(response => {
            if (response.ok) {
                alert('compra guardada correctamente.');
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
    compra = null;
    document.getElementById("formCompra").reset();
};

function actualizarTablaDetalle() {
    // Implementa esta función según tus necesidades
    // Puedes recorrer la lista de detalles de compra y lote
    // para actualizar la tabla en el front-end
}

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
