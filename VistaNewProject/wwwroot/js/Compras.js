
function agregarCompra() {
    const proveedorId = document.getElementById('ProveedorId').value;
    const numeroFactura = document.getElementById('NumeroFactura').value;
    const fechaCompra = document.getElementById('FechaCompra').value;
    const estadoCompra = document.getElementById('EstadoCompra').value;
   
    const compraObjeto = {
        ProveedorId: proveedorId,
        NumeroFactura: numeroFactura,
        FechaCompra: fechaCompra,
        EstadoCompra: estadoCompra
    };

    fetch('https://localhost:7013/api/Compras/InsertarCompra', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(compraObjeto)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ocurri� un error al enviar la solicitud.');
            }
            return response.json();
        })
        .then(data => {
            console.log('Respuesta del servidor:', data);
            location.reload(); // Recargar la p�gina
        })
        .catch(error => {
            console.error('Error:', error);
        });
}



function obtenerDatosCompra(compraId) {
    fetch(`https://localhost:7013/api/Compras/GetCompraById?Id=${compraId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos de la compra.');
            }
            return response.json();
        })
        .then(compra => {
            // Llenar los campos del formulario modal con los datos del cliente
            document.getElementById('CompraId').value = compra.compraId;
            document.getElementById('ProveedorId').value = compra.proveedorId;
            document.getElementById('NumeroFactura').value = compra.numeroFactura;
            document.getElementById('FechaCompra').value = compra.fechaCompra;
            document.getElementById('EstadoCompra').value = compra.estadoCompra;


            // Cambiar el t�tulo de la ventana modal
            document.getElementById('TituloModal').innerText = 'Editar Compra';
            // Ocultar el bot�n "Agregar" y mostrar el bot�n "Actualizar Usuario"
            document.getElementById('btnGuardar').style.display = 'none';
            document.getElementById('btnEditar').style.display = 'inline-block'; // Mostrar el bot�n "Actualizar Usuario"
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function ActualizarCompra() {
    const compraId = document.getElementById('CompraId').value;
    const proveedorId = document.getElementById('ProveedorId').value;
    const numeroFactura = document.getElementById('NumeroFactura').value;
    const fechaCompra = document.getElementById('FechaCompra').value;
    const estadoCompra = document.getElementById('EstadoCompra').value;

    const compraObjeto = {
        CompraId: compraId,
        ProveedorId: proveedorId,
        NumeroFactura: numeroFactura,
        FechaCompra: fechaCompra,
        EstadoCompra: estadoCompra
    };

    fetch(`https://localhost:7013/api/Compras/UpdateCompras`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(compraObjeto)
    })
        .then(response => {
            if (response.ok) {
                alert('compra actualizada correctamente.');
                location.reload(true); // Recargar la p�gina despu�s de la actualizaci�n
            } else {
                alert("Error en la actualizaci�n. Por favor, int�ntalo de nuevo m�s tarde.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Error en la actualizaci�n. Por favor, int�ntalo de nuevo m�s tarde.");
        });
}

function eliminarCompra(compraId) {
    // Hacer la solicitud DELETE al servidor para eliminar la compraId
    fetch(`https://localhost:7013/api/Compras/DeleteCompra/${compraId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar la Compra.');
            }
            // Aqu� puedes manejar la respuesta si es necesario
            console.log('Compra eliminado correctamente.');
            // Recargar la p�gina o actualizar la lista de clientes, seg�n sea necesario
            location.reload(); // Esto recarga la p�gina
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function limpiarFormulario() {
    // Limpiar los valores de los campos del formulario
    document.getElementById('CompraId').value = '';
    document.getElementById('ProveedorId').value = '';
    document.getElementById('NumeroFactura').value = '';
    document.getElementById('FechaCompra').value = '';
    document.getElementById('EstadoCompra').value = '';

    document.getElementById('TituloModal').innerText = 'Agregar Compra';
    document.getElementById('btnGuardar').style.display = 'inline-block'; // Mostrar el bot�n "Actualizar Usuario"
    document.getElementById('btnEditar').style.display = 'none';
}
