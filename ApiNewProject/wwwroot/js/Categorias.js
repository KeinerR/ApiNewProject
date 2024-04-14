
function agregarCategoria() {
    const nombreCategoria = document.getElementById('NombreCategoria').value;
    const categoriaObjeto = {
        NombreCategoria: nombreCategoria
    };

    fetch('https://localhost:7013/api/Categorias/InsertarCategoria', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoriaObjeto)
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



function obtenerDatosCategoria(categoriaId) {
    fetch(`https://localhost:7013/api/Categorias/GetCategoriaById?Id=${categoriaId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos de la categoria.');
            }
            return response.json();
        })
        .then(categoria => {
            // Llenar los campos del formulario modal con los datos del cliente
            document.getElementById('CategoriaId').value = categoria.categoriaId;
            document.getElementById('NombreCategoria').value = categoria.nombreCategoria;

            // Cambiar el título de la ventana modal
            document.getElementById('TituloModal').innerText = 'Editar Categoria';
            // Ocultar el botón "Agregar" y mostrar el botón "Actualizar Usuario"
            document.getElementById('btnGuardar').style.display = 'none';
            document.getElementById('btnEditar').style.display = 'inline-block'; // Mostrar el botón "Actualizar Usuario"
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function ActualizarCategoria() {
    const categoriaId = document.getElementById('CategoriaId').value;
    const nombreCategoria = document.getElementById('NombreCategoria').value;

    const categoriaObjeto = {
        CategoriaId: categoriaId,
        NombreCategoria: nombreCategoria
    };

    fetch(`https://localhost:7013/api/Categorias/UpdateCategorias`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoriaObjeto)
    })
        .then(response => {
            if (response.ok) {
                alert('categoria actualizada correctamente.');
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

function eliminarCategoria(categoriaId) {
    // Hacer la solicitud DELETE al servidor para eliminar la categoriaId
    fetch(`https://localhost:7013/api/Categorias/DeleteCategoria/${categoriaId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar la Categoria.');
            }
            // Aquí puedes manejar la respuesta si es necesario
            console.log('Categoria eliminado correctamente.');
            // Recargar la página o actualizar la lista de clientes, según sea necesario
            location.reload(); // Esto recarga la página
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function limpiarFormulario() {
    // Limpiar los valores de los campos del formulario
    document.getElementById('CategoriaId').value = '';
    document.getElementById('NombreCategoria').value = '';

    document.getElementById('TituloModal').innerText = 'Agregar Categoria';
    document.getElementById('btnGuardar').style.display = 'inline-block'; // Mostrar el botón "Actualizar Usuario"
    document.getElementById('btnEditar').style.display = 'none';
}
