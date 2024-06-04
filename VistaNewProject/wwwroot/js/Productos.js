var productos = [];
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
        })
        .catch(error => console.error('Error al obtener los productos:', error));
}

// Función para comparar productos durante la creación
function compararProductos(nuevoProducto, productosExistentes) {
    const nombreProductoNormalizado = normalizar(nuevoProducto.NombreProducto);
    let productosDuplicados = [];

    for (let i = 0; i < productosExistentes.length; i++) {
        const productoExistente = productosExistentes[i];
        const nombreProductoExistenteNormalizado = normalizar(productoExistente.nombreProducto);

        if (
            nombreProductoNormalizado === nombreProductoExistenteNormalizado &&
            productoExistente.presentacionId == nuevoProducto.PresentacionId &&
            productoExistente.categoriaId == nuevoProducto.CategoriaId
        ) {
            productosDuplicados.push(productoExistente.productoId);
        }
    }

    if (productosDuplicados.length > 0) {
        MostrarAlertaPersonalizada(`Ya existe un producto registrado con los mismos campos, Producto ID: ${productosDuplicados.join(', ')}`);
        return true; // Se encontraron coincidencias
    }

    return false; // No se encontraron coincidencias
}

// Función para comparar productos durante la actualización
function compararProductosAct(nuevoProducto, productosExistentes) {
    const nombreProductoNormalizado = normalizar(nuevoProducto.NombreProductoAct);
    let productosDuplicados = [];

    for (let i = 0; i < productosExistentes.length; i++) {
        const productoExistente = productosExistentes[i];
        const nombreProductoExistenteNormalizado = normalizar(productoExistente.nombreProducto);

        // Comprobamos si el producto existente coincide con el producto nuevo en todos los campos excepto en el ID
        if (
            nombreProductoNormalizado === nombreProductoExistenteNormalizado &&
            productoExistente.presentacionId == nuevoProducto.PresentacionIdAct &&
            productoExistente.categoriaId == nuevoProducto.CategoriaIdAct
        ) {
            if (productoExistente.productoId == nuevoProducto.ProductoIdAct) {
                // Si es el mismo producto que se está actualizando, no lo consideramos duplicado
                return false;
            } else {
                // Si es un producto diferente, lo añadimos a la lista de duplicados
                productosDuplicados.push(productoExistente.productoId);
            }
        }
    }

    if (productosDuplicados.length > 0) {
        MostrarAlertaPersonalizada(`Ya existe un producto registrado con los mismos campos, Producto ID: ${productosDuplicados.join(', ')}`);
        return true; // Se encontraron coincidencias
    }

    return false; // No se encontraron coincidencias
}

function mostrarValoresFormularioInicialProducto() {
    const idsCrear = [
        'CategoriaId',
        'NombreProducto',
        'PresentacionId',
        'MarcaId'
    ];
    const valoresCrear = obtenerValoresFormulario(idsCrear);
    return valoresCrear;
}

function mostrarValoresFormularioProductoAct() {
    const idsActualizar = [
        'CategoriaIdAct',
        'NombreProductoAct',
        'PresentacionIdAct',
        'MarcaIdAct',
        'ProductoIdAct',
        'CantidadAplicarPorMayorAct',
        'DescuentoAplicarPorMayorAct'
    ];
    const valoresActualizar = obtenerValoresFormulario(idsActualizar);
    return valoresActualizar;
}

