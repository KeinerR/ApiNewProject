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
    document.getElementById('botonEditarar').style.display = 'none';
}

document.getElementById('buscarRol').addEventListener('input', function () {
    var input = this.value.trim().toLowerCase();
    var rows = document.querySelectorAll('.rolesPaginado');

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
    var rowsTodos = document.querySelectorAll('.Roles');

    rowsTodos.forEach(function (row) {
        if (input === "") {
            row.style.display = 'none';
        } else {
            var rolId = row.querySelector('td:nth-child(1)').textContent.trim().toLowerCase();
            var nombreR = row.querySelector('td:nth-child(2)').textContent.trim().toLowerCase();

            row.style.display = (rolId.includes(input) || nombreR.includes(input)) ? 'table-row' : 'none';
        }
    });
});

function vaciarInput() {
    document.getElementById('buscarRol').value = "";
    var icon = document.querySelector('#btnNavbarSearch i');
    icon.className = 'fas fa-search';
    icon.style.color = 'gray';

    var rows = document.querySelectorAll('.rolesPaginado');
    rows.forEach(function (row) {
        row.style.display = 'table-row';
    });

    var rowsTodos = document.querySelectorAll('.Roles');

    rowsTodos.forEach(function (row) {
        row.style.display = 'none';
    });
}



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
//            document.getElementById('botonEditarar').style.display = 'inline-block'; // Mostrar el botón "Actualizar Usuario"


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
//    document.getElementById('botonEditarar').style.display = 'none';
//}
