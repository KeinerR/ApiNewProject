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



    // Validar cada campo individualmente
    if (!validarIdentificacion(identificacion)) {
        return false;
    }

    if (!validarNombreEntidad(nombreEntidad)) {
        return false;
    }

    if (!validarNombreCompleto(nombreCompleto)) {
        return false;
    }

    if (!validarTelefono(telefono)) {
        return false;
    }
    if (!validarDireccion(direccion)) {
        return false;
    }

    if (!validarCorreo(correo)) {
        return false;
    }



    // Si todas las validaciones pasan, se puede enviar el formulario
    return true;
}

// Funciones de validación individuales



$("#Identificacion").on("input", function () {
    validarIdentificacion($(this).val()); // Llamar a la función de validación con el valor actual del campo
});
function validarIdentificacion(identificacion) {
    if (!identificacion.trim()) {
        mostrarOcultarError("#MensajeIdentificacion", "Por favor, complete el campo Identificación."); // Mostrar error si el campo está vacío
        return false;
    }

    if (identificacion.trim().length > 25) {
        mostrarOcultarError("#MensajeIdentificacion", "El campo tiene más de 25 caracteres.");
        return false;
    }

    if (identificacion.trim().length < 4) {
        mostrarOcultarError("#MensajeIdentificacion", "El campo tiene menos de 5 caracteres.");
        return false;
    }

    // Verificar si el campo contiene solo espacios en blanco
    if (/^\s+$/.test(identificacion)) {
        mostrarOcultarError("#MensajeIdentificacion", "El campo Identificación no puede consistir solo en espacios en blanco.");
        return false;
    }

    // Limpiar mensaje de error en el span si pasa todas las validaciones
    mostrarOcultarError("#MensajeIdentificacion");
    return true;
}

// Función para validar el campo de Nombre de Entidad

$("#NombreEntidad").on("input", function () {
    validarNombreEntidad($(this).val()); // Llamar a la función de validación con el valor actual del campo
});
function validarNombreEntidad(nombreEntidad) {
    // Expresión regular para verificar que el campo contenga solo letras
    var letrasRegex = /^[A-Za-z]+(?:\s+[A-Za-z]+)*$/;

    if (!nombreEntidad.trim()) {
        mostrarOcultarError("#MensajeNombreEntidad", "Por favor, complete el campo Nombre de Entidad.");
        return false;
    }

    if (nombreEntidad.length < 4) {
        mostrarOcultarError("#MensajeNombreEntidad", "El campo Nombre de Entidad debe tener al menos 5 caracteres.");
        return false;
    }

    if (!letrasRegex.test(nombreEntidad)) {
        mostrarOcultarError("#MensajeNombreEntidad", "El campo Nombre de Entidad solo puede contener letras.");
        return false;
    }

    mostrarOcultarError("#MensajeNombreEntidad"); // Limpiar mensaje de error si pasa todas las validaciones
    return true;
}


$("#NombreCompleto").on("input", function () {
    validarNombreCompleto($(this).val()); // Llamar a la función de validación con el valor actual del campo
});
function validarNombreCompleto(nombreCompleto) {

    var letrasRegex = /^[A-Za-z]+(?:\s+[A-Za-z]+)*$/;
    if (!nombreCompleto.trim()) {
        mostrarOcultarError("#MensajeNombreCompleto", "Por favor, complete el campo Nombre Completo.");
        return false;
    }

    if (nombreCompleto.length > 25) {
        mostrarOcultarError("#MensajeNombreCompleto", "El campo Nombre Completo puede ser mayor a 25 palabras.");
        return false;
    }
    if (nombreCompleto.length < 4) {
        mostrarOcultarError("#MensajeNombreCompleto", "El campo Nombre Completo debe tener al menos 5 caracteres.");
        return false;
    }


    if (!letrasRegex.test(nombreCompleto)) {
        mostrarOcultarError("#MensajeNombreCompleto", "El campo Nombre de Completo solo puede contener letras.");
        return false;
    }

    if (/^\s+$/.test(nombreCompleto)) {
        mostrarOcultarError("#MensajeNombreCompleto", "El campo Nombre Completo no puede consistir solo en espacios en blanco.");
        return false;
    }

    // Limpiar mensaje de error en el span
    mostrarOcultarError("#MensajeNombreCompleto");
    return true;
}
// Agregar evento input al campo de teléfono

