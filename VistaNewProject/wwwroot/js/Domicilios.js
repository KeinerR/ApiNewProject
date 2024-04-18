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
                throw new Error('Ocurri� un error al enviar la solicitud.');
            }
            return response.json();
        })
        .then(data => {
            console.log('Respuesta del servidor:', data);
            location.reload(); // Recargar la p�gina
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

            // Cambiar el t�tulo de la ventana modal
            document.getElementById('TituloModal').innerText = 'Editar domicilio';
            // Ocultar el bot�n "Agregar" y mostrar el bot�n "Actualizar Usuario"
            document.getElementById('btnGuardar').style.display = 'none';
            document.getElementById('btnEditar').style.display = 'inline-block'; // Mostrar el bot�n "Actualizar Usuario"
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
                location.reload(true); // Recargar la p�gina despu�s de la actualizaci�n
            } else {
                alert("Error en la actualizaci�n. Por favor, int�ntalo de nuevo m�s tarde.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Error en la actualizaci�n. Por favor, int�ntalo de nuevo m�s tarde.");
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
            // Aqu� puedes manejar la respuesta si es necesario
            console.log('Domicilio eliminado correctamente.');
            // Recargar la p�gina o actualizar la lista de clientes, seg�n sea necesario
            location.reload(); // Esto recarga la p�gina
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
    document.getElementById('btnGuardar').style.display = 'inline-block'; // Mostrar el bot�n "Actualizar Usuario"
    document.getElementById('btnEditar').style.display = 'none';
}

function buscarDomicilios() {
    var searchTerm = $('#searchInput').val().toLowerCase();

    // Filtra las filas de la tabla bas�ndose en el t�rmino de b�squeda
    $('tbody tr').each(function () {
        var filaVisible = false;

        // Itera sobre cada campo de la fila en la tabla de domicilios
        $(this).find('.domicilio-id, .pedido-id, .usuario-id, .observacion, .fecha-entrega, .direccion-domiciliario').each(function () {
            var textoCampo = $(this).text().toLowerCase();

            // Comprueba si el t�rmino de b�squeda est� presente en el campo
            if (textoCampo.indexOf(searchTerm) !== -1) {
                filaVisible = true;
                return false; // Rompe el bucle si se encuentra una coincidencia en la fila
            }
        });

        // Muestra u oculta la fila seg�n si se encontr� una coincidencia
        if (filaVisible) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });

    // Mostrar u ocultar el bot�n de limpiar b�squeda seg�n si hay texto en el campo de b�squeda
    if (searchTerm !== '') {
        $('#btnClearSearch').show();
    } else {
        $('#btnClearSearch').hide();
    }
}

// Ocultar el bot�n de limpiar b�squeda al principio
$(document).ready(function () {
    $('#btnClearSearch').hide(); // Ocultar el bot�n de limpiar b�squeda al cargar la p�gina
});

// Evento de clic en el bot�n de b�squeda
$('#btnNavbarSearch').on('click', function () {
    buscarDomicilios();
});

// Evento de clic en el icono de b�squeda
$('#btnNavbarSearch i').on('click', function () {
    buscarDomicilios();
});

// Evento de presionar Enter en el campo de b�squeda
$('#searchInput').on('keypress', function (e) {
    if (e.which === 13) { // Verificar si se presion� la tecla Enter
        buscarDomicilios();
        e.preventDefault(); // Evitar la acci�n por defecto del Enter (puede ser un env�o de formulario)
    }
});

// Evento de clic en el bot�n para limpiar la b�squeda
$('#btnClearSearch').on('click', function () {
    // Limpiar el campo de b�squeda
    $('#searchInput').val('');
    // Mostrar todos los registros ocultados previamente
    $('tbody tr').show();
    // Ocultar el bot�n de limpiar b�squeda al limpiar la b�squeda
    $(this).hide();
});
