document.addEventListener('DOMContentLoaded', function () {

    // Agrega un evento 'submit' al formulario
    document.querySelector('form').addEventListener('submit', function (event) {
        event.preventDefault(); // Evitar que el formulario se envíe de forma tradicional

        // Obtener los valores de los campos del formulario
        const nombrepresentacion = document.getElementById('NombrePresentacion').value;
        const descripcionpresentacion = document.getElementById('DescripcionPresentacion').value;

        // Crear un objeto con los valores del formulario
        const usuarioObjeto = {
            NombrePresentacion: nombrepresentacion,
            DescripcionPresentacion: descripcionpresentacion,
            
        };

        // Enviar la solicitud POST al servidor utilizando la Fetch API
        fetch('https://localhost:7013/api/Presentaciones/InsertarPresentacion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(presentacionObjeto)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ocurrió un error al enviar la solicitud.');
                }
                return response.json();
            })
            .then(data => {
                console.log('Respuesta del servidor:', data);
                // Manejar la respuesta del servidor según sea necesario
                location.reload(); // Esto recarga la página
            })
            .catch(error => {
                console.error('Error:', error);
                // Manejar errores de la solicitud
            });
    });
});

function eliminarPresentacion(presentacionId) {
    // Hacer la solicitud DELETE al servidor para eliminar el cliente
    fetch(`https://localhost:7013/api/Presentaciones/DeletePresentacion/${presentacionId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar la presentacion.');
            }
            // Aquí puedes manejar la respuesta si es necesario
            console.log('Presentacion eliminada correctamente.');
            // Recargar la página o actualizar la lista de clientes, según sea necesario
            location.reload(); // Esto recarga la página
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Función para obtener los datos del cliente
function obtenerDatosPresentacion(presentacionId) {
    fetch(`https://localhost:7013/api/Presentaciones/GetPresentacionById?Id=${presentacionId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos de la presentacion.');
            }
            return response.json();
        })
        .then(presentacion => {
            // Llenar los campos del formulario modal con los datos del cliente
            console.log(presentacion)
            document.getElementById('PresentacionId').value = presentacion.presentacionId;
            document.getElementById('NombrePresentacion').value = presentacion.nombrepresentacion;
            document.getElementById('DescripcionPresentacion').value = presentacion.descripcionpresentacion;

            // Cambiar el título de la ventana modal
            document.getElementById('TituloModal').innerText = 'Editar Presentacion';
            // Ocultar el botón "Agregar" y mostrar el botón "Actualizar Usuario"
            document.getElementById('btnGuardar').style.display = 'none';
            document.getElementById('btnEditar').style.display = 'inline-block'; // Mostrar el botón "Actualizar Usuario"


        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function ActualizarPresentacion() {
    const usuarioid = document.getElementById('UsuarioId').value;
    const rolId = document.getElementById('RolId').value;
    const nombre = document.getElementById('Nombre').value;


    const presentacionObjeto = {
        PresentacionId: presentacionId,
        NombrePresentacion: nombrepresentacion,
        DescripcionPresentacion: descripcionpresentacion,
        
    };

    fetch(`https://localhost:7013/api/Presentaciones/UpdatePresentaciones`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(presentacionObjeto)
    })
        .then(response => {
            if (response.ok) {
                alert('Presentacion actualizada correctamente.');
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

function limpiarFormulario() {
    // Limpiar los valores de los campos del formulario
    document.getElementById('PresentacionId').value = '';
    document.getElementById('NombrePresentacion').value = '';
    document.getElementById('DescripcionPresentacion').value = '';


    document.getElementById('TituloModal').innerText = 'Agregar Presentacion';
    document.getElementById('btnGuardar').style.display = 'inline-block'; // Mostrar el botón "Actualizar Usuario"
    document.getElementById('btnEditar').style.display = 'none';
}
