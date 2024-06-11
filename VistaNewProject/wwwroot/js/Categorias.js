function checkInternetConnection() {
    return navigator.onLine;
}
var categorias = []; 

function obtenerDatosCategorias() {
    fetch('/Categorias/FindCategorias', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            categorias = data;
        })
        .catch(error => console.error('Error al obtener los categorias:', error));
}
function compararCategorias(nuevaCategoria, categoriasExistentes) {
    const nombreCategoriaNormalizado = normalizar(nuevaCategoria.NombreCategoriaVista || '');
   
    const categoriasDuplicadas = [];


    categoriasExistentes.forEach(categoriaExistente => {
        const nombreCategoriaExistenteNormalizado = normalizar(categoriaExistente.nombreCategoria || '');
       
        if (
            nombreCategoriaNormalizado === nombreCategoriaExistenteNormalizado 
        ) {
            categoriasDuplicadas.push(categoriaExistente.categoriaId);
        }
    });

    if (categoriasDuplicadas.length > 0) {
        mostrarAlertaAtencionPersonalizadaConBoton(`Ya existe una categoria registrada con el mismo nombre , Categoria ID: ${categoriasDuplicadas.join(', ')}`);
        return true; // Se encontraron coincidencias
    }
    
    return false; // No se encontraron coincidencias
}
function compararCategoriasAct(nuevaCategoria, categoriasExistentes) {
    const nombreCategoriaNormalizado = normalizar(nuevaCategoria.NombreCategoriaVistaAct || '');

    const categoriasDuplicadas = [];


    categoriasExistentes.forEach(categoriaExistente => {
        const nombreCategoriaExistenteNormalizado = normalizar(categoriaExistente.nombreCategoria || '');

        if (
            nombreCategoriaNormalizado === nombreCategoriaExistenteNormalizado
        ) {
            if (categoriaExistente.categoriaId == nuevaCategoria.CategoriaIdAct) {
                return false; // No es un duplicado de alguna categoria
            } else {
                categoriasDuplicadas.push(categoriaExistente.categoriaId);
            }
        }
    });

    if (categoriasDuplicadas.length > 0) {
        mostrarAlertaAtencionPersonalizadaConBoton(`Ya existe una categoria registrada con el mismo nombre , Categoria ID: ${categoriasDuplicadas.join(', ')}`);
        return true; // Se encontraron coincidencias
    }

    return false; // No se encontraron coincidencias
}
function mostrarValoresFormularioInicialCategoria() {
    const idsCrear = [
        'NombreCategoriaVista'
    ];
    const valoresCrear = obtenerValoresFormulario(idsCrear);
    return valoresCrear;
}
function mostrarValoresFormularioCategoriaAct() {
    const idsCrear = [
        'NombreCategoriaVistaAct',
        'CategoriaIdAct'
    ];
    const valoresCrear = obtenerValoresFormulario(idsCrear);
    return valoresCrear;
}

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const mostrarAlertaCampoVacio = urlParams.get('mostrarAlertaCampoVacio');
    const categoriaId = urlParams.get('categoriaId');

    if (mostrarAlertaCampoVacio === 'true' && categoriaId) {
        mostrarModalSinRetrasoCategoria(categoriaId);
    }
    //Evitar el envio de los formularios hasta que todo este validados
    $('.modal-formulario-crear-categoria').on('submit', function (event) {
        const categoriaFinal = mostrarValoresFormularioInicialCategoria();
        const categoriasAll = categorias;
        const categoriaRepetida = compararCategorias(categoriaFinal, categoriasAll);
        const campos = [
            { id: 'NombreCategoriaVista', nombre: 'Nombre categoría' }
        ];

        const camposVacios = verificarCampos(campos, mostrarAlertaCampoVacio);
        if (!NoCamposVaciosCategoria()) {
            event.preventDefault();
            return;
        }

        if (!NoCamposConErroresCategoria()) {
            event.preventDefault();
            mostrarAlertaAtencionPersonalizadaConBoton('El campo no es valido');
            return;
        }

        if (categoriaRepetida) {
            event.preventDefault();
            return;
        }

        if (!camposVacios) {
            event.preventDefault();
            return;
        }
    });
    $('.modal-formulario-actualizar-categoria').on('submit', function (event) {
        const categoriaFinal = mostrarValoresFormularioCategoriaAct();
        const categoriasAll = categorias;
        const categoriaRepetida = compararCategoriasAct(categoriaFinal, categoriasAll);
        const campos = [
            { id: 'NombreCategoriaVistaAct', nombre: 'Nombre categoría'}
        ];
        const camposVacios = verificarCampos(campos, mostrarAlertaCampoVacio);
        if (!NoCamposVaciosCategoriaAct()) {
            event.preventDefault();
            return;
        }

        if (!NoCamposConErroresCategoriaAct()) {
            event.preventDefault();
            return;
        }

        if (categoriaRepetida) {
            event.preventDefault();
            return;
        }

        if (!camposVacios) {
            event.preventDefault();
            return;
        }

    });
    // Confirmación de eliminación
    $('.eliminarCategoria').on('submit', function (event) {
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
    $('.modal-formulario-crear-categoria input').on('input', function () {
        NoCamposVaciosInicialCategoria();
        NoCamposConErroresInicialCategoria();
    });
    $('.modal-formulario-actualizar-categoria input, .modal-formulario-actualizar-categoria select').on('input', function () {
        NoCamposVaciosInicialCategoriaAct();
        NoCamposConErroresInicialCategoriaAct();

    });
    
    //Este elimina el mensaje inicial u lo agrega de ser necesario el que aparece sobre los botones
    function NoCamposVaciosCategoria() {
        const mensajeElements = $('.Mensaje');
        const mensajeSlice = mensajeElements.slice(0,1);
        const camposConTexto = mensajeSlice.filter(function () {
            return $(this).text().trim() !== ''; // Utilizamos trim() para eliminar espacios en blanco al principio y al final del texto.
        }).length;

        console.log('Número de campos sin texto:', camposConTexto);

        if (camposConTexto === 1) { // Cambiamos la condición para verificar si hay campos sin texto.
            $('.MensajeInicial').text('Por favor, complete el campo con *.');
            return false;
        } 

        return true;
    }
    function NoCamposConErroresCategoria() {
        const textDangerElements = $('.text-danger');
        const textDangerSlice = textDangerElements.slice(0, 1);
        const camposConTexto = textDangerSlice.filter(function () {
            return $(this).text().trim() !== ''; // Utilizamos trim() para eliminar espacios en blanco al principio y al final del texto.
        }).length;

        console.log('Número de campos sin texto:', camposConTexto);

        if (camposConTexto === 1) { // Cambiamos la condición para verificar si hay campos sin texto.
            mostrarAlertaAtencionPersonalizadaConBoton('El campo contiene errores');
            $('.MensajeInicial').text('El campo contiene errores.');
            return false;
        }
        return true;
    }

    function NoCamposVaciosCategoriaAct() {
        const mensajeElements = $('.Mensaje');
        const mensajeSlice = mensajeElements.slice(-1);
        const camposConTexto = mensajeSlice.filter(function () {
            return $(this).text().trim() !== ''; // Utilizamos trim() para eliminar espacios en blanco al principio y al final del texto.
        }).length;

        console.log('Número de campos sin texto:', camposConTexto);

        if (camposConTexto === 1) { // Cambiamos la condición para verificar si hay campos sin texto.
            $('.MensajeInicial').text('Por favor, completa el campo con *.');
            return false;
        } 

        return true;
    }
    function NoCamposConErroresCategoriaAct() {
        const textDangerElements = $('.text-danger');
        const textDangerSlice = textDangerElements.slice(-1);
        const camposConTexto = textDangerSlice.filter(function () {
            return $(this).text().trim() !== ''; // Utilizamos trim() para eliminar espacios en blanco al principio y al final del texto.
        }).length;

        console.log('Número de campos sin texto:', camposConTexto);

        if (camposConTexto === 1) { // Cambiamos la condición para verificar si hay campos sin texto.
            mostrarAlertaAtencionPersonalizadaConBoton('El campo contiene errores');
            $('.MensajeInicial').text('El campo contiene errores.');
            return false;
        }
        return true;
    }
    function NoCamposVaciosInicialCategoria() {
        const mensajeElements = $('.Mensaje');

        const mensajeSlice = mensajeElements.slice(0, 1);


        const todosLlenos = mensajeSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;


        if (todosLlenos) {
            $('.MensajeInicial').text('');
        }

    }
    function NoCamposConErroresInicialCategoria() {
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

    function NoCamposVaciosInicialCategoriaAct() {
        const mensajeElements = $('.Mensaje');

        const mensajeSlice = mensajeElements.slice(-1);


        const todosLlenos = mensajeSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;


        if (todosLlenos) {
            $('.MensajeInicial').text('');
        }

    }
    function NoCamposConErroresInicialCategoriaAct() {
        const textDangerElements = $('.text-danger');
        const textDangerSlice = textDangerElements.slice(-1);
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



function simularClickCategoria() {
    //ocultar formulario de actualizar  y mostrar el formulario principal
    $('#FormActualizarCategoria').hide();
    $('#FormPrincipalCategoria').show().css('visibility', 'visible');
    obtenerDatosCategorias();
}

/*--------------------Atajo para abrir modal -------------------------------*/
document.addEventListener('keydown', function (event) {
    if (event.ctrlKey && event.key === 'm') {
        try {
            if (esURLValida('Categorias')) {
                const modalCategoria = $('#ModalCategoria');
                const botonAbrirModal = $('#botonabrirModalCategoria');

                if (modalCategoria.length === 0 || botonAbrirModal.length === 0) {
                    console.error('El modal o el botón para abrir el modal no se encontraron en el DOM.');
                    return;
                }
                if (modalCategoria.hasClass('show')) {
                    modalCategoria.modal('hide'); // Cerrar la modal
                } else {
                    botonAbrirModal.click();
                }
            }
        } catch (error) {
            console.error('Ocurrió un error al intentar abrir/cerrar la modal de categoria:', error);
        }
    }
});


function abrirModalCategoria() {
    // Verificar si la modal está abierta
    if ($('#ModalCategoria').hasClass('show')) {
        $('#ModalCategoria').modal('hide'); // Cerrar la modal
    } else {
        simularClickCategoria(); // Simular algún evento antes de abrir la modal
        $('#ModalCategoria').modal('show'); // Abrir la modal
    }
}

function limpiarFormularioCategoria() {
    limpiarFormularioCategoriaAgregar();
    limpiarFormularioCategoriaAct();
    history.replaceState(null, '', location.pathname);
    // Limpiar campos y elementos específicos
    limpiarCampo('NombreCategoriaVista');


    // Limpiar campos y elementos específicos de la versión actualizada
    limpiarCampo('NombreCategoriaVistaAct');


}
function limpiarFormularioCategoriaAgregar() {
    // Limpiar la URL eliminando los parámetros de consulta
    history.replaceState(null, '', location.pathname);
    // Limpiar mensajes de alerta y *
    var mensajes = document.querySelectorAll('.Mensaje');
    var mensajesText = document.querySelectorAll('.text-danger');

    for (var i = 0; i < mensajes.length - 1; i++) {
        mensajes[i].textContent = '*';
    }
    for (var i = 0; i < mensajesText.length - 1; i++) {
        mensajesText[i].textContent = '';
    }

    document.querySelectorAll('.MensajeInicial').forEach(function (element) {
        element.textContent = '';
    });
    document.querySelectorAll('.MensaErrores').forEach(function (element) {
        element.textContent = '';
    });
    
}
function limpiarFormularioCategoriaAct() {
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

function AlPerderFocoCategoria() {
    var displayFormActualizar = $('#FormActualizarCategoria').css('display');
    var displayModal = $('#ModalCategoria').css('display');
    if (displayFormActualizar == "block" && displayModal == "none") {
        limpiarFormularioCategoriaAct();
    }
}




/*--------------------------------------------------------- Modal de actualizar usuario ---------------------------------------*/
function mostrarModalConRetrasoCategoria(categoriaId) {
    limpiarFormularioCategoriaAct();
    actualizarCategoria(categoriaId);
    setTimeout(function () {
        var myModal = new bootstrap.Modal(document.getElementById('ModalCategoria'));
        myModal.show();
        // Aquí puedes llamar a la función actualizarProducto si es necesario
    }, 400); // 500 milisegundos (0.5 segundos) de retraso antes de abrir la modal

}
//Modal cuando se hace click en editar en el boton de detalle
function mostrarModalSinRetrasoCategoria(categoriaId) {
    obtenerDatosCategorias();
    actualizarCategoria(categoriaId);
    setTimeout(function () {
        var myModal = new bootstrap.Modal(document.getElementById('ModalCategoria'));
        limpiarFormularioCategoriaAct();
        myModal.show();
        // Aquí puedes llamar a la función actualizarProducto si es necesario
    }, 600); // 50 milisegundos (0.05 segundos) de retraso antes de abrir la modal
}


function actualizarCategoria(campo) {
    var categoriaId = campo;
    $.ajax({
        url: '/Categorias/FindCategoria', // Ruta relativa al controlador y la acción
        type: 'POST',
        data: { categoriaId: categoriaId },
        success: function (data) {
            var formActualizar = $('#FormActualizarCategoria');
            formActualizar.find('#CategoriaIdAct').val(data.categoriaId);
            formActualizar.find('#NombreCategoriaVistaAct').val(data.nombreCategoria);
            formActualizar.find('#EstadoCategoriaAct').val(data.estadoCategoria);
            limpiarFormularioCategoriaAct()
            obtenerDatosCategorias();
        },
        error: function () {
            alert('Error al obtener los datos de la  categoria.');
        }
    });
    $('#FormPrincipalCategoria').hide().css('visibility', 'hidden');
    $('#FormActualizarCategoria').show().css('visibility', 'visible');
}
function actualizarEstadoCategoria(CategoriaId) {
    $.ajax({
        url: `/Categorias/UpdateEstadoCategoria/${CategoriaId}`,
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
            console.error('Error al actualizar el estado del categoria:', xhr.responseText);
            // Mostrar SweetAlert de error si es necesario
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al actualizar el estado del categoria. Por favor, inténtalo de nuevo.'
            });
        }
    });
}


function searchCategoria() {
    var input = $('#buscarCategoria').val().trim().toLowerCase();    //Obtiene el valor del buscadpor
    var rows = document.querySelectorAll('.categoriasPaginado');    //Obtiene el tr de Usuario Paginado.
    var rowsTodos = document.querySelectorAll('.Categorias');      //Obtiene el tr de Usuario que esta en none
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
            var categoriaId = row.querySelector('td:nth-child(2)').textContent.trim().toLowerCase();
            var nombreC = row.querySelector('td:nth-child(3)').textContent.trim().toLowerCase();
            row.style.display = (input === "" || categoriaId.includes(input) || nombreC.includes(input)) ? 'table-row' : 'none';
        }
    });
}

function vaciarInputCategoria() {
    var paginationContainer = document.getElementById('paginationContainer');
    document.getElementById('buscarCategoria').value = "";
    var icon = document.querySelector('#btnNavbarSearch i');
    icon.className = 'fas fa-search';
    icon.style.color = 'white';

    var contador = document.querySelector('.contador');
    contador.innerText = '#';
    var contadores = document.querySelectorAll('.contadorB');
    contadores.forEach(function (contador) {
        contador.classList.add('noIs'); // Removemos la clase 'noIs'
    });

    var rows = document.querySelectorAll('.categoriasPaginado');
    rows.forEach(function (row) {
        row.style.display = 'table-row';
    });

    var rowsTodos = document.querySelectorAll('.Categorias');

    rowsTodos.forEach(function (row) {
        row.style.display = 'none';
    });
    paginationContainer.classList.remove('noBe'); // Oculta el contenedor de paginación

}



function validarCampoCategoria(input) {
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
    if (inputElement.is('#NombreCategoriaVista') || inputElement.is('#NombreCategoriaVistaAct')) {
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







