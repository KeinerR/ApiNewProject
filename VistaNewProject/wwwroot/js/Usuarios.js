
document.addEventListener('DOMContentLoaded', function () {
    // Agrega un evento 'submit' al formulario
    document.querySelector('form').addEventListener('submit', function (event) {
        event.preventDefault(); // Evitar que el formulario se envíe de forma tradicional

        // Obtener los valores de los campos del formulario
        const nombre = document.getElementById('Nombre').value;
        const apellido = document.getElementById('Apellido').value;
        const usuario = document.getElementById('Usuario').value;
        const contraseña = document.getElementById('Contraseña').value;
        const telefono = document.getElementById('Telefono').value;
        const correo = document.getElementById('Correo').value;
        const estadoUsuario = document.getElementById('EstadoUsuario').value;

        // Crear un objeto con los valores del formulario
        const usuario = {
            Nombre: nombre,
            Apellido: apellido,
            Usuario: usuario,
            Contraseña: contraseña,
            Telefono: telefono,
            Correo: correo,
            EstadoUsuario: estadoUsuario
        };
        console.log(usuario)

        // Enviar la solicitud POST al servidor utilizando la Fetch API
        fetch('https://localhost:7013/api/Usuarios/InsertUsuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
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

function eliminarUsuario(usuarioId) {
    // Hacer la solicitud DELETE al servidor para eliminar el cliente
    fetch(`https://localhost:7013/api/Usuarios/DeleteUser/${usuarioId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar el usuario.');
            }
            // Aquí puedes manejar la respuesta si es necesario
            console.log('Usuario eliminado correctamente.');
            // Recargar la página o actualizar la lista de clientes, según sea necesario
            location.reload(); // Esto recarga la página
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Función para obtener los datos del cliente
function obtenerDatosUsuario(usuarioId) {
    fetch(`https://localhost:7013/api/Usuarios/GetUsuarioById?Id=${usuarioId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos del usuario.');
            }
            return response.json();
        })
        .then(usuario => {
            // Llenar los campos del formulario modal con los datos del cliente
            console.log(usuario)
            document.getElementById('UsuarioId').value = usuario.UsuarioId;
            document.getElementById('Nombre').value = usuario.Identificacion;
            document.getElementById('Apellido').value = usuario.NombreEntidad;
            document.getElementById('Usuario').value = usuario.NombreCompleto;
            document.getElementById('Contraseña').value = usuario.TipoCliente;
            document.getElementById('Telefono').value = usuario.Telefono;
            document.getElementById('Correo').value = usuario.Correo;
            document.getElementById('EstadoUsuario').value = usuario.EstadoUsuario;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function ActualizarUsuario() {
    const usuarioid = document.getElementById('UsuarioId').value;
    const nombre = document.getElementById('Nombre').value;
    const apellido = document.getElementById('Apellido').value;
    const usuario = document.getElementById('Usuario').value;
    const contraseña = document.getElementById('Contraseña').value;
    const telefono = document.getElementById('Telefono').value;
    const correo = document.getElementById('Correo').value;
    const estadoUsuario = document.getElementById('EstadoUsuario').value;

    const usuario = {
        Nombre: nombre,
        Apellido: apellido,
        Usuario: usuario,
        Contraseña: contraseña,
        Telefono: telefono,
        Correo: correo,
        EstadoUsuario: estadoUsuario
    };

    fetch(`https://localhost:7013/api/Usuarios/UpdateUsuarios`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cliente)
    })
        .then(response => {
            if (response.ok) {
                alert('Usuario actualizado correctamente.');
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
