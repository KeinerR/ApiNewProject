function checkInternetConnection() {
    return navigator.onLine;
}
var marcas = []; 

function obtenerDatosMarcas() {
    fetch('/Marcas/FindMarcas', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            marcas = data;
        })
        .catch(error => console.error('Error al obtener los marcas:', error));
}
function compararMarcas(nuevaMarca, marcasExistentes) {
    const nombreMarcaNormalizado = normalizar(nuevaMarca.NombreMarcaVista || '');
   
    const marcasDuplicadas = [];


    marcasExistentes.forEach(marcaExistente => {
        const nombreMarcaExistenteNormalizado = normalizar(marcaExistente.nombreMarca || '');
       
        if (
            nombreMarcaNormalizado === nombreMarcaExistenteNormalizado 
        ) {
            marcasDuplicadas.push(marcaExistente.marcaId);
        }
    });

    if (marcasDuplicadas.length > 0) {
        mostrarAlertaAtencionPersonalizadaConBoton(`Ya existe una marca registrada con el mismo nombre , Marca ID: ${marcasDuplicadas.join(', ')}`);
        return true; // Se encontraron coincidencias
    }
    
    return false; // No se encontraron coincidencias
}
function compararMarcasAct(nuevaMarca, marcasExistentes) {
    const nombreMarcaNormalizado = normalizar(nuevaMarca.NombreMarcaVistaAct || '');

    const marcasDuplicadas = [];


    marcasExistentes.forEach(marcaExistente => {
        const nombreMarcaExistenteNormalizado = normalizar(marcaExistente.nombreMarca || '');

        if (
            nombreMarcaNormalizado === nombreMarcaExistenteNormalizado 
        ) {
            if (marcaExistente.marcaId == nuevaMarca.MarcaIdAct) {
                return false; // No es un duplicado de alguna marca
            } else {
                marcasDuplicadas.push(marcaExistente.marcaId);
            }
        }
    });

    if (marcasDuplicadas.length > 0) {
        mostrarAlertaAtencionPersonalizadaConBoton(`Ya existe una marca registrada con el mismo nombre , Marca ID: ${marcasDuplicadas.join(', ')}`);
        return true; // Se encontraron coincidencias
    }

    return false; // No se encontraron coincidencias
}


