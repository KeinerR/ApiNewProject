var unidades = [];

function obtenerDatosUnidades() {
    fetch('/Unidades/FindUnidades', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            unidades = data;
        })
        .catch(error => console.error('Error al obtener los unidades:', error));
}
function compararUnidades(nuevaUnidad, unidadesExistentes) {
    const nombreUnidadNormalizado = normalizar(nuevaUnidad.NombreUnidadVista || '');
    const cantidad = parseInt(nuevaUnidad.CantidadPorUnidad)
    const unidadesDuplicadas = [];


    unidadesExistentes.forEach(unidadExistente => {
        const nombreUnidadExistenteNormalizado = normalizar(unidadExistente.nombreUnidad || '');
        const cantidadExistente= unidadExistente.cantidadPorUnidad;

        if (
            nombreUnidadNormalizado === nombreUnidadExistenteNormalizado &&
            cantidad === cantidadExistente                       
        ) {
            unidadesDuplicadas.push(unidadExistente.unidadId);
        }
    });

    if (unidadesDuplicadas.length > 0) {
        mostrarAlertaAtencionPersonalizadaConBoton(`Ya existe una unidad registrada con el mismo nombre , Unidad ID: ${unidadesDuplicadas.join(', ')}`);
        return true; // Se encontraron coincidencias
    }

    return false; // No se encontraron coincidencias
}
function compararUnidadesAct(nuevaUnidad, unidadesExistentes) {
    const nombreUnidadNormalizado = normalizar(nuevaUnidad.NombreUnidadVistaAct || '');
    const cantidad = parseInt(nuevaUnidad.CantidadPorUnidadAct);
    const unidadesDuplicadas = [];


    unidadesExistentes.forEach(unidadExistente => {
        const nombreUnidadExistenteNormalizado = normalizar(unidadExistente.nombreUnidad || '');
        const cantidadExistente = unidadExistente.cantidadPorUnidad;

        if (
            nombreUnidadNormalizado === nombreUnidadExistenteNormalizado &&
            cantidad === cantidadExistente 
        ) {
            if (unidadExistente.unidadId == nuevaUnidad.UnidadIdAct) {
                return false; // No es un duplicado de alguna unidad
            } else {
                unidadesDuplicadas.push(unidadExistente.unidadId);
            }
        }
    });

    if (unidadesDuplicadas.length > 0) {
        mostrarAlertaAtencionPersonalizadaConBoton(`Ya existe una unidad registrada con el mismo nombre , Unidad ID: ${unidadesDuplicadas.join(', ')}`);
        return true; // Se encontraron coincidencias
    }

    return false; // No se encontraron coincidencias
}
function mostrarValoresFormularioInicialUnidad() {
    const idsCrear = [
        'NombreUnidadVista',
        'CantidadPorUnidad'
    ];
    const valoresCrear = obtenerValoresFormulario(idsCrear);
    return valoresCrear;
}
function mostrarValoresFormularioUnidadAct() {
    const idsCrear = [
        'NombreUnidadVistaAct',
        'UnidadIdAct',
        'CantidadPorUnidadAct'
    ];
    const valoresCrear = obtenerValoresFormulario(idsCrear);
    return valoresCrear;
}

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const mostrarAlertaCampoVacio = urlParams.get('mostrarAlertaCampoVacio');
    const unidadId = urlParams.get('unidadId');

    if (mostrarAlertaCampoVacio === 'true' && unidadId) {
        mostrarModalActualizarUnidad(unidadId);
    }
    //Evitar el envio de los formularios hasta que todo este validados
    $('.modal-formulario-crear-unidad').on('submit', function (event) {
        const unidadFinal = mostrarValoresFormularioInicialUnidad();
        const unidadesAll = unidades;
        const unidadRepetida = compararUnidades(unidadFinal, unidadesAll);
        const campos = [
            { id: 'NombreUnidadVista', nombre: 'Nombre Unidad' },
            { id: 'CantidadPorUnidad', nombre: 'Cantidad por Unidad' }

        ];

        const camposVacios = verificarCampos(campos, mostrarAlertaCampoVacio);

        if (!camposVacios) {
            event.preventDefault();
            return;
        }
        if (!NoCamposConErroresUnidad()) {
            event.preventDefault();
            return;
        }

        if (unidadRepetida) {
            event.preventDefault();
            return;
        }

    });
    $('.modal-formulario-actualizar-unidad').on('submit', function (event) {
        const unidadFinal = mostrarValoresFormularioUnidadAct();
        const unidadesAll = unidades;
        const unidadRepetida = compararUnidadesAct(unidadFinal, unidadesAll);
        const campos = [
            { id: 'NombreUnidadVistaAct', nombre: 'Unidad' },
            { id: 'CantidadPorUnidadAct', nombre: 'Cantidad por Unidad' }
        ];

        const camposVacios = verificarCampos(campos, mostrarAlertaCampoVacio);

        if (!camposVacios) {
            event.preventDefault();
            return;
        }

        if (!NoCamposConErroresUnidadAct()) {
            event.preventDefault();
            return;
        }

        if (unidadRepetida) {
            event.preventDefault();
            return;
        }

   

    });
    // Confirmación de eliminación
    $('.eliminarUnidad').on('submit', function (event) {
        event.preventDefault(); // Evita que el formulario se envíe automáticamente
        // Mostrar el diálogo de confirmación
        Swal.fire({
            title: '\u00BFEst\u00E1s seguro?',
            text: '\u00A1Esta acci\u00F3n no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'S\u00ED, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Si el usuario confirma, enviar el formulario
                event.target.submit();
            }
        });
    });
    // Validar campos en cada cambio para cambiar el mensaje inicial que aparece arriba de los botones del formulario
    $('.modal-formulario-crear-unidad input').on('input', function () {
        NoCamposConErroresInicialUnidad();
    });
    $('.modal-formulario-actualizar-unidad input, .modal-formulario-actualizar-unidad select').on('input', function () {
        NoCamposConErroresInicialUnidadAct();

    });
    function NoCamposConErroresUnidad() {
        const textDangerElements = $('.text-danger');
        const textDangerSlice = textDangerElements.slice(0, 3);
        const camposConTexto = textDangerSlice.filter(function () {
            return $(this).text().trim() !== ''; // Utilizamos trim() para eliminar espacios en blanco al principio y al final del texto.
        }).length;

        if (camposConTexto === 3) { // Cambiamos la condición para verificar si hay campos sin texto.
            mostrarAlertaAtencionPersonalizadaConBoton('Complete correctamente todos los campos');
            $('.MensajeErrores').text('Todos los campos son invalidos.');
            return false;
        }
        if (camposConTexto > 1 && camposConTexto < 3) {
            mostrarAlertaAtencionPersonalizadaConBoton('Complete correctamente los campos');
            $('.MensajeErrores').text('Hay campos invalidos.');
            return false;
        }
        if (camposConTexto === 1) {
            mostrarAlertaAtencionPersonalizadaConBoton('Complete correctamente el campo');
            $('.MensajeErrores').text('Un campo es invalido.');
            return false;
        }
        return true;
    }
    function NoCamposConErroresUnidadAct() {
        const textDangerElements = $('.text-danger');
        const textDangerSlice = textDangerElements.slice(-3);
        const camposConTexto = textDangerSlice.filter(function () {
            return $(this).text().trim() !== ''; // Utilizamos trim() para eliminar espacios en blanco al principio y al final del texto.
        }).length;

        if (camposConTexto === 3) { // Cambiamos la condición para verificar si hay campos sin texto.
            mostrarAlertaAtencionPersonalizadaConBoton('Complete correctamente todos los campos');
            $('.MensajeErrores').text('Todos los campos son invalidos.');
            return false;
        }
        if (camposConTexto > 1 && camposConTexto < 3) {
            mostrarAlertaAtencionPersonalizadaConBoton('Complete correctamente los campos');
            $('.MensajeErrores').text('Hay campos invalidos.');
            return false;
        }
        if (camposConTexto === 1) {
            mostrarAlertaAtencionPersonalizadaConBoton('Complete correctamente el campo');
            $('.MensajeErrores').text('Un campo es invalido.');
            return false;
        }
        return true;
    }
    function NoCamposConErroresInicialUnidad() {
        const textDangerElements = $('.text-danger');
        const textDangerSlice = textDangerElements.slice(0, 3);
        const todoValido = textDangerSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;
        if (todoValido) {
            $('.MensajeErrores').text('');

        }
        return true;
    }
    function NoCamposConErroresInicialUnidadAct() {
        const textDangerElements = $('.text-danger');
        const textDangerSlice = textDangerElements.slice(-3);
        const todoValido = textDangerSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;
        if (todoValido) {
            $('.MensajeErrores').text('');
        }
        return true;
    }

});