//Funciones que se cargan al mismo tiempo que la pagina
document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const mostrarAlerta = urlParams.get('mostrarAlerta');
    const productoId = urlParams.get('productoId');
 
    if (mostrarAlerta === 'true' && productoId) {
        mostrarModalSinRetrasoProducto(productoId);
    }
  
    // Evita el envío de los formularios si no se cumplen los requerimientos mínimos
    $('.modal-formulario-crear-producto').on('submit', function (event) {
        const productoFinal = mostrarValoresFormularioInicialProducto();
        const productosAll = productos;
        const productoRepetido = compararProductos(productoFinal, productosAll);

        const campos = [
            { id: 'NombreCategoria', nombre: 'Categor\u00EDa' },
            { id: 'NombreProducto', nombre: 'Nombre Producto' },
            { id: 'NombreMarca', nombre: 'Marca' },
            { id: 'NombrePresentacion', nombre: 'Presentaci\u00F3n' },
            { id: 'CantidadAplicarPorMayor', nombre: 'Cantidad a superar' },
            { id: 'DescuentoAplicarPorMayor', nombre: 'Descuento por producto' }
        ];

        const camposVacios = verificarCampos(campos, mostrarAlertaCampoVacio);

        if (!NoCamposVacios()) {
            event.preventDefault();
            return;
        } 
        if (!NoCamposConErrores()) {
            event.preventDefault();
            mostrarAlertaCampoVacioPersonalizada('Algunos campos contienen errores');
            return;
        }
        if (productoRepetido !== false) {
            event.preventDefault();
            return;
        }
        if (camposVacios != true) {
            return;
        } 
        const datalist = [
            { id: 'CategoriaId', nombre: 'categor\u00EDa' },
            { id: 'MarcaId', nombre: 'marca' },
            { id: 'PresentacionId', nombre: 'presentación' }
        ];

        if (!verificarCampos(datalist, mostrarAlertaDataList)) {
            event.preventDefault();
            return;
        }
        
    });
    $('.modal-formulario-actualizar-producto').on('submit', function (event) {
        const productoFinal = mostrarValoresFormularioProductoAct();
        const productosAll = productos;
        const productoRepetido = compararProductosAct(productoFinal, productosAll);

        const campos = [
            { id: 'NombreCategoriaAct', nombre: 'Categor\u00EDa' },
            { id: 'NombreProductoAct', nombre: 'Nombre Producto' },
            { id: 'NombreMarcaAct', nombre: 'Marca' },
            { id: 'NombrePresentacionAct', nombre: 'Presentaci\u00F3n' },
            { id: 'CantidadAplicarPorMayorAct', nombre: 'Cantidad a superar' },
            { id: 'DescuentoAplicarPorMayorAct', nombre: 'Descuento por producto' }
        ];

        const camposVacios = verificarCampos(campos, mostrarAlertaCampoVacio);

        if (!NoCamposVaciosAct()) {
            event.preventDefault();
            return;
        }

        if (!NoCamposConErroresAct()) {
            event.preventDefault();
            mostrarAlertaCampoVacioPersonalizada('Algunos campos contienen errores');
            return;
        }

        if (productoRepetido) {
            event.preventDefault();
            return;
        }

        if (!camposVacios) {
            event.preventDefault();
            return;
        }

        const datalist = [
            { id: 'CategoriaIdAct', nombre: 'Categoría' },
            { id: 'MarcaIdAct', nombre: 'Marca' },
            { id: 'PresentacionIdAct', nombre: 'Presentación' }
        ];

        if (!verificarCampos(datalist, mostrarAlertaDataList)) {
            event.preventDefault();
            return;
        }
    });

    // Confirmación de eliminación
    $('.eliminarProducto').on('submit', function (event) {
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
    $('.modal-formulario-crear-producto input, .modal-formulario-crear-producto select').on('input', function () {
        NoCamposVaciosInicial();
        NoCamposConErroresInicial();
      
    });
    $('.modal-formulario-actualizar-producto input, .modal-formulario-actualizar-producto select').on('input', function () {
        NoCamposVaciosInicialAct();
        NoCamposConErroresInicialAct();
    });

    // Asignar función de selección a los campos
    $('#NombreMarca').on('input', function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            seleccionarOpcion(this, document.getElementById('marcas'), document.getElementById('MarcaId'));
        }, 590);
    });

    $('#NombreCategoria').on('input', function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            seleccionarOpcion(this, document.getElementById('categorias'), document.getElementById('CategoriaId'));
        }, 590);
    });

    $('#NombrePresentacion').on('input', function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            seleccionarOpcion(this, document.getElementById('presentaciones'), document.getElementById('PresentacionId'));
        }, 590);
    });

    $('#NombreMarcaAct').on('input', function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            seleccionarOpcion(this, document.getElementById('marcas'), document.getElementById('MarcaIdAct'));
        }, 590);
    });

    $('#NombreCategoriaAct').on('input', function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            seleccionarOpcion(this, document.getElementById('categorias'), document.getElementById('CategoriaIdAct'));
        }, 590);
    });

    $('#NombrePresentacionAct').on('input', function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            seleccionarOpcion(this, document.getElementById('presentaciones'), document.getElementById('PresentacionIdAct'));
        }, 590);
    });


    function NoCamposVacios() {
        const mensajeElements = $('.Mensaje');
        const mensajeSlice = mensajeElements.slice(0, 6);
        const camposConTexto = mensajeSlice.filter(function () {
            return $(this).text().trim() !== ''; // Utilizamos trim() para eliminar espacios en blanco al principio y al final del texto.
        }).length;

        console.log('Número de campos con texto:', camposConTexto);

        if (camposConTexto === 4 || camposConTexto === 6) { // Cambiamos la condición para verificar si hay campos sin texto.
            mostrarAlertaCampoVacioPersonalizada('Completa todos los campos');
            $('.MensajeInicial').text('Por favor, complete todos los campos obligatorios(*).');
            return false;
        }else if (camposConTexto !== 4 && camposConTexto !== 6 && camposConTexto !== 0) {
            $('.MensajeInicial').text('Por favor, complete todos los campos obligatorios(*).');
            return false;
        }

        return true;
    } 

    function NoCamposConErrores() {
        const textDangerElements = $('.text-danger');
        const textDangerSlice = textDangerElements.slice(0, 6);
        const todoValido = textDangerSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;
        console.log('Todos los campos son válidos:', todoValido);
        if (!todoValido) {
            $('.MensajeErrores').text('Algunos campos contienen errores.');
            return false;
        }
        return true;
    }

    function NoCamposVaciosAct() {
    
        const mensajeElements = $('.Mensaje');
    
        const mensajeSlice = mensajeElements.slice(-6);
     

        const camposConTexto = mensajeSlice.filter(function () {
            return $(this).text().trim() !== ''; // Utilizamos trim() para eliminar espacios en blanco al principio y al final del texto.
        }).length;
     
        console.log('Número de campos con texto:', camposConTexto);

        if (camposConTexto === 4 || camposConTexto === 6) { // Cambiamos la condición para verificar si hay campos sin texto.
            mostrarAlertaCampoVacioPersonalizada('Completa todos los campos');
            $('.MensajeInicial').text('Por favor, complete todos los campos obligatorios(*).');
            return false;
        } else if (camposConTexto !== 4 && camposConTexto !== 6 && camposConTexto !== 0) {
            $('.MensajeInicial').text('Por favor, complete todos los campos obligatorios(*).');
            return false;
        }
  
        return true;
    }
    function NoCamposConErroresAct() {
        const textDangerElements = $('.text-danger');
        const textDangerSlice = textDangerElements.slice(-6);
        const todoValido = textDangerSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;
        console.log('Todos los campos son válidos:', todoValido);
        if (todoValido) {
            return true;
        } else {
            $('.MensajeErrores').text('Algunos campos contienen errores.');
            return false;
        }     

    }

    function NoCamposVaciosInicial() {
        const mensajeElements = $('.Mensaje');
        
        const mensajeSlice = mensajeElements.slice(0, 6);
     

        const todosLlenos = mensajeSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;

        
        if (todosLlenos) {
            $('.MensajeInicial').text('');
        }

    }
    function NoCamposVaciosInicialAct() {

        const mensajeElements = $('.Mensaje');

        const mensajeSlice = mensajeElements.slice(-6);

        const todosLlenos = mensajeSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;

        if (todosLlenos) {
            $('.MensajeInicial').text('');
        }

    }
   


    function NoCamposConErroresInicial() {
        const textDangerElements = $('.text-danger');
        const textDangerSlice = textDangerElements.slice(0, 6);
        const todoValido = textDangerSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;

        if (todoValido) {
            $('.MensajeErrores').text('');
        }

    }
    function NoCamposConErroresInicialAct() {
       
        const textDangerElements = $('.text-danger');
        const textDangerSlice = textDangerElements.slice(-6);
        const todoValido = textDangerSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;
        if (todoValido) {
            $('.MensajeErrores').text('');
        }

    }

   
});



