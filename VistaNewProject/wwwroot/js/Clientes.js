







function buscarClientes() {
    var searchTerm = $('#searchInput').val().toLowerCase();

    // Filtra las filas de la tabla basándose en el término de búsqueda
    $('tbody tr').each(function () {
        var filaVisible = false;

        // Itera sobre cada campo de la fila en la tabla de clientes
        $(this).find('.identificacion, .nombre-entidad, .nombre-completo, .tipo-cliente, .telefono, .correo').each(function () {
            var textoCampo = $(this).text().toLowerCase();

            // Comprueba si el término de búsqueda está presente en el campo
            if (textoCampo.indexOf(searchTerm) !== -1) {
                filaVisible = true;
                return false; // Rompe el bucle si se encuentra una coincidencia en la fila
            }
        });

        // Muestra u oculta la fila según si se encontró una coincidencia
        if (filaVisible) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });

    // Mostrar u ocultar el botón de limpiar búsqueda según si hay texto en el campo de búsqueda
    if (searchTerm !== '') {
        $('#btnClearSearch').show();
    } else {
        $('#btnClearSearch').hide();
    }
}

// Ocultar el botón de limpiar búsqueda al principio
$('#btnClearSearch').hide();

// Evento de clic en el botón de búsqueda
$('#btnNavbarSearch').on('click', function () {
    buscarClientes();
});

// Evento de clic en el icono de búsqueda
$('#btnNavbarSearch i').on('click', function () {
    buscarClientes();
});

// Evento de presionar Enter en el campo de búsqueda
$('#searchInput').on('keypress', function (e) {
    if (e.which === 13) { // Verifica si la tecla presionada es Enter
        buscarClientes();
        e.preventDefault(); // Evita que la tecla Enter provoque la acción por defecto (puede ser un envío de formulario)
    }
});

// Evento de clic en el botón para limpiar la búsqueda
$('#btnClearSearch').on('click', function () {
    // Limpiar el campo de búsqueda
    $('#searchInput').val('');
    // Mostrar todos los registros normales
    $('tbody tr').show();
    // Ocultar el botón de limpiar búsqueda al limpiar la búsqueda
    $(this).hide();
});







function obteneClienteid(ClienteId) {

    fetch(`https://localhost:7013/api/Clientes/GetClienetById?Id=${ClienteId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos');
            }
            return response.json();
        })
        .then(cliente => {

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
