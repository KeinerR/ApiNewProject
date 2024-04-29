

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
document.getElementById('buscarPresentacion').addEventListener('input', function () {
    var input = this.value.trim().toLowerCase();
    var rows = document.querySelectorAll('.presentacionesPaginado');

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
    var rowsTodos = document.querySelectorAll('.Presentacion');

    rowsTodos.forEach(function (row) {
        if (input === "") {
            row.style.display = 'none';
        } else {
            var presentacionId = row.querySelector('td:nth-child(1)').textContent.trim().toLowerCase();
            var nombreP = row.querySelector('td:nth-child(2)').textContent.trim().toLowerCase();
            var contenido = row.querySelector('td:nth-child(3)').textContent.trim().toLowerCase();
            var cantidadporP = row.querySelector('td:nth-child(4)').textContent.trim().toLowerCase();
            var descripcionP = row.querySelector('td:nth-child(6)').textContent.trim().toLowerCase();
           

            row.style.display = (presentacionId.includes(input) || nombreP.includes(input) || contenido.includes(input) || cantidadporP.includes(input) || descripcionP.includes(input)) ? 'table-row' : 'none';
        }
    });
});

function vaciarInput() {
    document.getElementById('buscarPresentacion').value = "";
    var icon = document.querySelector('#btnNavbarSearch i');
    icon.className = 'fas fa-search';
    icon.style.color = 'gray';

    var rows = document.querySelectorAll('.presentacionesPaginado');
    rows.forEach(function (row) {
        row.style.display = 'table-row';
    });

    var rowsTodos = document.querySelectorAll('.Presentacion');

    rowsTodos.forEach(function (row) {
        row.style.display = 'none';
    });
}







function limpiarFormulario() {
    // Limpiar los valores de los campos del formulario
    $('#PresentacionIdId, #NombrePresentacion, #Contenido, #CantidadPorPresentacion,#DescripcionPorPresentacion,#EstadoPresentacion, #PresentacionIdIdAct, #NombrePresentacionAct, #ContenidoAct, #CantidadPorPresentacionAct,#DescripcionPorPresentacionAct,#EstadoPresentacionAct').val('');

    // Restaurar mensajes de error
    $('.Mensaje, .MensajeAct').text(' *');
    $('.Mensaje, .MensajeAct').show(); // Mostrar mensajes de error

    $('.text-danger, .text-dangerAct').text(''); // Limpiar mensajes de error
}



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
