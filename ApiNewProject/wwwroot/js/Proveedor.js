

function eliminarProveedor(proveedorId) {
    // Hacer la solicitud DELETE al servidor para eliminar el cliente
    fetch(`https://localhost:7013/api/Proveedores/DeleteProveedor/${proveedorId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar el proveedor.');
            }
            // Aqu� puedes manejar la respuesta si es necesario
            console.log('Proveedor eliminado correctamente.');
            // Recargar la p�gina o actualizar la lista de clientes, seg�n sea necesario
            location.reload(); // Esto recarga la p�gina
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function agregarProveedor() {
    // Obtener los valores de los campos del formulario
    const nombreEmpresa = document.getElementById('NombreEmpresa').value;
    const nombreContacto = document.getElementById('NombreContacto').value;
    const direccion = document.getElementById('Direccion').value;
    const telefono = document.getElementById('Telefono').value;
    const correo = document.getElementById('Correo').value;
    const estadoProveedor = document.getElementById('EstadoProveedor').value;
    console.log(nombreEmpresa);
    // Crear un objeto con los valores del formulario
    const proveedorObjeto = {
        NombreEmpresa: nombreEmpresa,
        NombreContacto: nombreContacto,
        Direccion: direccion,
        Telefono: telefono,
        Correo: correo,
        EstadoProveedor: estadoProveedor
    };
    console.log(proveedorObjeto)

    // Enviar la solicitud POST al servidor utilizando la Fetch API
    fetch('https://localhost:7013/api/Proveedores/InsertarProveedor', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(proveedorObjeto)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ocurri� un error al enviar la solicitud.');
            }
            return response.json();
        })
        .then(data => {
            /*console.log('Respuesta del servidor:', data);*/
            location.reload()
            // Manejar la respuesta del servidor seg�n sea necesario
        })
        .catch(error => {
            console.error('Error:', error);
            // Manejar errores de la solicitud
        });
}


// Funci�n para obtener los datos del cliente
function obtenerDatosProveedor(proveedorId) {
    fetch(`https://localhost:7013/api/Proveedores/GetProveedorById?Id=${proveedorId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos del Proveedor.');
            }
            return response.json();
        })
        .then(proveedor => {
            // Llenar los campos del formulario modal con los datos del cliente
            console.log(proveedor)
            document.getElementById('ProveedorId').value = proveedor.proveedorId;
            document.getElementById('NombreEmpresa').value = proveedor.nombreEmpresa;
            document.getElementById('NombreContacto').value = proveedor.nombreContacto;
            document.getElementById('Direccion').value = proveedor.direccion;
            document.getElementById('Telefono').value = proveedor.telefono;
            document.getElementById('Correo').value = proveedor.correo;
            document.getElementById('EstadoProveedor').value = proveedor.estadoProveedor;

            // Cambiar el t�tulo de la ventana modal
            document.getElementById('TituloModal').innerText = 'Editar Proveedor';
            // Ocultar el bot�n "Agregar" y mostrar el bot�n "Actualizar Proveedor"
            document.getElementById('btnGuardar').style.display = 'none';
            document.getElementById('btnEditar').style.display = 'inline-block'; // Mostrar el bot�n "Actualizar Proveedor"


        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function ActualizarProveedor() {
    const proveedorId = document.getElementById('ProveedorId').value;
    const nombreEmpresa = document.getElementById('NombreEmpresa').value;
    const nombreContacto = document.getElementById('NombreContacto').value;
    const direccion = document.getElementById('Direccion').value;
    const telefono = document.getElementById('Telefono').value;
    const correo = document.getElementById('Correo').value;
    const estadoProveedor = document.getElementById('EstadoProveedor').value;

    const proveedorObjeto = {
        ProveedorId: proveedorId,
        NombreEmpresa: nombreEmpresa,
        nombreContacto: nombreContacto,
        Direccion: direccion,
        Telefono: telefono,
        Correo: correo,
        EstadoProveedor: estadoProveedor
    };

    fetch(`https://localhost:7013/api/Proveedores/UpdateProveedores`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(proveedorObjeto)
    })
        .then(response => {
            if (response.ok) {
                alert('Proveedor actualizado correctamente.');
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

function limpiarFormulario() {
    // Limpiar los valores de los campos del formulario
    document.getElementById('ProveedorId').value = '';
    document.getElementById('NombreEmpresa').value = '';
    document.getElementById('NombreContacto').value = '';
    document.getElementById('Direccion').value = '';
    document.getElementById('Telefono').value = '';
    document.getElementById('Correo').value = '';
    document.getElementById('EstadoProveedor').value = '';

    document.getElementById('TituloModal').innerText = 'Agregar Proveedor';
    document.getElementById('btnGuardar').style.display = 'inline-block';
    document.getElementById('btnEditar').style.display = 'none';
}
