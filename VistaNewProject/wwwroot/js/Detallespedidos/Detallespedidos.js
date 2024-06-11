


var detallesdepedidp = [];

function agregarDetalle(url) {
    // Obtener los valores de los campos
    var unidadId = document.getElementById("unidadHidden").value;
    var cantidad = document.getElementById("CantidadTxt").value;
    var precioUnitario = document.getElementById("PrecioUnitario").value;
    var pedidoId = document.getElementById("PedidoId").value;

    // Crear el detalle del pedido
    var detalle = {
        PedidoId: pedidoId,
        LoteId: document.getElementById("LoteId").value,
        ProductoId: document.getElementById("ProductoId").value,
        Cantidad: cantidad,
        PrecioUnitario: precioUnitario,
        UnidadId: unidadId,
        Subtotal: cantidad * precioUnitario
    };

    // Validar el detalle del pedido
    var isValidDetalle = validarDetalle(detalle);

    // Si el detalle del pedido es válido, agregarlo y realizar las acciones necesarias
    if (isValidDetalle) {
        detallesdepedidp.push(detalle);
        mostrarDetallesPedido();
        enviarDetallePedido(detalle, url);
        mostrarDetallesActuales();
    }
}




function enviarDetallePedido(detalle, url) {
    fetch(url, {
        method: "POST",
        body: JSON.stringify(detalle),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error al enviar el detalle del pedido al servidor");
            }
            // Procesar la respuesta JSON recibida
            return response.json();
        })
        .then((data) => {
            console.log("Detalle del pedido enviado correctamente:", data.message);
            document.getElementById("ProductoId").value = "";
            document.getElementById("CantidadTxt").value = "";
            document.getElementById("PrecioUnitario").value = "";
            document.getElementById("UnidadId").value = "";
            document.getElementById("busqueda").value = "";
            document.getElementById("LoteId").value = "";
            document.getElementById("CantidadTxt").placeholder = "Ingrese cantidad"; // Aquí pones el placeholder que desees
            document.getElementById("unidadHidden").value = "";

            document.getElementById("ProductoIdtxt").value = ""; // Limpiar el campo de entrada de texto
            document.getElementById("ProductoId").value = ""; // Limpiar el campo oculto

        })
        .catch((error) => {
            console.error("Error al enviar el detalle del pedido al servidor:", error);
        });
}


function validarDetalle() {
    var cantidad = document.getElementById("CantidadTxt").value;
    var precio = document.getElementById("PrecioUnitario").value;
    var unidad = document.getElementById("UnidadId").value;
    var producto = document.getElementById("ProductoIdtxt").value;

    var isValid = true;

    if (!validarCantidad(cantidad)) {
        isValid = false;
    }

    if (!validarPrecioUnitario(precio)) {
        isValid = false;
    }

    if (!validarUnidad(unidad)) {
        isValid = false;
    }

    if (!validarProducto(producto)) {
        isValid = false;
    }

    return isValid;
}

function validarCantidad(cantidad) {
    var cantidadInput = document.getElementById('CantidadTxt');
    var cantidadError = document.getElementById("CantidadError");

    cantidad = cantidad.trim();

    if (cantidad === "") {
        mostrarError(cantidadInput, cantidadError, "El campo Cantidad no puede estar vacío.");
        return false;
    } else if (!/^[0-9]+$/.test(cantidad)) {
        mostrarError(cantidadInput, cantidadError, "El campo Cantidad solo puede contener números.");
        return false;
    } else {
        quitarError(cantidadInput, cantidadError);
        return true;
    }
}

function validarPrecioUnitario(precio) {
    var precioInput = document.getElementById('PrecioUnitario');
    var precioError = document.getElementById("PrecioUnitarioError");

    precio = precio.trim();

    if (precio === "") {
        mostrarError(precioInput, precioError, "El campo Precio Unitario no puede estar vacío.");
        return false;
    } else {
        quitarError(precioInput, precioError);
        return true;
    }
}

function validarUnidad(unidad) {
    var unidadInput = document.getElementById('UnidadId');
    var uni = document.getElementById('unidadHidden');

    var unidadError = document.getElementById("UnidadError");

    unidad = unidad.trim();

    if (unidad === "" ) {
        mostrarError(unidadInput, unidadError, "El campo Unidad no puede estar vacío.");
        return false;
    }
    if (!uni.value) {
        mostrarError(unidadInput, unidadError, "El campo Unidad no es el que  registrado.");
        return false;
    }
    else {
        quitarError(unidadInput, unidadError);
        return true;
    }
}

