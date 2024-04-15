document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const mostrarAlerta = urlParams.get('mostrarAlerta');
    const marcaId = urlParams.get('marcaId');

    unidades = {}; // Inicializamos la variable usuarios como un objeto vacío
    var todoValido = true;


    function obtenerDatosMarcas() {
        fetch('https://localhost:7013/api/Unidades/GetUnidades')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los usuarios.');
                }
                return response.json();
            })
            .then(data => {
                unidades = data; // Asignamos el resultado de la petición a la variable usuarios
                NoCamposVacios();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    obtenerDatosMarcas();

    if (mostrarAlerta === 'true' && marcaId) {
        obtenerDatosUsuario(marcaId);

        // Obtener el botón que activa la modal
        const botonModal = document.querySelector('[data-bs-target="#usuarioModal"]');
        if (botonModal) {
            // Simular el clic en el botón para mostrar la modal
            botonModal.click();
        }
    } else {
        console.log('UsuarioId no encontrado en la URL');
    }


    function NoCamposVacios() {
        // Mostrar mensaje inicial de validación
        $('#MensajeInicial').text(' Completa todos los campos con *');
        $('.Mensaje').text(' *');


        $('#DescripcionUnidad').on('input', function () {
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
        var valor = input.val().trim(); // Obtener el valor del campo y eliminar espacios en blanco al inicio y al final
        var spanError = input.next('.text-danger'); // Obtener el elemento span de error asociado al input
        var spanVacio = input.prev('.Mensaje'); // Obtener el elemento span vacío asociado al input

        // Limpiar el mensaje de error previo
        spanError.text('');
        spanVacio.text('');

        // Validar el campo y mostrar mensaje de error si es necesario
        if (valor === '') {
            spanVacio.text(' *obligatorio');
            spanError.text('');
        } else if (input.is('#DescripcionUnidad')) {
            if (valor.length < 2) {
                spanError.text('Este debe tener un mínimo de 2 caracteres.');
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
                var nombreRepetido = unidades.some(function (unidad) {
                    return unidad.descripcionUnidad.toLowerCase() === valor.toLowerCase() &&
                        unidad.unidadId != $('#UnidadId').val().trim();
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

    function agregarUnidad() {
        if (!todoValido) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                timer: 3000, // Tiempo en milisegundos (en este caso, 3 segundos)
                timerProgressBar: true,
                text: 'Por favor, completa correctamente todos los campos  para poder registrar la unidad.'
            });
            return;
        }
        const descripcionUnidad = document.getElementById('DescripcionUnidad').value;
        if (
            descripcionUnidad.trim() === ''
        ) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                timer: 3000,
                timerProgressBar: true,
                text: 'Por favor, completa todos los campos con * para registrar la unidad.'
            });
            return;
        }
        const unidadObjeto = {
            DescripcionUnidad: descripcionUnidad
        };


        fetch('https://localhost:7013/api/Unidades/InsertarUnidad', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(unidadObjeto)
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error('Error al agregar la marca: ' + error.message);
                    });
                } else {
                    Swal.fire({
                        icon: 'success',
                        title: 'Éxito',
                        text: 'Marca agregada correctamente.',
                        timer: 3000,
                        timerProgressBar: true
                    }).then(() => {
                        location.reload(); // Recargar la página
                    });
                }
            }).catch(error => {
                console.error('Error al agregar la marca:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un error al agregar la marca. Por favor, inténtalo de nuevo más tarde.'
                });
            });
    }


    function obtenerDatosUnidad(unidadId) {
        fetch(`https://localhost:7013/api/Unidades/GetUnidadById?Id=${unidadId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los datos de la unidad.');
                }
                return response.json();
            })
            .then(unidad => {
                // Llenar los campos del formulario modal con los datos del cliente
                document.getElementById('UnidadId').value = unidad.unidadId;
                document.getElementById('DescripcionUnidad').value = unidad.descripcionUnidad;

                // Cambiar el título de la ventana modal
                document.getElementById('TituloModal').innerText = 'Editar unidad';
                $('#MensajeInicial').text('');
                var mensajes = document.querySelectorAll('.Mensaje');
                mensajes.forEach(function (mensaje) {
                    mensaje.textContent = ''; // Restaurar mensajes de error
                    mensaje.style.display = 'inline-block';
                });
                // Ocultar el botón "Agregar" y mostrar el botón "Actualizar Usuario"
                document.getElementById('btnGuardar').style.display = 'none';
                document.getElementById('btnEditar').style.display = 'inline-block'; // Mostrar el botón "Actualizar Usuario"
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }



    function ActualizarUnidad() {
        if (!todoValido) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                timer: 3000, // Tiempo en milisegundos (en este caso, 3 segundos)
                timerProgressBar: true,
                text: 'Por favor, completa correctamente todos los campos  para poder registrar la unidad.'
            });
            return;
        }
        const unidadId = document.getElementById('UnidadId').value;
        const descripcionUnidad = document.getElementById('DescripcionUnidad').value;

        if (
            descripcionUnidad.trim() === ''
        ) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                timer: 3000,
                timerProgressBar: true,
                text: 'Por favor, completa todos los campos con * para registrar la unidad.'
            });
            return;
        }
        const unidadObjeto = {
            UnidadId: unidadId,
            DescripcionUnidad: descripcionUnidad
        };

        fetch(`https://localhost:7013/api/Unidades/UpdateUnidades`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(unidadObjeto)
        })
            .then(response => {
                if (response.ok) {
                    // Mostrar SweetAlert
                    Swal.fire({
                        icon: 'success',
                        title: 'Éxito',
                        text: 'Se ha actualizado con éxito.',
                        timer: 3000, // Tiempo en milisegundos (en este caso, 3 segundos)
                        timerProgressBar: true
                    }).then((result) => {
                        location.reload();
                    });
                } else {
                    throw new Error('Error al actualizar.');
                }
            })
            .catch(error => {
                console.error('Error al actualizar la marca:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un error al actualizar Por favor, inténtalo de nuevo más tarde.'
                });
            });
    }

    function eliminarUnidad(unidadId) {
        // Hacer la solicitud DELETE al servidor para eliminar la unidad
        fetch(`https://localhost:7013/api/Unidades/DeleteUnidad/${unidadId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al eliminar la unidad.');
                }
                return response.json();
            })
            .then(data => {
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Unidad Eliminada correctamente.',
                    timer: 1500,
                    timerProgressBar: true,
                    showConfirmButton: false
                }).then(() => {
                    location.reload();
                });
            })
            .catch(error => {
                console.error('Error al eliminar la marca:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un error al eliminar la unidad. Por favor, verifica que no tenga productos asociados e inténtalo de nuevo más tarde.'
                });
            });
    }


    document.getElementById('btnGuardar').addEventListener('click', function () {
        agregarUnidad();
    });

    document.querySelectorAll('#btnEdit').forEach(button => {
        button.addEventListener('click', function () {
            const unidadId = this.getAttribute('data-cliente-id');
            obtenerDatosUnidad(unidadId);
        });
    });

    document.getElementById('btnEditar').addEventListener('click', function () {
        ActualizarUnidad();
    });
    document.querySelectorAll('#btnDelete').forEach(button => {
        button.addEventListener('click', function () {
            const unidadId = this.getAttribute('data-cliente-id');
            eliminarUnidad(unidadId);
        });
    });





});

function limpiarFormulario() {
    // Limpiar los valores de los campos del formulario
    document.getElementById('UnidadId').value = '';
    document.getElementById('DescripcionUnidad').value = '';

    document.getElementById('TituloModal').innerText = 'Agregar Unidad';
    document.getElementById('btnGuardar').style.display = 'inline-block'; // Mostrar el botón "Actualizar Usuario"
    document.getElementById('btnEditar').style.display = 'none';
    var mensajes = document.querySelectorAll('.Mensaje');
    mensajes.forEach(function (mensaje) {
        mensaje.textContent = ' *'; // Restaurar mensajes de error
        mensaje.style.display = 'inline-block'; // Establecer estilo si es necesario
    });
    const mensajesError = document.querySelectorAll('.text-danger');
    mensajesError.forEach(span => {
        span.innerText = ''; // Limpiar contenido del mensaje
    });
    location.reload();
}
