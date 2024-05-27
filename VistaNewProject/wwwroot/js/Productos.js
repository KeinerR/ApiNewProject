var productos = [];
// Obtener productos al cargar la página
function obtenerDatosProductos() {
    fetch('/Productos/FindProductos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            productos = data;
            console.log(productos);
        })
        .catch(error => console.error('Error al obtener los productos:', error));
}

//Funciones que se cargan first
document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const mostrarAlerta = urlParams.get('mostrarAlerta');
    const productoId = urlParams.get('productoId');

   
    let timeout = null;

    if (mostrarAlerta === 'true' && productoId) {
        obtenerDatosProducto(productoId);
        const botonModal = document.querySelector('[data-bs-target="#ModalProducto"]');
        if (botonModal) {
            botonModal.click();
        }
    }

    // Evita el envío del formulario si no se cumplen con los requerimientos mínimos
    $('.modal-formulario-crear-producto').on('submit', function (event) {
        if (!NoCamposVacios()) {
            event.preventDefault();
        } else {
            // Obtener los valores de los campos del formulario
            var categoriaId = $('#CategoriaId').val();
            var presentacionId = $('#PresentacionId').val();
            var marcaId = $('#MarcaId').val();

            if (categoriaId === '') {
                event.preventDefault();
                mostrarAlertaDataList('categoria');
            } else if (presentacionId === '') {
                event.preventDefault();
                mostrarAlertaDataList('presentación');
            } else if (marcaId === '') {
                event.preventDefault();
                mostrarAlertaDataList('marca');
            }
        }
    });
    $('.modal-formulario-actualizar').on('submit', function (event) {
        if (!NoCamposVaciosAct()) {
            event.preventDefault();
        } else {
            // Obtener los valores de los campos del formulario
            var categoriaId = $('#CategoriaIdAct').val();
            var presentacionId = $('#PresentacionIdAct').val();
            var marcaId = $('#MarcaIdAct').val();

            if (categoriaId === '') {
                event.preventDefault();
                mostrarAlertaDataList('categoria');
            } else if (presentacionId === '') {
                event.preventDefault();
                mostrarAlertaDataList('presentación');
            } else if (marcaId === '') {
                event.preventDefault();
                mostrarAlertaDataList('marca');
            }
        }
    });

    // Validar campos en cada cambio
    $('.modal-formulario-crear-producto input, .modal-formulario-crear-producto select').on('input', function () {
        NoCamposVaciosInicial();
    });
    $('.modal-formulario-actualizar input, .modal-formulario-actualizar select').on('input', function () {
        NoCamposVaciosInicialAct();
    });

    // Confirmación de eliminación
    $('.delete-form').on('submit', function (event) {
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

    function NoCamposVacios() {
        const todoValido = $('.text-danger').filter(function () {
            return $(this).text() !== '';
        }).length === 0;

        const todosLlenos = $('.Mensaje').filter(function () {
            return $(this).text() !== '';
        }).length === 0;

        console.log('Todos los campos son válidos:', todoValido);
        console.log('Todos los campos están llenos:', todosLlenos);

        if (!todosLlenos) {
            $('.MensajeInicial').text('Por favor, complete todos los campos obligatorios(*).');
            return false;
        }

        if (!todoValido) {
            $('.MensajeInicial').text('Algunos campos contienen errores.');
            return false;
        }

        $('.MensajeInicial').text('');
        return true;
    }
    function NoCamposVaciosAct() {
        const textDangerElements = $('.text-danger');
        const mensajeElements = $('.Mensaje');

        const textDangerSlice = textDangerElements.slice(6);
        const mensajeSlice = mensajeElements.slice(6);

        const todoValido = textDangerSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;

        const todosLlenos = mensajeSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;

        console.log('Todos los campos son válidos:', todoValido);
        console.log('Todos los campos están llenos:', todosLlenos);

        if (!todosLlenos) {
            $('.MensajeInicial').text('Por favor, complete todos los campos obligatorios(*).');
            return false;
        }

        if (!todoValido) {
            $('.MensajeInicial').text('Algunos campos contienen errores.');
            return false;
        }

        $('.MensajeInicial').text('');
        return true;
    }

    function NoCamposVaciosInicial()     {
        const textDangerElements = $('.text-danger');
        const mensajeElements = $('.Mensaje');

        const textDangerSlice = textDangerElements.slice(0, 6);
        const mensajeSlice = mensajeElements.slice(0, 6);

        const todoValido = textDangerSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;

        const todosLlenos = mensajeSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;

        if (todosLlenos) {
            $('.MensajeInicial').text('');
            if (todoValido) {
                $('.MensajeInicial').text('');
            }
        }

    }
    function NoCamposVaciosInicialAct() {
        const textDangerElements = $('.text-danger');
        const mensajeElements = $('.Mensaje');

        const textDangerSlice = textDangerElements.slice(6);
        const mensajeSlice = mensajeElements.slice(6);

        const todoValido = textDangerSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;

        const todosLlenos = mensajeSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;
        if (todosLlenos) {
            $('.MensajeInicial').text('');
            if (todoValido) {
                $('.MensajeInicial').text('');
            }
        }
        
        
    }
    
    // Asignar función de selección a los campos
    $('#NombreMarca').on('input', function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            seleccionarOpcion(this, document.getElementById('marcas'), document.getElementById('MarcaId'));
        }, 650);
    });

    $('#NombreCategoria').on('input', function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            seleccionarOpcion(this, document.getElementById('categorias'), document.getElementById('CategoriaId'));
        }, 650);
    });

    $('#NombrePresentacion').on('input', function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            seleccionarOpcion(this, document.getElementById('presentaciones'), document.getElementById('PresentacionId'));
        }, 600);
    });

    $('#NombreMarcaAct').on('input', function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            seleccionarOpcion(this, document.getElementById('marcas'), document.getElementById('MarcaIdAct'));
        }, 650);
    });

    $('#NombreCategoriaAct').on('input', function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            seleccionarOpcion(this, document.getElementById('categorias'), document.getElementById('CategoriaIdAct'));
        }, 650);
    });

    $('#NombrePresentacionAct').on('input', function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            seleccionarOpcion(this, document.getElementById('presentaciones'), document.getElementById('PresentacionIdAct'));
        }, 650);
    });

       
});