/*---------------------------------------------------- Al dar click en el boton de agregar usuario  ---------------------------------------------------- */
function simularClickProducto() {
    obtenerDatosUsuarios();
    //ocultar formulario de actualizar  y mostrar el formulario principal
    $('#FormActualizarProducto').hide();
    $('#FormPrincipalProducto').show().css('visibility', 'visible');
    Llamar();
}
/*--------------------Atajo para abrir modal -------------------------------*/
document.addEventListener('keydown', function (event) {
    if (event.ctrlKey && event.key === 'm') {
        try {
            if (esURLValida('Productos')) {
                const modalProducto = $('#ModalProducto');
                const botonAbrirModal = $('#botonabrirModalProducto');

                if (modalProducto.length === 0 || botonAbrirModal.length === 0) {
                    console.error('El modal o el botón para abrir el modal no se encontraron en el DOM.');
                    return;
                }
                if (modalProducto.hasClass('show')) {
                    modalProducto.modal('hide'); // Cerrar la modal
                } else {
                    botonAbrirModal.click();
                }
            }
        } catch (error) {
            console.error('Ocurrió un error al intentar abrir/cerrar la modal de producto:', error);
        }
    }
});


/*------------------------------ Limpiar formularios y url ---------------------------------------------------------------------------------------------------- */

