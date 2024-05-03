
    // Objeto de compra
    var compra = {
        proveedorId: 0,
        numeroFactura: 0,
        fechaCompra: new Date().toISOString(), // Obtener la fecha actual en formato ISO
        valorTotalCompra: 0,
        estadoCompra: 0,
        detallecompras: []
    };

var verificarProducto = "";
    // Función para limpiar el formulario
function LimpiarFormulario() {
    // Limpiar los valores de los campos del formulario
    document.getElementById('ProductoId').value = '';
    document.getElementById('UnidadId').value = '';
    document.getElementById('Cantidad').value = 1;
    document.getElementById('PrecioDeCompra').value = '';
    document.getElementById('PrecioDeCompraPorPresentacion').value = '';
    document.getElementById('PrecioDeCompraUnitario').value = '';
    document.getElementById('FechaVencimiento').value = '';
    document.getElementById('PrecioDeVentaUnitario').value = '';
    document.getElementById('PrecioDeVentaxUnidadPresentacion').value = '';
    document.getElementById('PrecioDeCompraPorUnidad').value = '';
    document.getElementById('PorcentajeGanancia').value = '';
    document.getElementById('NumeroLote').value = '';
    document.getElementById('PorcentajeGanancia').value = '';
    document.getElementById('checkboxNoVencimiento').checked = false;
    const fechaVencimiento = document.getElementById('FechaVencimiento');
    const fechaVencimientoNunca = document.getElementById('FechaVencimientoNunca');
    const labelFechaVencimiento = document.getElementById('Vencimiento');
    const spanMensajeNoFecha = document.querySelector('.col-4 .Mensaje');
  
    fechaVencimiento.style.display = 'block'; // Mostrar la fecha de vencimiento
    fechaVencimiento.value = ''; // Asignar un valor vacío por defecto
    fechaVencimientoNunca.style.display = 'none'; // Ocultar el texto "Producto no perecedero"
    labelFechaVencimiento.textContent = 'No Aplica:'; 
    spanMensajeNoFecha.textContent = '*';
    
    var mensajes = document.querySelectorAll('.Mensaje');
    // Iterar sobre los mensajes, omitiendo los primeros 2 y los últimos 2
    for (var i = 2; i < mensajes.length - 3; i++) {
        var mensaje = mensajes[i];
        mensaje.textContent = ' *'; // Restaurar mensajes de error
        mensaje.style.display = 'inline-block'; // Establecer estilo si es necesario
    }
    const mensajesError = document.querySelectorAll('.text-danger');
    mensajesError.forEach(span => {
        span.innerText = ''; // Limpiar contenido del mensaje
    });

    // Ocultar elementos
    document.getElementById('PrecioBougth').style.display = 'none';
    document.getElementById('PrecioBuy').style.display = 'none';
    document.getElementById('TablaDetalles').style.display = 'flex';
}


function eliminarTodosLosDetalles() {
    var filasDetalles = document.querySelectorAll('#tablaDetalles tbody tr');

    // Iterar sobre todas las filas de detalles y eliminarlas una por una
    filasDetalles.forEach(function (fila) {
        var botonEliminar = fila.querySelector('.btnEliminar');
        eliminarFilaDetalle(botonEliminar); // Llamar a la función eliminarFilaDetalle para cada fila
    });
}

function limpiarFormularioTotalmente() {
    // Eliminar todos los detalles de la tabla
    eliminarTodosLosDetalles();
    compra = {
        proveedorId: 0,
        numeroFactura: 0,
        fechaCompra: new Date().toISOString(),
        valorTotalCompra: 0,
        estadoCompra: 0,
        detallecompras: []
    };

    document.getElementById('tituloModal').style.display = 'block';
    document.getElementById('subTituloModal').style.display = 'none';
    document.getElementById('PrincipalCompra').style.display = 'block';
    document.getElementById('agregarDetalle').style.display = 'block';
    document.getElementById('DetallesCompra').style.display = 'none';
    document.getElementById('actualizarCompra').style.visibility = 'hidden';
    document.getElementById('actualizarCompra').style.display = 'none';
    document.getElementById('verCompra').style.display = 'none';
    // Limpiar los valores de los campos del formulario
    document.getElementById('ProveedorId').value = '';
    document.getElementById('NumeroFactura').value = '';
    document.getElementById('ProductoId').value = '';
    document.getElementById('UnidadId').value = '';
    document.getElementById('Cantidad').value = 1;
    document.getElementById('PrecioDeCompra').value = '';
    document.getElementById('PrecioDeCompraPorPresentacion').value = '';
    document.getElementById('PrecioDeCompraUnitario').value = '';
    document.getElementById('FechaVencimiento').value = '';
    document.getElementById('PrecioDeVentaUnitario').value = '';
    document.getElementById('PrecioDeVentaxUnidadPresentacion').value = '';
    document.getElementById('PrecioDeCompraPorUnidad').value = '';
    document.getElementById('PorcentajeGanancia').value = '';
    document.getElementById('NumeroLote').value = '';
    document.getElementById('PorcentajeGanancia').value = '';
    document.getElementById('checkboxNoVencimiento').checked = false;
    const fechaVencimiento = document.getElementById('FechaVencimiento');
    const fechaVencimientoNunca = document.getElementById('FechaVencimientoNunca');
    const labelFechaVencimiento = document.getElementById('Vencimiento');
    const spanMensajeNoFecha = document.querySelector('.col-4 .Mensaje');

    fechaVencimiento.style.display = 'block'; // Mostrar la fecha de vencimiento
    fechaVencimiento.value = ''; // Asignar un valor vacío por defecto
    fechaVencimientoNunca.style.display = 'none'; // Ocultar el texto "Producto no perecedero"
    labelFechaVencimiento.textContent = 'No Aplica:';
    spanMensajeNoFecha.textContent = '*';

    var mensajes = document.querySelectorAll('.Mensaje');
    // Iterar sobre los mensajes, omitiendo los primeros 2 y los últimos 2
    for (var i = 0; i < mensajes.length - 3; i++) {
        var mensaje = mensajes[i];
        mensaje.textContent = ' *'; // Restaurar mensajes de error
        mensaje.style.display = 'inline-block'; // Establecer estilo si es necesario
    }
    const mensajesError = document.querySelectorAll('.text-danger');
    mensajesError.forEach(span => {
        span.innerText = ''; // Limpiar contenido del mensaje
    });

    // Ocultar elementos
    document.getElementById('PrecioBougth').style.display = 'none';
    document.getElementById('PrecioBuy').style.display = 'none';
    document.getElementById('TablaDetalles').style.display = 'flex';
}

