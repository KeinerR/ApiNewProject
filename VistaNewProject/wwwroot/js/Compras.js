var compra = null;

document.getElementById("formCompra").addEventListener("submit", function (event) {
    event.preventDefault();

    compra = {
        ProveedorId: document.getElementById("ProveedorId").value,
        NumeroFactura: document.getElementById("NumeroFactura").value,
        FechaCompra: document.getElementById("FechaCompra").value,
        EstadoCompra: document.getElementById("EstadoCompra").value,
        Detallecompras: []
    };
    console.log(compra)
    console.log(compra.Detallecompras);
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
    compra.Detallecompras.splice(index, 1); // Eliminar el detalle del pedido de la lista de detalles
    actualizarTablaDetalle(); // Actualizar la tabla de detalles del pedido después de eliminar un detalle
}

// Función para editar un detalle del pedido
function editarDetalle(index) {
    var detalleCompra = compra.Detallecompras[index];

    // Rellenar los campos del formulario de edición con los datos del detalle del pedido
    document.getElementById("ProductoId").value = detalleCompra.ProductoId;
    document.getElementById("Cantidad").value = detalleCompra.Cantidad;
    document.getElementById("NumeroLote").value = detalleCompra.Lotes[0].NumeroLote;
    document.getElementById("PrecioCompra").value = detalleCompra.Lotes[0].PrecioCompra;
    document.getElementById("PrecioDetal").value = detalleCompra.Lotes[0].PrecioDetal;
    document.getElementById("PrecioxMayor").value = detalleCompra.Lotes[0].PrecioxMayor;
    document.getElementById("FechaVencimiento").value = detalleCompra.Lotes[0].FechaVencimiento;
    document.getElementById("EstadoLote").value = detalleCompra.Lotes[0].EstadoLote;

    // Mostrar el formulario de edición de detalles del pedido
    document.getElementById("detallecontainer").classList.remove("d-none");

    // Eliminar el detalle del pedido de la lista de detalles
    compra.Detallecompras.splice(index, 1);

    // Actualizar la tabla de detalles del pedido
    actualizarTablaDetalle();
}

document.getElementById("formDetallecompra").addEventListener("submit", function (event) {
    event.preventDefault();

    var productoIdDetalleCompra = document.getElementById("ProductoId").value;

    // Crear el detalle del pedido
    var detalleCompra = {
        ProductoId: document.getElementById("ProductoId").value,
        Cantidad: document.getElementById("Cantidad").value,
        Lotes: [
            {
                ProductoId: productoIdDetalleCompra,
                NumeroLote: document.getElementById("NumeroLote").value,
                PrecioCompra: document.getElementById("PrecioCompra").value,
                PrecioDetal: document.getElementById("PrecioDetal").value,
                PrecioxMayor: document.getElementById("PrecioxMayor").value,
                FechaVencimiento: document.getElementById("FechaVencimiento").value,
                Cantidad: document.getElementById("Cantidad").value,
                EstadoLote: document.getElementById("EstadoLote").value
            }
        ]
    };

    // Agregar el detalle del pedido a la lista de detalles
    compra.Detallecompras.push(detalleCompra);

    // Reiniciar el formulario de detalles del pedido
    document.getElementById("formDetallecompra").reset();

    // Actualizar la tabla de detalles del pedido después de agregar un nuevo detalle
    actualizarTablaDetalle();
});

document.getElementById("btnGuardarCompra").onclick = function () {
    if (compra === null || compra.Detallecompras.length === 0) {
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
                alert('Compra guardada correctamente.');
                location.reload(true); // Recargar la página después de la actualización
            } else {
                alert("Error en la actualización. Por favor, inténtalo de nuevo más tarde.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Error en la actualización. Por favor, inténtalo de nuevo más tarde.");
        });

    // Limpiar el formulario de compra y el objeto compra
    compra = null;
    document.getElementById("formCompra").reset();
};