function simularClickProducto() {
    //ocultar formulario de actualizar  y mostrar el formulario principal
    $('#FormActualizarProducto').hide();
    $('#FormPrincipalProducto').show().css('visibility', 'visible');
}
//Funcion que se activa al haer clik en el boton de editar.
function mostrarModalConRetrasoProducto(productoId) {
    setTimeout(function () {
        actualizarProducto(productoId);
        setTimeout(function () {
            var myModal = new bootstrap.Modal(document.getElementById('ModalProducto'));
            myModal.show();
            // Aquí puedes llamar a la función actualizarProducto si es necesario
        }, 170); // 500 milisegundos (0.5 segundos) de retraso antes de abrir la modal
    }, 0); // 0 milisegundos de retraso antes de llamar a actualizarProducto
}

function actualizarProducto(campo) {
    var productoId = campo;
    $.ajax({
        url: '/Productos/FindProducto', // Ruta relativa al controlador y la acción
        type: 'POST',
        data: { productoId: productoId },
        success: function (data) {
            var formActualizar = $('#FormActualizarProducto');
            formActualizar.find('#ProductoIdAct').val(data.productoId);
            formActualizar.find('#EstadoAct').val(data.estado);
            formActualizar.find('#NombreMarcaAct').val(data.marcaId);
            formActualizar.find('#NombreProductoAct').val(data.nombreProducto);
            formActualizar.find('#NombrePresentacionAct').val(data.presentacionId);
            formActualizar.find('#NombreCategoriaAct').val(data.categoriaId);
            seleccionarOpcion(document.getElementById('NombreMarcaAct'), document.getElementById('marcas'), document.getElementById('MarcaIdAct'));
            seleccionarOpcion(document.getElementById('NombreCategoriaAct'), document.getElementById('categorias'), document.getElementById('CategoriaIdAct'));
            seleccionarOpcion(document.getElementById('NombrePresentacionAct'), document.getElementById('presentaciones'), document.getElementById('PresentacionIdAct'));
            if (data.cantidadAplicarPorMayor > 0) {
                $('#DescuentoAplicarPorMayorAct').val(data.descuentoAplicarPorMayor);
                $('#CantidadAplicarPorMayorAct').val(data.cantidadAplicarPorMayor);
                var button = document.getElementById("checkboxDescuentoPorMayorAct");
                button.click();   // Simular el clic en el botón
            } else {
                $('#checkboxDescuentoPorMayorAct').prop('checked', false); // Desmarcar el checkbox
            }
        },
        error: function () {
            alert('Error al obtener los datos del producto.');
        }
    });
    $('#FormPrincipalProducto').hide().css('visibility', 'hidden');
    $('#FormActualizarProducto').show().css('visibility', 'visible');
}

