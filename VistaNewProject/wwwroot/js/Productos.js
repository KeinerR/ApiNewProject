var productos = [];
var llamadasFuncion = 0;
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
            productoExistente.categoriaId == nuevoProducto.CategoriaId &&
            productoExistente.marcaId == nuevoProducto.MarcaId
        ) {
            productosDuplicados.push(productoExistente.productoId);
        }
    }

    if (productosDuplicados.length > 0) {
        mostrarAlertaAtencionPersonalizadaConBoton(`Ya existe un producto registrado con los mismos campos, Producto ID: ${productosDuplicados.join(', ')}`);
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
            productoExistente.categoriaId == nuevoProducto.CategoriaIdAct &&
            productoExistente.marcaId == nuevoProducto.MarcaIdAct
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
        mostrarAlertaAtencionPersonalizadaConBoton(`Ya existe un producto registrado con los mismos campos, Producto ID: ${productosDuplicados.join(', ')}`);
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
        'ProductoIdAct'
    ];
    const valoresActualizar = obtenerValoresFormulario(idsActualizar);
    return valoresActualizar;
}

//Funciones que se cargan al mismo tiempo que la pagina
document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const mostrarAlertaCampoVacio = urlParams.get('mostrarAlertaCampoVacio');
    const productoId = urlParams.get('productoId');

    if (mostrarAlertaCampoVacio === 'true' && productoId) {
        actualizarProducto(productoId);
    }

    // Evita el envío de los formularios si no se cumplen los requerimientos mínimos
    $('.modal-formulario-crear-producto').on('submit', function (event) {
        let datalist = [];
        let campos = [];
        const productoFinal = mostrarValoresFormularioInicialProducto();
        const productosAll = productos;
        const productoRepetido = compararProductos(productoFinal, productosAll);
        campos = [
            { id: 'NombreCategoria', nombre: 'Categor\u00EDa' },
            { id: 'NombreProducto', nombre: 'Nombre Producto' },
            { id: 'NombreMarca', nombre: 'Marca' },
            { id: 'NombrePresentacion', nombre: 'Presentaci\u00F3n' },
            { id: 'CantidadAplicarPorMayor', nombre: 'Cantidad a superar' },
            { id: 'DescuentoAplicarPorMayor', nombre: 'Descuento por producto' }
        ];

        if (!NoCamposVaciosProducto()) {
            event.preventDefault();
            return;

        }
        if (!verificarCampos(campos, mostrarAlertaCampoVacio)) {
            event.preventDefault();
            return;
        }

        if (!NoCamposConErroresProducto()) {
            mostrarAlertaCampoVacioPersonalizada('Algunos campos contienen errores');
            event.preventDefault();
            return;
        }
        if (productoRepetido !== false) {
            event.preventDefault();
            return;
        } else {
            datalist = [
                { id: 'CategoriaId', nombre: 'categor\u00EAa' },
                { id: 'MarcaId', nombre: 'marca' },
                { id: 'PresentacionId', nombre: 'presentaci\u00F3n' }
            ];

            if (!verificarCamposDataList(datalist, mostrarAlertaDataList)) {
                event.preventDefault();
                return;
            }
        }
    });

    // Event handler para el formulario de actualización
    $('.modal-formulario-actualizar-producto').on('submit', function (event) {
        let datalist = [];
        let campos = [];
        const productoFinal = mostrarValoresFormularioProductoAct();
        const productosAll = productos;
        const productoRepetido = compararProductosAct(productoFinal, productosAll);

        campos = [
            { id: 'NombreCategoriaAct', nombre: 'Categor\u00EDa' },
            { id: 'NombreProductoAct', nombre: 'Nombre Producto' },
            { id: 'NombreMarcaAct', nombre: 'Marca' },
            { id: 'NombrePresentacionAct', nombre: 'Presentaci\u00F3n' },
            { id: 'CantidadAplicarPorMayorAct', nombre: 'Cantidad a superar' },
            { id: 'DescuentoAplicarPorMayorAct', nombre: 'Descuento por producto' }
        ];
        if (!NoCamposVaciosProductoAct()) {
            event.preventDefault();
            return;
            if (!verificarCampos(campos, mostrarAlertaCampoVacio)) {
                return;
            }
        } else if (!NoCamposConErroresProductoAct()) {
            event.preventDefault();
            return;
            return;
        } else if (productoRepetido !== false) {
            event.preventDefault();
            return;
        } else {
            datalist = [
                { id: 'CategoriaIdAct', nombre: 'categor\u00EAa' },
                { id: 'MarcaIdAct', nombre: 'marca' },
                { id: 'PresentacionIdAct', nombre: 'presentaci\u00EAn' }
            ];

            if (!verificarCampos(datalist, mostrarAlertaDataList)) {
                event.preventDefault();
                return;
            }
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
        NoCamposVaciosProductoInicial();
        NoCamposConErroresProductoInicial();

    });

    $('.modal-formulario-actualizar-producto input, .modal-formulario-actualizar-producto select').on('input', function () {
        NoCamposVaciosProductoInicialAct();
        NoCamposConErroresProductoInicialAct();
    });

    // Asignar función de selección a los campos
    $('#NombreMarca').on('input', function () {
        if (this.value.length > 5) {
            clearTimeout(timeout);
            seleccionarOpcion(this, document.getElementById('marcas'), document.getElementById('MarcaId'));
        } else {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                seleccionarOpcion(this, document.getElementById('marcas'), document.getElementById('MarcaId'));
            }, 590);
        }
    });

    $('#NombreCategoria').on('input', function () {
        if (this.value.length > 5) {
            clearTimeout(timeout);
            seleccionarOpcion(this, document.getElementById('categorias'), document.getElementById('CategoriaId'));
            checkboxFiltrar();
        } else {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                seleccionarOpcion(this, document.getElementById('categorias'), document.getElementById('CategoriaId'));
                checkboxFiltrar();
            }, 590);


        }
    });

    $('#NombrePresentacion').on('input', function () {
        if (this.value.length > 5) {
            clearTimeout(timeout);
            seleccionarOpcion(this, document.getElementById('presentaciones'), document.getElementById('PresentacionId'));
        } else {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                seleccionarOpcion(this, document.getElementById('presentaciones'), document.getElementById('PresentacionId'));
            }, 590);
        }
    });

    $('#NombreMarcaAct').on('input', function () {
        if (this.value.length > 5) {
            clearTimeout(timeout);
            seleccionarOpcion(this, document.getElementById('marcas'), document.getElementById('MarcaIdAct'));
        } else {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                seleccionarOpcion(this, document.getElementById('marcas'), document.getElementById('MarcaIdAct'));
            }, 590);
        }
    });

    $('#NombreCategoriaAct').on('input', function () {

        if (this.value.length > 5) {
            clearTimeout(timeout);
            seleccionarOpcion(this, document.getElementById('categorias'), document.getElementById('CategoriaIdAct'));
        } else {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                seleccionarOpcion(this, document.getElementById('categorias'), document.getElementById('CategoriaIdAct'));
            }, 590);
        }
    });

    $('#NombrePresentacionAct').on('input', function () {
        if (this.value.length > 5) {
            clearTimeout(timeout);
            seleccionarOpcion(this, document.getElementById('presentaciones'), document.getElementById('PresentacionIdAct'));
        } else {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                seleccionarOpcion(this, document.getElementById('presentaciones'), document.getElementById('PresentacionIdAct'));
            }, 590);
        }
    });

    function NoCamposVaciosProducto() {
        const mensajeElements = $('.Mensaje');
        const mensajeSlice = mensajeElements.slice(0, 6);
        const camposConTexto = mensajeSlice.filter(function () {
            return $(this).text().trim() !== ''; // Utilizamos trim() para eliminar espacios en blanco al principio y al final del texto.
        }).length;

        if (camposConTexto == 4) { // Cambiamos la condición para verificar si hay campos sin texto.
            $('.MensajeInicial').text('Por favor, complete todos los campos con *.');
            mostrarAlertaAtencionPersonalizadaConBoton('Completa todos los campos con *');
            return false;
        }
        if (camposConTexto > 1 && camposConTexto < 4) { // Cambiamos la condición para verificar si hay campos sin texto.
            $('.MensajeInicial').text('Por favor, complete los campos con *.');
            mostrarAlertaAtencionPersonalizadaConBoton('Completa los campos con *');
            return false;
        }
        return true;
    }

    function NoCamposConErroresProducto() {
        const textDangerElements = $('.text-danger');
        const textDangerSlice = textDangerElements.slice(0, 3);
        const camposConTexto = textDangerSlice.filter(function () {
            return $(this).text().trim() !== ''; // Utilizamos trim() para eliminar espacios en blanco al principio y al final del texto.
        }).length;

        if (camposConTexto == 4) { // Cambiamos la condición para verificar si hay campos sin texto.
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
    function NoCamposVaciosProductoAct() {
        const mensajeElements = $('.Mensaje');
        const mensajeSlice = mensajeElements.slice(-6);
        const camposConTexto = mensajeSlice.filter(function () {
            return $(this).text().trim() !== ''; // Utilizamos trim() para eliminar espacios en blanco al principio y al final del texto.
        }).length;


        if (camposConTexto === 6) { // Cambiamos la condición para verificar si hay campos sin texto.
            mostrarAlertaAtencionPersonalizadaConBoton('Completa todos los campos con *');
            $('.MensajeInicial').text('Por favor, complete los campos con *.');
            return false;
        }
        if (camposConTexto > 1 && camposConTexto < 6) { // Cambiamos la condición para verificar si hay campos sin texto.
            mostrarAlertaAtencionPersonalizadaConBoton('Completa los campos con *');
            $('.MensajeInicial').text('Por favor, complete los campos con *.');
            return false;
        }
        if (camposConTexto === 1) { // Cambiamos la condición para verificar si hay campos sin texto.
            mostrarAlertaAtencionPersonalizadaConBoton('Completa los campos con *');
            $('.MensajeInicial').text('Por favor, complete el campo con *.');
            return false;
        }

        return true;
    }

    function NoCamposConErroresProductoAct() {
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

    function NoCamposVaciosProductoInicial() {
        const mensajeElements = $('.Mensaje');

        const mensajeSlice = mensajeElements.slice(0, 6);


        const todosLlenos = mensajeSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;


        if (todosLlenos) {
            $('.MensajeInicial').text('');
        }

    }
    function NoCamposVaciosProductoInicialAct() {

        const mensajeElements = $('.Mensaje');

        const mensajeSlice = mensajeElements.slice(-6);

        const todosLlenos = mensajeSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;

        if (todosLlenos) {
            $('.MensajeInicial').text('');
        }

    }

    function NoCamposConErroresProductoInicial() {
        const textDangerElements = $('.text-danger');
        const textDangerSlice = textDangerElements.slice(0, 3);
        const todoValido = textDangerSlice.filter(function () {
            return $(this).text() !== '';
        }).length === 0;

        if (todoValido) {
            $('.MensajeErrores').text('');
        }

    }
    function NoCamposConErroresProductoInicialAct() {

        const textDangerElements = $('.text-danger');
        const textDangerSlice = textDangerElements.slice(-3);
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
    obtenerDatosProductos();
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
    limpiarDatosFormularioProductoAgregar();
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

}
function limpiarFormularioProductoAct() {
    limpiarDatosFormularioProductoAct();
    // Limpiar la URL eliminando los parámetros de consulta
    history.replaceState(null, '', location.pathname);

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
function limpiarDatosFormularioProductoAgregar() {
    removerIconoparalimpiarElCampo(['NombreMarca', 'NombrePresentacion', 'NombreMarca']);
    limpiarFiltroProductoAgregar();
    history.replaceState(null, '', location.pathname);
    var mensajes = document.querySelectorAll('.Mensaje');
    var mensajesText = document.querySelectorAll('.text-danger');
    for (var i = 0; i < mensajes.length - 8; i++) {
        mensajes[i].textContent = '*';
    }
    for (var i = 0; i < mensajesText.length - 3; i++) {
        mensajesText[i].textContent = '';
    }
    document.querySelectorAll('.MensajeInicial').forEach(function (element) {
        element.textContent = '';
    });
    document.querySelectorAll('.MensajeErrores').forEach(function (element) {
        element.textContent = '';
    });
    // Simular clic en el checkboxDescuentoPorMayor si está marcado
    var checkbox = $('#checkboxDescuentoPorMayor');
    if (checkbox.checked) {
        checbox.trigger('click');
        $('#filtrarxCategoriaAct').trigger('click');
    }
    actualizarFormularioParaDescuentoCrear(false);
}
function limpiarDatosFormularioProductoAct() {

    // Limpiar la URL eliminando los parámetros de consulta
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
    for (var i = Math.max(0, mensajes.length - 8); i < mensajes.length - 2; i++) {
        mensajes[i].textContent = '';
    }
    for (var i = Math.max(0, mensajesText.length - 3); i < mensajesText.length; i++) {
        mensajesText[i].textContent = '';
    }
    // Verificar si los elementos están marcados y desmarcarlos si es así
    if ($('#filtrarActivosAct').prop('checked')) {
        $('#filtrarActivosAct').trigger('click');

    }
    if ($('#filtrarxCategoriaAct').prop('checked')) {
        $('#filtrarxCategoriaAct').trigger('click');
    }

    agregarIconoparalimpiarElCampo('NombrePresentacionAct');
    agregarIconoparalimpiarElCampo('NombreMarcaAct');
    agregarIconoparalimpiarElCampo('NombreCategoriaAct');


}

function limpiarFiltroProductoAgregar() {
    var filtroTodos = $('#filtrarActivos').prop('checked');
    var filtroCategoria = $('#filtrarxCategoria').prop('checked');

    if (filtroTodos) {
        $('#filtrarActivos').trigger('click');
    }
    if (filtroCategoria) {
        $('#filtrarxCategoria').trigger('click');
    }
}


//Se llama al perder el foco de la modal para limpiar el formulario actualizar
//Función para limpiar la url si el usuario da fuera de ella 
$('.modal').on('click', function (e) {
    if (e.target === this) {
        // Limpiar la URL eliminando los parámetros de consulta
        history.replaceState(null, '', location.pathname);
        $(this).modal('hide'); // Oculta la modal

        // Verificar si los elementos están marcados y desmarcarlos si es así
        if ($('#filtrarActivosAct').prop('checked')) {
            $('#filtrarActivosAct').trigger('click');

        }
        if ($('#filtrarxCategoriaAct').prop('checked')) {
            $('#filtrarxCategoriaAct').trigger('click');
        }
    }
});

/*--------------------------------------------------------- Modal de actualizar usuario ---------------------------------------*/
//Funcion que se activa al hacer clik en el boton de editar.
function actualizarProducto(campo) {
    var productoId = campo;
    try {
        $.ajax({
            url: '/Productos/FindProducto', // Ruta relativa al controlador y la acción
            type: 'POST',
            data: { productoId: productoId },
            success: function (data) {
                console.log(data);
                limpiarCampoIcono('NombrePresentacionAct');
                limpiarCampoIcono('NombreMarcaAct');
                limpiarCampoIcono('NombreCategoriaAct');
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
                    // Marcar el checkbox DescuentoPorMayorAct como seleccionado
                    $('#checkboxDescuentoPorMayorAct').prop('checked', true);
                    $('#DescuentoAplicarPorMayorAct').val(data.descuentoAplicarPorMayor);
                    $('#CantidadAplicarPorMayorAct').val(data.cantidadAplicarPorMayor);
                    // Mostrar los elementos con la clase 'PorMayor'
                    var elementos = document.getElementsByClassName('PorMayorAct');
                    for (var i = 0; i < elementos.length; i++) {
                        elementos[i].classList.remove('noBe');
                    }
                  
                }else{
                    $('#checkboxDescuentoPorMayorAct').prop('checked', false);
                    $('#DescuentoAplicarPorMayorAct').val(0);
                    $('#CantidadAplicarPorMayorAct').val(0);
                    var elementos = document.getElementsByClassName('PorMayorAct');
                    for (var i = 0; i < elementos.length; i++) {
                        elementos[i].classList.add('noBe');
                    }
                }
             
                obtenerDatosProductos();
              
                // Abrir la modal después de completar la actualización del producto
                $('#ModalProductoAct').modal('show');
            }
        });
    } catch {
        alert('Hubo problemas para obtener los datos del producto revisa tu conexion a internet.')
    }

}


/*------------------- Cambiar estado producto------------------------------------------*/
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



/*---------------------------------------------------------Buscador--------------------------------------------------------- */

function vaciarInputProducto() {
    var paginationContainer = document.getElementById('paginationContainer');
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
    paginationContainer.classList.remove('noBe'); // Oculta el contenedor de paginación
}

function searchProducto() {
    var input = $('#buscarProducto').val().trim().toLowerCase();    //Obtiene el valor del buscadpor
    var rows = document.querySelectorAll('.productosPaginado');    //Obtiene el tr de Usuario Paginado.
    var rowsTodos = document.querySelectorAll('.Productos');      //Obtiene el tr de Usuario que esta en none
    var icon = document.querySelector('#btnNavbarSearch i');     //Obtiene el icino de buscar
    var contador = document.querySelector('.contador');         //Obtiene la columna que tiene el # 
    var contadores = document.querySelectorAll('.contadorB');  //Obtiene el contadorB que esta en none y lo hace visible para mostrar el consecutivo y el ID
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
            var productoId = row.querySelector('td:nth-child(2)').textContent.trim().toLowerCase();
            var nombreC = row.querySelector('td:nth-child(3)').textContent.trim().toLowerCase();
            var nombreM = row.querySelector('td:nth-child(4)').textContent.trim().toLowerCase();
            var nombreP = row.querySelector('td:nth-child(5)').textContent.trim().toLowerCase();
            var cantidadT = row.querySelector('td:nth-child(6)').textContent.trim().toLowerCase();

            row.style.display = (productoId.includes(input) || nombreM.includes(input) || nombreC.includes(input) || nombreP.includes(input) || cantidadT.includes(input)) ? 'table-row' : 'none';
        }
    });

}