function actualizarTablaDetalle() {
    var detalleTableBody = document.getElementById("detalleTableBody");
    // Limpiar la tabla
    detalleTableBody.innerHTML = "";

    // Recorrer la lista de detalles de compra y agregar cada detalle a la tabla
    compra.Detallecompras.forEach((detalleCompra, index) => {
        var lote = detalleCompra.Lotes[0]; // Se asume un solo lote por detalle
        agregarDetalleATabla(detalleCompra, lote);
    });
}



function obtenerDatosCompras(CompraId) {
    fetch(`https://localhost:7013/api/Compras/GetCompraById?id=${CompraId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos del cliente.');
            }
            return response.json();
        })
        .then(compra => {
            console.log(compra);
            document.getElementById('CompraId').value = compra.CompraId;
            console.log(CompraId);
            document.getElementById('ProveedorId').value = compra.proveedorId;
            document.getElementById('NumeroFactura').value = compra.numeroFactura;
            document.getElementById('FechaCompra').value = compra.fechaCompra;
            document.getElementById('EstadoCompra').value = compra.estadoCompra;

            var btnCancelar = document.getElementById('btnCancelar');
            var btnGuardarCompra = document.getElementById('btnGuardarCompra');
            var btnCerrar = document.getElementById('btnCerrar');
            var asignardetalle = document.getElementById('asignardetalle');
            var detalleTable = document.getElementById('detalleTable');
            var guardar = document.getElementById('guardar');

            if (btnCancelar && btnGuardarCompra && btnCerrar && asignardetalle && detalleTable && guardar) {
                btnCancelar.style.display = 'none';
                btnGuardarCompra.style.display = 'none';
                btnCerrar.style.display = 'none';
                asignardetalle.style.display = 'none';
                detalleTable.style.display = 'none';
                guardar.style.display = 'none';




            } else {
                console.error('Alguno de los botones no existe en el documento.');
            }
            document.getElementById('btnEditar').style.display = 'block'; // o 'inline-block'

        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function ActualizarCompra() {
    const compraId = document.getElementById('CompraId').value;
    const proveedorId = document.getElementById('ProveedorId').value;
    const numeroFactura = document.getElementById('NumeroFactura').value;
    const fechacompra = document.getElementById('FechaCompra').value;
    const estadoCompra = document.getElementById('EstadoCompra').value;
    console.log(" esta es el id" + compraId)
    

    const compra = {
        compraId: compraId,
        ProveedorId: proveedorId,
        NumeroFactura: numeroFactura,
        FechaCompra: fechacompra,
        EstadoCompra: estadoCompra,
    };

    console.log(compra)


    fetch(`https://localhost:7013/api/Compras/UpdateCompras`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(compra)
    })
        .then(response => {
            if (response.ok) {
                alert('compra actualizado correctamente.');
                location.reload(true); // Recargar la página después de la actualización
            } else {
                alert("Error en la actualización. Por favor, inténtalo de nuevo más tarde.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Error en la actualización. Por favor, inténtalo de nuevo más tarde.");
        });

   
}

function eliminarCliente(clienteId) {
    // Hacer la solicitud DELETE al servidor para eliminar el cliente
    fetch(`https://localhost:7013/api/Clientes/DeleteUser/${clienteId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar el cliente.');
            }
            // Aquí puedes manejar la respuesta si es necesario
            console.log('Cliente eliminado correctamente.');
            // Recargar la página o actualizar la lista de clientes, según sea necesario
            location.reload(); // Esto recarga la página
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


function limpiarFormulario() {
    // Limpiar los valores de los campos del formulario
    document.getElementById('ClienteId').value = '';
    document.getElementById('Identificacion').value = '';
    document.getElementById('NombreEntidad').value = '';;
    document.getElementById('NombreCompleto').value = '';
    document.getElementById('TipoCliente').value = '';
    document.getElementById('Telefono').value = '';
    document.getElementById('Correo').value = '';
    document.getElementById('Direccion').value = '';
    document.getElementById('EstadoCliente').value = '';

    document.getElementById('TituloModal').innerText = 'Agregar Cliente';
    document.getElementById('btnGuardar').style.display = 'inline-block'; // Mostrar el botón "Actualizar Cliente"
    document.getElementById('btnEditar').style.display = 'none';
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
