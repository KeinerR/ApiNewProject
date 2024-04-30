

function checkInternetConnection() {
    return navigator.onLine;
}


  
    function NoCamposVacios() {
        // Mostrar mensaje inicial de validación
        $('#MensajeInicial').text('Completa todos los campos con *');
        $('.Mensaje').text('*');

        $('#NombrePresentacion, #DescripcionPresentacion, #Contenido, #CantidadPorPresentacion').on('input', function () {
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
        } if (input.is('#NombrePresentacion') || input.is('#Contenido')) {
            var spanErrorNombre = $('#NombrePresentacion').next('.text-danger'); // Obtén el elemento span correspondiente al campo NombrePresentacion
            var spanErrorContenido = $('#Contenido').next('.text-danger'); // Obtén el elemento span correspondiente al campo Contenido
            var valorNombre = $('#NombrePresentacion').val().trim(); // Obtén el valor del campo Nombre
            var valorContenido = $('#Contenido').val().trim(); // Obtén el valor del campo Contenido
            var spanVacioNombre = $('#NombrePresentacion').prev('.Mensaje');
            var spanVacioContenido = $('#Contenido').prev('.Mensaje');
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

            if (valorContenido === '') {
                spanErrorContenido.text(' ');
                spanVacioContenido.text(' *');
            } else if ($('#Contenido').val().trim().length < 3) {
                spanErrorContenido.text('Este campo debe tener un mínimo de 3 caracteres.');
                spanVacioContenido.text('');
            } else if (/^\d+$/.test(valorContenido)) {
                spanErrorContenido.text('Este campo no puede ser solo numerico');
                spanVacioContenido.text('');
            } else {
                spanError.text('');
                spanVacio.text('');
            }

            var nombreRepetido = presentaciones.some(function (presentacion) {
                return presentacion.nombrePresentacion.toLowerCase() === valorNombre.toLowerCase() &&
                    presentacion.contenido.toLowerCase() === valorContenido.toLowerCase() &&
                    presentacion.p != $('#PresentacionId').val().trim();
            });

            if (nombreRepetido) {
                spanErrorNombre.text('Se encontro una presentacion igual ya registrada.');
                spanErrorContenido.text('Se encontro una presentacion igual ya registrada.');
                spanVacio.text('');
            }
        }
        return todoValido; // Devuelve el estado de validación al finalizar la función
    }






    // Modificar la función buscarPresentaciones() para incluir campos ocultos en la búsqueda
    function buscarPresentaciones() {
        var searchTerm = $('#searchInput').val().toLowerCase();

        // Filtra las filas de la tabla basándose en el término de búsqueda
        $('tbody tr').each(function () {
            var filaVisible = false;

            // Itera sobre cada campo de la entidad Cliente en la fila
            $(this).find('.nombre-presentacion, .descripcion-presentacion, .presentacion-id, .contenido-empaque').each(function () {
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







function limpiarFormulario() {
    // Limpiar los valores de los campos del formulario
    $('#PresentacionIdId, #NombrePresentacion, #Contenido, #CantidadPorPresentacion,#DescripcionPorPresentacion,#EstadoPresentacion, #PresentacionIdIdAct, #NombrePresentacionAct, #ContenidoAct, #CantidadPorPresentacionAct,#DescripcionPorPresentacionAct,#EstadoPresentacionAct').val('');

    // Restaurar mensajes de error
    $('.Mensaje, .MensajeAct').text(' *');
    $('.Mensaje, .MensajeAct').show(); // Mostrar mensajes de error

    $('.text-danger, .text-dangerAct').text(''); // Limpiar mensajes de error

    $('#btnModalAgregarPresentacion').show();
    $('#FormActualizarPresentacion').hide();
}


$('.modal').on('click', function (e) {
    if (e.target === this) {
        limpiarFormulario(); // Limpia el formulario si se hace clic fuera de la modal
        $(this).modal('hide'); // Oculta la modal
    }
});
function obtenerPresentacionId(PresentacionId) {

    fetch(`https://localhost:7013/api/Presentaciones/GetPresentacionById?Id=${PresentacionId}`)
        .then(response => {

            if (!response.ok) {
                throw new Error('Error al obtner los datos');
            }

            return response.json();

        })
        .then(presentacion => {
            document.getElementById('PresentacionIdAct').value = presentacion.presentacionId;
            document.getElementById('NombrePresntacionAct').value = presentacion.nombrePresentacion;
            document.getElementById('ContenidoAct').value = presentacion.contenido;
            document.getElementById('CantidadPorPresentacionAct').value = presentacion.cantidadPorPresentacion;
            document.getElementById('DescripcionPresentacionAct').value = presentacion.descripcionPresentacion;
            document.getElementById('EstadoPresentacionAct').value = presentacion.estadoPresentacion;

            console.log(presentacion);
        })
        .catch(error => {
            console.error("Error al pintar los datos ", error)
        });
    

}

document.querySelectorAll('#btnEdit').forEach(button => {
    button.addEventListener('click', function () {
        const Id = this.getAttribute('data-presentacion-id');

        document.getElementById('btnModalAgregarPresentacion').style.display = 'none';
        document.getElementById('FormActualizarPresentacion').style.display = 'block';

        obtenerPresentacionId(Id);
    });
});




function actualizarEstadoPresentacion(PresentacionId, EstadoPresentacion) {
    fetch(`https://localhost:7013/api/Presentaciones/UpdateEstadoPresentacion/${PresentacionId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ EstadoPresentacion: EstadoPresentacion ? 1 : 0 })
    })
        .then(response => {
            if (response.ok) {
                console.log(EstadoPresentacion);
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
