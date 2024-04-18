document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const mostrarAlerta = urlParams.get('mostrarAlerta');
    const presentacionId = urlParams.get('presentacionId');
    const API_URL = 'https://localhost:7013/api/Presentaciones';

    var presentaciones = []; // Cambiado de objeto a array
    let todoValido = true;

    function obtenerDatosPresentaciones() {
        fetch(`${API_URL}/GetPresentaciones`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener las presentaciones.');
                }
                return response.json();
            })
            .then(data => {
                presentaciones = data;
                NoCamposVacios();
            })
            .catch(error => {
                location.reload();
            });
    }
    obtenerDatosPresentaciones();

    if (mostrarAlerta === 'true' && presentacionId) {
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
        $('#MensajeInicial').text('Completa todos los campos con *');
        $('.Mensaje').text('*');

        $('#NombrePresentacion, #DescripcionPresentacion').on('input', function () {
            validarCampo($(this));

            // Validar si todos los campos son válidos antes de agregar la presentación
            todoValido = $('.text-danger').filter(function () {
                return $(this).text() !== '';
            }).length === 0;

            const todosLlenos = $('.Mensaje').filter(function () {
                return $(this).text() !== '';
            }).length === 0;

            console.log('Todos los campos son válidos:', todoValido);

            // Si todos los campos son válidos, ocultar el mensaje inicial en todos los campos
            if (todosLlenos) {
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
            spanVacio.text('* Obligatorio');
            spanError.text('');
        } if (input.is('#NombrePresentacion') || input.is('#DescripcionPresentacion')) {
            var spanErrorNombre = $('#NombrePresentacion').next('.text-danger'); // Obtén el elemento span correspondiente al campo NombrePresentacion
            var spanErrorDescripcion = $('#DescripcionPresentacion').next('.text-danger'); // Obtén el elemento span correspondiente al campo Descripcion
            var valorNombre = $('#NombrePresentacion').val().trim(); // Obtén el valor del campo Nombre
            var valorDescripcion = $('#DescripcionPresentacion').val().trim(); // Obtén el valor del campo Descripcion
            var spanVacioNombre = $('#NombrePresentacion').prev('.Mensaje');
            var spanVacioDescripcion = $('#DescripcionPresentscion').prev('.Mensaje');
            const redundante = /^(?!.*(\w)\1\1\1)[\w\s]+$/;


            if (valorNombre === '') {
                spanErrorNombre.text(' ');
                spanVacioNombre.text(' *');
            } else if ($('#NombrePresentacion').val().trim().length < 3) {
                spanErrorNombre.text('Este campo debe tener un mínimo de 3 caracteres.');
                spanVacioNombre.text('');
            } else if (/^\d+$/.test(valorNombre)) {
                spanErrorNombre.text('Este campo no puede ser solo numérico.');
                spanVacioNombre.text('');
            } else {
                if (redundante.test(valorNombre)) {
                    spanErrorNombre.text('');
                    spanVacioNombre.text('');
                } else {
                    spanErrorNombre.text('Esta descripción es redundante');
                    spanVacioNombre.text('');
                }
            }

            if (valorDescripcion === '') {
                spanErrorDescripcion.text(' ');
                spanVacioDescripcion.text(' *');
            } else if ($('#DescripcionPresentacion').val().trim().length < 3) {
                spanErrorDescripcion.text('Este campo debe tener un mínimo de 3 caracteres.');
                spanVacioDescripcion.text('');
            } else if (/^\d+$/.test(valorDescripcion)) {
                spanErrorDescripcion.text('Este campo no puede ser solo numerico');
                spanVacioDescripcion.text('');
            } else {
                spanErrorDescripcion.text('');
                spanVacioDescripcion.text('');
            }

            var nombreRepetido = presentaciones.some(function (presentacion) {
                return presentacion.nombrePresentacion.toLowerCase() === valorNombre.toLowerCase() &&
                    presentacion.descripcionPresentacion.toLowerCase() === valorDescripcion.toLowerCase() &&
                    presentacion.p != $('#PresentacionId').val().trim();
            });

            if (nombreRepetido) {
                spanErrorNombre.text('Se encontro una presentacion igual ya registrada.');
                spanErrorDescripcion.text('Se encontro una presentacion igual ya registrada.');
                spanVacio.text('');
            }
        }
        return todoValido; // Devuelve el estado de validación al finalizar la función
    }


    function agregarPresentacion() {
        if (!todoValido) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                timer: 3000, // Tiempo en milisegundos (en este caso, 3 segundos)
                timerProgressBar: true,
                text: 'Por favor, completa correctamente todos los campos  para poder registrar la presentacion.'
            });
            return;
        }
        const nombrePresentacion = document.getElementById('NombrePresentacion').value;
        const descripcionPresentacion = document.getElementById('DescripcionPresentacion').value;
        const cantidadPorUnidad = document.getElementById('CantidadPorUnidad').value;

        if (
            nombrePresentacion.trim() === '' ||
            descripcionPresentacion.trim() === '' ||
            cantidadPorUnidad.trim() === ''
        ) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                timer: 3000,
                timerProgressBar: true,
                text: 'Por favor, completa todos los campos con * para poder registrar la presentacion.'
            });
            return;
        }
        const presentacionObjeto = {
            NombrePresentacion: nombrePresentacion,
            DescripcionPresentacion: descripcionPresentacion,
            CantidadPorUnidad: cantidadPorUnidad,
            EstadoPresentacion: estadoPresentacion
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
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Presentacion agregada correctamente.',
                    timer: 3000,
                    timerProgressBar: true
                }).then(() => {
                    location.reload(); // Recargar la página
                });
            })
            .catch(error => {
                console.error('Error al agregar la marca:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un error al agregar la Presentacion. Por favor, inténtalo de nuevo más tarde.'
                });
            });  
    }



    function obtenerDatosPresentacion(presentacionId) {
        fetch(`${API_URL}/GetPresentacionById?Id=${presentacionId}`)
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
                document.getElementById('Contenido').value = presentacion.cantidadPorUnidad;

                document.getElementById('estadoPresentacion').style.display = 'block';

                $('#MensajeInicial').text('');
                var mensajes = document.querySelectorAll('.Mensaje');
                mensajes.forEach(function (mensaje) {
                    mensaje.textContent = ''; // Restaurar mensajes de error
                    mensaje.style.display = 'inline-block';
                });
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
        if (!todoValido) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                timer: 3000, // Tiempo en milisegundos (en este caso, 3 segundos)
                timerProgressBar: true,
                text: 'Por favor, completa correctamente todos los campos  para poder actualizar la presentacion.'
            });
            return;
        }
        const presentacionId = document.getElementById('PresentacionId').value;
        const nombrePresentacion = document.getElementById('NombrePresentacion').value;
        const descripcionPresentacion = document.getElementById('DescripcionPresentacion').value;
        const estadoPresentacion = document.getElementById('EstadoPresentacion').value;
        const cantidadPorUnidad = document.getElementById('CantidadPorUnidad').value;
        if (
            nombrePresentacion.trim() === '' ||
            descripcionPresentacion.trim() === '' ||
            cantidadPorUnidad.trim() === ''
        ) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                timer: 3000,
                timerProgressBar: true,
                text: 'Por favor, completa todos los campos con * para poder actualizar la presentacion.'
            });
            return;
        }

        const presentacionObjeto = {
            PresentacionId: presentacionId,
            NombrePresentacion: nombrePresentacion,
            DescripcionPresentacion: descripcionPresentacion,
            CantidadPorUnidad: cantidadPorUnidad,
            EstadoPresentacion: estadoPresentacion
        };

        fetch(`${API_URL}/UpdatePresentaciones`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(presentacionObjeto)
        })
            .then(response => {
                if (response.ok) {
                    // Mostrar SweetAlert
                    Swal.fire({
                        icon: 'success',
                        title: 'Éxito',
                        text: 'Se ha actualizado la presentacion con éxito.',
                        timer: 3000, // Tiempo en milisegundos (en este caso, 3 segundos)
                        timerProgressBar: true
                    }).then((result) => {
                        location.reload();
                    });
                } else {
                    throw new Error('Error al actualizar la presentacion.');
                }
            })
            .catch(error => {
                console.error('Error al actualizar la presentacion:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un error al actualizar la presentacion. Por favor, inténtalo de nuevo más tarde.'
                });
            });
    }



    function eliminarPresentacion(presentacionId) {
        // Hacer la solicitud DELETE al servidor para eliminar la presentacion
        fetch(`${API_URL}/DeletePresentacion/${presentacionId}`, {
            method: 'DELETE',
        })
            .then(data => {
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Presentacion Eliminada correctamente.',
                    timer: 1500,
                    timerProgressBar: true,
                    showConfirmButton: false
                }).then(() => {
                    location.reload();
                });
            })
            .catch(error => {
                console.error('Error al eliminar la Presentacion:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un error al eliminar la Presentacion. Por favor, verifica que la presentacion no tenga productos asociados e inténtalo de nuevo más tarde.'
                });
            });
    }

    // Modificar la función buscarPresentaciones() para incluir campos ocultos en la búsqueda
    function buscarPresentaciones() {
        var searchTerm = $('#searchInput').val().toLowerCase();

        // Filtra las filas de la tabla basándose en el término de búsqueda
        $('tbody tr').each(function () {
            var filaVisible = false;

            // Itera sobre cada campo de la entidad Cliente en la fila
            $(this).find('.nombre-presentacion, .descripcion-presentacion, .presentacion-id').each(function () {
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
        buscarPresentaciones();
    });

    // Evento de clic en el icono de búsqueda
    $('#btnNavbarSearch i').on('click', function () {
        buscarPresentaciones();
    });

    // Evento de presionar Enter en el campo de búsqueda
    $('#searchInput').on('keypress', function (e) {
        if (e.which === 13) { // Verifica si la tecla presionada es Enter
            buscarPresentaciones();
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


    document.getElementById('btnGuardar').addEventListener('click', function () {
        agregarPresentacion();
    });

    document.querySelectorAll('#btnEdit').forEach(button => {
        button.addEventListener('click', function () {
            const presentacionId = this.getAttribute('data-presentacion-id');
            obtenerDatosPresentacion(presentacionId);
        });
    });

    document.getElementById('btnEditar').addEventListener('click', function () {
        ActualizarPresentacion();
    });
    document.querySelectorAll('#btnDelete').forEach(button => {
        button.addEventListener('click', function () {
            const presentacionId = this.getAttribute('data-presentacion-id');
            eliminarPresentacion(presentacionId);
        });
    });
});

function limpiarFormulario() {
    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = urlParams.get('page');
    // Limpiar los valores de los campos del formulario
    document.getElementById('PresentacionId').value = '';
    document.getElementById('NombrePresentacion').value = '';
    document.getElementById('DescripcionPresentacion').value = '';

    document.getElementById('TituloModal').innerText = 'Agregar Presentacion';
    document.getElementById('btnGuardar').style.display = 'inline-block'; // Mostrar el botón "Actualizar Usuario"
    document.getElementById('btnEditar').style.display = 'none';


    // Ocultar el campo de Estado Presentacion 
    document.getElementById('estadoPresentacion').style.display = 'none';
    var mensajes = document.querySelectorAll('.Mensaje');
    mensajes.forEach(function (mensaje) {
        mensaje.textContent = ' *'; // Restaurar mensajes de error
        mensaje.style.display = 'inline-block'; // Establecer estilo si es necesario
    });
    const mensajesError = document.querySelectorAll('.text-danger');
    mensajesError.forEach(span => {
        span.innerText = ''; // Limpiar contenido del mensaje
    });
    if (currentPage) {
        window.location.replace(`/Presentaciones?page=${currentPage}`);
    } else {
        window.location.replace('/Presentaciones');
    }
}