$("#Telefono").on("input", function () {
    validarTelefono($(this).val()); // Llamar a la función de validación con el valor actual del campo
});
// Función para validar el campo de teléfono
function validarTelefono(telefono) {
    // Obtener el valor del campo de teléfono
    var telefonoValor = telefono.trim();

    // Limpiar mensaje de error en el span
    mostrarOcultarError("#MensajeTelefono");

    // Validar si el campo está vacío
    if (!telefonoValor) {
        mostrarOcultarError("#MensajeTelefono", "Por favor, complete el campo Teléfono.");
        return false;
    }

    // Validar si el teléfono solo contiene números
    if (!/^\d+$/.test(telefonoValor)) {
        mostrarOcultarError("#MensajeTelefono", "El teléfono solo puede contener números.");
        return false;
    }
    // Validar longitud del teléfono
    if (telefonoValor.length < 7 || telefonoValor.length > 11) {
        mostrarOcultarError("#MensajeTelefono", "El campo Teléfono debe tener entre 7 y 11 dígitos.");
        return false;
    }




    // Si pasa todas las validaciones, no hay error
    return true;
}

// Función para validar el campo de correo

$("#Correo").on("input", function () {
    validarCorreo($(this).val()); // Llamar a la función de validación con el valor actual del campo
});
function validarCorreo(correo) {
    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

    if (!correo.trim()) {
        mostrarOcultarError("#MensajeCorreo", "Por favor, complete el campo Correo.");
        return false;
    }

    if (!correoValido) {
        mostrarOcultarError("#MensajeCorreo", "El correo electrónico no es válido.");
        return false;
    }

    // Verificar si el correo ya está en la lista de clientes obtenida
    if (cliente.some(cliente => cliente.correo.toLowerCase() === correo.toLowerCase())) {
        mostrarOcultarError("#MensajeCorreo", "Este Correo ya se encuentra registrado.");
        return false;
    }

    mostrarOcultarError("#MensajeCorreo"); // Limpiar mensaje de error si pasa todas las validaciones
    return true;
}

$("#Direccion").on("input", function () {
    validarDireccion($(this).val()); // Llamar a la función de validación con el valor actual del campo
});
function validarDireccion(direccion) {

    if (!direccion.trim()) {
        mostrarOcultarError("#MensajeDireccion", "Por favor, complete el campo Direccion.");
        return false;
    }

    if (direccion.length > 25) {
        mostrarOcultarError("#MensajeDireccion", "El campo tiene más de 25 caracteres.");
        return false;
    }
    if (direccion.length < 5) {
        mostrarOcultarError("#MensajeDireccion", "El campo tiene menos de 5.");
        return false;
    }


    // Limpiar mensaje de error en el span
    mostrarOcultarError("#MensajeDireccion");
    return true;
}
// Función para mostrar un mensaje de error en el span

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

// Función para limpiar el formulario cuando se cierra el modal



function validarFormularioAct() {
    // Obtener los valores de los campos del formulario de actualización
    var identificacionAct = $("#IdentificacionAct").val();
    var nombreEntidadAct = $("#NombreEntidadAct").val();
    var nombreCompletoAct = $("#NombreCompletoAct").val();
    var telefonoAct = $("#TelefonoAct").val();
    var correoAct = $("#CorreoAct").val();
    var direccionAct = $("#DireccionAct").val();

    // Validar cada campo individualmente
    if (!validarIdentificacionAct(identificacionAct)) {
        return false;
    }

    if (!validarNombreEntidadAct(nombreEntidadAct)) {
        return false;
    }

    if (!validarNombreCompletoAct(nombreCompletoAct)) {
        return false;
    }

    if (!validarTelefonoAct(telefonoAct)) {
        return false;
    }

    if (!validarDireccionAct(direccionAct)) {
        return false;
    }

    if (!validarCorreoAct(correoAct)) {
        return false;
    }

    // Si todas las validaciones pasan, se puede enviar el formulario de actualización
    return true;
}

// Función para validar la identificación en el formulario de actualización

$("#IdentificacionAct").on("input", function () {
    validarIdentificacionAct($(this).val()); // Llamar a la función de validación con el valor actual del campo
});
function validarIdentificacionAct(identificacionAct) {

    if (!identificacionAct.trim()) {
        mostrarOcultarError("#MensajeIdentificacionAct"); // Limpiar mensaje de error en el span
        return true; // No hay error si el campo está vacío
    }

    if (identificacionAct.length > 25) {
        mostrarOcultarError("#MensajeIdentificacionAct", "El campo tiene más de 25 caracteres.");
        return false;
    }
    if (identificacionAct.length < 4) {
        mostrarOcultarError("#MensajeIdentificacionAct", "El campo tiene menos de 5 caracteres.");
        return false;
    }
    if (!/^\d+$/.test(identificacionAct)) {
        mostrarOcultarError("#MensajeIdentificacionAct", "El campo identificacion no puede tener solo espacios en blancos.");
        return false;
    }

    // Limpiar mensaje de error en el span
    mostrarOcultarError("#MensajeIdentificacionAct");
    return true;
}

