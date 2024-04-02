document.addEventListener('DOMContentLoaded', function () {
    const marcaForm = document.getElementById('marcaForm');
    const actualizarMarcaBtn = document.getElementById('ActualizarMarca');
    const marcaIdInput = document.getElementById('MarcaId');
    const nombreMarcaInput = document.getElementById('NombreMarca');

    // Agrega un evento 'submit' al formulario
    marcaForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Evitar que el formulario se envíe de forma tradicional

        // Obtener los valores de los campos del formulario
        const nombreMarca = nombreMarcaInput.value;

        // Crear un objeto con los valores del formulario
        const marca = {
            NombreMarca: nombreMarca
        };

        // Enviar la solicitud POST al servidor utilizando la Fetch API
        fetch('https://localhost:7013/api/Marcas/InsertarMarca', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(marca)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ocurrió un error al enviar la solicitud.');
                }
                return response.json();
            })
            .then(data => {
                console.log('Respuesta del servidor:', data);
                // Manejar la respuesta del servidor según sea necesario
            })
            .catch(error => {
                console.error('Error:', error);
                // Manejar errores de la solicitud
            });
    });

    // Agrega un evento 'click' al botón de actualizar marca
    actualizarMarcaBtn.addEventListener('click', function () {
        const marcaId = marcaIdInput.value;
        const nombreMarca = nombreMarcaInput.value;

        // Crear un objeto con los valores actualizados de la marca
        const marcaActualizada = {
            MarcaId: marcaId,
            NombreMarca: nombreMarca
        };

        // Enviar la solicitud PUT al servidor para actualizar la marca
        fetch(`https://localhost:7013/api/Marcas/UpdateMarcas`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(marcaActualizada)
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
    });
});

function eliminarMarca(marcaId) {
    // Hacer la solicitud DELETE al servidor para eliminar la marca
    fetch(`https://localhost:7013/api/Marcas/DeleteMarca/${marcaId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar la marca.');
            }
            console.log('Marca eliminada correctamente.');
            location.reload(); // Esto recarga la página
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function obtenerDatosMarca(marcaId) {
    // Hacer la solicitud GET al servidor para obtener los datos de la marca
    fetch(`https://localhost:7013/api/Marcas/GetMarcaById?id=${marcaId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos de la marca.');
            }
            return response.json();
        })
        .then(marca => {
            // Llenar los campos del formulario modal con los datos de la marca
            document.getElementById('MarcaId').value = marca.marcaId;
            document.getElementById('NombreMarca').value = marca.nombreMarca;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}