/*------------------------ Validaciones---------------*/

function validarCampoProducto(input) {
    const inputElement = $(input); // Convertir el input a objeto jQuery
    const campo = inputElement.attr('id'); // Obtener el id del input actual como nombre de campo
    const valor = inputElement.val().trim(); // Obtener el valor del campo y eliminar espacios en blanco al inicio y al final
    const spanError = inputElement.next('.text-danger'); // Obtener el elemento span de error asociado al input
    const labelForCampo = $('label[for="' + campo + '"]');
    const spanVacio = labelForCampo.find('.Mensaje');
    const redundante = /^(?!.*(\w)\1\1\1)[\w\s]+$/;
    const soloNumeros = /^\d+$/;
    spanError.text('');
    spanVacio.text('');

    if (valor === '') {
        spanVacio.text('*');
        // Limpiar valores de campos relacionados si el campo principal está vacío
        if (inputElement.is('#NombreMarca') || inputElement.is('#NombreMarcaAct')) {
            document.getElementById('MarcaId').value = '';
            document.getElementById('MarcaIdAct').value = ''
        } else if (inputElement.is('#NombrePresentacion') || inputElement.is('#NombrePresentacionAct')) {
            document.getElementById('PresentacionId').value = '';
            document.getElementById('PresentacionIdAct').value = '';
        } else if (inputElement.is('#NombreCategoria') || inputElement.is('#NombreCategoriaAct')) {
            document.getElementById('CategoriaId').value = '';
            document.getElementById('CategoriaIdAct').value = '';
        }
    } else if (inputElement.is('#NombreProducto') || inputElement.is('#NombreProductoAct')) {
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
        actualizarFormularioParaDescuentoCrear(true);
    } else {
        actualizarFormularioParaDescuentoCrear(false);

    }
}