function simularClickUnidad() {
    obtenerDatosUnidades();
}

/*--------------------Atajo para abrir modal -------------------------------*/
document.addEventListener('keydown', function (event) {
    if (event.ctrlKey && event.key === 'm') {
        try {
            if (esURLValida('Unidades')) {
                const modalUnidad = $('#ModalUnidad');
                const botonAbrirModal = $('#botonabrirModalUnidad');

                if (modalUnidad.length === 0 || botonAbrirModal.length === 0) {
                    console.error('El modal o el botón para abrir el modal no se encontraron en el DOM.');
                    return;
                }
                if (modalUnidad.hasClass('show')) {
                    modalUnidad.modal('hide'); // Cerrar la modal
                } else {
                    botonAbrirModal.click();
                }
            }
        } catch (error) {
            console.error('Ocurrió un error al intentar abrir/cerrar la modal de unidad:', error);
        }
    }
});

function limpiarFormularioUnidad() {
    limpiarFormularioUnidadAgregar();
    limpiarFormularioUnidadAct();
    history.replaceState(null, '', location.pathname);
    // Limpiar campos y elementos específicos
    limpiarCampo('NombreUnidadVista');
    limpiarCampo('CantidadPorUnidad');
    limpiarCampo('DescripcionUnidad');


    // Limpiar campos y elementos específicos de la versión actualizada
    limpiarCampo('NombreUnidadVistaAct');
    limpiarCampo('CantidadPorUnidadAct');
    limpiarCampo('DescripcionUnidadAct');

}
function limpiarFormularioUnidadAgregar() {
    // Limpiar la URL eliminando los parámetros de consulta
    history.replaceState(null, '', location.pathname);
    // Limpiar mensajes de alerta y *

    var mensajesText = document.querySelectorAll('.text-danger');
    var mensajes = document.querySelectorAll('.Mensaje');
    for (var i = 0; i < mensajesText.length - 3; i++) {
        mensajesText[i].textContent = '';
    }

    for (var i = 0; i < mensajes.length - 2; i++) {
        mensajes[i].textContent = '*';
    }


}
function limpiarFormularioUnidadAct() {
    history.replaceState(null, '', location.pathname);
    var mensajes = document.querySelectorAll('.Mensaje');
    var mensajesText = document.querySelectorAll('.text-danger');

    for (var i = Math.max(0, mensajes.length - 2); i < mensajes.length; i++) {
        mensajes[i].textContent = '';
    }
    for (var i = Math.max(0, mensajesText.length - 3); i < mensajesText.length; i++) {
        mensajesText[i].textContent = '';
    }
}