function validarProducto(producto) {
    var productoInput = document.getElementById('ProductoIdtxt');
    var prod = document.getElementById('ProductoId');
    var productoError = document.getElementById("ProductoIdError");

    producto = producto.trim();

    if (producto === "") {
        mostrarError(productoInput, productoError, "El campo Producto no puede estar vacío.");
        return false;
    }
    if (!prod.value ){
        mostrarError(productoInput, productoError, "El  Producto no es el que esta registrado de datos.");
        return false;
    } else {
        quitarError(productoInput, productoError);
        return true;
    }
}

function mostrarError(inputElement, errorElement, errorMessage) {
    inputElement.classList.add("is-invalid");
    errorElement.textContent = errorMessage;
}

function quitarError(inputElement, errorElement) {
    inputElement.classList.remove("is-invalid");
    errorElement.textContent = "";
}






function mostrarDetallesPedido() {
    var tablaDetalles = document.getElementById("listaDetallesPedido").getElementsByTagName("tbody")[0];
    tablaDetalles.innerHTML = "";

    var cantidadAcumuladaPorProducto = {};
    detallesdepedidp.forEach(function (detalle, index) {
        // Verificar si ya se ha agregado un detalle para este producto
        if (cantidadAcumuladaPorProducto.hasOwnProperty(detalle.ProductoId)) {
            // Si ya existe una cantidad acumulada para este producto, sumar la nueva cantidad
            cantidadAcumuladaPorProducto[detalle.ProductoId].Cantidad += parseFloat(detalle.Cantidad);
            cantidadAcumuladaPorProducto[detalle.ProductoId].Subtotal += parseFloat(detalle.Subtotal);
        } else {
            // Si es la primera vez que se encuentra este producto, almacenar sus detalles
            cantidadAcumuladaPorProducto[detalle.ProductoId] = {
                Cantidad: parseFloat(detalle.Cantidad),
                PrecioUnitario: parseFloat(detalle.PrecioUnitario),
                UnidadId: detalle.UnidadId,
                Subtotal: parseFloat(detalle.Subtotal),
                Index: index  // Guardar el índice para la eliminación
            };
        }
    });

    Object.keys(cantidadAcumuladaPorProducto).forEach(function (productoId) {
        var fila = tablaDetalles.insertRow();
        fila.insertCell(0).innerHTML = productoId; // ProductoId
        fila.insertCell(1).innerHTML = cantidadAcumuladaPorProducto[productoId].Cantidad; // Cantidad acumulada
        fila.insertCell(2).innerHTML = cantidadAcumuladaPorProducto[productoId].PrecioUnitario; // PrecioUnitario
        fila.insertCell(3).innerHTML = cantidadAcumuladaPorProducto[productoId].UnidadId; // UnidadId
        fila.insertCell(4).innerHTML = cantidadAcumuladaPorProducto[productoId].Subtotal; // Subtotal
        // Agregar un botón de eliminar en la última celda de cada fila
        var btnEliminar = document.createElement("button");
        btnEliminar.innerHTML = '<i class="fa-solid fa-trash-can"></i>'; // Icono de eliminación
        btnEliminar.onclick = function () {
            eliminarDetalle(cantidadAcumuladaPorProducto[productoId].Index);
        };
        fila.insertCell(5).appendChild(btnEliminar); // Insertar el botón en la última celda (índice 5)
    });
}
function eliminarDetalle(index) {
    console.log(index);
    $.ajax({
        url: '/DetallePedidos/EliminarDetalle',
        type: 'POST',
        data: JSON.stringify({ index: index }),
        contentType: 'application/json',
        success: function (response) {
            // Manejar la respuesta del servidor, como actualizar la interfaz de usuario
            console.log('Detalle eliminado exitosamente');
            // Eliminar el detalle de la lista detallesdepedidp
            detallesdepedidp.splice(index, 1);
            // Actualizar la tabla de detalles
            mostrarDetallesPedido();
            mostrarDetallesActuales(); // Actualizar los detalles mostrados en la tabla
        },
        error: function (xhr, status, error) {
            // Manejar errores, como mostrar un mensaje al usuario
            console.error('Error al eliminar el detalle:', error);
        }
    });
}

