//// Agrega un evento de clic al botón de agregar dentro del modal
//document.getElementById('btnGuardar').addEventListener('click', function () {
//    agregarMarca(); // Llama a la función para agregar la marca
//});
// Función para agregar la presentacion
function agregarPresentacion() {
    const nombrePresentacion = document.getElementById('NombrePresentacion').value;
    const descripcionPresentacion = document.getElementById('DescripcionPresentacion').value;
    const presentacionObjeto = {
        NombrePresentacion: nombrePresentacion,
        DescripcionPresentacion: descripcionPresentacion
    };

    fetch('https://localhost:7013/api/Presentaciones/InsertarPresentacion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(presentacionObjeto)
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



function obtenerDatosPresentacion(presentacionId) {
    fetch(`https://localhost:7013/api/Presentaciones/GetPresentacionById?Id=${presentacionId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos de la presentacion.');
            }
            return response.json();
        })
        .then(presentacion => {
            // Llenar los campos del formulario modal con los datos del cliente
            document.getElementById('PresentacionId').value = presentacion.presentacionId;
            document.getElementById('NombrePresentacion').value = presentacion.nombrePresentacion;
            document.getElementById('DescripcionPresentacion').value = presentacion.descripcionPresentacion;

            // Cambiar el título de la ventana modal
            document.getElementById('TituloModal').innerText = 'Editar presentacion';
            // Ocultar el botón "Agregar" y mostrar el botón "Actualizar Usuario"
            document.getElementById('btnGuardar').style.display = 'none';
            document.getElementById('btnEditar').style.display = 'inline-block'; // Mostrar el botón "Actualizar Usuario"
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function ActualizarPresentacion() {
    const presentacionId = document.getElementById('PresentacionId').value;
    const nombrePresentacion = document.getElementById('NombrePresentacion').value;
    const descripcionPresentacion = document.getElementById('DescripcionPresentacion').value;

    const presentacionObjeto = {
        PresentacionId: presentacionId,
        NombrePresentacion: nombrePresentacion,
        DescripcionPresentacion: descripcionPresentacion
    };

    fetch(`https://localhost:7013/api/Presentaciones/UpdatePresentaciones`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(presentacionObjeto)
    })
        .then(response => {
            if (response.ok) { // Corrección aquí
                alert('Presentacion actualizada correctamente.');
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

function eliminarPresentacion(presentacionId) {
    // Hacer la solicitud DELETE al servidor para eliminar la marca
    fetch(`https://localhost:7013/api/Presentaciones/DeletePresentacion/${presentacionId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar la presentacion.');
            }
            // Aquí puedes manejar la respuesta si es necesario
            console.log('Marca eliminado correctamente.');
            // Recargar la página o actualizar la lista de clientes, según sea necesario
            location.reload(); // Esto recarga la página
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function limpiarFormulario() {
    // Limpiar los valores de los campos del formulario
    document.getElementById('PresentacionId').value = '';
    document.getElementById('NombrePresentacion').value = '';
    document.getElementById('DescripcionPresentacion').value = '';

    document.getElementById('TituloModal').innerText = 'Agregar Presentacion';
    document.getElementById('btnGuardar').style.display = 'inline-block'; // Mostrar el botón "Actualizar Usuario"
    document.getElementById('btnEditar').style.display = 'none';
}