// Función para registrar la compra
function RegistrarBuy() {
    if (compra.detallecompras.length === 0) {

        Swal.fire({
            position:"center",
            icon: 'warning',
            title: '¡Atencion!',
            text: 'Debes agregar minimo un producto a la compra.',
            showConfirmButton: false, // Mostrar botón de confirmación
            timer: 3000
        })
        return;
    }
    
    // Mostrar una alerta de confirmación antes de enviar la solicitud
    Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas confirmar y enviar la compra?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, confirmar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Si el usuario confirma, enviar la solicitud POST al servidor utilizando la Fetch API
            fetch('https://localhost:7013/api/Compras/InsertCompras', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(compra)
            })
                .then(response => {
                    if (response.ok) {
                        Swal.fire({
                            position: "center",
                            icon: 'success',
                            title: '¡Compra guardada!',
                            text: 'La compra se ha registrado correctamente.',
                            showConfirmButton: false, // No mostrar botón de confirmación
                            timer: 3000
                        });
                        location.reload(true); // Recargar la página después de la actualización
                    } else {
                        console.log(compra);
                        Swal.fire({
                            position: "center",
                            icon: 'error',
                            title: 'Error',
                            text: 'Error en la actualización. Por favor, inténtalo de nuevo más tarde.',
                            showConfirmButton: false, // No mostrar botón de confirmación
                            timer: 3000
                        });
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    Swal.fire({
                        position: "center",
                        icon: 'error',
                        title: 'Error',
                        text: 'Error en la actualización. Por favor, inténtalo de nuevo más tarde.',
                        showConfirmButton: false, // No mostrar botón de confirmación
                        timer: 3000
                    });
                });
        }
    });
};

  
    //Funcion para asignar la hora actual al campo  
    function setHoraActual() {
        // Obtener la hora actual con Moment.js
        var fechaHoraActual = moment().format('YYYY-MM-DDTHH:mm');

        // Asignar la fecha y hora actual al campo datetime-local
        document.getElementById('FechaCompra').value = fechaHoraActual;
    }   

//Funcion para validar campos vacios
function validarCampos(input) {
    var valor = input.val().trim();
    var spanError = input.next('.text-danger');
    var spanVacio = input.prev('.Mensaje');
    var spanVacioPorcentaje = $('#PorcentajeGanancia').closest('.col-3').find('.Mensaje');
    var spanVacioFechaVencimiento = $('#FechaVencimiento').closest('.col-4').find('.Mensaje');
    var spanVacioPrecio = $('#PrecioDeVentaUnitario').closest('.col-4').find('.Mensaje');
  


  

    var MensajaInicial = $('#MensajeInicial');

    spanError.text('');
    spanVacio.text('');
    if (valor != '') {
        spanVacio.text(''); // Cambiar el texto del elemento span 
    } else {
        spanVacio.text('*obligatorio'); // Limpiar el texto del elemento span si el valor está vacío
    }
    if (input.is('#PorcentajeGanancia')) {
        spanVacioPorcentaje.text(valor === '' ? '*obligatorio' : '');
    }
    if (input.is('#FechaVencimiento')) {
        spanVacioFechaVencimiento.text(valor === '' ? '*obligatorio' : '');
    }
    if (input.is('#ProveedorId') || input.is('#NumeroFactura')) {
        if ($('#ProveedorId').val() !== '' && $('#NumeroFactura').val() !== '') {
            $('#MensajeInicial').css('display', 'block');
            MensajaInicial.text(''); // Use jQuery's text() method
        }
    }

    if (input.is('#PrecioDeVentaUnitario')) {
        spanVacioPrecio.text(valor === '' ? '*obligatorio' : '');
    }
 
   

    
}