//function eliminarDetalle(id) {
//    console.log(id);
//    $.ajax({
//        url: '/DetallePedidos/EliminarDetalle',
//        type: 'POST',
//        data: JSON.stringify({ id: id }), // Cambia "index" a "id" si estás usando el id para identificar detalles
//        contentType: 'application/json',
//        success: function (response) {
//            // Manejar la respuesta del servidor, como actualizar la interfaz de usuario
//            console.log('Detalle eliminado exitosamente');
//            // Actualizar la tabla de detalles
//            mostrarDetallesActuales(); // Actualizar los detalles mostrados en la tabla
//        },
//        error: function (xhr, status, error) {
//            // Manejar errores, como mostrar un mensaje al usuario
//            console.error('Error al eliminar el detalle:', error);
//        }
//    });
//}


//// Función para obtener y mostrar los detalles actuales
//function mostrarDetallesPedido() {
//    var tablaDetalles = document.getElementById("listaDetallesPedido").getElementsByTagName("tbody")[0];
//    tablaDetalles.innerHTML = "";

//    detallesdepedidp.forEach(function (detalle, index) {
//        var fila = tablaDetalles.insertRow();
//        fila.insertCell(0).innerHTML = detalle.PedidoId;
//        fila.insertCell(1).innerHTML = detalle.ProductoId;
//        fila.insertCell(2).innerHTML = detalle.Cantidad;
//        fila.insertCell(3).innerHTML = detalle.PrecioUnitario;
//        fila.insertCell(4).innerHTML = detalle.UnidadId; // Aquí se muestra la unidad
//        fila.insertCell(5).innerHTML = detalle.Cantidad * detalle.PrecioUnitario; // Subtotal
//        // Agregar un botón de eliminar en la última celda de cada fila
//        var btnEliminar = document.createElement("button");
//        btnEliminar.innerHTML = '<i class="fa-solid fa-trash-can"></i>'; // Icono de eliminación
//        btnEliminar.onclick = function () {
//            eliminarDetalle(index);
//        };
//        fila.insertCell(6).appendChild(btnEliminar); // Insertar el botón en la última celda (índice 6)
//    });
//}

