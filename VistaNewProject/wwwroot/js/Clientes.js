
function obteneClienteid(ClienteId) {

    fetch(`https://localhost:7013/api/Clientes/GetClienetById?Id=${ClienteId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos');
            }
            return response.json();
        })
        .then(cliente => {
            console.log(cliente);

            document.getElementById('ClienteIdAct').value = cliente.clienteId;
            document.getElementById('IdentificacionAct').value = cliente.identificacion;
            document.getElementById('NombreEntidadAct').value = cliente.nombreEntidad;
            document.getElementById('NombreCompletoAct').value = cliente.nombreCompleto;
            document.getElementById('TipoClienteAct').value = cliente.tipoCliente;
            document.getElementById('TelefonoAct').value = cliente.telefono;
            document.getElementById('CorreoAct').value = cliente.correo;
            document.getElementById('DireccionAct').value = cliente.direccion;
            document.getElementById('EstadoClienteAct').value = cliente.estadoCliente;



            console.log(cliente);
        })
        .catch(error => {
            console.error("Error :", error)
        });
}

document.querySelectorAll('#btnEdit').forEach(button => {
    button.addEventListener('click', function () {
        const Id = this.getAttribute('data-cliente-id');

        document.getElementById('agregarDetalleCliente').style.display = 'none';
        document.getElementById('FormActualizarCliente').style.display = 'block';
        obteneClienteid(Id); // Aquí se pasa el Id como argumento a la función obtenercategoriaid()
    });
});


function actualizarEstadoCliente(clienteId, estadoCliente) {
    fetch(`https://localhost:7013/api/Clientes/UpdateEstadoCliente/${clienteId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ EstadoCliente: estadoCliente ? 1 : 0 })
    })
        .then(response => {
            if (response.ok) {
                setTimeout(() => {
                    location.reload(); // Recargar la página
                }, 500);
            } else {
                console.error('Error al actualizar el estado del cliente');
            }
        })
        .catch(error => {
            console.error('Error de red:', error);
        });
}

