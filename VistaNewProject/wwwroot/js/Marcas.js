document.addEventListener('DOMContentLoaded', function () {
    // Agrega un evento 'submit' al formulario
    document.querySelector('form').addEventListener('submit', function (event) {
        event.preventDefault(); // Evitar que el formulario se envíe de forma tradicional

        // Obtener los valores de los campos del formulario
        const nombremarca = document.getElementById('nombremarca').value;

        // Crear un objeto con los valores del formulario
        const marca = {
            nombremarca: nombremarca,

        };
        console.log(marca)

        // Enviar la solicitud POST al servidor utilizando la Fetch API
        fetch('https://localhost:7013/api/Clientes/InsertarCliente', {
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
});


function eliminarMarca(marcaId) {
    // Hacer la solicitud DELETE al servidor para eliminar el cliente
    fetch(`https://localhost:7013/api/Clientes/DeleteUser/${clienteId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar la marca.');
            }
            // Aquí puedes manejar la respuesta si es necesario
            console.log('Cliente eliminado correctamente.');
            // Recargar la página o actualizar la lista de clientes, según sea necesario
            location.reload(); // Esto recarga la página
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Función para obtener los datos del cliente
function obtenerDatosMarca(marcaId) {
    fetch(`https://localhost:7013/api/Clientes/GetClienetById?id=${marcaId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos de la marca.');
            }
            return response.json();
        })
        .then(cliente => {
            // Llenar los campos del formulario modal con los datos del cliente
            console.log(cliente)
            document.getElementById('marcaId').value = marca.marcaId;
            document.getElementById('nombremarca').value = marca.nombremarca;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
function ActualizarMarca() {
    const marcaId = document.getElementById('marcaId').value;
    const nombremarca = document.getElementById('nombremarca').value;
  

    const marca = {
        marcaId: marcaId,
        nombremarca: nombremarca,

    };

    fetch(`https://localhost:7013/api/Clientes/UpdateClientes`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(marca)
    })
        .then(response => {
            if (response.ok) {
                alert('Marca actualizado correctamente.');
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

