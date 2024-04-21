var compra = {
    proveedorId: 0,
    numeroFactura: 0,
    fechaCompra: new Date().toISOString(), // Obtener la fecha actual en formato ISO
    valorTotalCompra: 0,
    estadoCompra: 0,
    detallecompras: [
        {
            compraId: 0,
            productoId: 0,
            unidadId: 0,
            cantidad: 0,
            lotes: [
                {
                    detalleCompraId: 0,
                    productoId: 0,
                    numeroLote: 'string',
                    precioCompra: 0,
                    precioPorPresentacion: 0,
                    precioPorUnidad: 0,
                    fechaVencimiento: new Date().toISOString(), // Obtener la fecha actual en formato ISO
                    cantidad: 0,
                    estadoLote: 0
                }
            ]
        }
    ]
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
}

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
    var numeroLote = document.getElementById('NumeroLote').value;

    // Validar que se hayan ingresado los datos requeridos
    if (!proveedorId || !numeroFactura || !fechaCompra || !numeroLote) {
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

    // Imprimir los valores de compra y lote en la consola (para depuración)
    console.log(compra);
}

// Función para agregar un detalle de compra al objeto principal
function agregarDetalleCompra() {
    // Crear un nuevo objeto detalleCompra en cada llamada para evitar referencias compartidas
    var detalleCompra = {
        compraId: compra.compraId,
        productoId: document.getElementById('ProductoIdHidden').value,
        unidadId: document.getElementById('UnidadIdHidden').value,
        cantidad: document.getElementById('Cantidad').value,
        lotes: [] // Inicialmente sin lotes
    };

    var numeroLote = document.getElementById('NumeroLote').value;
    var precioCompra = document.getElementById('PrecioDeCompra').value.replace(/\./g, '');
    var precioVentaxProducto = document.getElementById('PrecioDeVentaUnitario').value.replace(/\./g, '');
    var precioVentaxPresentacion = document.getElementById('PrecioDeVentaxUnidadPresentacion').value.replace(/\./g, '');
    var cantidadPresentacion = document.getElementById('CantidadPorPresentacionHidden').value;
    var cantidadLote = detalleCompra.cantidad * cantidadPresentacion;

    var nuevoLote = {
        detalleCompraId: detalleCompra.detalleCompraId,
        productoId: detalleCompra.productoId,
        numeroLote: numeroLote,
        precioCompra: precioCompra,
        precioPorPresentacion: precioVentaxProducto,
        precioPorUnidad: precioVentaxPresentacion,
        fechaVencimiento: document.getElementById('FechaVencimiento').value,
        cantidad: cantidadLote,
        estadoLote: 1 // Estado por defecto
    };

    detalleCompra.lotes.push(nuevoLote);
    compra.detallecompras.push(detalleCompra);

    console.log(compra);
    LimpiarFormulario();
    agregarFilaDetalle(detalleCompra); // Llama a la función para agregar la fila de detalle a la tabla
    insertarCompraAPI(compra); // Llama a la función para insertar la compra en el API
}

function insertarCompraAPI(compra) {
    // URL del endpoint API para insertar compras
    var apiUrl = 'https://localhost:7013/api/Compras/InsertCompras';

    // Opciones de la solicitud POST
    var requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(compra) // Convertir el objeto compra a JSON
    };

    // Enviar la solicitud fetch
    fetch(apiUrl, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al insertar la compra');
            }
            return response.json(); // Convertir la respuesta a JSON
        })
        .then(data => {
            console.log('Compra insertada exitosamente:', data);
            // Aquí puedes realizar otras acciones después de insertar la compra
        })
        .catch(error => {
            console.error('Error al insertar la compra:', error);
            // Aquí puedes manejar el error de inserción de compra
        });
}

// Función para agregar un detalle de compra al objeto principal
function agregarDetalleCompra() {
    // Crear un nuevo objeto detalleCompra en cada llamada para evitar referencias compartidas
    var detalleCompra = {
        detalleCompraId: compra.detallecompras.length + 1,
        compraId: compra.compraId,
        productoId: document.getElementById('ProductoIdHidden').value,
        unidadId: document.getElementById('UnidadIdHidden').value,
        cantidad: document.getElementById('Cantidad').value,
        lotes: [] // Inicialmente sin lotes
    };

    var numeroLote = document.getElementById('NumeroLote').value;
    var precioCompra = document.getElementById('PrecioDeCompra').value.replace(/\./g, '');
    var precioVentaxProducto = document.getElementById('PrecioDeVentaUnitario').value.replace(/\./g, '');
    var precioVentaxPresentacion = document.getElementById('PrecioDeVentaxUnidadPresentacion').value.replace(/\./g, '');
    var cantidadPresentacion = document.getElementById('CantidadPorPresentacionHidden').value;
    var cantidadLote = detalleCompra.cantidad * cantidadPresentacion;

    var nuevoLote = {
        loteId: detalleCompra.lotes.length + 1,
        detalleCompraId: detalleCompra.detalleCompraId,
        productoId: detalleCompra.productoId,
        numeroLote: numeroLote,
        precioCompra: precioCompra,
        precioPorPresentacion: precioVentaxProducto,
        precioPorUnidad: precioVentaxPresentacion,
        fechaVencimiento: document.getElementById('FechaVencimiento').value,
        cantidad: cantidadLote,
        estadoLote: 1 // Estado por defecto
    };

    detalleCompra.lotes.push(nuevoLote);
    compra.detallecompras.push(detalleCompra);

    console.log(compra);
    LimpiarFormulario();
    agregarFilaDetalle(detalleCompra); // Llama a la función para agregar la fila de detalle a la tabla
    insertarCompraAPI(compra); // Llama a la función para insertar la compra en el API
}

