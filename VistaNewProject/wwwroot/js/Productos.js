const API_URL = 'https://localhost:7013/api/Productos';
var productos = [];
// Obtener productos al cargar la página
function obtenerDatosProductos() {
    fetch(`${API_URL}/GetProductos`)
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

    /*Se usa para que si se cierra la ventana modal al estar 
    actualizando se limpie el formulario si es necesario agregar dicha
    funcionalidad al crear hacerlo aqui*/
    var modal = document.getElementById('GeneralModal'); 
   
    let timeout = null;

    if (mostrarAlerta === 'true' && productoId) {
        obtenerDatosProducto(productoId);
        const botonModal = document.querySelector('[data-bs-target="#ProductoModal"]');
        if (botonModal) {
            botonModal.click();
        }
    }



    // Agregar evento blur al modal
    modal.addEventListener('blur', function () {
        // Llamar a la función al perder el foco
        funcionAlPerderFoco();
    });

    // Función a llamar al perder el foco del modal
    function funcionAlPerderFoco() {
        // Obtener el estilo de #FormActualizar
        var displayFormActualizar = $('#GeneralModal').css('display');
        
        if (displayFormActualizar == "none") {
            console.log('Displaysss de #FormActualizar:', displayFormActualizar);
            limpiarFormularioProducto();
        }
    }
    //Evita el envio dell formulario si no se cumplen con los requerimientos minimos
    $('.modal-formulario-crear').on('submit', function (event) {
        if (!NoCamposVacios()) {
            event.preventDefault();
        }
        // Obtener los valores de los campos del formulario
        var categoriaId = document.getElementById('CategoriaId').value;
        var presentacionId = document.getElementById('PresentacionId').value;
        var marcaId = document.getElementById('MarcaId').value;

        if (categoriaId == '') {
            event.preventDefault();
            mostrarAlertaDataList('categoria');
        } else if (presentacionId == '') {
            event.preventDefault();
            mostrarAlertaDataList('presentación');

        } else if (marcaId == '') {
            event.preventDefault();
            mostrarAlertaDataList('marca');
        }
    }); 
    //Validar campos en cada cambio
    $('.modal-formulario-crear input, .modal-formulario-crear select').on('submit', function () {
        NoCamposVacios();
    });
    $('.modal-formulario-crear input, .modal-formulario-crear select').on('change', function () {
        NoCamposVaciosInicial();
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

        // Mostrar/ocultar mensaje inicial
        if (todosLlenos && todoValido) {
            $('#MensajeInicial').text('');
            return true;
        } else {
            $('#MensajeInicial').text('Por favor, complete todos los campos obligatorios(*).');
            return false;
        }
    }
    function NoCamposVaciosInicial() {
        const todoValido = $('.text-danger').filter(function () {
            return $(this).text() !== '';
        }).length === 0;

        const todosLlenos = $('.Mensaje').filter(function () {
            return $(this).text() !== '';
        }).length === 0;

        // Mostrar/ocultar mensaje inicial
        if (todosLlenos && todoValido) {
            $('#MensajeInicial').text('');
            return true;
        }
    }


    //Funcion para mostrar un sweet alert en caso de que se ingrese un numero de id que no tiene coincidencias
    function mostrarAlertaDataList(campo) {
        Swal.fire({
            position: "center",
            icon: 'warning',
            title: '¡Atencion!',
            html: `<p style="margin: 0;">Recuerda que debes seleccionar la ${campo} dando click en la opción que deseas</p>
            <div class="text-center" style="margin: 0; padding: 0;">
            <p style="margin: 0;">O</p>
            </div>
            <p style="margin: 0;">En su defecto, escribir el ID del ${campo} o nombre exactamente igual.</p>`,

            showConfirmButton: false, // Mostrar botón de confirmación
            timer: 6000

        });
    }
    
    // Función para manejar la selección de opciones en los datalist
    function seleccionarOpcion(input, dataList, hiddenInput) {
        const selectedValue = input.value.trim();
        let selectedOptionByName = Array.from(dataList.options).find(option => option.value === selectedValue);
        let selectedOptionById = Array.from(dataList.options).find(option => option.getAttribute('data-id') === selectedValue);

        if (/^\d+[a-zA-Z]$/.test(selectedValue)) {
            console.log('Número seguido de letra encontrado:', selectedValue);
            selectedOptionByName = Array.from(dataList.options).find(option => option.value === selectedValue);
        }

        if (!selectedOptionByName && !selectedOptionById && /^\d+$/.test(selectedValue)) {
            Swal.fire({
                icon: 'warning',
                title: 'No se encontró ningún resultado con este ID',
                showConfirmButton: false,
                timer: 1800
            });
            input.value = '';
            input.dispatchEvent(new Event('input'));
            return;
        }

        if (selectedOptionByName) {
            input.value = selectedOptionByName.value;
            hiddenInput.value = selectedOptionByName.getAttribute('data-id');
        } else if (selectedOptionById) {
            input.value = selectedOptionById.value;
            hiddenInput.value = selectedOptionById.getAttribute('data-id');
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
        }, 650);
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
    window.llenarCampos = function () {
        seleccionarOpcion(document.getElementById('NombreMarcaAct'), document.getElementById('marcas'), document.getElementById('MarcaIdAct'));
        seleccionarOpcion(document.getElementById('NombreCategoriaAct'), document.getElementById('categorias'), document.getElementById('CategoriaIdAct'));
        seleccionarOpcion(document.getElementById('NombrePresentacionAct'), document.getElementById('presentaciones'), document.getElementById('PresentacionIdAct'));
    }
  

});

