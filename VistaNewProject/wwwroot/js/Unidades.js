function checkInternetConnection() {
    return navigator.onLine;
}
var unidades = [];

function obtenerDatosUnidades() {
    fetch('/Unidades/FindUnidades', {
        method: 'POST',
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

    const unidadesDuplicadas = [];


    unidadesExistentes.forEach(unidadExistente => {
        const nombreUnidadExistenteNormalizado = normalizar(unidadExistente.nombreUnidad || '');

        if (
            nombreUnidadNormalizado === nombreUnidadExistenteNormalizado
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

    const unidadesDuplicadas = [];


    unidadesExistentes.forEach(unidadExistente => {
        const nombreUnidadExistenteNormalizado = normalizar(unidadExistente.nombreUnidad || '');

        if (
            nombreUnidadNormalizado === nombreUnidadExistenteNormalizado
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
        'NombreUnidadVista'
    ];
    const valoresCrear = obtenerValoresFormulario(idsCrear);
    return valoresCrear;
}
function mostrarValoresFormularioUnidadAct() {
    const idsCrear = [
        'NombreUnidadVistaAct',
        'UnidadIdAct'
    ];
    const valoresCrear = obtenerValoresFormulario(idsCrear);
    return valoresCrear;
}

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const mostrarAlerta = urlParams.get('mostrarAlerta');
    const unidadId = urlParams.get('unidadId');

    if (mostrarAlerta === 'true' && unidadId) {
        mostrarModalSinRetrasoUnidad(unidadId);
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
        if (!NoCamposVaciosUnidad()) {
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

        if (!camposVacios) {
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
        if (!NoCamposVaciosUnidadAct()) {
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

        if (!camposVacios) {
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
        NoCamposVaciosInicialUnidad();
        NoCamposConErroresInicialUnidad();
    });
    $('.modal-formulario-actualizar-unidad input, .modal-formulario-actualizar-unidad select').on('input', function () {
        NoCamposVaciosInicialUnidadAct();
        NoCamposConErroresInicialUnidadAct();

    });

    //Este elimina el mensaje inicial u lo agrega de ser necesario el que aparece sobre los botones
    function NoCamposVaciosUnidad() {
        const mensajeElements = $('.Mensaje');
        const mensajeSlice = mensajeElements.slice(0, 2);
        const camposConTexto = mensajeSlice.filter(function () {
            return $(this).text().trim() !== ''; // Utilizamos trim() para eliminar espacios en blanco al principio y al final del texto.
        }).length;

        console.log('Número de campos sin texto:', camposConTexto);
        if (camposConTexto === 2) { // Cambiamos la condición para verificar si hay campos sin texto.
            mostrarAlertaAtencionPersonalizadaConBoton('Completa todos los campos con *');
            $('.MensajeInicial').text('Por favor, complete los campos obligatorios(*).');
            return false;
        }
        if (camposConTexto === 1) { // Cambiamos la condición para verificar si hay campos sin texto.
            mostrarAlertaAtencionPersonalizadaConBoton('Completa el campo con *');
            $('.MensajeInicial').text('Por favor, complete el campo obligatorio(*).');
            return false;
        }
  
        return true;
    }
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
    function NoCamposVaciosUnidadAct() {
        const mensajeElements = $('.Mensaje');
        const mensajeSlice = mensajeElements.slice(-2);
        const camposConTexto = mensajeSlice.filter(function () {
            return $(this).text().trim() !== ''; // Utilizamos trim() para eliminar espacios en blanco al principio y al final del texto.
        }).length;

        console.log('Número de campos sin texto:', camposConTexto);
        if (camposConTexto === 2) { // Cambiamos la condición para verificar si hay campos sin texto.
            mostrarAlertaAtencionPersonalizadaConBoton('Completa todos los campos con *');
            $('.MensajeInicial').text('Por favor, complete los campos obligatorios(*).');
            return false;
        }
        if (camposConTexto === 1) { // Cambiamos la condición para verificar si hay campos sin texto.
            mostrarAlertaAtencionPersonalizadaConBoton('Completa el campo con *');
            $('.MensajeInicial').text('Por favor, complete el campo obligatorio(*).');
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

    function NoCamposVaciosInicialUnidad() {
        const mensajeElements = $('.Mensaje');

        const mensajeSlice = mensajeElements.slice(0, 2);


        const todosLlenos = mensajeSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;


        if (todosLlenos) {
            $('.MensajeInicial').text('');
        }

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

    function NoCamposVaciosInicialUnidadAct() {
        const mensajeElements = $('.Mensaje');

        const mensajeSlice = mensajeElements.slice(-2);


        const todosLlenos = mensajeSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;


        if (todosLlenos) {
            $('.MensajeInicial').text('');
        }

    }
    function NoCamposConErroresInicialUnidadAct() {
        const textDangerElements = $('.text-danger');
        const textDangerSlice = textDangerElements.slice(-3);
        const todoValido = textDangerSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;
        console.log('Todos los campos son válidos:', todoValido);
        if (todoValido) {
            $('.MensajeErrores').text('');
        }
        return true;
    }

});

function simularClickUnidad() {
    //ocultar formulario de actualizar  y mostrar el formulario principal
    $('#FormActualizarUnidad').hide();
    $('#FormPrincipalUnidad').show().css('visibility', 'visible');
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

function abrirModalUnidad() {
    // Verificar si la modal está abierta
    if ($('#ModalUnidad').hasClass('show')) {
        $('#ModalUnidad').modal('hide'); // Cerrar la modal
    } else {
        simularClickUnidad(); // Simular algún evento antes de abrir la modal
        $('#ModalUnidad').modal('show'); // Abrir la modal
    }
}

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
    var mensajes = document.querySelectorAll('.Mensaje');
    var mensajesText = document.querySelectorAll('.text-danger');

    for (var i = 0; i < mensajes.length - 2; i++) {
        mensajes[i].textContent = '*';
    }
    for (var i = 0; i < mensajesText.length - 3; i++) {
        mensajesText[i].textContent = '';
    }

    document.querySelectorAll('.MensajeInicial').forEach(function (element) {
        element.textContent = '';
    });
    document.querySelectorAll('.MensaErrores').forEach(function (element) {
        element.textContent = '';
    });

}
function limpiarFormularioUnidadAct() {
    history.replaceState(null, '', location.pathname);
    document.querySelectorAll('.MensajeInicial').forEach(function (element) {
        element.textContent = '';
    });
    document.querySelectorAll('.MensaErrores').forEach(function (element) {
        element.textContent = '';
    });

    // Limpiar mensajes de alerta y asteriscos
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
    var displayFormActualizar = $('#FormActualizarUnidad').css('display');
    var displayModal = $('#ModalUnidad').css('display');
    if (displayFormActualizar == "block" && displayModal == "none") {
        limpiarFormularioUnidadAct();
    }
}




/*--------------------------------------------------------- Modal de actualizar usuario ---------------------------------------*/
function mostrarModalConRetrasoUnidad(unidadId) {
    limpiarFormularioUnidadAct();
    actualizarUnidad(unidadId);
    setTimeout(function () {
        var myModal = new bootstrap.Modal(document.getElementById('ModalUnidad'));
        myModal.show();
        // Aquí puedes llamar a la función actualizarProducto si es necesario
    }, 400); // 500 milisegundos (0.5 segundos) de retraso antes de abrir la modal

}
//Modal cuando se hace click en editar en el boton de detalle
function mostrarModalSinRetrasoUnidad(unidadId) {
    obtenerDatosUnidades();
    actualizarUnidad(unidadId);
    setTimeout(function () {
        var myModal = new bootstrap.Modal(document.getElementById('ModalUnidad'));
        limpiarFormularioUnidadAct();
        myModal.show();
        // Aquí puedes llamar a la función actualizarProducto si es necesario
    }, 600); // 50 milisegundos (0.05 segundos) de retraso antes de abrir la modal
}


function actualizarUnidad(campo) {
    var unidadId = campo;
    $.ajax({
        url: '/Unidades/FindUnidad', // Ruta relativa al controlador y la acción
        type: 'POST',
        data: { unidadId: unidadId },
        success: function (data) {
            var formActualizar = $('#FormActualizarUnidad');
            formActualizar.find('#UnidadIdAct').val(data.unidadId);
            formActualizar.find('#NombreUnidadVistaAct').val(data.nombreUnidad);
            formActualizar.find('#CantidadPorUnidadAct').val(data.cantidadPorUnidad);
            formActualizar.find('#DescripcionUnidadAct').val(data.nombreUnidad);
            formActualizar.find('#EstadoUnidadAct').val(data.estadoUnidad);
            limpiarFormularioUnidadAct()
            obtenerDatosUnidades();
        },
        error: function () {
            alert('Error al obtener los datos de la  unidad.');
        }
    });
    $('#FormPrincipalUnidad').hide().css('visibility', 'hidden');
    $('#FormActualizarUnidad').show().css('visibility', 'visible');
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
                title: '¡Estado actualizado!',
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







