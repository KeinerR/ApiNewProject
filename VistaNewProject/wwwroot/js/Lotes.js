function agregarLote() {
    const detalleCompraId = document.getElementById('DetalleCompraId').value;
    const productoId = document.getElementById('ProductoId').value;
    const numeroLote = document.getElementById('NumeroLote').value;
    const precioCompra = document.getElementById('PrecioCompra').value;
    const precioDetal = document.getElementById('PrecioDetal').value;
    const precioxMayor = document.getElementById('PrecioxMayor').value;
    const fechaVencimiento = document.getElementById('FechaVencimiento').value;
    const cantidad = document.getElementById('Cantidad').value;
    const estadoLote = document.getElementById('EstadoLote').value;

    const loteObjeto = {
        DetalleCompraId: detalleCompraId,
        ProductoId: productoId,
        NumeroLote: numeroLote,
        PrecioCompra: precioCompra,
        PrecioDetal: precioDetal,
        PrecioxMayor: precioxMayor,
        FechaVencimiento: fechaVencimiento,
        Cantidad: cantidad,
        EstadoLote: estadoLote
    };

    fetch('https://localhost:7013/api/Lotes/InsertarLote', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loteObjeto)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ocurrió un error al enviar la solicitud.');
            }
            return response.json();
        })
        .then(data => {
            console.log('Respuesta del servidor:', data);
            location.reload(); // Recargar la página
        })
        .catch(error => {
            console.error('Error:', error);
        });
}



function obtenerDatosLote(loteId) {
    fetch(`https://localhost:7013/api/Lotes/GetLoteById?Id=${loteId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos de la lote.');
            }
            return response.json();
        })
        .then(lote => {
            // Llenar los campos del formulario modal con los datos del cliente
            document.getElementById('LoteId').value = lote.loteId;
            document.getElementById('DetalleCompraId').value = lote.detalleCompraId;
            document.getElementById('ProductoId').value = lote.productoId;
            document.getElementById('NumeroLote').value = lote.numeroLote;
            document.getElementById('PrecioCompra').value = lote.precioCompra;
            document.getElementById('PrecioDetal').value = lote.precioDetal;
            document.getElementById('PrecioxMayor').value = lote.precioxMayor;
            document.getElementById('FechaVencimiento').value = lote.fechaVencimiento;
            document.getElementById('Cantidad').value = lote.cantidad;
            document.getElementById('EstadoLote').value = lote.estadoLote;

            // Cambiar el título de la ventana modal
            document.getElementById('TituloModal').innerText = 'Editar lote';
            // Ocultar el botón "Agregar" y mostrar el botón "Actualizar Usuario"
            document.getElementById('btnGuardar').style.display = 'none';
            document.getElementById('btnEditar').style.display = 'inline-block'; // Mostrar el botón "Actualizar Usuario"
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function ActualizarLote() {
    const loteId = document.getElementById('LoteId').value;
    const detalleCompraId = document.getElementById('DetalleCompraId').value;
    const productoId = document.getElementById('ProductoId').value;
    const numeroLote = document.getElementById('NumeroLote').value;
    const precioCompra = document.getElementById('PrecioCompra').value;
    const precioDetal = document.getElementById('PrecioDetal').value;
    const precioxMayor = document.getElementById('PrecioxMayor').value;
    const fechaVencimiento = document.getElementById('FechaVencimiento').value;
    const cantidad = document.getElementById('Cantidad').value;
    const estadoLote = document.getElementById('EstadoLote').value;

    const loteObjeto = {
        LoteId: loteId,
        DetalleCompraId: detalleCompraId,
        ProductoId: productoId,
        NumeroLote: numeroLote,
        PrecioCompra: precioCompra,
        PrecioDetal: precioDetal,
        PrecioxMayor: precioxMayor,
        FechaVencimiento: fechaVencimiento,
        Cantidad: cantidad,
        EstadoLote: estadoLote
    };

    fetch(`https://localhost:7013/api/Lotes/UpdateLotes`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loteObjeto)
    })
        .then(response => {
            if (response.ok) {
                alert('Lote actualizadO correctamente.');
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

function eliminarLote(loteId) {
    // Hacer la solicitud DELETE al servidor para eliminar la lote
    fetch(`https://localhost:7013/api/Lotes/DeleteLote/${loteId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar la lote.');
            }
            // Aquí puedes manejar la respuesta si es necesario
            console.log('Lote eliminado correctamente.');
            // Recargar la página o actualizar la lista de clientes, según sea necesario
            location.reload(); // Esto recarga la página
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function limpiarFormulario() {
    // Limpiar los valores de los campos del formulario
    document.getElementById('LoteId').value = '';
    document.getElementById('DetalleCompraId').value = '';
    document.getElementById('ProductoId').value = '';
    document.getElementById('NumeroLote').value = '';
    document.getElementById('PrecioCompra').value = '';
    document.getElementById('PrecioDetal').value = '';
    document.getElementById('PrecioxMayor').value = '';
    document.getElementById('FechaVencimiento').value = '';
    document.getElementById('Cantidad').value = '';
    document.getElementById('EstadoLote').value = '';

    document.getElementById('TituloModal').innerText = 'Agregar Lote';
    document.getElementById('btnGuardar').style.display = 'inline-block'; // Mostrar el botón "Actualizar Usuario"
    document.getElementById('btnEditar').style.display = 'none';
}
