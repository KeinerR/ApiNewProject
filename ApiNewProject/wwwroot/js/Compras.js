// Declarar el objeto compra fuera de la función de envío del formulario
var compra = null;
// Obtener la fecha actual
var fechaActual = new Date().toISOString().slice(0, 16);

// Establecer el valor del campo de fecha a la fecha actual
document.getElementById("FechaCompra").value = fechaActual;
// Obtener la fecha actual
var fechavencimiento = new Date().toISOString().slice(0, 16);

// Establecer el valor del campo de fecha a la fecha actual
document.getElementById("FechaVencimiento").value = fechavencimiento;

document.getElementById("formCompra").addEventListener("submit", function (event) {
    event.preventDefault();

    // Recoger los valores del formulario
    var proveedorId = document.getElementById("ProveedorId").value;
    var numeroFactura = document.getElementById("NumeroFactura").value;
    var fechaCompra = document.getElementById("FechaCompra").value;
    var estadoCompra = document.getElementById("EstadoCompra").value;

    // Crear el objeto compra solo si es nulo
    if (compra === null) {
        compra = {
            ProveedorId: proveedorId,
            NumeroFactura: numeroFactura,
            FechaCompra: fechaCompra,
            EstadoCompra: estadoCompra,
            Detallecompras: [] // Inicializar el arreglo de detalles de compra
        };
    }

    // Recoger los valores de los detalles de compra
    var productoId = document.getElementById("ProductoId").value;
    var cantidad = document.getElementById("Cantidad").value;
    var numeroLote = document.getElementById("NumeroLote").value;
    var precioCompra = document.getElementById("PrecioCompra").value;
    var precioDetal = document.getElementById("PrecioDetal").value;
    var precioMayor = document.getElementById("PrecioxMayor").value;
    var fechaVencimiento = document.getElementById("FechaVencimiento").value;
    var estadoLote = document.getElementById("EstadoLote").value;

    // Crear el objeto detalleCompra con los valores recogidos
    var detalleCompra = {
        ProductoId: productoId,
        Cantidad: cantidad,
        Lotes: [
            {
                NumeroLote: numeroLote,
                PrecioCompra: precioCompra,
                PrecioDetal: precioDetal,
                PrecioxMayor: precioMayor,
                FechaVencimiento: fechaVencimiento,
                EstadoLote: estadoLote
            }
        ]
    };

    // Agregar el detalle de compra al arreglo de detalles de compra
    compra.Detallecompras.push(detalleCompra);

    console.log(compra)
    console.log(compra.Detallecompras)

    // Actualizar la tabla de detalles del pedido
    actualizarTablaDetalle();

    // Limpiar los campos del formulario después de agregar la compra
    limpiarDatosCompra();
});

// Función para actualizar la tabla de detalles del pedido
function actualizarTablaDetalle() {
    var detalleTableBody = document.getElementById("detalleTableBodyContent");
    detalleTableBody.innerHTML = "";

    compra.Detallecompras.forEach(function (detalleCompra, index) {
        detalleCompra.Lotes.forEach(function (lote) {
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

            cell1.textContent = detalleCompra.ProductoId;
            cell2.textContent = detalleCompra.Cantidad;
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
            editButton.dataset.index = index;
            cell10.appendChild(editButton);

            // Agregar botón de eliminar con emoji
            var deleteButton = document.createElement("button");
            deleteButton.innerHTML = "❌"; // Emoji de cruz para eliminar
            deleteButton.classList.add("btn", "btn-danger", "btn-eliminar-detalle");
            deleteButton.dataset.index = index;
            cell10.appendChild(deleteButton);
        });
    });

    // Agregar eventos de clic a los botones de "Editar" y "Eliminar"
    agregarEventosEditar();
    agregarEventosEliminar();
}

// Función para agregar eventos de clic a los botones de "Editar"
function agregarEventosEditar() {
    var botonesEditar = document.querySelectorAll(".btn-editar-detalle");
    botonesEditar.forEach(function (boton) {
        boton.addEventListener("click", function () {
            var index = this.dataset.index;
            editarDetalle(index);
        });
    });
}

// Función para agregar eventos de clic a los botones de "Eliminar"
function agregarEventosEliminar() {
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
    compra.Detallecompras.splice(index, 1); // Eliminar el detalle del pedido de la lista de detalles
    actualizarTablaDetalle(); // Actualizar la tabla de detalles del pedido después de eliminar un detalle
}

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

    // Mostrar el formulario de edición de detalles del pedido si existe
    var detalleContainer = document.getElementById("detallecontainer");
    if (detalleContainer) {
        detalleContainer.classList.remove("d-none");
    } else {
        console.error("Elemento 'detallecontainer' no encontrado.");
    }

    // Eliminar el detalle del pedido de la lista de detalles
    compra.Detallecompras.splice(index, 1);

    // Actualizar la tabla de detalles del pedido
    actualizarTablaDetalle();
}


// Función para limpiar los campos del formulario de compra después de agregar la compra
function limpiarDatosCompra() {
  
   
    document.getElementById("ProductoId").value = "";
    document.getElementById("Cantidad").value = "";
    document.getElementById("NumeroLote").value = "";
    document.getElementById("PrecioCompra").value = "";
    document.getElementById("PrecioDetal").value = "";
    document.getElementById("PrecioxMayor").value = "";
  
}


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






function obtenerDatosCompras(CompraId) {
    fetch(`https://localhost:7013/api/Compras/GetCompraById?id=${CompraId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos del cliente.');
            }
            return response.json();
        })
        .then(compra => {
            // Llenar los campos del formulario modal con los datos del cliente
            console.log(compra)
            document.getElementById('CompraId').value = com;
            document.getElementById('ProveedorId').value = cliente.identificacion;
            document.getElementById('NumeroFactura').value = cliente.nombreEntidad;
            document.getElementById('FechaCompra').value = cliente.nombreCompleto;
            document.getElementById('EstadoCompra').value = cliente.tipoCliente;
           

            // Cambiar el título de la ventana modal
            document.getElementById('TituloModal').innerText = 'Editar Cliente';
            // Ocultar el botón "Agregar" y mostrar el botón "Actualizar Usuario"
            document.getElementById('btnGuardar').style.display = 'none';
            document.getElementById('btnEditar').style.display = 'inline-block'; // Mostrar el botón "Actualizar Usuario"
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function limpiardatos() {
    // Limpiar los campos del formulario de detalle
    document.getElementById("ProductoId").value = "";
    document.getElementById("Cantidad").value = "";
    document.getElementById("NumeroLote").value = "";
    document.getElementById("PrecioCompra").value = "";
    document.getElementById("PrecioDetal").value = "";
    document.getElementById("PrecioxMayor").value = "";
    document.getElementById("FechaVencimiento").value = "";
}