// Función para validar el nombre de la entidad en el formulario de actualización
$("#NombreEntidadAct").on("input", function () {
    validarNombreEntidadAct($(this).val()); // Llamar a la función de validación con el valor actual del campo
});
function validarNombreEntidadAct(nombreEntidadAct) {
    var letrasRegex = /^[A-Za-z]+(?:\s+[A-Za-z]+)*$/;

    if (!nombreEntidadAct.trim()) {
        mostrarOcultarError("#MensajeNombreEntidadAct", "Por favor, complete el campo Nombre de Entidad.");
        return false;
    }

    if (nombreEntidadAct.length < 4) {
        mostrarOcultarError("#MensajeNombreEntidadAct", "El campo Nombre de Entidad debe tener al menos 4 caracteres.");
        return false;
    }

    if (!letrasRegex.test(nombreEntidadAct)) {
        mostrarOcultarError("#MensajeNombreEntidadAct", "El campo Nombre de Entidad solo puede contener letras y espacios entre palabras.");
        return false;
    }
    if (!/^\d+$/.test(nombreEntidadAct)) {
        mostrarOcultarError("#MensajeNombreEntidadAct", "El campo Nombre Entidad no puede tener solo espacios en blancos.");
        return false;
    }

    mostrarOcultarError("#MensajeNombreEntidadAct"); // Limpiar mensaje de error si pasa todas las validaciones
    return true;
}

// Función para validar el nombre completo en el formulario de actualización
$("#NombreCompletoAct").on("input", function () {
    validarNombreCompletoAct($(this).val()); // Llamar a la función de validación con el valor actual del campo
});
function validarNombreCompletoAct(nombreCompletoAct) {
    var letrasRegex = /^[A-Za-z]+(?:\s+[A-Za-z]+)*$/;

    if (!nombreCompletoAct.trim()) {
        mostrarOcultarError("#MensajeNombreCompletoAct", "Por favor, complete el campo Nombre Completo.");
        return false;
    }

    if (nombreCompletoAct.length > 25) {
        mostrarOcultarError("#MensajeNombreCompletoAct", "El campo Nombre Completo puede ser mayor a 25 palabras.");
        return false;
    }

    if (nombreCompletoAct.length < 5) {
        mostrarOcultarError("#MensajeNombreCompletoAct", "El campo Nombre Completo debe tener al menos 5 caracteres.");
        return false;
    }

    if (!letrasRegex.test(nombreCompletoAct)) {
        mostrarOcultarError("#MensajeNombreCompletoAct", "El campo Nombre de Completo solo puede contener letras.");
        return false;
    }
    if (!/^\d+$/.test(nombreCompletoAct)) {
        mostrarOcultarError("#MensajeNombreCompletoAct", "El campo Nombre Completo no puede tener solo espacios en blancos.");
        return false;
    }

    mostrarOcultarError("#MensajeNombreCompletoAct"); // Limpiar mensaje de error si pasa todas las validaciones
    return true;
}

// Función para validar el teléfono en el formulario de actualización
$("#TelefonoAct").on("input", function () {
    validarTelefonoAct($(this).val()); // Llamar a la función de validación con el valor actual del campo
});
function validarTelefonoAct(telefonoAct) {
    var telefonoValor = telefonoAct.trim();

    mostrarOcultarError("#MensajeTelefonoAct"); // Limpiar mensaje de error en el span

    if (!telefonoValor) {
        mostrarOcultarError("#MensajeTelefonoAct", "Por favor, complete el campo Teléfono.");
        return false;
    }

    if (!/^\d+$/.test(telefonoValor)) {
        mostrarOcultarError("#MensajeTelefonoAct", "El teléfono solo puede contener números.");
        return false;
    }

    if (telefonoValor.length < 7 || telefonoValor.length > 11) {
        mostrarOcultarError("#MensajeTelefonoAct", "El campo Teléfono debe tener entre 7 y 11 dígitos.");
        return false;
    }
    if (!/^\d+$/.test(telefonoValor)) {
        mostrarOcultarError("#MensajeTelefonoAct", "El teléfono solo puede contener números.");
        return false;
    }

    return true;
}

// Función para validar la dirección en el formulario de actualización
$("#DireccionAct").on("input", function () {
    validarDireccionAct($(this).val()); // Llamar a la función de validación con el valor actual del campo
});
function validarDireccionAct(direccionAct) {
    if (!direccionAct.trim()) {
        mostrarOcultarError("#MensajeDireccionAct", "Por favor, complete el campo Dirección.");
        return false;
    }

    if (direccionAct.length > 25) {
        mostrarOcultarError("#MensajeDireccionAct", "El campo tiene más de 25 caracteres.");
        return false;
    }
    if (direccionAct.length < 5) {
        mostrarOcultarError("#MensajeDireccionAct", "El campo tiene menos de 5 caracteres.");
        return false;
    }
    if (!/^\d+$/.test(direccionAct)) {
        mostrarOcultarError("#MensajeDireccionAct", "La direccion  no puede tener solo espsacios.");
        return false;
    }

    mostrarOcultarError("#MensajeDireccionAct"); // Limpiar mensaje de error en el span
    return true;
}


