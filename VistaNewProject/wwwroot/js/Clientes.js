
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

document.getElementById('buscarCliente').addEventListener('input', function () {
    var input = this.value.trim().toLowerCase();
    var rows = document.querySelectorAll('.clientesPaginado');

    if (input === "") {
        rows.forEach(function (row) {
            row.style.display = '';
        });
        var icon = document.querySelector('#btnNavbarSearch i');
        icon.className = 'fas fa-search';
        icon.style.color = 'gray';
    } else {
        rows.forEach(function (row) {
            row.style.display = 'none';
        });
        var icon = document.querySelector('#btnNavbarSearch i');
        icon.className = 'fas fa-times';
        icon.style.color = 'gray';
    }
    var rowsTodos = document.querySelectorAll('.Clientes');

    rowsTodos.forEach(function (row) {
        if (input === "") {
            row.style.display = 'none';
        } else {
            var clienteId = row.querySelector('td:nth-child(1)').textContent.trim().toLowerCase();
            var identificacion = row.querySelector('td:nth-child(2)').textContent.trim().toLowerCase();
            var nombreE = row.querySelector('td:nth-child(3)').textContent.trim().toLowerCase();
            var nombreC = row.querySelector('td:nth-child(4)').textContent.trim().toLowerCase();
            var tipoC = row.querySelector('td:nth-child(5)').textContent.trim().toLowerCase();
            var telefono = row.querySelector('td:nth-child(6)').textContent.trim().toLowerCase();
            var correo = row.querySelector('td:nth-child(7)').textContent.trim().toLowerCase();
            var direccion = row.querySelector('td:nth-child(8)').textContent.trim().toLowerCase();

            row.style.display = (clienteId.includes(input) || identificacion.includes(input) || nombreE.includes(input) || nombreC.includes(input) || tipoC.includes(input) || telefono.includes(input) || correo.includes(input) || direccion.includes(input)) ? 'table-row' : 'none';
        }
    });
});

function vaciarInput() {
    document.getElementById('buscarCliente').value = "";
    var icon = document.querySelector('#btnNavbarSearch i');
    icon.className = 'fas fa-search';
    icon.style.color = 'gray';

    var rows = document.querySelectorAll('.clientesPaginado');
    rows.forEach(function (row) {
        row.style.display = 'table-row';
    });

    var rowsTodos = document.querySelectorAll('.Clientes');

    rowsTodos.forEach(function (row) {
        row.style.display = 'none';
    });
}