//Funcion que cambia el estado del checbox (Migrar a controlador Echo ;))
function actualizarEstadoProducto(ProductoId) {
    $.ajax({
        url: `/Productos/UpdateEstadoProducto/${ProductoId}`,
        type: 'PATCH',
        contentType: 'application/json',
        success: function (response) {
            // Mostrar SweetAlert de éxito
            Swal.fire({
                icon: 'success',
                title: '\u00A1Estado actualizado!',
                showConfirmButton: false,
                timer: 1500 // Duración del SweetAlert en milisegundos
            });
        },
        error: function (xhr, status, error) {
            console.error('Error al actualizar el estado del producto:', xhr.responseText);
            // Mostrar SweetAlert de error
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al actualizar el estado del producto. Por favor, inténtalo de nuevo.'
            });
        }
    });
}


//Funcion que le da la funcionalidad al buscador

function vaciarInputProducto() {
    document.getElementById('buscarProducto').value = "";
    var icon = document.querySelector('#btnNavbarSearch i');
    icon.className = 'fas fa-search';
    icon.style.color = 'white';

    var contador = document.querySelector('.contador');
    contador.innerText = '#';
    var contadores = document.querySelectorAll('.contadorB');
    contadores.forEach(function (contador) {
        contador.classList.add('noIs'); // Removemos la clase 'noIs'
    });

    var rows = document.querySelectorAll('.productosPaginado');
    rows.forEach(function (row) {
        row.style.display = 'table-row';
    });

    var rowsTodos = document.querySelectorAll('.Productos');

    rowsTodos.forEach(function (row) {
        row.style.display = 'none';
    });
}


