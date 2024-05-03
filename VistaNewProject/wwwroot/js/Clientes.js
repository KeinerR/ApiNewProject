function obtenerDatosUsuarios() {
    fetch('https://localhost:7013/api/Clientes/GetClientes')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los Clientes.');
            }
            return response.json();
        })
        .then(data => {
            cliente = data; // Asignamos el resultado de la petición a la variable usuarios
            console.log('Clientes obtenidos:', cliente);
            // Llamar a la función para validar campos después de obtener los usuarios

        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function inicializarEventos() {
    // Botón para abrir el modal de agregar cliente
    $('#clienteModal').on('show.bs.modal', function (event) {
        obtenerDatosUsuarios();
    });
}
    // Función para validar el formulario antes de enviarlo
$(document).ready(function () {
    inicializarEventos();
});




function validarFormulario() {
    // Obtener los valores de los campos del formulario
    var identificacion = $("#Identificacion").val();
    var nombreEntidad = $("#NombreEntidad").val();
    var nombreCompleto = $("#NombreCompleto").val();
    var telefono = $("#Telefono").val();
    var correo = $("#Correo").val();
    var direccion = $("#Direccion").val();

    // Verificar si el campo identificación está vacío
    if (!identificacion.trim()) {
        mostrarAlertaError('Por favor, complete el campo Identificación.');
        return false; // Evitar el envío del formulario
    }

    // Verificar si el campo nombre de entidad está vacío
    if (!nombreEntidad.trim()) {
        mostrarAlertaError('Por favor, complete el campo Nombre de Entidad.');
        return false; // Evitar el envío del formulario
    }

    if (!nombreCompleto.trim()) {
        mostrarAlertaError('Por favor, complete el campo NombreCompleto.');
        return false; // Evitar el envío del formulario
    }

    if (!telefono.trim()) {
        mostrarAlertaError('Por favor, complete el campo Teléfono.');
        return false; // Evitar el envío del formulario
    } else if (!/^\d+$/.test(telefono)) {
        mostrarAlertaError('El teléfono solo puede contener números.');
        return false; // Evitar el envío del formulario
    }

    if (!correo.trim()) {
        mostrarAlertaError('Por favor, complete el campo Correo.');
        return false; // Evitar el envío del formulario
    }
    if (!direccion.trim()) {
        mostrarAlertaError('Por favor, complete el campo Dirección.');
        return false; // Evitar el envío del formulario
    }

    // Verificar si la identificación tiene más de 35 caracteres
    if (identificacion.length > 35) {
        // Mostrar mensaje de error en el span
        $("#MensajeNombreCompletoAct").text('El campo tiene más de 35 caracteres.');
        // Mostrar asterisco rojo
        $("#Identificacion").addClass('is-invalid');
        return false; // Evitar el envío del formulario
    }

    // Si todos los campos están completos y el teléfono es válido, enviar el formulario
    return true;
}

// Función para mostrar una alerta de error con un tiempo de duración
function mostrarAlertaError(mensaje) {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: mensaje,
        timer: 3000, // Tiempo en milisegundos (3 segundos en este caso)
        timerProgressBar: true, // Mostrar la barra de progreso
        showConfirmButton: false // Ocultar el botón de confirmación
    });
}

// Evento de entrada en el campo de identificación
$("#Identificacion").on('input', function () {
    var identificacion = $(this).val();
    // Verificar si la identificación tiene más de 35 caracteres
    if (identificacion.length > 25 && identificacion.length<5) {
        // Mostrar mensaje de error en el span
        $("#MensajeIdentificacion").text('El campo tiene más de 35 caracteres.');
        // Mostrar asterisco rojo
        $(this).addClass('is-invalid');
    }
    if ( identificacion.length < 5) {
        // Mostrar mensaje de error en el span
        $("#MensajeIdentificacion").text('El campo Identificacion tiene menos de 5 carecatere.');
        // Mostrar asterisco rojo
        $(this).addClass('is-invalid');
    }
    else {
        // Limpiar mensaje de error en el span
        $("#MensajeIdentificacion").text('');
        // Eliminar clase de error del campo
        $(this).removeClass('is-invalid');
    }
});