// Controlador de eventos para campos de entrada
$('#NumeroFactura, #ProveedorId, #FechaCompra,#ProductoId, #FechaVencimiento, #NumeroLote, #UnidadId, #PrecioDeCompra, #PorcentajeGanancia, #PrecioDeVentaPorUnidad').on('input', function () {
    validarCampos($(this));
});
// Función para agregar productos a la compra
    function agregarProductos() {
        // Obtener los valores de los campos del formulario
        var proveedorId = document.getElementById('ProveedorIdHidden').value;
        var numeroFactura = document.getElementById('NumeroFactura').value;
        var fechaCompra = document.getElementById('FechaCompra').value;
        var MensajaInicial = document.getElementById('MensajeInicial');

        // Validar que se hayan ingresado los datos requeridos
        if (!proveedorId || !numeroFactura || !fechaCompra) {
            // alert('Por favor complete todos los campos.');
            MensajaInicial.innerText = 'Completa los campos con *'; // Use vanilla JavaScript to set text
            MensajaInicial.style.display = 'block'; // Display the message
            return;
        }

        // Actualizar los valores del objeto compra
        compra.proveedorId = proveedorId;
        compra.numeroFactura = numeroFactura;
        compra.fechaCompra = fechaCompra;

        // Mostrar y ocultar elementos según sea necesario
        document.getElementById('DetallesCompra').style.display = 'block';
        document.getElementById('verCompra').style.display = 'block';
        document.getElementById('MensajeInicial').style.display = 'none';
        document.getElementById('PrincipalCompra').style.display = 'none';
        document.getElementById('tituloModal').style.display = 'none';
        document.getElementById('subTituloModal').style.display = 'block';
        document.getElementById('agregarDetalle').style.display = 'none';
        document.getElementById('expandir').style.display = 'inline-block';
        document.getElementById('expandir').style.visibility = 'visible';
   
    }


    // Función para agregar un detalle de compra al objeto principal