//Función para limpiar la url si el usuario da fuera de ella 
$('.modal').on('click', function (e) {
    if (e.target === this) {
        // Limpiar la URL eliminando los parámetros de consulta
        history.replaceState(null, '', location.pathname);
        $(this).modal('hide'); // Oculta la modal
    }
});

function AlPerderFocoUnidad() {
    var displayModal = $('#ModalActualizarUnidad').css('display');
    if (displayModal == "none") {
        limpiarFormularioUnidadAct();
    }
}

/*--------------------------------------------------------- Modal de actualizar usuario ---------------------------------------*/
function mostrarModalActualizarUnidad(unidadId) {
    limpiarFormularioUnidadAct();
    actualizarUnidad(unidadId);
    setTimeout(function () {
        var myModal = new bootstrap.Modal(document.getElementById('ModalActualizarUnidad'));
        myModal.show();
        // Aquí puedes llamar a la función actualizarProducto si es necesario
    }, 50); // 500 milisegundos (0.5 segundos) de retraso antes de abrir la modal

}

function actualizarUnidad(campo) {
    var unidadId = campo;
    $.ajax({
        url: '/Unidades/FindUnidad', // Ruta relativa al controlador y la acción
        type: 'GET',
        data: { unidadId: unidadId },
        success: function (data) {
            var formActualizar = $('#FormActualizarUnidad');
            formActualizar.find('#UnidadIdAct').val(data.unidadId);
            formActualizar.find('#NombreUnidadVistaAct').val(data.nombreUnidad);
            formActualizar.find('#CantidadPorUnidadAct').val(data.cantidadPorUnidad);
            formActualizar.find('#DescripcionUnidadAct').val(data.descripcionUnidad);
            formActualizar.find('#EstadoUnidadAct').val(data.estadoUnidad);
            obtenerDatosUnidades();
        },
        error: function () {
            alert('Error al obtener los datos de la  unidad.');
        }
    });

}
function actualizarEstadoUnidad(UnidadId) {
    $.ajax({
        url: `/Unidades/UpdateEstadoUnidad/${UnidadId}`,
        type: 'PATCH',
        contentType: 'application/json',
        success: function (response) {
            // Mostrar SweetAlert
            Swal.fire({
                icon: 'success',
                title: '\u00A1Estado actualizado!',
                showConfirmButton: false,
                timer: 1500 // Duración del SweetAlert en milisegundos
            }).then(() => {
                location.reload(); // Recargar la página después de que la alerta haya terminado
            });
        },

        error: function (xhr, status, error) {
            console.error('Error al actualizar el estado del unidad:', xhr.responseText);
            // Mostrar SweetAlert de error si es necesario
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al actualizar el estado del unidad. Por favor, inténtalo de nuevo.'
            });
        }
    });
}