function searchProducto() {
    var input = $('#buscarProducto').val().trim().toLowerCase();    //Obtiene el valor del buscadpor
    var rows = document.querySelectorAll('.productosPaginado');    //Obtiene el tr de Usuario Paginado.
    var rowsTodos = document.querySelectorAll('.Productos');      //Obtiene el tr de Usuario que esta en none
    var icon = document.querySelector('#btnNavbarSearch i');     //Obtiene el icino de buscar
    var contador = document.querySelector('.contador');         //Obtiene la columna que tiene el # 
    var contadores = document.querySelectorAll('.contadorB');  //Obtiene el contadorB que esta en none y lo hace visible para mostrar el consecutivo y el ID
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
            var productoId = row.querySelector('td:nth-child(2)').textContent.trim().toLowerCase();
            var nombreC = row.querySelector('td:nth-child(3)').textContent.trim().toLowerCase();
            var nombreM = row.querySelector('td:nth-child(4)').textContent.trim().toLowerCase();
            var nombreP = row.querySelector('td:nth-child(5)').textContent.trim().toLowerCase();
            var cantidadT = row.querySelector('td:nth-child(6)').textContent.trim().toLowerCase();

            row.style.display = (productoId.includes(input) || nombreM.includes(input) || nombreC.includes(input) || nombreP.includes(input) || cantidadT.includes(input)) ? 'table-row' : 'none';
        }
    });
    
}
//Funcion para hacer las respectivas validaciones a los campos
function validarCampoProducto(input) {
    console.log(input.id);
    const $input = $(input); // Convertir el input a objeto jQuery
    const valor = $input.val().trim(); // Obtener el valor del input y eliminar espacios en blanco
    const spanError = $input.next('.text-danger');
    const spanVacio = $input.prev('.Mensaje'); // Cambio aquí: uso prev() en lugar de siblings()
    const redundante = /^(?!.*(\w)\1\1\1)[\w\s]+$/;
    const soloNumeros = /^\d+$/;
    spanError.text('');
    spanVacio.text('');

    if (valor === '') {
        spanVacio.text('*');
        // Limpiar valores de campos relacionados si el campo principal está vacío
        if ($input.is('#NombreMarca') || $input.is('#NombreMarcaAct')) {
            document.getElementById('MarcaId').value = '';
            document.getElementById('MarcaIdAct').value = ''
        } else if ($input.is('#NombrePresentacion') || $input.is('#NombrePresentacionAct')) {
            document.getElementById('PresentacionId').value = '';
            document.getElementById('PresentacionIdAct').value = '';
        } else if ($input.is('#NombreCategoria') || $input.is('#NombreCategoriaAct')) {
            document.getElementById('CategoriaId').value = '';
            document.getElementById('CategoriaIdAct').value = '';
        }
    } else if ($input.is('#NombreProducto') || $input.is('#NombreProductoAct')) {
        if (valor.length < 3) {
            spanError.text('Este campo debe tener un mínimo de 3 caracteres.');
            spanVacio.text('');
        } else if (soloNumeros.test(valor)) {
            spanError.text('Este campo no puede ser solo numérico.');
            spanVacio.text('');
        } else if (!redundante.test(valor)) {
            spanError.text('Este nombre es redundante');
            spanVacio.text('');
        } else {
            spanError.text('');
            spanVacio.text('');
        }
    }

    return true; // Asumir que todo está bien si no hay errores
}

// Llama a la función general con los parámetros específicos
function showNoMarcasAlert() {
    showAlertIfNoOptions("marcas", "No hay marcas activas", "No hay marcas disponibles en este momento.");
}

function showNoPresentacionesAlert() {
    showAlertIfNoOptions("presentaciones", "No hay presentaciones activas", "No hay presentaciones disponibles en este momento.");
}