function agregarDetalleCompra() {
    var unidad = document.getElementById('UnidadIdHidden').value;
    var productoId = document.getElementById('ProductoIdHidden').value;
    var cantidad = document.getElementById('Cantidad').value;

    if (productoId != verificarProducto) {
        alert('¡Atención! Parece que has modificado el campo de producto. Por favor, asegúrate de realizar de nuevo el cálculo.');
        return;
    }

    // Crear un nuevo objeto detalleCompra en cada llamada para evitar referencias compartidas
    var detalleCompra = {
        productoId: productoId,
        unidadId: unidad,
        cantidad: cantidad,
        lotes: [] // Inicialmente sin lotes
    };

    var numeroLote = document.getElementById('NumeroLote').value;
    var precioCompra = parseFloat(document.getElementById('PrecioDeCompra').value.replace(/[\.,]/g, ''));
    var precioCompraUnidad = parseFloat(document.getElementById('PrecioDeCompraPorUnidad').value.replace(/[\.,]/g, ''));
    var precioCompraPorProducto = parseFloat(document.getElementById('PrecioDeCompraPorPresentacion').value.replace(/[\.,]/g, ''));
    var PrecioDeCompraUnitario = parseFloat(document.getElementById('PrecioDeCompraUnitario').value.replace(/[\.,]/g, ''));

    var precioVentaxUnidad = parseFloat(document.getElementById('PrecioDeVentaPorUnidad').value.replace(/[\.,]/g, ''));
    var precioVentaxPresentacion = parseFloat(document.getElementById('PrecioDeVentaUnitario').value.replace(/[\.,]/g, ''));
    var precioVentaxUnidadPresentacion = parseFloat(document.getElementById('PrecioDeVentaxUnidadPresentacion').value.replace(/[\.,]/g, ''));

    var cantidadPresentacion = document.getElementById('CantidadPorPresentacionHidden').value;
    var cantidadUnidad = document.getElementById('CantidadPorUnidad').value;

    var cantidadLote = detalleCompra.cantidad * (cantidadPresentacion * cantidadUnidad);
    var fechaVencimiento = document.getElementById('FechaVencimiento').value;

    var todolleno = $('.Mensaje').filter(function () {
        return $(this).text() !== '';
    }).length === 0;

    if (!todolleno) {
        Swal.fire({
            position: "center",
            icon: 'warning',
            title: '¡Atención!',
            html: '<p>Completa los campos con * para poder agregar el producto a la compra.</p>',
            showConfirmButton: false,
            timer: 5000
        });
        return;

    }

    // Validar la fecha de vencimiento
    if (!fechaVencimiento || isNaN(new Date(fechaVencimiento))) {
        // Si la fecha no es de tipo date time o es nula, establecerla en '2000-01-01T00:00'
        fechaVencimiento = '2000-01-01T00:00';
    }
    var diferencia = Math.abs(precioCompra - (precioCompraUnidad * cantidad));
    if (diferencia > 200) {
        alert('Has cambiado un campo, por favor realiza de nuevo el cálculo');
        return;
    }
    var diferenciaTwo = Math.abs(precioCompraUnidad - (precioCompraPorProducto * cantidadUnidad));
    if (diferenciaTwo > 200) {
        alert('¡Atención! Parece que has modificado el campo de unidad. Por favor, asegúrate de realizar de nuevo el cálculo.');
        return;
    }
    if (precioVentaxUnidad < precioCompraUnidad || precioVentaxPresentacion < precioCompraPorProducto || precioVentaxUnidadPresentacion < PrecioDeCompraUnitario) {
        let mensajeAlerta = 'Estás vendiendo a un valor menor al que compraste en el siguiente campo: ';
        if (precioVentaxUnidad < precioCompraUnidad) {
            mensajeAlerta += 'Precio de venta x Unidad\n';
        }
        if (precioVentaxPresentacion < precioCompraPorProducto) {
            mensajeAlerta += 'Precio de venta x Presentación\n';
        }
        if (precioVentaxUnidadPresentacion < PrecioDeCompraUnitario) {
            mensajeAlerta += 'Precio de venta x Unidad de Presentación\n';
        }

        // Mostrar la alerta con SweetAlert
        Swal.fire({
            title: "Advertencia",
            text: mensajeAlerta + "\n¿Deseas continuar con estos valores?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Continuar",
            cancelButtonText: "Actualizar Valores",
        }).then((result) => {
            if (!result.isConfirmed) {
                return;
            } else {
                // Aquí es donde se crea el detalle de compra después de la validación del cliente
                var nuevoLote = {
                    productoId: detalleCompra.productoId,
                    numeroLote: numeroLote,
                    precioCompra: precioCompra,
                    precioPorUnidad: precioVentaxUnidad,
                    precioPorPresentacion: precioVentaxPresentacion,
                    precioPorUnidadProducto: precioVentaxUnidadPresentacion,
                    fechaVencimiento: fechaVencimiento,
                    cantidad: cantidadLote,
                    estadoLote: 1 // Estado por defecto
                };

                detalleCompra.lotes.push(nuevoLote);
                compra.detallecompras.push(detalleCompra);
                console.log(precioVentaxUnidad + "+ " + precioCompraUnidad);
                LimpiarFormulario();
                agregarFilaDetalle(detalleCompra); // Llama a la función para agregar la fila de detalle a la tabla
            }
        });

    } else {
        // Si no se muestra la alerta de SweetAlert, se crea el detalle de compra directamente
        var nuevoLote = {
            productoId: detalleCompra.productoId,
            numeroLote: numeroLote,
            precioCompra: precioCompra,
            precioPorUnidad: precioVentaxUnidad,
            precioPorPresentacion: precioVentaxPresentacion,
            precioPorUnidadProducto: precioVentaxUnidadPresentacion,
            fechaVencimiento: fechaVencimiento,
            cantidad: cantidadLote,
            estadoLote: 1 // Estado por defecto
        };

        detalleCompra.lotes.push(nuevoLote);
        compra.detallecompras.push(detalleCompra);
        console.log(precioVentaxUnidad + "+ " + precioCompraUnidad);
        LimpiarFormulario();
        agregarFilaDetalle(detalleCompra); // Llama a la función para agregar la fila de detalle a la tabla
    }
}




// Función para calcular y actualizar el valor total
function actualizarValorTotal() {
    var total = 0;
    // Obtener todas las filas de la tabla
    var filas = document.querySelectorAll('#detalleTableBody tr');
    // Iterar sobre las filas y sumar los subtotales
    filas.forEach(function (fila) {
        var subtotal = parseFloat(fila.cells[3].innerHTML);
        total += subtotal;
    });
    // Asignar el total al elemento con el id 'ValorTotal'
    document.getElementById('ValorTotal').value = total;
}

// Función para agregar una fila de detalle a la tabla
function agregarFilaDetalle(detalleCompra) {
    // Obtener el cuerpo de la tabla
    var detalleTableBody = document.getElementById('detalleTableBody');

    // Obtener el último lote agregado al detalle
    var ultimoLote = detalleCompra.lotes[detalleCompra.lotes.length - 1];

    // Crear una nueva fila para el detalle
    var newRow = detalleTableBody.insertRow();

    // Crear las celdas para los datos del detalle
    var cellProducto = newRow.insertCell(0);
    var cellCantidad = newRow.insertCell(1);
    var cellPrecioUnitario = newRow.insertCell(2);
    var cellSubtotal = newRow.insertCell(3);
    var cellAcciones = newRow.insertCell(4);

    // Asignar los valores del detalle a las celdas
    cellProducto.innerHTML = detalleCompra.productoId;
    cellCantidad.innerHTML = detalleCompra.cantidad;
    cellPrecioUnitario.innerHTML = ultimoLote.precioCompra;
    cellSubtotal.innerHTML = detalleCompra.cantidad * ultimoLote.precioCompra;
    cellAcciones.innerHTML = '<button onclick="eliminarFilaDetalle(this)">Eliminar</button>';

    // Actualizar el valor total
    actualizarValorTotal();
}