function mostrarValoresFormularioInicialMarca() {
    const idsCrear = [
        'NombreMarcaVista'
    ];
    const valoresCrear = obtenerValoresFormulario(idsCrear);
    return valoresCrear;
}
function mostrarValoresFormularioMarcaAct() {
    const idsCrear = [
        'NombreMarcaVistaAct',
        'MarcaIdAct'
    ];
    const valoresCrear = obtenerValoresFormulario(idsCrear);
    return valoresCrear;
}

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const mostrarAlertaCampoVacio = urlParams.get('mostrarAlertaCampoVacio');
    const marcaId = urlParams.get('marcaId');

    if (mostrarAlertaCampoVacio === 'true' && marcaId) {
        mostrarModalActualizarMarca(marcaId);
    }
    //Evitar el envio de los formularios hasta que todo este validados
    $('.modal-formulario-crear-marca').on('submit', function (event) {
        obtenerDatosMarcas();
        const marcaFinal = mostrarValoresFormularioInicialMarca();
        const marcasAll = marcas;
        const marcaRepetida = compararMarcas(marcaFinal, marcasAll);
        const campos = [
            { id: 'NombreMarcaVista', nombre: 'Nombre marca' }
        ];

        const camposVacios = verificarCampos(campos, mostrarAlertaCampoVacio);
        if (!camposVacios) {
            event.preventDefault();
            return;
        }
        if (!NoCamposConErroresMarca()) {
            event.preventDefault();
            return;
        }

        if (marcaRepetida) {
            event.preventDefault();
            return;
        }

       
    });
    $('.modal-formulario-actualizar-marca').on('submit', function (event) {
        obtenerDatosMarcas();
        const marcaFinal = mostrarValoresFormularioMarcaAct();
        const marcasAll = marcas;
        const marcaRepetida = compararMarcasAct(marcaFinal, marcasAll);
        const campos = [
            { id: 'NombreMarcaVistaAct', nombre: 'Nombre marca'}
        ];
        const camposVacios = verificarCampos(campos, mostrarAlertaCampoVacio);
        if (!camposVacios) {
            event.preventDefault();
            return;
        }

        if (!NoCamposConErroresMarcaAct()) {
            event.preventDefault();
            return;
        }

        if (marcaRepetida) {
            event.preventDefault();
            return;
        }


    });
    // Confirmación de eliminación
    $('.eliminarMarca').on('submit', function (event) {
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
    $('.modal-formulario-crear-marca input').on('input', function () {
        NoCamposConErroresInicialMarca();
    });
    $('.modal-formulario-actualizar-marca input, .modal-formulario-actualizar-marca select').on('input', function () {
        NoCamposConErroresInicialMarcaAct();

    });
    
    function NoCamposConErroresMarca() {
        const textDangerElements = $('.text-danger');
        const textDangerSlice = textDangerElements.slice(0,1);
        const camposConTexto = textDangerSlice.filter(function () {
            return $(this).text().trim() !== ''; // Utilizamos trim() para eliminar espacios en blanco al principio y al final del texto.
        }).length;

        if (camposConTexto === 1) { // Cambiamos la condición para verificar si hay campos sin texto.
            mostrarAlertaAtencionPersonalizadaConBoton('Complete correctamente el campo');
            $('.MensajeErrores').text('El campo es invalido.');
            return false;
        }
        return true;
    }

    function NoCamposConErroresMarcaAct() {
        const textDangerElements = $('.text-danger');
        const textDangerSlice = textDangerElements.slice(-1);
        const camposConTexto = textDangerSlice.filter(function () {
            return $(this).text().trim() !== ''; // Utilizamos trim() para eliminar espacios en blanco al principio y al final del texto.
        }).length;

        if (camposConTexto === 1) { // Cambiamos la condición para verificar si hay campos sin texto.
            mostrarAlertaAtencionPersonalizadaConBoton('Complete correctamente el campo');
            $('.MensajeErrores').text('El campo es invalido.');
            return false;
        } 
        return true;
    }
    function NoCamposConErroresInicialMarca() {
        const textDangerElements = $('.text-danger');
        const textDangerSlice = textDangerElements.slice(0, 1);
        const todoValido = textDangerSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;
        if (todoValido) {
            $('.MensajeErrores').text('');
            
        }
        return true;
    }

    function NoCamposConErroresInicialMarcaAct() {
        const textDangerElements = $('.text-danger');
        const textDangerSlice = textDangerElements.slice(-1);
        const todoValido = textDangerSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;
        if (todoValido) {
            $('.MensajeErrores').text('');
        }
        return true;
    }

});

function simularClickMarca() {
    obtenerDatosMarcas();
}

/*--------------------Atajo para abrir modal -------------------------------*/
document.addEventListener('keydown', function (event) {
    if (event.ctrlKey && event.key === 'm') {
        try {
            if (esURLValida('Marcas')) {
                const modalMarca = $('#ModalMarca');
                const botonAbrirModal = $('#botonabrirModalMarca');

                if (modalMarca.length === 0 || botonAbrirModal.length === 0) {
                    console.error('El modal o el botón para abrir el modal no se encontraron en el DOM.');
                    return;
                }
                if (modalMarca.hasClass('show')) {
                    modalMarca.modal('hide'); // Cerrar la modal
                } else {
                    botonAbrirModal.click();
                }
            }
        } catch (error) {
            console.error('Ocurrió un error al intentar abrir/cerrar la modal de marca:', error);
        }
    }
});