function actualizarFormularioParaDescuentoCrear(activar) {
    var mensajes = document.querySelectorAll('.Mensaje');
    const elementos = document.getElementsByClassName('PorMayor');

    for (let i = 4; i < mensajes.length - 6; i++) {
        mensajes[i].textContent = activar ? '*' : ''; // Restaurar mensajes de error o limpiarlos
    }

    for (let i = 0; i < elementos.length; i++) {
        if (activar) {
            elementos[i].classList.remove("noBe");
        } else {
            elementos[i].classList.add("noBe");
        }
    }

    document.getElementById('CantidadAplicarPorMayor').value = activar ? '' : '0';
    document.getElementById('DescuentoAplicarPorMayor').value = activar ? '' : '0';
}


function Llamar2() {
    var checkbox = document.getElementById('checkboxDescuentoPorMayorAct');
    var mensajes = document.querySelectorAll('.Mensaje');
    const mensajesError = document.querySelectorAll('.text-danger');
    const elementos = document.getElementsByClassName('PorMayorAct');

    if (checkbox.checked) {
        for (let i = mensajes.length - 2; i < mensajes.length; i++) {
            mensajes[i].textContent = '*'; // Restaurar mensajes de error
        }

        for (let i = 0; i < elementos.length; i++) {
            elementos[i].classList.remove("noBe");
        }
        document.getElementById('CantidadAplicarPorMayorAct').value = '';
        document.getElementById('DescuentoAplicarPorMayorAct').value = '';
    } else {
        let cantidadAplicarPorMayorAct = document.getElementById('CantidadAplicarPorMayorAct').value;
        let descuentoAplicarPorMayorAct = document.getElementById('DescuentoAplicarPorMayorAct').value;

        if (cantidadAplicarPorMayorAct > 0 && descuentoAplicarPorMayorAct > 0) {
            Swal.fire({
                title: '¿Estás seguro?',
                text: "Si desmarcas esta opción, se perderán los datos de descuento por mayor.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, desmarcar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    actualizarFormularioParaDescuento(false);
                } else {
                    checkbox.checked = true;
                }
            });
        } else {
            actualizarFormularioParaDescuento(false);
        }
    }
}