$("#CorreoAct").on("input", function () {
    validarCorreoAct($(this).val()); // Llamar a la función de validación con el valor actual del campo
});
function validarCorreoAct(correoAct) {
    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoAct);

    if (!correoAct.trim()) {
        mostrarOcultarError("#MensajeCorreoAct", "Por favor, complete el campo Correo.");
        return false;
    }

    if (!correoValido) {
        mostrarOcultarError("#MensajeCorreoAct", "El correo electrónico no es válido.");
        return false;
    }

    if (cliente.some(cliente => cliente.correo.toLowerCase() === correoAct.toLowerCase())) {
        mostrarOcultarError("#MensajeCorreoAct", "Este Correo ya se encuentra registrado.");
        return false;
    }

    if (!/^\d+$/.test(correoValido)) {
        mostrarOcultarError("#MensajeCorreoAct", "El correo  no puede tener solo espsacios.");
        return false;
    }
    mostrarOcultarError("#MensajeCorreoAct"); // Limpiar mensaje de error si pasa todas las validaciones
    return true;
}



function limpiarFormulario() {
    // Limpiar los valores de los campos del formulario
    $('#Identificacion, #NombreEntidad, #Telefono,#Correo,#Direccion,#TipoCliente,#ClienteIdAct, #IdentificacionAct,#NombreCompletoAct,#NombreEntidadAct,#TelefonoAct,#CorreoAct,#DireccionAct,#TipoClienteAct,#EstadoClienteAct').val('');

    // Restaurar mensajes de error
    $('.Mensaje, .MensajeAct').text(' *');
    $('.Mensaje, .MensajeAct').show(); // Mostrar mensajes de error

    $('.text-danger, .text-dangerAct').text(''); // Limpiar mensajes de error
    document.getElementById('agregarDetalleCliente').style.display = 'block';
    document.getElementById('FormActualizarCliente').style.display = 'none';

}

// Bandera para controlar si se ha ingresado texto en el campo
var textoIngresado = false;

// Función para mostrar u ocultar el mensaje de error y aplicar estilos
function mostrarOcultarError(spanId, mensaje) {
    var campoTexto = $(spanId).prev();

    if (mensaje && campoTexto.val().trim()) {
        // Si hay un mensaje de error y el campo no está vacío, mostrar el mensaje de error y agregar la clase de error
        $(spanId).text(mensaje);
        $(spanId).addClass('text-danger'); // Agregar clase para mostrar en rojo
        campoTexto.addClass('is-invalid'); // Dar estilo al cuadro de texto
    } else {
        // Si no hay mensaje de error o el campo está vacío, limpiar el mensaje de error y quitar la clase de error
        $(spanId).text('');
        $(spanId).removeClass('text-danger'); // Eliminar clase de error
        campoTexto.removeClass('is-invalid'); // Quitar estilo del cuadro de texto

        // Verificar si el campo está vacío después de eliminar el mensaje de error
        if (!campoTexto.val().trim()) {
            if (textoIngresado) {
                // Si se ha ingresado texto previamente y se ha borrado, marcar el campo como válido
                campoTexto.addClass('is-valid');
            } else {
                // Si es la primera vez que el campo está vacío, marcar el campo como inválido
                campoTexto.addClass('is-invalid');
            }
        } else {
            // Si el campo no está vacío, verificar si cumple con las condiciones de validación
            var isValid = false;
            // Lógica de validación aquí, establece isValid en true si el campo es válido
            if (isValid) {
                campoTexto.addClass('is-valid'); // Marcar el campo como válido si cumple con las condiciones de validación
            }
        }
    }
}

// Evento para capturar cuando se comienza a escribir en el campo
$("#campoTexto").on("input", function () {
    // Cuando se empieza a escribir, establecer la bandera textoIngresado a true
    textoIngresado = true;
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

document.querySelectorAll('#btnEditar').forEach(button => {
    button.addEventListener('click', function () {
        const Id = this.getAttribute('data-cliente-id');

        document.getElementById('agregarDetalleCliente').style.display = 'none';
        document.getElementById('FormActualizarCliente').style.display = 'block';
        obtenerDatosUsuarios();
        obteneClienteid(Id); // Aquí se pasa el Id como argumento a la función obtenercategoriaid()
    });
});

// Agregar un evento de clic fuera del modal para limpiar el formulario
$(document).mouseup(function (e) {
    var modal = $("#clienteModal");
    // Si el clic no está dentro del modal ni dentro de sus descendientes, limpiar el formulario
    if (!modal.is(e.target) && modal.has(e.target).length === 0) {
        limpiarFormulario();
    }
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