function limpiarFormularioMarca() {
    limpiarFormularioMarcaAgregar();
    limpiarFormularioMarcaAct();
    history.replaceState(null, '', location.pathname);
    // Limpiar campos y elementos específicos
    limpiarCampo('NombreMarcaVista');

    // Limpiar campos y elementos específicos de la versión actualizada
    limpiarCampo('NombreMarcaVistaAct');


}
function limpiarFormularioMarcaAgregar() {
    // Limpiar la URL eliminando los parámetros de consulta
    history.replaceState(null, '', location.pathname);
    var mensajesText = document.querySelectorAll('.text-danger');
    var mensajes = document.querySelectorAll('.Mensaje');
    for (var i = 0; i < mensajesText.length - 1; i++) {
        mensajesText[i].textContent = '';
    }
    for (var i = 0; i < mensajes.length - 1; i++) {
        mensajes[i].textContent = '';
    }

}
function limpiarFormularioMarcaAct() {
    history.replaceState(null, '', location.pathname);

    // Limpiar mensajes de alerta y asteriscos
    var mensajes = document.querySelectorAll('.Mensaje');
    var mensajesText = document.querySelectorAll('.text-danger');

    for (var i = Math.max(0, mensajes.length - 1); i < mensajes.length; i++) {
        mensajes[i].textContent = '';
    }
    for (var i = Math.max(0, mensajesText.length - 1); i < mensajesText.length; i++) {
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

function AlPerderFocoMarca() {
    var displayModal = $('#ModalActualizarMarca').css('display');
    if (displayModal == "none") {
        limpiarFormularioMarcaAct();
    }
}




/*--------------------------------------------------------- Modal de actualizar usuario ---------------------------------------*/
function mostrarModalActualizarMarca(marcaId) {
    limpiarFormularioMarcaAct();
    actualizarMarca(marcaId);
    setTimeout(function () {
        var myModal = new bootstrap.Modal(document.getElementById('ModalActualizarMarca'));
        myModal.show();
        // Aquí puedes llamar a la función actualizarProducto si es necesario
    }, 50); // 500 milisegundos (0.5 segundos) de retraso antes de abrir la modal

}

function actualizarMarca(campo) {
    var marcaId = campo;
    $.ajax({
        url: '/Marcas/FindMarca', // Ruta relativa al controlador y la acción
        type: 'GET',
        data: { marcaId: marcaId },
        success: function (data) {
            var formActualizar = $('#FormActualizarMarca');
            formActualizar.find('#MarcaIdAct').val(data.marcaId);
            formActualizar.find('#NombreMarcaVistaAct').val(data.nombreMarca);
            formActualizar.find('#EstadoMarcaAct').val(data.estadoMarca);
            obtenerDatosMarcas();
        },
        error: function () {
            alert('Error al obtener los datos de la  marca.');
        }
    });
}
function actualizarEstadoMarca(MarcaId) {
        $.ajax({
            url: `/Marcas/UpdateEstadoMarca/${MarcaId}`,
            type: 'PATCH',
            contentType: 'application/json',
            success: function (response) {
                console.log("Estado actualizado:", EstadoMarca);
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
                console.error('Error al actualizar el estado del marca:', xhr.responseText);
                // Mostrar SweetAlert de error si es necesario
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un error al actualizar el estado del marca. Por favor, inténtalo de nuevo.'
                });
            }
        });
}



function searchMarca() {
    var input = $('#buscarMarca').val().trim().toLowerCase();    //Obtiene el valor del buscadpor
    var rows = document.querySelectorAll('.marcasPaginado');    //Obtiene el tr de Usuario Paginado.
    var rowsTodos = document.querySelectorAll('.Marcas');      //Obtiene el tr de Usuario que esta en none
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
            var marcaId = row.querySelector('td:nth-child(2)').textContent.trim().toLowerCase();
            var nombreC = row.querySelector('td:nth-child(3)').textContent.trim().toLowerCase();
            row.style.display = (input === "" || marcaId.includes(input) || nombreC.includes(input)) ? 'table-row' : 'none';
        }
    });
}

function vaciarInputMarca() {
    var paginationContainer = document.getElementById('paginationContainer');
    document.getElementById('buscarMarca').value = "";
    var icon = document.querySelector('#btnNavbarSearch i');
    icon.className = 'fas fa-search';
    icon.style.color = 'white';

    var contador = document.querySelector('.contador');
    contador.innerText = '#';
    var contadores = document.querySelectorAll('.contadorB');
    contadores.forEach(function (contador) {
        contador.classList.add('noIs'); // Removemos la clase 'noIs'
    });

    var rows = document.querySelectorAll('.marcasPaginado');
    rows.forEach(function (row) {
        row.style.display = 'table-row';
    });

    var rowsTodos = document.querySelectorAll('.Marcas');

    rowsTodos.forEach(function (row) {
        row.style.display = 'none';
    });
    paginationContainer.classList.remove('noBe'); // Oculta el contenedor de paginación

}


function validarCampoMarca(input) {
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
    if (inputElement.is('#NombreMarcaVista') || inputElement.is('#NombreMarcaVistaAct')) {
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