function eliminarFilaDetalle(button) {
    var row = button.parentNode.parentNode; // Obtener la fila de la tabla
    var indice = row.getAttribute('data-indice'); // Obtener el índice de la fila

    // Obtener el detalle de compra a eliminar
    var detalleEliminado = compra.detallecompras[indice];

    // Eliminar el detalle de compra del objeto compra
    compra.detallecompras.splice(indice, 1);

    // Eliminar el lote asociado del objeto detalleEliminado solo si existe
    if (detalleEliminado && detalleEliminado.lotes.length > 0) {
        // Como estás eliminando toda la fila del detalle, 
        // no necesitas acceder al índice de los lotes, simplemente los eliminas todos.
        detalleEliminado.lotes = [];
    }

    // Eliminar la fila de la tabla
    row.remove();

    // Actualizar los índices de las filas restantes en la tabla
    actualizarIndicesTabla();
    actualizarValorTotal();
}

function actualizarIndicesTabla() {
    // Obtener todas las filas de la tabla
    var filas = document.querySelectorAll('#detalleTableBody tr');

    // Recorrer las filas y actualizar el atributo data-indice
    filas.forEach(function (fila, index) {
        fila.setAttribute('data-indice', index);
    });
}

// Función para actualizar una fila de detalle existente con los nuevos datos
function actualizarFilaDetalle(detalleCompra, indice) {
    var detalleTableBody = document.getElementById('detalleTableBody');
    var row = detalleTableBody.rows[indice];

    var ultimoLote = detalleCompra.lotes[detalleCompra.lotes.length - 1];

    row.cells[0].innerHTML = detalleCompra.productoId;
    row.cells[1].innerHTML = detalleCompra.cantidad;
    row.cells[2].innerHTML = ultimoLote.precioCompra;
    row.cells[3].innerHTML = detalleCompra.cantidad * ultimoLote.precioCompra;
}


// Función para agregar un lote al detalle de compra
function agregarLoteAlDetalle(detalleIndex, lote) {
    if (detalleIndex >= 0 && detalleIndex < compra.detallecompras.length) {
        compra.detallecompras[detalleIndex].lotes.push(lote);
    } else {
        console.error('Índice de detalle inválido.');
    }
}

function actualizarCompra() {
    var proveedorId = document.getElementById('ProveedorIdHidden').value;
    var numeroFactura = document.getElementById('NumeroFactura').value;
    var fechaCompra = document.getElementById('FechaCompra').value;
    var MensajaInicial = document.getElementById('MensajeInicial');

    if (!proveedorId || !numeroFactura || !fechaCompra ) {
        MensajaInicial.innerText = 'Completa los campos con *'; 
        MensajaInicial.style.display = 'block';
        return;
    }

    // Actualizar los valores de la compra
    compra.proveedorId = proveedorId;
    compra.numeroFactura = numeroFactura;
    compra.fechaCompra = fechaCompra;

    alert('Compra actualizada');
    noVerCompra();
}

function verTodo() {
    console.log(compra);
}
function volverARegistrarCompra()    {
    document.getElementById('tituloModal').style.display = 'block';
    document.getElementById('subTituloModal').style.display = 'none';
    document.getElementById('PrincipalCompra').style.display = 'block';
    document.getElementById('agregarDetalle').style.display = 'block';
    document.getElementById('DetallesCompra').style.display = 'none';
    document.getElementById('actualizarCompra').style.visibility = 'hidden';
    document.getElementById('actualizarCompra').style.display = 'none';
    document.getElementById('verCompra').style.display = 'none';
    document.getElementById('CompraId').value = '';
    document.getElementById('NumeroFactura').value = '';
    document.getElementById('NumeroLote').value = '';
    document.getElementById('ProveedorId').value = '';
    document.getElementById('ProductoId').value = '';
    document.getElementById('UnidadId').value = '';
    document.getElementById('Cantidad').value = 1;
    document.getElementById('PrecioDeCompra').value = '';
    document.getElementById('PorcentajeGanancia').value = '';
    document.getElementById('UnidadIdHidden').value = '';
    document.getElementById('CantidadPorUnidad').value = '';
    document.getElementById('PrecioDeCompraPorPresentacion').value = '';
    document.getElementById('PrecioDeCompraUnitario').value = '';
    document.getElementById('PrecioDeCompraPorUnidad').value = '';
    document.getElementById('FechaVencimiento').value = '';
    document.getElementById('checkboxNoVencimiento').click();
    document.getElementById('checkboxNoVencimiento').checked = false;
    const fechaVencimiento = document.getElementById('FechaVencimiento');
    const fechaVencimientoNunca = document.getElementById('FechaVencimientoNunca');
    const labelFechaVencimiento = document.getElementById('Vencimiento');
    const spanMensajeNoFecha = document.querySelector('.col-4 .Mensaje');

    fechaVencimiento.style.display = 'block'; // Mostrar la fecha de vencimiento
    fechaVencimiento.value = ''; // Asignar un valor vacío por defecto
    fechaVencimientoNunca.style.display = 'none'; // Ocultar el texto "Producto no perecedero"
    labelFechaVencimiento.textContent = 'No Aplica:';
    spanMensajeNoFecha.textContent = '*';
      var mensajes = document.querySelectorAll('.Mensaje');
    // Iterar sobre los mensajes, omitiendo los primeros 2 y los últimos 2
    for (var i = 0; i < mensajes.length - 3; i++) {
        var mensaje = mensajes[i];
        mensaje.textContent = ' *'; // Restaurar mensajes de error
        mensaje.style.display = 'inline-block'; // Establecer estilo si es necesario
    }

    setHoraActual();
}

