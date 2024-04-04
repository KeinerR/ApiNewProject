document.addEventListener('DOMContentLoaded', function () {

    // Agrega un evento 'submit' al formulario
    document.querySelector('form').addEventListener('submit', function (event) {
        event.preventDefault(); // Evitar que el formulario se envíe de forma tradicional

        // Obtener los valores de los campos del formulario
        const nombreRol = document.getElementById('NombreRol').value;

        // Crear un objeto con los valores del formulario
        const usuarioObjeto = {
            NombreRol: nombreRol
        };

        // Enviar la solicitud POST al servidor utilizando la Fetch API
        fetch('https://localhost:7013/api/Roles/InsertRol', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuarioObjeto)
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
                location.reload()
            })
            .catch(error => {
                console.error('Error:', error);
                // Manejar errores de la solicitud
            });
    });
});

function eliminarRol(rolId) {
    // Hacer la solicitud DELETE al servidor para eliminar el cliente
    fetch(`https://localhost:7013/api/Roles/DeleteRol/${rolId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar el rol.');
            }
            // Aquí puedes manejar la respuesta si es necesario
            console.log('Rol eliminado correctamente.');
            // Recargar la página o actualizar la lista de clientes, según sea necesario
            location.reload(); // Esto recarga la página
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Función para obtener los datos del cliente
function obtenerDatosRol(rolId) {
    fetch(`https://localhost:7013/api/Roles/GetRolById?Id=${rolId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos del rol.');
            }
            return response.json();
        })
        .then(rol => {
            // Llenar los campos del formulario modal con los datos del cliente
            console.log(rol)
            document.getElementById('RolId').value = rol.rolId;
            document.getElementById('NombreRol').value = rol.nombreRol;

            // Cambiar el título de la ventana modal
            document.getElementById('TituloModal').innerText = 'Editar rol';
            // Ocultar el botón "Agregar" y mostrar el botón "Actualizar Usuario"
            document.getElementById('btnGuardar').style.display = 'none';
            document.getElementById('btnEditar').style.display = 'inline-block'; // Mostrar el botón "Actualizar Usuario"


        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function ActualizarRol() {
    const rolId = document.getElementById('RolId').value;
    const nombreRol = document.getElementById('NombreRol').value;
    

    const RolObjeto = {
        RolId: rolId,
        NombreRol: nombreRol
       
    };

    fetch(`https://localhost:7013/api/Roles/UpdateRol`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(RolObjeto)
    })
        .then(response => {
            if (response.ok) {
                alert('Rol actualizado correctamente.');
                location.reload()
            } else {
                alert("Error en la actualización. Por favor, inténtalo de nuevo más tarde.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Error en la actualización. Por favor, inténtalo de nuevo más tarde.");
        });
}

function limpiarFormulario() {
    // Limpiar los valores de los campos del formulario
    document.getElementById('RolId').value = '';
    document.getElementById('NombreRol').value = '';
   

    document.getElementById('TituloModal').innerText = 'Agregar Rol';
    document.getElementById('btnGuardar').style.display = 'inline-block'; // Mostrar el botón "Actualizar Usuario"
    document.getElementById('btnEditar').style.display = 'none';
}
