document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const mostrarAlerta = urlParams.get('mostrarAlerta');
    const presentacionId = urlParams.get('presentacionId');

    let presentaciones = {}; // Cambiado de objeto a array
    let todoValido = true;

    function obtenerDatosPresentaciones() {
        fetch('https://localhost:7013/api/Unidades/GetUnidades')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los usuarios.');
                }
                return response.json();
            })
            .then(data => {
                presentaciones = data;
                NoCamposVacios();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    obtenerDatosPresentaciones();

    if (mostrarAlerta === 'true' && marcaId) {
        obtenerDatosPresentacion(presentacionId);

        // Obtener el botón que activa la modal
        const botonModal = document.querySelector('[data-bs-target="#PresentacionModal"]');
        if (botonModal) {
            // Simular el clic en el botón para mostrar la modal
            botonModal.click();
        }
    }

    function NoCamposVacios() {
        // Mostrar mensaje inicial de validación
        $('#MensajeInicial').text(' Completa todos los campos con *');
        $('.Mensaje').text(' *');

        $('#NombrePresentacion, #DescripcionPresentacion').on('input', function () {
            validarCampo($(this));

            // Validar si todos los campos son válidos antes de agregar el usuario
            todoValido = $('.text-danger').filter(function () {
                return $(this).text() !== '';
            }).length === 0;

            todolleno = $('.Mensaje ').filter(function () {
                return $(this).text() !== '';
            }).length === 0;
            console.log('Todos los campos son válidos:', todoValido);

            // Si todos los campos son válidos, ocultar el mensaje en todos los campos
            if (todolleno) {
                $('#MensajeInicial').hide();
            } else {
                $('#MensajeInicial').show(); // Mostrar el mensaje si no todos los campos son válidos
            }
        });
    }

    function validarCampo(input) {
        const valor = input.val().trim(); // Obtener el valor del campo y eliminar espacios en blanco al inicio y al final
        const spanError = input.next('.text-danger'); // Obtener el elemento span de error asociado al input
        const spanVacio = input.prev('.Mensaje'); // Obtener el elemento span vacío asociado al input

        // Limpiar el mensaje de error previo
        spanError.text('');
        spanVacio.text('');

        // Validar el campo y mostrar mensaje de error si es necesario
        if (valor === '') {
            spanVacio.text(' *obligatorio');
            spanError.text('');
        } else if (input.is('#NombrePresentacion')) {
            if (valor.length < 2) {
                spanError.text('Este debe tener un mínimo de 3 caracteres.');
                spanVacio.text('');
            } else if (!/^(?!.*(\w)\1\1\1)[\w\s]+$/.test(valor)) {
                spanError.text('Este nombre es redundante.');
                spanVacio.text('');
                todoValido = false;
            } else if (/^\d+$/.test(valor)) {
                spanError.text('Este campo no puede ser solo numérico.');
                spanVacio.text('');
                todoValido = false;
            } else {
                const nombreRepetido = presentaciones.some(function (presentacion) {
                    return presentacion.NombrePresentacion.toLowerCase() === valor.toLowerCase() &&
                        presentacion.PresentacionId != $('#PresentacionId').val().trim();
                });

                if (nombreRepetido) {
                    spanError.text('Esta unidad ya se encuentra registrada.');
                    spanVacio.text('');
                    todoValido = false;
                } else {
                    spanError.text('');
                    spanVacio.text('');
                }
            }
        }
        return todoValido; // Devuelve el estado de validación al finalizar la función
    }
});

function agregarPresentacion() {
    const nombrePresentacion = document.getElementById('NombrePresentacion').value;
    const descripcionPresentacion = document.getElementById('DescripcionPresentacion').value;
    const presentacionObjeto = {
        NombrePresentacion: nombrePresentacion,
        DescripcionPresentacion: descripcionPresentacion
    };

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
            location.reload(); // Recargar la página
        })
        .catch(error => {
            console.error('Error:', error);
        });

}



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
            document.getElementById('PresentacionId').value = presentacion.presentacionId;
            document.getElementById('NombrePresentacion').value = presentacion.nombrePresentacion;
            document.getElementById('DescripcionPresentacion').value = presentacion.descripcionPresentacion;

            // Cambiar el título de la ventana modal
            document.getElementById('TituloModal').innerText = 'Editar presentacion';
            // Ocultar el botón "Agregar" y mostrar el botón "Actualizar Usuario"
            document.getElementById('btnGuardar').style.display = 'none';
            document.getElementById('btnEditar').style.display = 'inline-block'; // Mostrar el botón "Actualizar Usuario"
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function ActualizarPresentacion() {
    const presentacionId = document.getElementById('PresentacionId').value;
    const nombrePresentacion = document.getElementById('NombrePresentacion').value;
    const descripcionPresentacion = document.getElementById('DescripcionPresentacion').value;

    const presentacionObjeto = {
        PresentacionId: presentacionId,
        NombrePresentacion: nombrePresentacion,
        DescripcionPresentacion: descripcionPresentacion
    };

    fetch(`https://localhost:7013/api/Presentaciones/UpdatePresentaciones`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(presentacionObjeto)
    })
        .then(response => {
            if (response.ok) { // Corrección aquí
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

function eliminarPresentacion(presentacionId) {
    // Hacer la solicitud DELETE al servidor para eliminar la marca
    fetch(`https://localhost:7013/api/Presentaciones/DeletePresentacion/${presentacionId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar la presentacion.');
            }
            // Aquí puedes manejar la respuesta si es necesario
            console.log('Marca eliminado correctamente.');
            // Recargar la página o actualizar la lista de clientes, según sea necesario
            location.reload(); // Esto recarga la página
        })
        .catch(error => {
            console.error('Error:', error);
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