function reiniciarCompra() {
    location.reload();
}
function verCompra() {
    document.getElementById('agregarDetalle').style.display = 'none';
    document.getElementById('PrincipalCompra').style.display = 'block';
    document.getElementById('DetallesCompra').style.display = 'block';
    document.getElementById('verCompra').style.display = 'block';
    document.getElementById('reducir').style.display = 'inline-block';
    document.getElementById('reducir').style.visibility = 'visible';
    document.getElementById('expandir').style.display = 'none';
    document.getElementById('expandir').style.visibility = 'hidden';
    document.getElementById('actualizarCompra').style.visibility = 'visible';
    document.getElementById('actualizarCompra').style.display = 'flex';
    
}

function noVerCompra() {
    document.getElementById('PrincipalCompra').style.display = 'none';
    document.getElementById('reducir').style.display = 'none';
    document.getElementById('reducir').style.visibility = 'hidden';
    document.getElementById('expandir').style.display = 'inline-block';
    document.getElementById('expandir').style.visibility = 'visible';
}
function cambioFechaVencimiento() {
    const checkboxNoVencimiento = document.getElementById('checkboxNoVencimiento');
    const fechaVencimiento = document.getElementById('FechaVencimiento');
    const fechaVencimientoNunca = document.getElementById('FechaVencimientoNunca');
    const labelFechaVencimiento = document.getElementById('Vencimiento');
    const spanMensajeNoFecha = document.querySelector('.col-4 .Mensaje');

    checkboxNoVencimiento.addEventListener('change', () => {
        if (checkboxNoVencimiento.checked) {
            fechaVencimiento.style.display = 'none'; // Ocultar la fecha de vencimiento
            fechaVencimientoNunca.style.display = 'block'; // Mostrar el texto "Producto no perecedero"
            labelFechaVencimiento.textContent = 'Fecha Vencimiento clic:';
            fechaVencimiento.value = ''; // Asignar un valor vacío por defecto
            spanMensajeNoFecha.textContent = ''; // Cambia el contenido del span a vacío
        } else {
            fechaVencimiento.style.display = 'block'; // Mostrar la fecha de vencimiento
            labelFechaVencimiento.textContent = 'No Aplica:';
            fechaVencimientoNunca.style.display = 'none'; // Ocultar el texto "Producto no perecedero"
            spanMensajeNoFecha.textContent = '*';
        }
    });
}