$("#Telefono").on('input', function () {
    var telefono = $(this).val();
    // Verificar si la identificación tiene más de 35 caracteres
    if (!/^\d+$/.test(telefono)) {
        // Mostrar mensaje de error en el span
        $("#MensajeTelefono").text('El campo no es numerioco.');
        // Mostrar asterisco rojo
        $(this).addClass('is-invalid');
    }
    if (telefono.length < 7) {
        // Mostrar mensaje de error en el span
        $("#MensajeTelefono").text('El campo Telefono tiene menos de 7 caracteres.');
        // Mostrar asterisco rojo
        $(this).addClass('is-invalid');
    }
    if (telefono.length > 11) {
        // Mostrar mensaje de error en el span
        $("#MensajeTelefono").text('El campo Telefono tiene mas de ');
        // Mostrar asterisco rojo
        $(this).addClass('is-invalid');
    }
    else {
        // Limpiar mensaje de error en el span
        $("#MensajeTelefono").text('');
        // Eliminar clase de error del campo
        $(this).removeClass('is-invalid');
    }
});

$("#NombreCompleto").on('input', function () {
    var nombreCompleto = $(this).val();
    // Verificar si la identificación tiene más de 35 caracteres
    if (nombreCompleto.length> 25) {
        // Mostrar mensaje de error en el span
        $("#MensajeNombreCompleto").text('El campo Nombre Contacto puede ser mayor a 25 palabras.');
        // Mostrar asterisco rojo
        $(this).addClass('is-invalid');
    }
    if (nombreCompleto.length < 5) {
        // Mostrar mensaje de error en el span
        $("#MensajeNombreCompleto").text('El campo Nombre Contacto  tiene menos de 5 carecatere.');
        // Mostrar asterisco rojo
        $(this).addClass('is-invalid');
    }
    else {
        // Limpiar mensaje de error en el span
        $("#MensajeNombreCompleto").text('');
        // Eliminar clase de error del campo
        $(this).removeClass('is-invalid');
    }
});

$("#NombreEntidad").on('input', function () {
    var nombreEntidad = $(this).val();
    // Verificar si la identificación tiene más de 35 caracteres
    if (nombreEntidad.length > 25) {
        // Mostrar mensaje de error en el span
        $("#MensajeNombreEntidad").text('El campo Nombre Entidad puede ser mayor a 25 palabras.');
        // Mostrar asterisco rojo
        $(this).addClass('is-invalid');
    }
    if (nombreEntidad.length < 5) {
        // Mostrar mensaje de error en el span
        $("#MensajeNombreEntidad").text('El campo Nombre Entidad  tiene menos de 5 carecatere.');
        // Mostrar asterisco rojo
        $(this).addClass('is-invalid');
    }

    else {
        // Limpiar mensaje de error en el span
        $("#MensajeNombreEntidad").text('');
        // Eliminar clase de error del campo
        $(this).removeClass('is-invalid');
    }
});
$("#Correo").on('input', function () {
    var correo = $(this).val();
    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
    // Verificar si el correo es válido
    if (!correoValido) {
        // Mostrar mensaje de error en el span
        $("#MensajeCorreo").text('El correo electrónico no es válido.');
        // Mostrar asterisco rojo
        $(this).addClass('is-invalid');
        return; // Salir de la función si el correo no es válido
    }

    // Verificar si el correo ya está registrado en la variable cliente
    var correoExistente = cliente.find(function (cliente) {
        return cliente.correo.toLowerCase() === correo.toLowerCase();
    });

    if (correoExistente) {
        // Mostrar mensaje de error en el span
        $("#MensajeCorreo").text('Este Correo ya se encuentra registrado.');
        // Mostrar asterisco rojo
        $(this).addClass('is-invalid');
    } else {
        // Limpiar mensaje de error en el span
        $("#MensajeCorreo").text('');
        // Eliminar clase de error del campo
        $(this).removeClass('is-invalid');
    }
});





// Función para limpiar el formulario cuando se cierra el modal
function limpiarFormulario() {
    $("#Identificacion").val("");
    $("#NombreEntidad").val("");
    $("#Telefono").val("");
    $("#Correo").val("");
    $("#Direccion").val("");
}
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
        obtenerDatosUsuarios();
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