//Funcion que se activa al haer clik en el boton de editar.
function actualizarProducto(campo) {
    var productoId = campo;
    $.ajax({
        url: '/Productos/FindProducto', // Ruta relativa al controlador y la acción
        type: 'POST',
        data: { productoId: productoId },
        success: function (data) {
            // Llenar el formulario con los datos obtenidos
            $('#ProductoIdAct').val(data.productoId);
            $('#EstadoAct').val(data.estado);
            $('#NombreMarcaAct').val(data.marcaId);
            $('#NombreProductoAct').val(data.nombreProducto);
            $('#NombrePresentacionAct').val(data.presentacionId);
            $('#NombreCategoriaAct').val(data.categoriaId);
            $('#FormPrincipal').hide().css('visibility', 'hidden');
            $('#FormActualizar').show().css('visibility', 'visible');
            if (data.cantidadAplicarPorMayor > 0) {
                $('#DescuentoAplicarPorMayorAct').val(data.descuentoAplicarPorMayor);
                $('#CantidadAplicarPorMayorAct').val(data.cantidadAplicarPorMayor);
                var button = document.getElementById("checkboxDescuentoPorMayorAct");
                // Simular el clic en el botón
                button.click();
            } else {
                $('#checkboxDescuentoPorMayorAct').prop('checked', false); // Desmarcar el checkbox
            }

            if (typeof llenarCampos === 'function') {
                llenarCampos(); // Llamada a la función llenarCampos
            }
            console.log(data);
        },
        error: function () {
            alert('Error al obtener los datos del producto.');
        }
    });
}

//Funcion que cambia el estado del checbox (Migrar a controlador)
function actualizarEstadoProducto(ProductoId, Estado) {
    fetch(`https://localhost:7013/api/Productos/UpdateEstadoProducto/${ProductoId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Estado: Estado ? 1 : 0 })
    })
        .then(response => {
            if (response.ok) {
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


//Funcion que le da la funcionalidad al buscador

document.getElementById('buscarProducto').addEventListener('input', function () {
    var input = this.value.trim().toLowerCase();
    var rows = document.querySelectorAll('.productosPaginado');

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
    var rowsTodos = document.querySelectorAll('.Productos');

    rowsTodos.forEach(function (row) {
        if (input === "") {
            row.style.display = 'none';
        } else {
            var productoId = row.querySelector('td:nth-child(1)').textContent.trim().toLowerCase();
            var nombreM = row.querySelector('td:nth-child(2)').textContent.trim().toLowerCase();
            var nombreC = row.querySelector('td:nth-child(3)').textContent.trim().toLowerCase();
            var nombreP = row.querySelector('td:nth-child(4)').textContent.trim().toLowerCase();
            var nombrePr = row.querySelector('td:nth-child(5)').textContent.trim().toLowerCase();
            var cantidadT = row.querySelector('td:nth-child(6)').textContent.trim().toLowerCase();

            row.style.display = (productoId.includes(input) || nombreM.includes(input) || nombreC.includes(input) || nombreP.includes(input) || nombrePr.includes(input) || cantidadT.includes(input)) ? 'table-row' : 'none';
        }
    });
});

function vaciarInput() {
    document.getElementById('buscarProducto').value = "";
    var icon = document.querySelector('#btnNavbarSearch i');
    icon.className = 'fas fa-search';
    icon.style.color = 'gray';

    var rows = document.querySelectorAll('.productosPaginado');
    rows.forEach(function (row) {
        row.style.display = 'table-row';
    });

    var rowsTodos = document.querySelectorAll('.Productos');

    rowsTodos.forEach(function (row) {
        row.style.display = 'none';
    });
}


//Funcion para hacer las respectivas validaciones a los campos
function validarCampo(input) {
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
    } else if ($input.is('#NombreProducto')) {
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


// Función general para mostrar el Sweet Alert si no hay opciones disponibles
function showAlertIfNoOptions(elementId, alertTitle, alertText) {
    var options = document.getElementById(elementId).getElementsByTagName("option");
    if (options.length === 0) {
        Swal.fire({
            icon: 'info',
            title: alertTitle,
            text: alertText,
            timer: 3000,
            timerProgressBar: true
        });
    }
}
// Llama a la función general con los parámetros específicos
function showNoMarcasAlert() {
    showAlertIfNoOptions("marcas", "No hay marcas activas", "No hay marcas disponibles en este momento.");
}

function showNoPresentacionesAlert() {
    showAlertIfNoOptions("presentaciones", "No hay presentaciones activas", "No hay presentaciones disponibles en este momento.");
}

function showCategorias() {
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
                        mensaje.textContent = '*';
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

    // Añadir texto a los últimos seis mensajes
    for (var i = Math.max(0, mensajes.length - 6); i < mensajes.length; i++) {
        mensajes[i].textContent = '';
    }
    for (var i = 0; i < mensajes.length -10; i++) {
        mensajes[i].textContent = '*';
    }
    document.getElementById('checkboxDescuentoPorMayorAct').checked = false; // Desmarcar el checkbox
}