/*Cantidad y datalist*/
document.addEventListener   ("DOMContentLoaded", function () {
    var inputCantidad = document.getElementById('Cantidad');
    var inputprecioCompra = document.getElementById('PrecioDeCompra');
    var inputprecioVentaxPresentacion = document.getElementById('PrecioDeVentaUnitario');
    var inputprecioVentaxUnidad = document.getElementById('PrecioDeVentaxUnidadPresentacion');
    var inputprecioVentaxUnidadPresentacion = document.getElementById('PrecioDeVentaPorUnidad');
    var inputPorcentaje = document.getElementById('PorcentajeGanancia');

    var btnMas = document.getElementById('btnMas');
    var btnMenos = document.getElementById('btnMenos');

    // Variables para almacenar el intervalo y el contador de incremento
    var intervalo;
    var contador = 0;

    // Función para incrementar la cantidad
    function incrementarCantidad() {
        var valorActual = parseInt(inputCantidad.value);
        if (valorActual < 99) { // Establecer el límite máximo
            inputCantidad.value = valorActual + 1;
        }
    }

    // Función para decrementar la cantidad
    function decrementarCantidad() {
        var valorActual = parseInt(inputCantidad.value);
        if (valorActual > 1) { // Establecer el límite mínimo
            inputCantidad.value = valorActual - 1;
        }
    }
    function formatoNumeroINT(input) {
        // Obtener el valor del input y quitar los puntos
        let cleanedValue = input.value.replace(/\./g, '');
        // Eliminar cualquier carácter que no sea número
        cleanedValue = cleanedValue.replace(/[^\d]/g, '');
        // Verificar si el valor es cero y reemplazarlo por uno si es necesario
        if (parseInt(cleanedValue, 10) === 0) {
            cleanedValue = '1';
        }
        // Formatear el valor con puntos para separar los miles
        const formattedValue = cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        // Asignar el valor formateado al campo
        input.value = formattedValue;
        
        // Llamar a la función de validación de campos
        validarCampos($(input));
    }

    // Función para iniciar el intervalo al mantener presionado el botón
    function iniciarIntervalo(funcion) {
        intervalo = setInterval(function () {
            contador++;
            if (contador > 5) { // Incremento más rápido después de cierto tiempo
                funcion();
            }
        }, 100); // Intervalo inicial de 100ms
    }

    // Función para detener el intervalo al soltar el botón
    function detenerIntervalo() {
        clearInterval(intervalo);
        contador = 0; // Reiniciar el contador al soltar el botón
    }

    // Asignar eventos de clic y mouse a los botones
    btnMas.addEventListener('mousedown', function () {
        iniciarIntervalo(incrementarCantidad);
    });

    btnMas.addEventListener('mouseup', detenerIntervalo);
    btnMas.addEventListener('mouseleave', detenerIntervalo);

    btnMenos.addEventListener('mousedown', function () {
        iniciarIntervalo(decrementarCantidad);
    });

    btnMenos.addEventListener('mouseup', detenerIntervalo);
    btnMenos.addEventListener('mouseleave', detenerIntervalo);

    // Asignar eventos de clic a los botones
    btnMas.addEventListener('click', incrementarCantidad);
    btnMenos.addEventListener('click', decrementarCantidad);

    // Evitar que se ingrese texto manualmente en el input
    // Agregar un evento de entrada al campo de cantidad
    inputCantidad.addEventListener('input', function () {
        // Eliminar cualquier carácter que no sea número, incluido el cero inicial
        this.value = this.value.replace(/[^\d]/g, '');
        // Verificar si el valor es cero y reemplazarlo por uno si es necesario
        if (parseInt(this.value, 10) === 0) {
            this.value = '1';
        }
    });

    // Agregar eventos de entrada a los inputs que necesitas formatear
    inputprecioCompra.addEventListener('input', function () {
        formatoNumeroINT(this);
    });
    inputPorcentaje.addEventListener('input', function () {
        formatoNumeroINT(this);
    });
    inputprecioVentaxPresentacion.addEventListener('input', function () {
        formatoNumeroINT(this);
    });
    inputprecioVentaxUnidad.addEventListener('input', function () {
        formatoNumeroINT(this);
    });
    inputprecioVentaxUnidadPresentacion.addEventListener('input', function () {
        formatoNumeroINT(this);
    });




 
    function seleccionarOpcion(input, dataList, hiddenInput, cantidadPorUnidadInput) {
        var selectedOption = Array.from(dataList.options).find(function (option) {
            return option.value === input.value;
        });

        if (selectedOption) {
            input.value = selectedOption.text; // Mostrar el nombre seleccionado
            hiddenInput.value = selectedOption.value; // Asignar el ID al campo oculto

            // Verificar si es el campo ProductoId
            if (input.id === 'ProductoId') {
                document.getElementById('CantidadPorPresentacionHidden').value = selectedOption.dataset.cantidad;
            }

            // Verificar si es el campo UnidadId
            if (input.id === 'UnidadId') {
                var cantidadPorUnidad = selectedOption.text.split(' x ')[1]; // Obtener la cantidad por unidad
                cantidadPorUnidadInput.value = cantidadPorUnidad; // Asignar la cantidad por unidad al campo hidden
            }
        } else if (!input.value.trim()) {
            // Mantener el valor actual si el campo de entrada está vacío
            input.value = '';
        }
    }

    // Asignar función de selección a los campos ProductoId y UnidadId 
    document.getElementById('ProductoId').addEventListener('input', function () {
        seleccionarOpcion(this, document.getElementById('productos'), document.getElementById('ProductoIdHidden'), document.getElementById('CantidadPorUnidad'));
    });

    document.getElementById('UnidadId').addEventListener('input', function () {
        seleccionarOpcion(this, document.getElementById('unidades'), document.getElementById('UnidadIdHidden'), document.getElementById('CantidadPorUnidad'));
    });

    document.getElementById('ProveedorId').addEventListener('input', function () {
        seleccionarOpcion(this, document.getElementById('proveedores'), document.getElementById('ProveedorIdHidden'));
    });

    // Función para formatear números enteros con puntos de mil
    function formatNumber(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
 
    // Agregar un evento de clic al botón "Calcular"
    document.getElementById('btnCalcular').addEventListener('click', () => {
        // Obtener los valores de los campos
        const productoId = document.getElementById('ProductoIdHidden').value;
        verificarProducto = productoId;
        const cantidad = document.getElementById('Cantidad').value;
        const precioCompraConPuntos = document.getElementById('PrecioDeCompra').value;
        const unidad = document.getElementById('CantidadPorUnidad').value;
        const cantidadPorPresentacion = document.getElementById('CantidadPorPresentacionHidden').value;
        const porcentajeAGanar = document.getElementById('PorcentajeGanancia').value;
        const producto = document.getElementById('ProductoId').value;
        const unidadId = document.getElementById('UnidadId').value;

        // Verificar si los campos requeridos están completos
        if (productoId === '' || precioCompraConPuntos === '' || producto === '' || unidadId === '' || porcentajeAGanar === '') {
            Swal.fire({
                position: "center",
                icon: 'warning',
                title: '¡Atencion!',
                html: '<p>Completa los campos: Producto, Unidad, Precio de Compra y % A Ganar.</p><p>Para poder realizar el calculo</p>',
                showConfirmButton: false, // Mostrar botón de confirmación
                timer: 6000

            });
            return;
        }
        if (cantidad === '') {
            Swal.fire({
                position: "center",
                icon: 'warning',
                title: '¡Atencion!',
                html: '<p>Cantidad no puede estar vacio.</p>',
                showConfirmButton: false, // Mostrar botón de confirmación
                timer: 6000

            });
            return;
        }


        const precioCompra = precioCompraConPuntos.replace(/\./g, '');
      
        /* Precio por unidad*/
        const precioPorUnidadIndividualSinPuntos = precioCompra / cantidad; 

        /*Precio por producto*/
        const cantidadUnitariaPorPresentacionSinPuntos = precioCompra / (unidad * cantidad);
        // Precio por unidad de producto
        const precioIndividualUnitarioSinPuntos = (precioCompra / unidad) / (cantidadPorPresentacion * cantidad);

        /* Precio venta por unidad*/
        const precioVentaIndividualUnitarioSinPuntos = precioPorUnidadIndividualSinPuntos + (precioPorUnidadIndividualSinPuntos * porcentajeAGanar / 100);
        /*Precio venta por producto*/
        const precioVentaPorPresentacionSinPuntos = cantidadUnitariaPorPresentacionSinPuntos + (cantidadUnitariaPorPresentacionSinPuntos * porcentajeAGanar / 100) ;
        // Precio venta  por unidad de producto
        const precioVentaPorUnidadDeProducto = precioIndividualUnitarioSinPuntos + (precioIndividualUnitarioSinPuntos * porcentajeAGanar / 100);
     
        const precioIndividualUnitario = formatNumber(Math.round(precioIndividualUnitarioSinPuntos));
        const cantidadUnitariaPorPresentacion = formatNumber(Math.round(cantidadUnitariaPorPresentacionSinPuntos));
        const precioPorUnidad = formatNumber(Math.round(precioPorUnidadIndividualSinPuntos));

        const precioVentaPorUnidad = formatNumber(Math.round(precioVentaIndividualUnitarioSinPuntos));
        const precioVentaPorProducto = formatNumber(Math.round(precioVentaPorPresentacionSinPuntos));
        const precioVentaIndividualUnitario = formatNumber(Math.round(precioVentaPorUnidadDeProducto));
        // Mostrar los resultados en los campos correspondientes
      
        document.getElementById('PrecioDeCompraPorPresentacion').value = cantidadUnitariaPorPresentacion;
        document.getElementById('PrecioDeCompraUnitario').value = precioIndividualUnitario;
        document.getElementById('PrecioDeCompraPorUnidad').value = precioPorUnidad;

        document.getElementById('PrecioDeVentaPorUnidad').value = precioVentaPorUnidad;   
        document.getElementById('PrecioDeVentaUnitario').value = precioVentaPorProducto;       
        document.getElementById('PrecioDeVentaxUnidadPresentacion').value = precioVentaIndividualUnitario;

        var mensajes = document.querySelectorAll('.Mensaje');

        // Iterar sobre los últimos tres mensajes de error
        for (var i = mensajes.length - 3; i < mensajes.length; i++) {
            var mensaje = mensajes[i];
            mensaje.textContent = ''; // Restaurar mensajes de error
            mensaje.style.display = 'inline-block'; // Establecer estilo si es necesario
        }

        document.getElementById('PrecioBuy').style.display = "flex";
        document.getElementById('PrecioBougth').style.display = "flex";


        // Aquí puedes realizar cualquier operación adicional con los valores calculados
    });
    document.getElementById('btnCalcularVenta').addEventListener('click', () => {
        // Obtener los valores de los campos
        const precioVentaxProductoConPuntos = document.getElementById('PrecioDeVentaUnitario').value;

        const precioVentaxProducto = precioVentaxProductoConPuntos.replace(/\./g, '');

        // Verificar si los campos requeridos están completos
        if (precioVentaxProducto === '') {
            alert('Ingresa un valor antes para poder hacer el calculo');
            return;
        }
        const cantidadPorPresentacion = document.getElementById('CantidadPorPresentacionHidden').value;
        const precioUnitarioPorPresentacion = formatNumber(Math.ceil(precioVentaxProducto / cantidadPorPresentacion));
        

        document.getElementById('PrecioDeVentaxUnidadPresentacion').value = precioUnitarioPorPresentacion;
    });
    document.getElementById('checkboxNoVencimiento').addEventListener('click', cambioFechaVencimiento);
});
