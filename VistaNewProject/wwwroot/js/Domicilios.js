function agregarDomicilio() {
    const pedidoId = document.getElementById('PedidoId').value;
    const usuarioId = document.getElementById('UsuarioId').value;
    const observacion = document.getElementById('Observacion').value;
    const fechaentrega = document.getElementById('FechaEntrega').value;
    const direccionDomiciliario = document.getElementById('DireccionDomiciliario').value;
    const estadoDomicilio = document.getElementById('EstadoDomicilio').value;

    const domicilioObjeto = {
        PedidoId: pedidoId,
        UsuarioId: usuarioId,
        Observacion: observacion,
        FechaEntrega: fechaentrega,
        DireccionDomiciliario: direccionDomiciliario,
        EstadoDomicilio: estadoDomicilio
    };

    fetch('https://localhost:7013/api/Domicilios/InsertDomicilio', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(domicilioObjeto)
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



function obtenerDatosDomicilio(domicilioId) {
    fetch(`https://localhost:7013/api/Domicilios/GetDomicilioById?Id=${domicilioId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos de la domicilio.');
            }
            return response.json();
        })
        .then(domicilio => {
            // Llenar los campos del formulario modal con los datos del cliente
            document.getElementById('DomicilioId').value = domicilio.domicilioId;
            document.getElementById('PedidoId').value = domicilio.pedidoId;
            document.getElementById('UsuarioId').value = domicilio.usuarioId;
            document.getElementById('Observacion').value = domicilio.observacion;
            document.getElementById('FechaEntrega').value = domicilio.fechaEntrega;
            document.getElementById('DireccionDomiciliario').value = domicilio.direccionDomiciliario;
            document.getElementById('EstadoDomicilio').value = domicilio.estadoDomicilio;

            // Cambiar el título de la ventana modal
            document.getElementById('TituloModal').innerText = 'Editar domicilio';
            // Ocultar el botón "Agregar" y mostrar el botón "Actualizar Usuario"
            document.getElementById('btnGuardar').style.display = 'none';
            document.getElementById('btnEditar').style.display = 'inline-block'; // Mostrar el botón "Actualizar Usuario"
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function ActualizarDomicilio() {
    const domicilioId = document.getElementById('DomicilioId').value;
    const pedidoId = document.getElementById('PedidoId').value;
    const usuarioId = document.getElementById('UsuarioId').value;
    const observacion = document.getElementById('Observacion').value;
    const fechaentrega = document.getElementById('FechaEntrega').value;
    const direccionDomiciliario = document.getElementById('DireccionDomiciliario').value;
    const estadoDomicilio = document.getElementById('EstadoDomicilio').value;

    const domicilioObjeto = {
        DomicilioId: domicilioId,
        PedidoId: pedidoId,
        UsuarioId: usuarioId,
        Observacion: observacion,
        FechaEntrega: fechaentrega,
        DireccionDomiciliario: direccionDomiciliario,
        EstadoDomicilio: estadoDomicilio
    };

    fetch(`https://localhost:7013/api/Domicilios/UpdateDomicilios`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(domicilioObjeto)
    })
        .then(response => {
            if (response.ok) {
                alert('Domicilio actualizada correctamente.');
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

function eliminarDomicilio(domicilioId) {
    // Hacer la solicitud DELETE al servidor para eliminar la domicilio
    fetch(`https://localhost:7013/api/Domicilios/DeleteDomicilio/${domicilioId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar la domicilio.');
            }
            // Aquí puedes manejar la respuesta si es necesario
            console.log('Domicilio eliminado correctamente.');
            // Recargar la página o actualizar la lista de clientes, según sea necesario
            location.reload(); // Esto recarga la página
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function limpiarFormulario() {
    // Limpiar los valores de los campos del formulario
    document.getElementById('DomicilioId').value = '';
    document.getElementById('PedidoId').value = '';
    document.getElementById('UsuarioId').value = '';
    document.getElementById('Observacion').value = '';
    document.getElementById('FechaEntrega').value = '';
    document.getElementById('DireccionDomiciliario').value = '';
    document.getElementById('EstadoDomicilio').value = '';
    document.getElementById('TituloModal').innerText = 'Agregar Domicilio';
    document.getElementById('btnGuardar').style.display = 'inline-block'; // Mostrar el botón "Actualizar Usuario"
    document.getElementById('btnEditar').style.display = 'none';
}

document.getElementById('buscarDomicilio').addEventListener('input', function () {
    var input = this.value.trim().toLowerCase();
    var rows = document.querySelectorAll('.domiciliosPaginado');

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
    var rowsTodos = document.querySelectorAll('.Domicilios');

    rowsTodos.forEach(function (row) {
        if (input === "") {
            row.style.display = 'none';
        } else {
            var domicilioId = row.querySelector('td:nth-child(1)').textContent.trim().toLowerCase();
            var pedidoId = row.querySelector('td:nth-child(2)').textContent.trim().toLowerCase();
            var usuario = row.querySelector('td:nth-child(3)').textContent.trim().toLowerCase();
            var observacion = row.querySelector('td:nth-child(4)').textContent.trim().toLowerCase();
            var fechaE = row.querySelector('td:nth-child(5)').textContent.trim().toLowerCase();
            var direccionD = row.querySelector('td:nth-child(6)').textContent.trim().toLowerCase();

            row.style.display = (domicilioId.includes(input) || pedidoId.includes(input) || usuario.includes(input) || observacion.includes(input) || fechaE.includes(input) || direccionD.includes(input)) ? 'table-row' : 'none';
        }
    });
});

function vaciarInput() {
    document.getElementById('buscarDomicilio').value = "";
    var icon = document.querySelector('#btnNavbarSearch i');
    icon.className = 'fas fa-search';
    icon.style.color = 'gray';

    var rows = document.querySelectorAll('.domiciliosPaginado');
    rows.forEach(function (row) {
        row.style.display = 'table-row';
    });

    var rowsTodos = document.querySelectorAll('.Domicilios');

    rowsTodos.forEach(function (row) {
        row.style.display = 'none';
    });
}

