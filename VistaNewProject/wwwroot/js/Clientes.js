function agregarCliente() {
    // Obtener los valores de los campos del formulario
    const identificacion = document.getElementById('Identificacion').value;
    const NombreEntidad = document.getElementById('NombreEntidad').value;
    const NombreCompleto = document.getElementById('NombreCompleto').value;
    const TipoCliente = document.getElementById('TipoCliente').value;
    const Telefono = document.getElementById('Telefono').value;
    const Correo = document.getElementById('Correo').value;
    const Direccion = document.getElementById('Direccion').value;
    const EstadoCliente = document.getElementById('EstadoCliente').value;

    // Crear un objeto con los valores del formulario
    const clienteObjeto = {
        identificacion: identificacion,
        NombreEntidad: NombreEntidad,
        NombreCompleto: NombreCompleto,
        TipoCliente: TipoCliente,
        Telefono: Telefono,
        Correo: Correo,
        Direccion: Direccion,
        EstadoCliente: EstadoCliente
    };

    // Enviar la solicitud POST al servidor utilizando la Fetch API
    fetch('https://localhost:7013/api/Clientes/InsertarCliente', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(clienteObjeto)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ocurrió un error al enviar la solicitud.');
            }
            return response.json();
        })
        .then(data => {
            /*console.log('Respuesta del servidor:', data);*/
            location.reload()
            // Manejar la respuesta del servidor según sea necesario
        })
        .catch(error => {
            console.error('Error:', error);
            // Manejar errores de la solicitud
        });
}

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
            document.getElementById('ClienteId').value = cliente.clienteId;
            document.getElementById('Identificacion').value = cliente.identificacion;
            document.getElementById('NombreEntidad').value = cliente.nombreEntidad;
            document.getElementById('NombreCompleto').value = cliente.nombreCompleto;
            document.getElementById('TipoCliente').value = cliente.tipoCliente;
            document.getElementById('Telefono').value = cliente.telefono;
            document.getElementById('Correo').value = cliente.correo;
            document.getElementById('Direccion').value = cliente.direccion;
            document.getElementById('EstadoCliente').value = cliente.estadoCliente;

            // Cambiar el título de la ventana modal
            document.getElementById('TituloModal').innerText = 'Editar Cliente';
            // Ocultar el botón "Agregar" y mostrar el botón "Actualizar Usuario"
            document.getElementById('btnGuardar').style.display = 'none';
            document.getElementById('btnEditar').style.display = 'inline-block'; // Mostrar el botón "Actualizar Usuario"
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function ActualizarCliente() {
    const clienteId = document.getElementById('ClienteId').value;
    const identificacion = document.getElementById('Identificacion').value;
    const NombreEntidad = document.getElementById('NombreEntidad').value;
    const NombreCompleto = document.getElementById('NombreCompleto').value;
    const TipoCliente = document.getElementById('TipoCliente').value;
    const Telefono = document.getElementById('Telefono').value;
    const Correo = document.getElementById('Correo').value;
    const Direccion = document.getElementById('Direccion').value;
    const EstadoCliente = document.getElementById('EstadoCliente').value;

    const cliente = {
        clienteId: clienteId,
        identificacion: identificacion,
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


function limpiarFormulario() {
    // Limpiar los valores de los campos del formulario
    document.getElementById('ClienteId').value = '';
    document.getElementById('Identificacion').value = '';
    document.getElementById('NombreEntidad').value = '';;
    document.getElementById('NombreCompleto').value = '';
    document.getElementById('TipoCliente').value = '';
    document.getElementById('Telefono').value = '';
    document.getElementById('Correo').value = '';
    document.getElementById('Direccion').value = '';
    document.getElementById('EstadoCliente').value = '';

    document.getElementById('TituloModal').innerText = 'Agregar Cliente';
    document.getElementById('btnGuardar').style.display = 'inline-block'; // Mostrar el botón "Actualizar Cliente"
    document.getElementById('btnEditar').style.display = 'none';
}
