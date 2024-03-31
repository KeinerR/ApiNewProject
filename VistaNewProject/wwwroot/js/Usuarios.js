
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
        const cliente = {
            Nombre: nombre,
            Apellido: apellido,
            Usuario: usuario,
            Contraseña: contraseña,
            Telefono: telefono,
            Correo: correo,
            EstadoUsuario: estadoUsuario
        };
        console.log(cliente)

        // Enviar la solicitud POST al servidor utilizando la Fetch API
        fetch('https://localhost:7013/api/Usuarios/InsertUsuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cliente)
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

function eliminarCliente(clienteId) {
    // Hacer la solicitud DELETE al servidor para eliminar el cliente
    fetch(`https://localhost:7013/api/Clientes/DeleteUser/${clienteId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar el cliente.');
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
function obtenerDatosCliente(clienteId) {
    fetch(`https://localhost:7013/api/Clientes/GetClienetById?id=${clienteId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos del cliente.');
            }
            return response.json();
        })
        .then(cliente => {
            // Llenar los campos del formulario modal con los datos del cliente
            console.log(cliente)
            document.getElementById('clienteId').value = cliente.ClienteId;
            document.getElementById('identificacion').value = cliente.Identificacion;
            document.getElementById('NombreEntidad').value = cliente.NombreEntidad;
            document.getElementById('NombreCompleto').value = cliente.NombreCompleto;
            document.getElementById('TipoCliente').value = cliente.TipoCliente;
            document.getElementById('Telefono').value = cliente.Telefono;
            document.getElementById('Correo').value = cliente.Correo;
            document.getElementById('Direccion').value = cliente.Direccion;
            document.getElementById('EstadoCliente').value = cliente.EstadoCliente;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function ActualizarCliente() {
    const clienteId = document.getElementById('clienteId').value;
    const identificacion = document.getElementById('identificacion').value;
    const NombreEntidad = document.getElementById('NombreEntidad').value;
    const NombreCompleto = document.getElementById('NombreCompleto').value;
    const TipoCliente = document.getElementById('TipoCliente').value;
    const Telefono = document.getElementById('Telefono').value;
    const Correo = document.getElementById('Correo').value;
    const Direccion = document.getElementById('Direccion').value;
    const EstadoCliente = document.getElementById('EstadoCliente').value;

    const cliente = {
        ClienteId: clienteId,
        Identificacion: identificacion,
        NombreEntidad: NombreEntidad,
        NombreCompleto: NombreCompleto,
        TipoCliente: TipoCliente,
        Telefono: Telefono,
        Correo: Correo,
        Direccion: Direccion,
        EstadoCliente: EstadoCliente
    };

    fetch(`https://localhost:7013/api/Clientes/UpdateClientes`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cliente)
    })
        .then(response => {
            if (response.ok) {
                alert('Cliente actualizado correctamente.');
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
