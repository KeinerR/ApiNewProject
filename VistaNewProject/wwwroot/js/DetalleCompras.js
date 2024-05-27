
function agregarDetalleCompra() {
    const compraId = document.getElementById('CompraId').value;
    const productoId = document.getElementById('ProductoId').value;
    const cantidad = document.getElementById('Cantidad').value;
    
    const detalleCompraObjeto = {
        CompraId: compraId,
        ProductoId: productoId,
        Cantidad: cantidad
    };

    fetch('https://localhost:7013/api/Detallecompras/InsertarDetallecompra', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(detalleCompraObjeto)
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



function obtenerDatosDetalleCompra(detalleCompraId) {
    fetch(`https://localhost:7013/api/Detallecompras/GetDetallecompraById?Id=${detalleCompraId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos de la detalleCompra.');
            }
            return response.json();
        })
        .then(detalleCompra => {
            // Llenar los campos del formulario modal con los datos del cliente
            document.getElementById('DetalleCompraId').value = detalleCompra.detalleCompraId;
            document.getElementById('CompraId').value = detalleCompra.compraId;
            document.getElementById('ProductoId').value = detalleCompra.productoId;
            document.getElementById('Cantidad').value = detalleCompra.cantidad;
            


            // Cambiar el t�tulo de la ventana modal
            document.getElementById('TituloModal').innerText = 'Editar DetalleCompra';
            // Ocultar el bot�n "Agregar" y mostrar el bot�n "Actualizar Usuario"
            document.getElementById('btnGuardar').style.display = 'none';
            document.getElementById('botonEditarar').style.display = 'inline-block'; // Mostrar el bot�n "Actualizar Usuario"
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function ActualizarDetalleCompra() {
    const detalleCompraId = document.getElementById('DetalleCompraId').value;
    const compraId = document.getElementById('CompraId').value;
    const productoId = document.getElementById('ProductoId').value;
    const cantidad = document.getElementById('Cantidad').value;

    const detalleCompraObjeto = {
        DetalleCompraId: detalleCompraId,
        CompraId: compraId,
        ProductoId: productoId,
        Cantidad: cantidad
    };

    fetch(`https://localhost:7013/api/DetalleCompras/UpdateDetalleCompras`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(detalleCompraObjeto)
    })
        .then(response => {
            if (response.ok) {
                alert('detalleCompra actualizada correctamente.');
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

function eliminarDetalleCompra(detalleCompraId) {
    // Hacer la solicitud DELETE al servidor para eliminar la detalleCompraId
    fetch(`https://localhost:7013/api/Detallecompras/DeleteDetallecompra/${detalleCompraId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar la DetalleCompra.');
            }
            // Aqu� puedes manejar la respuesta si es necesario
            console.log('DetalleCompra eliminado correctamente.');
            // Recargar la p�gina o actualizar la lista de clientes, seg�n sea necesario
            location.reload(); // Esto recarga la p�gina
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function limpiarFormulario() {
    // Limpiar los valores de los campos del formulario
    document.getElementById('DetalleCompraId').value = '';
    document.getElementById('CompraId').value = '';
    document.getElementById('ProductoId').value = '';
    document.getElementById('Cantidad').value = '';

    document.getElementById('TituloModal').innerText = 'Agregar DetalleCompra';
    document.getElementById('btnGuardar').style.display = 'inline-block'; // Mostrar el bot�n "Actualizar Usuario"
    document.getElementById('botonEditarar').style.display = 'none';
}