function showCategoriasAlert() {
    showAlertIfNoOptions("categorias", "No hay categorias ", "No hay categorias disponibles en este momento.");
}
/*Mostrar o no las opciones de producto por mayor en la ventana modal de producto al hacer click en el chacbox de la ventana modal producto*/
function Llamar() {
    var checkbox = document.getElementById('checkboxDescuentoPorMayor');

    if (checkbox.checked) {
        var mensajes = document.querySelectorAll('.Mensaje');
        // Iterar sobre los mensajes, omitiendo los primeros 3 y los últimos 3
        for (var i = 4; i < mensajes.length - 6; i++) {
            var mensaje = mensajes[i];
            mensaje.textContent = '*'; // Restaurar mensajes de error
        }
        const mensajesError = document.querySelectorAll('.text-danger');
        mensajesError.forEach(span => {
            span.innerText = ''; // Limpiar contenido del mensaje
        });
        // Obtener todos los elementos que tienen una clase específica
        var elementos = document.getElementsByClassName('PorMayor');
        // Iterar sobre la colección de elementos y aplicar estilos a cada uno
        for (var i = 0; i < elementos.length; i++) {
            elementos[i].style.display = "block";
            elementos[i].style.visibility = "visible";
        }
        document.getElementById('CantidadAplicarPorMayor').value = '';
        document.getElementById('DescuentoAplicarPorMayor').value = '';

        console.log("El checkbox está marcado");
    } else {
        var mensajes = document.querySelectorAll('.Mensaje');
        // Iterar sobre los mensajes, omitiendo los primeros 3 y los últimos 3
        for (var i = 4; i < mensajes.length - 6; i++) {
            var mensaje = mensajes[i];
            mensaje.textContent = ''; // Restaurar mensajes de error
        }
        var elementos = document.getElementsByClassName('PorMayor');

        // Iterar sobre la colección de elementos y aplicar estilos a cada uno
        for (var i = 0; i < elementos.length; i++) {
            elementos[i].style.display = "none";
            elementos[i].style.visibility = "hidden";
        }
        document.getElementById('CantidadAplicarPorMayor').value = '';
        document.getElementById('DescuentoAplicarPorMayor').value = '';

        console.log("El checkbox no está marcado");
    }
}

/*Mostrar o no las opciones de producto por mayor en la ventana modal de actualizar producto al hacer click en el checbox de la ventana modal producto*/

function Llamar2() {
    var checkbox = document.getElementById('checkboxDescuentoPorMayorAct');
    var cantidadElement = document.getElementById('CantidadAplicarPorMayorAct');
    var descuentoElement = document.getElementById('DescuentoAplicarPorMayorAct');
    var cantidad = cantidadElement.value.trim();
    var descuento = descuentoElement.value.trim();
    var mensajes = document.querySelectorAll('.Mensaje');

    if (checkbox.checked) {
        if (cantidad === '' || descuento === '') {
            // Mostrar mensajes de error si los campos están vacíos
            mensajes.forEach((mensaje, index) => {
                if (index >= 10 && index < mensajes.length) {
                    mensaje.textContent = '*';
                }
            });
        } else {
            // Limpiar los mensajes de error si los campos están llenos
            const mensajesError = document.querySelectorAll('.text-danger');
            mensajesError.forEach(span => {
                span.innerText = '';
            });
        }
        // Mostrar los elementos con la clase 'PorMayor'
        var elementos = document.getElementsByClassName('PorMayorAct');
        for (var i = 0; i < elementos.length; i++) {
            elementos[i].style.display = "block";
            elementos[i].style.visibility = "visible";
        }

        // Limpiar los campos de cantidad y descuento por mayor
    } else {
        Swal.fire({
            title: '¿Deseas quitar el precio y cantidad por mayor?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                // Esconder los elementos con la clase 'PorMayor'
                var elementos = document.getElementsByClassName('PorMayorAct');
                for (var i = 0; i < elementos.length; i++) {
                    elementos[i].style.display = "none";
                    elementos[i].style.visibility = "hidden";
                }
                // Restaurar los mensajes de error
                mensajes.forEach((mensaje, index) => {
                    if (index >= 10 && index < mensajes.length) {
                        mensaje.textContent = '';
                    }
                    // Establecer los campos de cantidad y descuento por mayor a vacío
                    cantidadElement.value = '0';
                    descuentoElement.value = '0';


                });
            } else {
                // Si el usuario cancela, volver a marcar el checkbox
                checkbox.checked = true;
            }
        });
    }
}


