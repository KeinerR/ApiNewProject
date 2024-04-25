﻿
    // Objeto de compra
    var compra = {
        proveedorId: 0,
        numeroFactura: 0,
        fechaCompra: new Date().toISOString(), // Obtener la fecha actual en formato ISO
        valorTotalCompra: 0,
        estadoCompra: 0,
        detallecompras: []
    };

    // Función para limpiar el formulario
    function LimpiarFormulario() {
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
        document.getElementById('NumeroLote').value = '';
        document.getElementById('PrecioBougth').style.display = 'none';
        document.getElementById('PrecioBuy').style.display = 'none';
        document.getElementById('TablaDetalles').style.display= 'flex';

    }
// Función para registrar la compra

function RegistrarBuy() {
    // Verificar si la compra es nula o no tiene detalles
    if (compra === null || compra.detallecompras.length === 0) {
        console.error('No se puede guardar una compra sin detalles.');
        return;
    }
    alert(compra.detallecompras[0].unidadId)

    // Enviar la solicitud POST al servidor utilizando la Fetch API
    fetch('https://localhost:7013/api/Compras/InsertCompras', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(compra)
    })
        .then(response => {
            if (response.ok) {
                alert('Compra guardada correctamente.');
                location.reload(true); // Recargar la página después de la actualización
            } else {
                console.log(compra);
                alert("Error en la actualización. Por favor, inténtalo de nuevo más tarde.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Error en la actualización. Por favor, inténtalo de nuevo más tarde.");
        });
};

  
    /*Funcion para asignar la hora actual al campo  */
    function setHoraActual() {
        // Obtener la hora actual con Moment.js
        var fechaHoraActual = moment().format('YYYY-MM-DDTHH:mm');

        // Asignar la fecha y hora actual al campo datetime-local
        document.getElementById('FechaCompra').value = fechaHoraActual;
    }   

    // Llamar a setHoraActual al cargar la página para mostrar la hora actual en ek campo de fecha compra
    setHoraActual();
    // Función para mostrar los detalles de la compra en la tabla

    // Función para agregar productos a la compra
    function agregarProductos() {
        // Obtener los valores de los campos del formulario
        var proveedorId = document.getElementById('ProveedorId').value;
        var numeroFactura = document.getElementById('NumeroFactura').value;
        var fechaCompra = document.getElementById('FechaCompra').value;
  

        // Validar que se hayan ingresado los datos requeridos
        if (!proveedorId || !numeroFactura || !fechaCompra ) {
            alert('Por favor complete todos los campos.');
            return;
        }

        // Actualizar los valores del objeto compra
        compra.proveedorId = proveedorId;
        compra.numeroFactura = numeroFactura;
        compra.fechaCompra = fechaCompra;

        // Mostrar y ocultar elementos según sea necesario
        document.getElementById('DetallesCompra').style.display = 'block';
        document.getElementById('verCompra').style.display = 'block';
        document.getElementById('PrincipalCompra').style.display = 'none';
        document.getElementById('tituloModal').style.display = 'none';
        document.getElementById('subTituloModal').style.display = 'block';
        document.getElementById('agregarDetalle').style.display = 'none';
        document.getElementById('expandir').style.display = 'inline-block';
        document.getElementById('expandir').style.visibility = 'visible';
   
    }


    // Función para agregar un detalle de compra al objeto principal
    function agregarDetalleCompra() {
        var unidad = document.getElementById('UnidadIdHidden').value
        var unidadParse = parseInt(unidad);
        alert("El valor de unidad es:" + unidad);
        if (Number.isInteger(unidadParse)) { alert("Es entero"); }
        // Crear un nuevo objeto detalleCompra en cada llamada para evitar referencias compartidas
        var detalleCompra = {
            productoId: document.getElementById('ProductoIdHidden').value,
            unidadId: unidadParse,
            cantidad: document.getElementById('Cantidad').value,
            lotes: [] // Inicialmente sin lotes
        };

        var numeroLote = document.getElementById('NumeroLote').value;
        var precioCompra = document.getElementById('PrecioDeCompra').value.replace(/\./g, '');
        var precioVentaxProducto = document.getElementById('PrecioDeVentaUnitario').value.replace(/\./g, '');
        var precioVentaxPresentacion = document.getElementById('PrecioDeVentaxUnidadPresentacion').value.replace(/\./g, '');
        var cantidadPresentacion = document.getElementById('CantidadPorPresentacionHidden').value;
        var cantidadUnidad = document.getElementById('CantidadPorUnidad').value;
        var cantidadLote = detalleCompra.cantidad * (cantidadPresentacion * cantidadUnidad);
        var fechaVencimiento = document.getElementById('FechaVencimiento').value
        // Validar la fecha de vencimiento
        if (!fechaVencimiento || isNaN(new Date(fechaVencimiento))) {
            // Si la fecha no es de tipo date time o es nula, establecerla en '00-00-0000 00:00'
            fechaVencimiento = '2000-01-01T00:00';
        }
       
        var nuevoLote = {
            productoId: detalleCompra.productoId,
            numeroLote: numeroLote,
            precioCompra: precioCompra,
            precioPorPresentacion: precioVentaxProducto,
            precioPorUnidad: precioVentaxPresentacion,
            fechaVencimiento: fechaVencimiento,
            cantidad: cantidadLote,
            estadoLote: 1 // Estado por defecto
        };

        detalleCompra.lotes.push(nuevoLote);
        compra.detallecompras.push(detalleCompra);

        LimpiarFormulario();
        agregarFilaDetalle(detalleCompra); // Llama a la función para agregar la fila de detalle a la tabla
    }

    // Función para agregar una fila de detalle a la tabla
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
    var proveedorId = document.getElementById('ProveedorId').value;
    var numeroFactura = document.getElementById('NumeroFactura').value;
    var fechaCompra = document.getElementById('FechaCompra').value;

    if (!proveedorId || !numeroFactura || !fechaCompra ) {
        alert('Por favor complete todos los campos.');
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
function volverARegistrarCompra() {
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
    document.getElementById('UnidadIdHidden').value = '';
    document.getElementById('CantidadPorUnidad').value = '';
    document.getElementById('PrecioDeCompraPorPresentacion').value = '';
    document.getElementById('PrecioDeCompraUnitario').value = '';
    document.getElementById('PrecioDeCompraPorUnidad').value = '';

    setHoraActual();
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


/*Cantidad y datalist*/
document.addEventListener("DOMContentLoaded", function () {
    var inputCantidad = document.getElementById('Cantidad');
    var inputprecioCompra = document.getElementById('PrecioDeCompra');
    var inputprecioVentaxPresentacion = document.getElementById('PrecioDeVentaUnitario');
    var inputprecioVentaxUnidad = document.getElementById('PrecioDeVentaxUnidadPresentacion');

   
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

    // Agregar un evento de entrada al campo de precio de compra
    // Agregar eventos de entrada a los inputs que necesitas formatear
    inputprecioCompra.addEventListener('input', function () {
        formatoNumeroINT(this);
    });
    inputprecioVentaxPresentacion.addEventListener('input', function () {
        formatoNumeroINT(this);
    });
    inputprecioVentaxUnidad.addEventListener('input', function () {
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

    // Función para formatear números enteros con puntos de mil
    function formatNumber(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
 
    // Agregar un evento de clic al botón "Calcular"
    document.getElementById('btnCalcular').addEventListener('click', () => {
        // Obtener los valores de los campos
        const productoId = document.getElementById('ProductoIdHidden').value;
        const cantidad = document.getElementById('Cantidad').value;
        const precioCompraConPuntos = document.getElementById('PrecioDeCompra').value;
        const unidad = document.getElementById('CantidadPorUnidad').value;
        const cantidadPorPresentacion = document.getElementById('CantidadPorPresentacionHidden').value;
        const porcentajeAGanar = document.getElementById('PorcentajeGanancia').value;
        // Verificar si los campos requeridos están completos
        if (productoId === '' || cantidad === '' || precioCompraConPuntos === '') {
            alert('Completa los campos para poder calcular' + productoId + '--Canridad-' + cantidad + '-PrecioC-' + precioCompraConPuntos + '-Unidad-' + unidad + '-Cantidadpoep-' + cantidadPorPresentacion);
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
        const precioVentaIndividualUnitarioSinPuntos = (cantidadUnitariaPorPresentacionSinPuntos * porcentajeAGanar) / 100;

        /*Precio venta por producto*/
        const precioVentaPorPresentacionSinPuntos = ( * porcentajeAGanar) / 100;
        // Precio venta  por unidad de producto

        const precioVentaPorUnidadDeProducto = (precioIndividualUnitarioSinPuntos * porcentajeAGanar) / 100;
     
        const precioIndividualUnitario = formatNumber(Math.round(precioIndividualUnitarioSinPuntos));
        const cantidadUnitariaPorPresentacion = formatNumber(Math.round(cantidadUnitariaPorPresentacionSinPuntos));
        const precioPorUnidad = formatNumber(Math.round(precioPorUnidadIndividualSinPuntos));
        const precioVentaIndividualUnitario = 22000;
        // Mostrar los resultados en los campos correspondientes
      
        document.getElementById('PrecioDeCompraPorPresentacion').value = cantidadUnitariaPorPresentacion;
        document.getElementById('PrecioDeCompraUnitario').value = precioIndividualUnitario;
        document.getElementById('PrecioDeCompraPorUnidad').value = precioPorUnidad;
        document.getElementById('PrecioDeVentaPorUnidad').value = precioVentaPorPresentacionSinPuntos;   
        document.getElementById('PrecioDeVentaUnitario').value = precioVentaIndividualUnitario;       
        document.getElementById('PrecioDeVentaxUnidadPresentacion').value = precioVentaIndividualUnitario;
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
        const precioUnitarioPorPresentacion = Math.ceil(precioVentaxProducto / cantidadPorPresentacion);

        document.getElementById('PrecioDeVentaxUnidadPresentacion').value = precioUnitarioPorPresentacion;
    });
    /*Fecha de vencimiento*/
    const checkboxNoVencimiento = document.getElementById('checkboxNoVencimiento');
    const fechaVencimiento = document.getElementById('FechaVencimiento');
    const fechaVencimientoNunca = document.getElementById('FechaVencimientoNunca');
    const labelFechaVencimiento = document.getElementById('Vencimiento');
    checkboxNoVencimiento.addEventListener('change', () => {
        if (checkboxNoVencimiento.checked) {
            fechaVencimiento.style.display = 'none'; // Ocultar la fecha de vencimiento
            fechaVencimientoNunca.style.display = 'block'; // Mostrar el texto "Producto no perecedero"
            labelFechaVencimiento.textContent = 'Fecha Vencimiento clic:';
            fechaVencimiento.value = ''; // Asignar un valor vacío por defecto
        } else {
            fechaVencimiento.style.display = 'block'; // Mostrar la fecha de vencimiento
            labelFechaVencimiento.textContent = 'No Aplica:';
            fechaVencimientoNunca.style.display = 'none'; // Ocultar el texto "Producto no perecedero"
        }
    });
});
