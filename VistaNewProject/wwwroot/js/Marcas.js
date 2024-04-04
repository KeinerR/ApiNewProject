//// Agrega un evento de clic al botón de agregar dentro del modal
//document.getElementById('btnGuardar').addEventListener('click', function () {
//    agregarMarca(); // Llama a la función para agregar la marca
//});
// Función para agregar la marca
function agregarMarca() {
    const nombreMarca = document.getElementById('NombreMarca').value;
    const marcaObjeto = {
        NombreMarca: nombreMarca
    };

    fetch('https://localhost:7013/api/Marcas/InsertarMarca', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(marcaObjeto)
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



function obtenerDatosMarca(marcaId) {
    fetch(`https://localhost:7013/api/Marcas/GetMarcaById?Id=${marcaId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos de la marca.');
            }
            return response.json();
        })
        .then(marca => {
            // Llenar los campos del formulario modal con los datos del cliente
            document.getElementById('MarcaId').value = marca.marcaId;
            document.getElementById('NombreMarca').value = marca.nombreMarca;

            // Cambiar el título de la ventana modal
            document.getElementById('TituloModal').innerText = 'Editar marca';
            // Ocultar el botón "Agregar" y mostrar el botón "Actualizar Usuario"
            document.getElementById('btnGuardar').style.display = 'none';
            document.getElementById('btnEditar').style.display = 'inline-block'; // Mostrar el botón "Actualizar Usuario"
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function ActualizarMarca() {
    const marcaId = document.getElementById('MarcaId').value;
    const nombreMarca = document.getElementById('NombreMarca').value;

    const marcaObjeto = {
        MarcaId: marcaId,
        NombreMarca: nombreMarca
    };

    fetch(`https://localhost:7013/api/Marcas/UpdateMarcas`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(marcaObjeto)
    })
        .then(response => {
            if (response.ok) {
                alert('Marca actualizada correctamente.');
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

function eliminarMarca(marcaId) {
    // Hacer la solicitud DELETE al servidor para eliminar la marca
    fetch(`https://localhost:7013/api/Marcas/DeleteMarca/${marcaId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar la marca.');
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
    document.getElementById('MarcaId').value = '';
    document.getElementById('NombreMarca').value = '';

    document.getElementById('TituloModal').innerText = 'Agregar Marca';
    document.getElementById('btnGuardar').style.display = 'inline-block'; // Mostrar el botón "Actualizar Usuario"
    document.getElementById('btnEditar').style.display = 'none';
}