function limpiarFormularioProducto() {
    // Simular clic en el checkboxDescuentoPorMayor si está marcado
    var checkbox = document.getElementById('checkboxDescuentoPorMayor');
    if (checkbox.checked) {
        checkbox.click();
    }

    // Limpiar campos y elementos específicos
    limpiarCampo('NombreMarca');
    limpiarCampo('MarcaId');
    limpiarCampo('NombreCategoria');
    limpiarCampo('CategoriaId');
    limpiarCampo('NombrePresentacion');
    limpiarCampo('PresentacionId');
    limpiarCampo('NombreProducto');
    limpiarCampo('CantidadAplicarPorMayor');
    limpiarCampo('DescuentoAplicarPorMayor');

    // Limpiar campos y elementos específicos de la versión actualizada
    limpiarCampo('NombreMarcaAct');
    limpiarCampo('MarcaIdAct');
    limpiarCampo('NombreCategoriaAct');
    limpiarCampo('CategoriaIdAct');
    limpiarCampo('NombrePresentacionAct');
    limpiarCampo('PresentacionIdAct');
    limpiarCampo('NombreProductoAct');
    limpiarCampo('CantidadAplicarPorMayorAct');
    limpiarCampo('DescuentoAplicarPorMayorAct');
    document.querySelectorAll('.MensajeInicial').forEach(function (element) {
        element.textContent = '';
    });
    // Limpiar elementos adicionales
    var elementos = document.getElementsByClassName('PorMayorAct');
    for (var i = 0; i < elementos.length; i++) {
        elementos[i].style.display = "none";
        elementos[i].style.visibility = "hidden";
    }
  
    var mensajes = document.querySelectorAll('.Mensaje');
    var mensajesText = document.querySelectorAll('.text-danger');
   
    for (var i = Math.max(0, mensajes.length - 6); i < mensajes.length; i++) {
        mensajes[i].textContent = '';
    }
    for (var i = 0; i < mensajes.length -8; i++) {
        mensajes[i].textContent = '*';
    }
    for (var i = 0; i < mensajesText.length; i++) {
        mensajesText[i].textContent = '';
    }
    document.getElementById('checkboxDescuentoPorMayorAct').checked = false; // Desmarcar el checkbox
}

function limpiarFormularioProductoAct() {
    // Limpiar campos y elementos específicos de la versión actualizada
    limpiarCampo('NombreMarcaAct');
    limpiarCampo('MarcaIdAct');
    limpiarCampo('NombreCategoriaAct');
    limpiarCampo('CategoriaIdAct');
    limpiarCampo('NombrePresentacionAct');
    limpiarCampo('PresentacionIdAct');
    limpiarCampo('NombreProductoAct');
    limpiarCampo('CantidadAplicarPorMayorAct');
    limpiarCampo('DescuentoAplicarPorMayorAct');
    document.querySelectorAll('.MensajeInicial').forEach(function (element) {
        element.textContent = ''
    });

    // Función auxiliar para limpiar un campo por su ID
    function limpiarCampo(idCampo) {
        document.getElementById(idCampo).value = '';
    }

    // Limpiar elementos adicionales
    var elementos = document.getElementsByClassName('PorMayorAct');
    for (var i = 0; i < elementos.length; i++) {
        elementos[i].style.display = "none";
        elementos[i].style.visibility = "hidden";
    }

    var mensajes = document.querySelectorAll('.Mensaje');
    var mensajesText = document.querySelectorAll('.text-danger');


    // Añadir texto a los últimos seis mensajes
    for (var i = Math.max(0, mensajes.length - 6); i < mensajes.length; i++) {
        mensajes[i].textContent = '';
    }
    for (var i = 6; i < mensajesText.length; i++) {
        mensajesText[i].textContent = '';
    }
    document.getElementById('checkboxDescuentoPorMayorAct').checked = false; // Desmarcar el checkbox
}

// Función a llamar al perder el foco del modal
function AlPerderFocoProducto() {
    // Obtener el estilo de #FormActualizar
    var displayFormActualizar = $('#FormActualizarProducto').css('display');
    var displayModal = $('#ModalProducto').css('display');
    if (displayFormActualizar == "block" && displayModal == "none") {
        limpiarFormularioProductoAct();
    }
}