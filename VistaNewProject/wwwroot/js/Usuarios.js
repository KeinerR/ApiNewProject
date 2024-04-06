function agregarUsuario() {
    // Obtener los valores de los campos del formulario
    const nombre = document.getElementById('Nombre').value;
    const rolId = document.getElementById('RolId').value;
    const apellido = document.getElementById('Apellido').value;
    const usuario = document.getElementById('Usuario').value;
    const contraseña = document.getElementById('Contraseña').value;
    const telefono = document.getElementById('Telefono').value;
    const correo = document.getElementById('Correo').value;
    const estadoUsuario = document.getElementById('EstadoUsuario').value;

    // Crear un objeto con los valores del formulario
    const usuarioObjeto = {
        RolId: rolId,
        Nombre: nombre,
        Apellido: apellido,
        Usuario1: usuario,
        Contraseña: contraseña,
        Telefono: telefono,
        Correo: correo,
        EstadoUsuario: estadoUsuario
    };

    // Enviar la solicitud POST al servidor utilizando la Fetch API
    fetch('https://localhost:7013/api/Usuarios/InsertUsuario', {
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
            location.reload(); // Esto recarga la página
        })
        .catch(error => {
            console.error('Error:', error);
            // Manejar errores de la solicitud
        });
}

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
            document.getElementById('UsuarioId').value = usuario.usuarioId;
            document.getElementById('RolId').value = usuario.rolId;
            document.getElementById('Nombre').value = usuario.nombre;
            document.getElementById('Apellido').value = usuario.apellido;
            document.getElementById('Usuario').value = usuario.usuario1;
            document.getElementById('Contraseña').value = usuario.contraseña;
            document.getElementById('Telefono').value = usuario.telefono;
            document.getElementById('Correo').value = usuario.correo;
            document.getElementById('EstadoUsuario').value = usuario.estadoUsuario;

            // Cambiar el título de la ventana modal
            document.getElementById('TituloModal').innerText = 'Editar Usuario';
            // Ocultar el botón "Agregar" y mostrar el botón "Actualizar Usuario"
            document.getElementById('btnGuardar').style.display = 'none';
            document.getElementById('btnEditar').style.display = 'inline-block'; // Mostrar el botón "Actualizar Usuario"


        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function ActualizarUsuario() {
    const usuarioId = document.getElementById('UsuarioId').value;
    const rolId = document.getElementById('RolId').value;
    const nombre = document.getElementById('Nombre').value;
    const apellido = document.getElementById('Apellido').value;
    const usuario = document.getElementById('Usuario').value;
    const contraseña = document.getElementById('Contraseña').value;
    const telefono = document.getElementById('Telefono').value;
    const correo = document.getElementById('Correo').value;
    const estadoUsuario = document.getElementById('EstadoUsuario').value;

    const usuarioObjeto = {
        UsuarioId: usuarioId,
        RolId: rolId,
        Nombre: nombre,
        Apellido: apellido,
        Usuario1: usuario,
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
        body: JSON.stringify(usuarioObjeto)
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


function limpiarFormulario() {
    // Limpiar los valores de los campos del formulario
    document.getElementById('UsuarioId').value = '';
    document.getElementById('RolId').value = '';
    document.getElementById('Nombre').value = '';
    document.getElementById('Apellido').value = '';
    document.getElementById('Usuario').value = '';
    document.getElementById('Contraseña').value = '';
    document.getElementById('Telefono').value = '';
    document.getElementById('Correo').value = '';
    document.getElementById('EstadoUsuario').value = '';

    document.getElementById('TituloModal').innerText = 'Agregar Usuario';
    document.getElementById('btnGuardar').style.display = 'inline-block'; // Mostrar el botón "Actualizar Usuario"
    document.getElementById('btnEditar').style.display = 'none';
}