// Función para agregar una fila de detalle a la tabla
function agregarFilaDetalle(detalleCompra) {
    // Obtener la tabla y el cuerpo de la tabla
    var detalleTable = document.getElementById('detalleTable');
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
}

function eliminarFilaDetalle(button) {
    var row = button.parentNode.parentNode; // Obtener la fila de la tabla
    var indice = row.getAttribute('data-indice'); // Obtener el índice de la fila

    // Obtener el detalle de compra y el lote asociado a través del índice
    var detalleEliminado = compra.detallecompras[indice];
    var loteEliminar = detalleCompra.lotes[indice];

    // Eliminar el detalle de compra y el lote asociado del objeto compra
    compra.detallecompras.splice(indice, 1);

    // Eliminar el lote asociado del objeto detalleCompra solo si existe
    if (loteEliminar) {
        detalleCompra.lotes.splice(indice, 1);
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
    var nuevoNumeroLote = document.getElementById('NumeroLote').value; // Nuevo número de lote

    if (!proveedorId || !numeroFactura || !fechaCompra || !nuevoNumeroLote) {
        alert('Por favor complete todos los campos.');
        return;
    }

    // Actualizar los valores de la compra
    compra.proveedorId = proveedorId;
    compra.numeroFactura = numeroFactura;
    compra.fechaCompra = fechaCompra;

    // Actualizar el número de lote en todos los lotes asociados a la compra
    compra.detallecompras.forEach(function (detalle) {
        detalle.lotes.forEach(function (lote) {
            lote.numeroLote = nuevoNumeroLote;
        });
    });

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
    document.getElementById('PrecioDeCompraPorPresentacion').value = '';
    document.getElementById('PrecioDeCompraUnitario').value = '';
    
    

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

    // Asignar eventos de clic a los botones
    btnMas.addEventListener('mousedown', function () {
        intervalo = setInterval(function () {
            contador++;
            if (contador > 5) { // Incremento más rápido después de cierto tiempo
                incrementarCantidad();
            }
        }, 100); // Intervalo inicial de 100ms
    });

    btnMas.addEventListener('mouseup', function () {
        clearInterval(intervalo);
        contador = 0; // Reiniciar el contador al soltar el botón
    });

    btnMenos.addEventListener('mousedown', function () {
        intervalo = setInterval(function () {
            contador++;
            if (contador > 5) { // Decremento más rápido después de cierto tiempo
                decrementarCantidad();
            }
        }, 100); // Intervalo inicial de 100ms
    });

    btnMenos.addEventListener('mouseup', function () {
        clearInterval(intervalo);
        contador = 0; // Reiniciar el contador al soltar el botón
    });

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
        const unidadId = document.getElementById('UnidadIdHidden').value;
        const cantidad = document.getElementById('Cantidad').value;
        const precioCompraConPuntos = document.getElementById('PrecioDeCompra').value;
       
        // Verificar si los campos requeridos están completos
        if (productoId === '' || unidadId === '' || cantidad === '' || precioCompraConPuntos === '') {
            alert('Completa los campos para poder calcular');
            return;
        }

        const precioCompra = precioCompraConPuntos.replace(/\./g, '');
      

        const unidad = document.getElementById('CantidadPorUnidad').value;
        const cantidadPorPresentacion = document.getElementById('CantidadPorPresentacionHidden').value;


        // Calcular el precio individual unitario y la cantidad unitaria por presentación
        const precioIndividualUnitarioSinPuntos = precioCompra / (cantidadPorPresentacion * cantidad);
        const cantidadUnitariaPorPresentacionSinPuntos = precioCompra / (unidad * cantidad);

        const precioIndividualUnitario = formatNumber(Math.round(precioIndividualUnitarioSinPuntos));
        const cantidadUnitariaPorPresentacion = formatNumber(Math.round(cantidadUnitariaPorPresentacionSinPuntos));
        // Mostrar los resultados en los campos correspondientes
        document.getElementById('PrecioDeCompraUnitario').value = precioIndividualUnitario;
        document.getElementById('PrecioDeCompraPorPresentacion').value = cantidadUnitariaPorPresentacion;

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
        console.log(precioUnitarioPorPresentacion );
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
            labelFechaVencimiento.textContent = 'Fecha Vencimiento? :';
            fechaVencimiento.value = ''; // Asignar un valor vacío por defecto
        } else {
            fechaVencimiento.style.display = 'block'; // Mostrar la fecha de vencimiento
            labelFechaVencimiento.textContent = 'No perecedero:';
            fechaVencimientoNunca.style.display = 'none'; // Ocultar el texto "Producto no perecedero"
        }
    });

  

   
});