function searchUnidad() {
    var input = $('#buscarUnidad').val().trim().toLowerCase();    //Obtiene el valor del buscadpor
    var rows = document.querySelectorAll('.unidadesPaginado');    //Obtiene el tr de Usuario Paginado.
    var rowsTodos = document.querySelectorAll('.Unidades');      //Obtiene el tr de Usuario que esta en none
    var icon = document.querySelector('#btnNavbarSearch i');    //Obtiene el icino de buscar
    var contador = document.querySelector('.contador');        //Obtiene la columna que tiene el # 
    var contadores = document.querySelectorAll('.contadorB'); //Obtiene el contadorB que esta en none y lo hace visible para mostrar el consecutivo y el ID
    var paginationContainer = document.getElementById('paginationContainer');
    if (input === "") {
        rows.forEach(function (row) { //Esconde los usuarios paginado
            row.style.display = '';
        });
        contadores.forEach(function (contador) {
            contador.classList.add('noIs'); // Removemos la clase 'noIs' para mostrar la columna
        });
        icon.className = 'fas fa-search';
        icon.style.color = 'white';
        contador.innerText = '#';
        paginationContainer.classList.remove('noBe'); // Oculta el contenedor de paginación

    } else {
        rows.forEach(function (row) {
            row.style.display = 'none';
        });
        contadores.forEach(function (contador) {
            contador.classList.remove('noIs'); // Removemos la clase 'noIs'
        });
        icon.className = 'fas fa-times';
        icon.style.color = 'white';
        contador.innerText = 'ID';
        paginationContainer.classList.add('noBe'); // Oculta el contenedor de paginación

    }

    rowsTodos.forEach(function (row) {
        if (input === "") {
            row.style.display = 'none';
        } else {
            var unidadId = row.querySelector('td:nth-child(2)').textContent.trim().toLowerCase();
            var nombreC = row.querySelector('td:nth-child(3)').textContent.trim().toLowerCase();
            row.style.display = (input === "" || unidadId.includes(input) || nombreC.includes(input)) ? 'table-row' : 'none';
        }
    });
}

function vaciarInputUnidad() {
    var paginationContainer = document.getElementById('paginationContainer');
    
    document.getElementById('buscarUnidad').value = "";
    var icon = document.querySelector('#btnNavbarSearch i');
    icon.className = 'fas fa-search';
    icon.style.color = 'white';

    var contador = document.querySelector('.contador');
    contador.innerText = '#';
    var contadores = document.querySelectorAll('.contadorB');
    contadores.forEach(function (contador) {
        contador.classList.add('noIs'); // Removemos la clase 'noIs'
    });

    var rows = document.querySelectorAll('.unidadesPaginado');
    rows.forEach(function (row) {
        row.style.display = 'table-row';
    });

    var rowsTodos = document.querySelectorAll('.Unidades');

    rowsTodos.forEach(function (row) {
        row.style.display = 'none';
    });

    paginationContainer.classList.remove('noBe'); // Oculta el contenedor de paginación
}



function validarCampoUnidad(input) {
    const inputElement = $(input); // Convertir el input a objeto jQuery
    const campo = inputElement.attr('id'); // Obtener el id del input actual como nombre de campo
    const valor = inputElement.val().trim(); // Obtener el valor del campo y eliminar espacios en blanco al inicio y al final
    const spanError = inputElement.next('.text-danger'); // Obtener el elemento span de error asociado al input
    const labelForCampo = $('label[for="' + campo + '"]');
    const spanVacio = labelForCampo.find('.Mensaje');

    // Limpiar el mensaje de error previo
    spanError.text('');
    spanVacio.text('');

    // Validar el campo y mostrar mensaje de error si es necesario
    if (valor === '') {
        spanVacio.text('*');
        spanError.text('');
    }


    // Validación de usuario
    if (inputElement.is('#NombreUnidadVista') || inputElement.is('#NombreUnidadVistaAct')) {
        const nombreValido = /^[a-zA-Z]{3,}[a-zA-Z0-9_-]{0,16}$/.test(valor); // Verifica que el usuario cumpla con el formato especificado
        if (valor === '') {
            spanVacio.text('*');
        } else if (valor.length < 4 && valor.length > 1) {
            spanVacio.text('');
            spanError.text('El usuario debe contener entre 4 y 16 caracteres y empezar con letras. Ejemplo: juan123');
        } else if (!nombreValido) {
            spanVacio.text('');
            spanError.text('El usuario debe contener entre 4 y 16 caracteres alfanuméricos, guiones bajos (_) o guiones medios (-).');
        } else {
            spanError.text('');
            spanVacio.text('');
        }
    }
    return true; // Devuelve el estado de validación al finalizar la función
}