//Se llama al daar click en la x
function limpiarFormularioProducto() {
    // Limpiar la URL eliminando los parámetros de consulta
    history.replaceState(null, '', location.pathname);
    limpiarFormularioProductoAgregar();
    limpiarFormularioProductoAct();
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
   
   

   
}
//Se llama al daar click en cancelar en la modal de agregar producto
function limpiarFormularioProductoAgregar() {
    // Limpiar la URL eliminando los parámetros de consulta
    history.replaceState(null, '', location.pathname);
    // Limpiar mensajes de alerta y *
    var mensajes = document.querySelectorAll('.Mensaje');
    var mensajesText = document.querySelectorAll('.text-danger');

    for (var i = 0; i < mensajes.length - 6; i++) {
        mensajes[i].textContent = '*';
    }
    for (var i = 0; i < mensajesText.length - 6; i++) {
        mensajesText[i].textContent = '';
    }

    document.querySelectorAll('.MensajeInicial').forEach(function (element) {
        element.textContent = '';
    });
    document.querySelectorAll('.MensaErrores').forEach(function (element) {
        element.textContent = '';
    });
    // Simular clic en el checkboxDescuentoPorMayor si está marcado
    var checkbox = document.getElementById('checkboxDescuentoPorMayor');
    if (checkbox.checked) {
        checkbox.click();
    }
}
//Se llama al perder el foco de la modal para limpiar el formulario actualizar
function limpiarFormularioProductoAct() {
    // Limpiar la URL eliminando los parámetros de consulta
    history.replaceState(null, '', location.pathname);
    document.querySelectorAll('.MensajeInicial').forEach(function (element) {
        element.textContent = '';
    });
    document.querySelectorAll('.MensaErrores').forEach(function (element) {
        element.textContent = '';
    });

    // Marcar el checkbox DescuentoPorMayorAct como no seleccionado
    document.getElementById('checkboxDescuentoPorMayorAct').checked = false;

    // Limpiar campos específicos
    $('#DescuentoAplicarPorMayorAct').val(0);
    $('#CantidadAplicarPorMayorAct').val(0);


    // Ocultar y ocultar elementos adicionales
    var elementos = document.getElementsByClassName('PorMayorAct');
    for (var i = 0; i < elementos.length; i++) {
        elementos[i].style.display = "none";
        elementos[i].style.visibility = "hidden";
    }

    // Limpiar mensajes de alerta y asteriscos
    var mensajes = document.querySelectorAll('.Mensaje');
    var mensajesText = document.querySelectorAll('.text-danger');

    for (var i = Math.max(0, mensajes.length - 8); i < mensajes.length; i++) {
        mensajes[i].textContent = '';
    }
    for (var i = Math.max(0, mensajesText.length - 8); i < mensajesText.length; i++) {
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

// Función a llamar al perder el foco del modal
function AlPerderFocoProducto() {
    // Obtener el estilo de #FormActualizar
    var displayFormActualizar = $('#FormActualizarProducto').css('display');
    var displayModal = $('#ModalProducto').css('display');
    if (displayFormActualizar == "block" && displayModal == "none") {
        limpiarFormularioProductoAct();
    }
}


/*--------------------------------------------------------- Modal de actualizar usuario ---------------------------------------*/
//Funcion que se activa al hacer clik en el boton de editar.
function mostrarModalConRetrasoProducto(productoId) {
    // Limpia el formulario del producto antes de cualquier otra acción
    limpiarFormularioProductoAct();

    actualizarProducto(productoId);
   
    setTimeout(function () {
        var myModal = new bootstrap.Modal(document.getElementById('ModalProducto'));
        myModal.show();
    }, 400); // 400 milisegundos (0.4 segundos) de retraso antes de abrir la modal
}
function mostrarModalSinRetrasoProducto(productoId) {
    
    // Retrasa la apertura del modal para asegurar que los campos hayan sido poblados correctamente 
    setTimeout(function () {
        // Limpia el formulario del producto antes de cualquier otra acción
        limpiarFormularioProductoAct();

        // Llama a la función de actualización del producto inmediatamente
        actualizarProducto(productoId);

        var myModal = new bootstrap.Modal(document.getElementById('ModalProducto'));
        myModal.show();
    }, 400); // 40 milisegundos de retraso antes de abrir la modal
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
            limpiarFormularioProductoAct()
            obtenerDatosProductos();
        },
        error: function () {
            alert('Error al obtener los datos del producto.');
        }
    });
    $('#FormPrincipalProducto').hide().css('visibility', 'hidden');
    $('#FormActualizarProducto').show().css('visibility', 'visible');
}

/*------------------- Cambiar estado producto------------------------------------------*/

//Funcion que cambia el estado del producto
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
            }).then(() => {
                // Recargar la página después de que la alerta se haya cerrado
                location.reload();
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

/*---------------------------------------------------------Buscador--------------------------------------------------------- */

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
    console.log('Here2');
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

/*---------------------- Llama a la funcion en site.js  ---------------------------*/


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

/*------------------------ Validaciones---------------*/

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


/*------------------------------------------- Funciones para dar funcionalidad a los checkbox   ---------------------------------------------------*/

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
        document.getElementById('CantidadAplicarPorMayor').value = '0';
        document.getElementById('DescuentoAplicarPorMayor').value = '0';
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
            document.getElementById('CantidadAplicarPorMayorAct').value = '0';
            document.getElementById('DescuentoAplicarPorMayorAct').value = '0';
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
                    cantidadElement.value = '';
                    descuentoElement.value = '';
                });
            } else {
                // Si el usuario cancela, volver a marcar el checkbox
                checkbox.checked = true;
            }
        });
    }
}

