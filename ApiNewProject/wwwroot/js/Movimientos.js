function agregarMovimiento() {
    const productoId = document.getElementById('ProductoId').value;
    const tipoAccion= document.getElementById('TipoAccion').value;
    const tipoMovimiento = document.getElementById('TipoMovimiento').value;
    const cantidadMovimiento= document.getElementById('CantidadMovimiento').value;
    const descripcionMovimiento = document.getElementById('DescripcionMovimiento').value;
    const fechaMovimiento = document.getElementById('FechaMovimiento').value;
  
    const movimientoObjeto = {
        ProductoId: productoId,
        TipoAccion: tipoAccion,
        TipoMovimiento: tipoMovimiento,
        CantidadMovimiento: cantidadMovimiento,
        Descripcion: descripcionMovimiento,
        FechaMovimiento : fechaMovimiento
    };

    fetch('https://localhost:7013/api/Movimientos/InsertarMovimiento', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(movimientoObjeto)
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


function ActualizarMovimiento() {
    const movimientoId = document.getElementById('MovimientoId').value;
    const productoId = document.getElementById('ProductoId').value;
    const tipoAccion = document.getElementById('TipoAccion').value;
    const tipoMovimiento = document.getElementById('TipoMovimiento').value;
    const cantidadMovimiento = document.getElementById('CantidadMovimiento').value;
    const descripcionMovimiento = document.getElementById('DescripcionMovimiento').value;
    const fechaMovimiento = document.getElementById('FechaMovimiento').value;

    const movimientoObjeto = {
        MovimientoId: movimientoId,
        ProductoId: productoId,
        TipoAccion: tipoAccion,
        TipoMovimiento: tipoMovimiento,
        CantidadMovimiento: cantidadMovimiento,
        Descripcion: descripcionMovimiento,
        FechaMovimiento: fechaMovimiento
    };

    // Mostrar los valores obtenidos en el objeto movimientoObjeto
    console.log('Movimiento Objeto:', movimientoObjeto);

    fetch(`https://localhost:7013/api/Movimientos/UpdateMovimientos`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(movimientoObjeto)
    })
        .then(response => {
            if (response.ok) {
                alert('Movimiento actualizado correctamente.');
                console.log('Respuesta OK:', response);
                location.reload()
            } else {
                alert("Error en la actualización. Por favor, inténtalo de nuevo más tarde.");
                console.log('Respuesta de Error:', response);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Error en la actualización. Por favor, inténtalo de nuevo más tarde.");
        });
}


function obtenerDatosMovimiento(movimientoId) {
    fetch(`https://localhost:7013/api/Movimientos/GetMovimientoById?Id=${movimientoId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos de la movimiento.');
            }
            return response.json();
        })
        .then(movimiento => {
            // Llenar los campos del formulario modal con los datos del movimiento
            document.getElementById('MovimientoId').value = movimiento.movimientoId;
            document.getElementById('ProductoId').value = movimiento.productoId;
            document.getElementById('TipoAccion').value = movimiento.tipoAccion;
            document.getElementById('TipoMovimiento').value = movimiento.tipoMovimiento;
            document.getElementById('CantidadMovimiento').value = movimiento.cantidadMovimiento;
            document.getElementById('DescripcionMovimiento').value = movimiento.descripcion;
            document.getElementById('FechaMovimiento').value = movimiento.fechaMovimiento;

            // Cambiar el título de la ventana modal
            document.getElementById('TituloModal').innerText = 'Editar movimiento';
            // Ocultar el botón "Agregar" y mostrar el botón "Actualizar Usuario"
            document.getElementById('btnGuardar').style.display = 'none';
            document.getElementById('btnEditar').style.display = 'inline-block'; // Mostrar el botón "Actualizar Usuario"
        })
        .catch(error => {
            console.error('Error:', error);
        });
}



function eliminarMovimiento(movimientoId) {
    // Hacer la solicitud DELETE al servidor para eliminar la movimiento
    fetch(`https://localhost:7013/api/Movimientos/DeleteMovimiento/${movimientoId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar la movimiento.');
            }
            // Aquí puedes manejar la respuesta si es necesario
            console.log('Movimiento eliminado correctamente.');
            // Recargar la página o actualizar la lista de clientes, según sea necesario
            location.reload(); // Esto recarga la página
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function limpiarFormulario() {
    // Limpiar los valores de los campos del formulario
    document.getElementById('MovimientoId').value = '';
    document.getElementById('ProductoId').value = '';
    document.getElementById('TipoAccion').value = '';
    document.getElementById('TipoMovimiento').value = '';
    document.getElementById('CantidadMovimiento').value = '';
    document.getElementById('DescripcionMovimiento').value = '';
    document.getElementById('FechaMovimiento').value = '';

    document.getElementById('TituloModal').innerText = 'Agregar Movimiento';
    document.getElementById('btnGuardar').style.display = 'inline-block'; // Mostrar el botón "Actualizar Usuario"
    document.getElementById('btnEditar').style.display = 'none';
}
