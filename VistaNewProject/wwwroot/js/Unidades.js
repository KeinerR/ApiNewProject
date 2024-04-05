function agregarUnidad() {
    const descripcionUnidad = document.getElementById('DescripcionUnidad').value;
    const unidadObjeto = {
        DescripcionUnidad: descripcionUnidad
    };

    fetch('https://localhost:7013/api/Unidades/InsertarUnidad', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(unidadObjeto)
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



function obtenerDatosUnidad(unidadId) {
    fetch(`https://localhost:7013/api/Unidades/GetUnidadById?Id=${unidadId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos de la unidad.');
            }
            return response.json();
        })
        .then(unidad => {
            // Llenar los campos del formulario modal con los datos del cliente
            document.getElementById('UnidadId').value = unidad.unidadId;
            document.getElementById('DescripcionUnidad').value = unidad.descripcionUnidad;

            // Cambiar el t�tulo de la ventana modal
            document.getElementById('TituloModal').innerText = 'Editar unidad';
            // Ocultar el bot�n "Agregar" y mostrar el bot�n "Actualizar Usuario"
            document.getElementById('btnGuardar').style.display = 'none';
            document.getElementById('btnEditar').style.display = 'inline-block'; // Mostrar el bot�n "Actualizar Usuario"
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function ActualizarUnidad() {
    const unidadId = document.getElementById('UnidadId').value;
    const descripcionUnidad = document.getElementById('DescripcionUnidad').value;

    const unidadObjeto = {
        UnidadId: unidadId,
        DescripcionUnidad: descripcionUnidad
    };

    fetch(`https://localhost:7013/api/Unidades/UpdateUnidades`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(unidadObjeto)
    })
        .then(response => {
            if (response.ok) {
                alert('Unidad actualizada correctamente.');
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

function eliminarUnidad(unidadId) {
    // Hacer la solicitud DELETE al servidor para eliminar la unidad
    fetch(`https://localhost:7013/api/Unidades/DeleteUnidad/${unidadId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar la unidad.');
            }
            // Aqu� puedes manejar la respuesta si es necesario
            console.log('Unidad eliminado correctamente.');
            // Recargar la p�gina o actualizar la lista de clientes, seg�n sea necesario
            location.reload(); // Esto recarga la p�gina
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function limpiarFormulario() {
    // Limpiar los valores de los campos del formulario
    document.getElementById('UnidadId').value = '';
    document.getElementById('DescripcionUnidad').value = '';

    document.getElementById('TituloModal').innerText = 'Agregar Unidad';
    document.getElementById('btnGuardar').style.display = 'inline-block'; // Mostrar el bot�n "Actualizar Usuario"
    document.getElementById('btnEditar').style.display = 'none';
}