function actualizarFormularioParaDescuento(activar) {
    var mensajes = document.querySelectorAll('.Mensaje');
    const elementos = document.getElementsByClassName('PorMayorAct');

    if (activar) {
        for (let i = mensajes.length - 2; i < mensajes.length; i++) {
            mensajes[i].textContent = '*'; // Restaurar mensajes de error
        }

        for (let i = 0; i < elementos.length; i++) {
            elementos[i].classList.remove("noBe");
        }
    } else {
        for (let i = 4; i < mensajes.length - 6; i++) {
            mensajes[i].textContent = ''; // Restaurar mensajes de error
        }

        for (let i = 0; i < elementos.length; i++) {
            elementos[i].classList.add("noBe");
        }

        document.getElementById('CantidadAplicarPorMayorAct').value = '0';
        document.getElementById('DescuentoAplicarPorMayorAct').value = '0';
    }
}

window.addEventListener('beforeunload', function (event) {
    // Obtener la URL actual
    var currentUrl = window.location.href;

    // Verificar si la URL contiene la palabra "Productos"
    if (currentUrl.includes("Productos")) {
        // Mostrar mensaje de confirmación solo si está en la página de productos
        var confirmationMessage = '¿Estás seguro de que quieres salir de esta página?';
        event.returnValue = confirmationMessage;
        return confirmationMessage;
    }
});




