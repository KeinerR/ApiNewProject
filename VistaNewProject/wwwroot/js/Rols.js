function agregarRol() {
    Swal.fire({
        icon: 'error',
        title: 'Función deshabilitada',
        text: 'La función de agregar rol está deshabilitada actualmente.',
    });
}

function eliminarRol(rolId) {
    Swal.fire({
        icon: 'error',
        title: 'Función deshabilitada',
        text: 'La función de eliminar rol está deshabilitada actualmente.',
    });
}

function obtenerDatosRol(rolId) {
    Swal.fire({
        icon: 'error',
        title: 'Función deshabilitada',
        text: 'La función de obtener datos del rol está deshabilitada actualmente.',
    });
}

function ActualizarRol() {
    Swal.fire({
        icon: 'error',
        title: 'Función deshabilitada',
        text: 'La función de actualizar rol está deshabilitada actualmente.',
    });
}

function limpiarFormulario() {
    // Limpiar los valores de los campos del formulario
    document.getElementById('RolId').value = '';
    document.getElementById('NombreRol').value = '';
    document.getElementById('TituloModal').innerText = 'Agregar Rol';
    document.getElementById('btnGuardar').style.display = 'inline-block'; // Mostrar el botón "Actualizar Usuario"
    document.getElementById('btnEditar').style.display = 'none';
}

function buscarRoles() {
    var searchTerm = $('#searchInput').val().toLowerCase();

    // Filtra las filas de la tabla basándose en el término de búsqueda
    $('tbody tr').each(function () {
        var filaVisible = false;

        // Itera sobre cada campo de la entidad Rol en la fila
        $(this).find('.nombre-rol, .rol-id').each(function () {
            var textoCampo = $(this).is(':hidden') ? $(this).text() : $(this).html().toLowerCase();

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
    buscarRoles();
});

// Evento de clic en el icono de búsqueda
$('#btnNavbarSearch i').on('click', function () {
    buscarRoles();
});

// Evento de presionar Enter en el campo de búsqueda
$('#searchInput').on('keypress', function (e) {
    if (e.which === 13) { // Verifica si la tecla presionada es Enter
        buscarRoles();
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


//function agregarRol() {
//    const nombreRol = document.getElementById('NombreRol').value;
//    const rolObjeto = {
//        NombreRol: nombreRol
//    };

//    fetch('https://localhost:7013/api/Roles/InsertRol', {
//        method: 'POST',
//        headers: {
//            'Content-Type': 'application/json'
//        },
//        body: JSON.stringify(rolObjeto)
//    })
//        .then(response => {
//            if (!response.ok) {
//                throw new Error('Ocurrió un error al enviar la solicitud.');
//            }
//            return response.json();
//        })
//        .then(data => {
//            console.log('Respuesta del servidor:', data);
//            location.reload(); // Recargar la página
//        })
//        .catch(error => {
//            console.error('Error:', error);
//        });
//}
//function eliminarRol(rolId) {
//    // Hacer la solicitud DELETE al servidor para eliminar el cliente
//    fetch(`https://localhost:7013/api/Roles/DeleteRol/${rolId}`, {
//        method: 'DELETE',
//    })
//        .then(response => {
//            if (!response.ok) {
//                throw new Error('Error al eliminar el rol.');
//            }
//            // Aquí puedes manejar la respuesta si es necesario
//            console.log('Rol eliminado correctamente.');
//            // Recargar la página o actualizar la lista de clientes, según sea necesario
//            location.reload(); // Esto recarga la página
//        })
//        .catch(error => {
//            console.error('Error:', error);
//        });
//}

//// Función para obtener los datos del cliente
//function obtenerDatosRol(rolId) {
//    fetch(`https://localhost:7013/api/Roles/GetRolById?Id=${rolId}`)
//        .then(response => {
//            if (!response.ok) {
//                throw new Error('Error al obtener los datos del rol.');
//            }
//            return response.json();
//        })
//        .then(rol => {
//            // Llenar los campos del formulario modal con los datos del cliente
//            console.log(rol)
//            document.getElementById('RolId').value = rol.rolId;
//            document.getElementById('NombreRol').value = rol.nombreRol;

//            // Cambiar el título de la ventana modal
//            document.getElementById('TituloModal').innerText = 'Editar rol';
//            // Ocultar el botón "Agregar" y mostrar el botón "Actualizar Usuario"
//            document.getElementById('btnGuardar').style.display = 'none';
//            document.getElementById('btnEditar').style.display = 'inline-block'; // Mostrar el botón "Actualizar Usuario"


//        })
//        .catch(error => {
//            console.error('Error:', error);
//        });
//}

//function ActualizarRol() {
//    const rolId = document.getElementById('RolId').value;
//    const nombreRol = document.getElementById('NombreRol').value;
    

//    const RolObjeto = {
//        RolId: rolId,
//        NombreRol: nombreRol
       
//    };

//    fetch(`https://localhost:7013/api/Roles/UpdateRol`, {
//        method: 'PUT',
//        headers: {
//            'Content-Type': 'application/json'
//        },
//        body: JSON.stringify(RolObjeto)
//    })
//        .then(response => {
//            if (response.ok) {
//                alert('Rol actualizado correctamente.');
//                location.reload()
//            } else {
//                alert("Error en la actualización. Por favor, inténtalo de nuevo más tarde.");
//            }
//        })
//        .catch(error => {
//            console.error('Error:', error);
//            alert("Error en la actualización. Por favor, inténtalo de nuevo más tarde.");
//        });
//}

//function limpiarFormulario() {
//    // Limpiar los valores de los campos del formulario
//    document.getElementById('RolId').value = '';
//    document.getElementById('NombreRol').value = '';
   

//    document.getElementById('TituloModal').innerText = 'Agregar Rol';
//    document.getElementById('btnGuardar').style.display = 'inline-block'; // Mostrar el botón "Actualizar Usuario"
//    document.getElementById('btnEditar').style.display = 'none';
//}