document.getElementById('ProductoId').addEventListener('change', async function () {
    var productoId = this.value;
    console.log("ProductoId seleccionado:", productoId);  // Para depuración

    try {
        var response = await fetch('/DetallePedidos/ObtenerLotesDisponibles?productoId=' + productoId);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        var data = await response.json();

      

        var datalist = document.getElementById('LoteList');
        datalist.innerHTML = '';

        // Actualizar el valor del campo PrecioUnitario con el precio del primer lote disponible
        if (data.length > 0) {
            document.getElementById('PrecioUnitario').value = data[0].precioPorPresentacion;
        } else {
            document.getElementById('PrecioUnitario').value = ''; // Limpiar el campo si no hay lotes disponibles
        }

        // Agregar opciones al datalist
        data.forEach(function (lote) {
            var option = document.createElement('option');
            option.value = lote.loteId;
            option.textContent = lote.numeroLote;
            datalist.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching lotes disponibles:', error);
    }
});



$(document).ready(function () {
    // Función para cargar los productos
    function cargarProductos() {
        let query = $('#busqueda').val(); // Captura el valor del input
        fetch(`https://localhost:7013/api/Productos/GetProductos?busqueda=${query}`, {
            method: 'GET', // Especifica el método de la solicitud
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json()) // Convierte la respuesta a JSON
            .then(data => {
                $('#ProductosList').empty(); // Limpia la lista de productos
                $.each(data, function (index, producto) {
                    $('#ProductosList').append('<option value="' + producto.nombreProducto + '" data-id="' + producto.productoId + '"></option>');
                });
            })
            .catch(error => {
                console.log(error); // Muestra el error en la consola
            });
    }

    // Cargar productos al cargar la vista
    cargarProductos();

    // Evento para cargar productos al escribir en el campo de búsqueda
    $('#busqueda').on('input', function () {
        cargarProductos();
    });

    // Evento para capturar la selección del producto del datalist
    // Evento para capturar la selección del producto del datalist
    $('#ProductoIdtxt').on('input', function () {
        const input = $(this).val();
        const selectedOption = $('#ProductosList option').filter(function () {
            return $(this).val() === input || $(this).data('id') == input;
        });

        if (selectedOption.length > 0) {
            const idSeleccionado = selectedOption.attr('data-id');

            console.log("ProductoId seleccionado:", idSeleccionado);

            $('#ProductoId').val(idSeleccionado);

            // Asignar el ID del producto al campo oculto
            obtenerDetallesProducto(idSeleccionado);
        } else {
            limpiarDetallesProducto(); // Limpiar detalles del producto si no se selecciona ninguno
        }
    });

   
       



    // Función para obtener y mostrar los detalles del producto seleccionado
    function obtenerDetallesProducto(productId) {


        fetch(`https://localhost:7013/api/Productos/GetNombreProductoPorId/${productId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text(); // Cambiar response.json() por response.text()
            })
            .then(data => {
                console.log("Nombre del producto:", data);
                $('#ProductoIdtxt').val(data.trim());
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });


        // Llamada a la API para obtener los lotes del producto
        fetch(`https://localhost:7013/api/Lotes/GetLotes`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los lotes del producto');
                }
                return response.json();
            })
            .then(data => {
                // Filtrar los lotes por productId seleccionado
                const lotesProducto = data.filter(lote => lote.productoId == productId);
                if (lotesProducto.length > 0) {
                    // Encontrar el lote con la fecha de vencimiento más próxima y con cantidad disponible mayor que cero
                    let loteProximoVencimiento = null;
                    for (const lote of lotesProducto) {
                        if (lote.cantidad > 0 && lote.estadoLote!=0) {
                            if (loteProximoVencimiento === null || new Date(lote.fechaVencimiento) < new Date(loteProximoVencimiento.fechaVencimiento)) {
                                loteProximoVencimiento = lote;
                            }
                        }
                    }

                    if (loteProximoVencimiento !== null) {
                        const precio = loteProximoVencimiento.precioPorPresentacion; // Ajusta esta propiedad según la estructura real
                        $('#PrecioUnitario').val(precio);
                        $('#LoteId').val(loteProximoVencimiento.loteId); // Asigna el ID del lote al campo LoteId
                    } else {
                        // Si no se encontró ningún lote con cantidad disponible mayor que cero
                        $('#PrecioUnitario').val('');
                        $('#LoteId').val('');
                    }
                } else {
                    // Manejar el caso en que no se encuentren lotes
                    $('#PrecioUnitario').val('');
                    $('#LoteId').val('');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al obtener los lotes del producto');
            });

        // Llamada a la API de productos para obtener la cantidad total y establecer el marcador de posición
        fetch(`https://localhost:7013/api/Productos/GetProductos`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los productos');
                }
                return response.json();
            })
            .then(data => {

                // Filtrar los productos por productId seleccionado
                const productoSeleccionado = data.find(producto => producto.productoId == productId);
                const unidadId = productoSeleccionado.unidadId;

                if (productoSeleccionado) {

                    const cantidadTotal = productoSeleccionado.cantidadTotal;
                    const cantidadReservada = productoSeleccionado.cantidadReservada;
                    const cantidadDisponible = cantidadTotal - cantidadReservada;



                    if (cantidadDisponible > 0) {
                        // Mostrar la cantidad total como marcador de posición en el campo "Cantidad"
                        $('#CantidadTxt').attr('placeholder', `Disponible: ${cantidadDisponible}`);
                    } else {
                        // Si la cantidad disponible es cero, mostrar el mensaje apropiado en el marcador de posición
                        $('#CantidadTxt').attr('placeholder', 'No hay productos disponibles');
                    }
                } else {
                    // Si no se encuentra ningún producto con el productId seleccionado, mostrar un mensaje
                    $('#CantidadTxt').attr('placeholder', '');
                }

            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al obtener los productos');
            });





        fetch(`https://localhost:7013/api/Unidades/GetUnidades`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los productos');
                }
                return response.json();
            })
            .then(data => {
                const dataList = document.getElementById('UnidadIdList');
                dataList.innerHTML = ''; // Limpiar opciones existentes



                data.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.nombreUnidad; // Utiliza el nombre de la unidad para el valor visible
                    option.setAttribute('data-id', item.unidadId); // Guarda el ID de la unidad como un atributo data-id
                    dataList.appendChild(option);

                  
                });


             
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al obtener los productos');
            });

      
    }


    $(document).ready(function () {
        $('#UnidadId').on('input', function () {
            var selectedValue = $(this).val();
            var selectedOption = $('#UnidadIdList option').filter(function () {
                return $(this).val() === selectedValue || $(this).data('id') === selectedValue;
            }).first();

            if (selectedOption.length > 0) {
                var unidadId = selectedOption.attr('data-id');
                console.log("ID de la unidad seleccionada:", unidadId);
                $('#unidadHidden').val(unidadId);
            } else if (!isNaN(selectedValue) && selectedValue !== '') { // Verificar si el valor ingresado es un número
                fetch(`https://localhost:7013/api/Unidades/GetunidadPorId/${selectedValue}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.text();
                    })
                    .then(data => {
                        console.log("Nombre de la unidad:", data);
                        $('#UnidadId').val(data.trim());
                        $('#unidadHidden').val(selectedValue);
                    })
                    .catch(error => {
                        console.error('There has been a problem with your fetch operation:', error);
                    });
            } else {
                $('#unidadHidden').val(''); // Limpiar el campo oculto si no se encuentra ninguna unidad que coincida
            }
        });
    });


    // Función para limpiar los detalles del producto
    function limpiarDetallesProducto() {
        $('#PrecioUnitario').val('');
        $('#ProductoId').val('');
        $('#ProductoIdtxt').val('');
        $('#ProductosList').val('');
        $('#CantidadTxt').attr('placeholder', '');
        $('#LoteId').val('');
    }

    // Evento input para el campo "Cantidad"
    $('#CantidadTxt').on('input', function () {
        const cantidadIngresada = parseFloat($(this).val()); // Convertir el valor a un número flotante
        const cantidadDisponible = parseFloat($('#CantidadTxt').attr('placeholder').split(':')[1].trim());

        if (isNaN(cantidadIngresada)) {
            // Si la cantidad ingresada no es un número válido, mostrar mensaje de error
            $('#CantidadTxt').addClass('input-validation-error'); // Agregar la clase de error al campo
            $('span[data-valmsg-for="CantidadTxt"]').text('Por favor, ingrese una cantidad válida'); // Mostrar el mensaje de error
            $('#CantidadTxt').addClass('is-invalid'); // Agregar la clase de error al campo para los estilos de Bootstrap
            $('#btnEnviar').prop('disabled', true); // Deshabilitar el botón de enviar
        } else if (cantidadIngresada > cantidadDisponible) {
            // Si la cantidad ingresada es mayor que la cantidad disponible, mostrar mensaje de error
            $('#CantidadTxt').addClass('input-validation-error');
            // Agregar la clase de error al campo
            $('span[data-valmsg-for="Cantidad"]').text('La cantidad ingresada no puede ser mayor que la cantidad disponible');
            $('#btnEnviar').prop('disabled', true); // Deshabilitar el botón de enviar
            $('#CantidadTxt').addClass('is-invalid'); // Agregar la clase de error al campo para los estilos de Bootstrap
        } else if (cantidadIngresada <= 0) {
            // Si la cantidad ingresada es menor o igual a 0, mostrar mensaje de error
            $('#CantidadTxt').addClass('input-validation-error');
            // Agregar la clase de error al campo
            $('span[data-valmsg-for="CantidadTxt"]').text('La cantidad ingresada no puede ser menor o igual a 0');
            $('#btnEnviar').prop('disabled', true); // Deshabilitar el botón de enviar
            $('#CantidadTxt').addClass('is-invalid'); // Agregar la clase de error al campo para los estilos de Bootstrap
        } else {
            // Si la cantidad ingresada es válida, quitar la clase de error del campo
            $('#CantidadTxt').removeClass('input-validation-error');
            // Quitar el mensaje de error
            $('span[data-valmsg-for="CantidadTxt"]').text('');
            // Quitar la clase de error del campo para los estilos de Bootstrap
            $('#CantidadTxt').removeClass('is-invalid');
            // Habilitar el botón de enviar
            $('#btnEnviar').prop('disabled', false);
        }
    });


})
    


// Evento input para el campo "ProductoId"
$('#ProductoId').on('input', function () {
    const productId = $(this).val();
    console.log('ProductoId seleccionado:', productId);
    if (productId) {
        // Si hay un productId seleccionado, obtener y mostrar los detalles del producto
    } else {
        // Si el campo está vacío, limpiar los campos relacionados
        $('#PrecioUnitario').val('');
        $('#CantidadTxt').attr('placeholder', '');
    }
});

function mostrarDetallesActuales() {
    // Realizar una solicitud al servidor para obtener la lista global de detalles
    $.get('/DetallePedidos/ObtenerDetalles', function (data) {
        // Mostrar los detalles en la consola
        console.log('Detalles actuales:', data);
    });
}


