



var detallesdepedidp = [];

function agregarDetalle(url) {
    var unidadId = document.getElementById("unidadHidden").value;
    var cantidad = document.getElementById("CantidadPorUnidad").value;
    var precioUnitario = document.getElementById("PrecioEnviar").value;
    var pedidoId = document.getElementById("PedidoId").value;

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

    if (isValidDetalle) {
        detallesdepedidp.push(detalle);
        mostrarDetallesPedido();
        enviarDetallePedido(detalle, url);
        mostrarDetallesActuales();
    }
}

function validarDetalle(detalle) {
    var isValid = true;

 
    if (!validarPrecioUnitario(detalle.PrecioUnitario)) {
        isValid = false;
    }

    if (!validarUnidad(detalle.UnidadId)) {
        isValid = false;
    }
    if (!validarCantidad(detalle.Cantidad)) {
        isValid = false;
    }
   
    return isValid;
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
            return response.json();
        })
        .then((data) => {
            console.log("Detalle del pedido enviado correctamente:", data.message);
            limpiarCampos();
        })
        .catch((error) => {
            console.error("Error al enviar el detalle del pedido al servidor:", error);
        });
}

function limpiarCampos() {
    document.getElementById("ProductoId").value = "";
    document.getElementById("CantidadTxt").value = "";
    document.getElementById("PrecioUnitario").value = "";
    document.getElementById("UnidadId").value = "";
    document.getElementById("LoteId").value = "";
    document.getElementById("busqueda").value = "";
    document.getElementById("CantidadTxt").placeholder = "Ingrese cantidad";
    document.getElementById("unidadHidden").value = "";

    document.getElementById("ProductoIdtxt").value = ""; // Limpiar el campo de entrada de texto
    document.getElementById("ProductoId").value = ""; // Limpiar el campo oculto
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
function validarCantidad(Cantidad) {
    var precioInput = document.getElementById('CantidadTxt');
    var precioError = document.getElementById("CantidadError");

    Cantidad = Cantidad.trim();

    if (Cantidad === "") {
        mostrarError(precioInput, precioError, "El campo campo cantidad  no puede estar vacío.");
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

    if (unidad === "") {
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


function mostrarError(inputElement, errorElement, errorMessage) {
    inputElement.classList.add("is-invalid");
    errorElement.textContent = errorMessage;
}


function quitarError(inputElement, errorElement) {
    if (inputElement && errorElement) {
        inputElement.classList.remove("is-invalid");
        errorElement.textContent = "";
    } else {
        console.error("Elemento de entrada o elemento de error es null.");
    }
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
    $('#ProductoIdtxt').on('input', function () {
        const input = $(this).val();
        const selectedOption = $('#ProductosList option').filter(function () {
            return $(this).val() === input || $(this).data('id') == input;
        });

        if (selectedOption.length > 0) {
            const idSeleccionado = selectedOption.attr('data-id');
            const nombreSeleccionado = selectedOption.val();

            $('#ProductoId').val(idSeleccionado); // Asignar el ID del producto al campo oculto
            $(this).val(nombreSeleccionado); // Mostrar el nombre del producto seleccionado en el campo de texto

            obtenerDetallesProducto(idSeleccionado); // Obtener detalles adicionales del producto si es necesario
        } else {
            limpiarDetallesProducto(); // Limpiar detalles del producto si no se selecciona ninguno
        }
    });

    // Función para obtener detalles adicionales del producto (puedes implementarla si es necesario)
   


    let unidades = [];

    function obtenerDetallesProducto(productId) {
        // Llamada para obtener los datos de la unidad y los lotes
        const fetchUnidades = fetch(`https://localhost:7013/api/Unidades/GetUnidades`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener las unidades');
                }
                return response.json();
            })
            .then(data => {
                unidades = data; // Guardar unidades en una variable global
            });

        const fetchLotes = fetch(`https://localhost:7013/api/Lotes/GetLotes`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los lotes del producto');
                }
                return response.json();
            });

        const fetchProductos = fetch(`https://localhost:7013/api/Productos/GetProductos`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los productos');
                }
                return response.json();
            });

        const fetchDetalleCompras = fetch(`https://localhost:7013/api/Detallecompras/GetDetallecompras`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los detalles de compras');
                }
                return response.json();
            });

        // Esperar a que todas las solicitudes se completen
        Promise.all([fetchUnidades, fetchLotes, fetchProductos, fetchDetalleCompras])
            .then(([unidadesData, lotesData, productosData, detalleComprasData]) => {
                console.log("Unidades:", unidadesData);
                console.log("Lotes:", lotesData);
                console.log("Productos:", productosData);
                console.log("Detalle compras:", detalleComprasData);

                // Procesar datos de producto
                const productoSeleccionado = productosData.find(producto => producto.productoId == productId);
                console.log(productoSeleccionado);

                if (productoSeleccionado) {
                    var AplicarPormayor = productoSeleccionado.cantidadAplicarPorMayor;
                    var descuento = productoSeleccionado.descuentoAplicarPorMayor;
                    $('#Descuento').val(descuento);
                    $('#CantidadAPlicada').val(AplicarPormayor);


                    console.log(AplicarPormayor);
                    console.log(descuento);;
                    const cantidadTotal = productoSeleccionado.cantidadTotal;
                    const cantidadReservada = productoSeleccionado.cantidadReservada;
                    const cantidadDisponible = cantidadTotal - cantidadReservada;

                    if (cantidadDisponible > 0) {
                        $('#CantidadTxt').attr('placeholder', `Disponible: ${cantidadDisponible}`);
                    } else {
                        $('#CantidadTxt').attr('placeholder', 'No hay productos disponibles');
                    }

                    // Obtener detalles de compras y unidades
                    // Obtener detalles de compras y unidades
                    const detalles = detalleComprasData.filter(d => d.productoId == productId);
                    if (detalles.length > 0) {
                        detalles.forEach(detalle => {
                            var unidadIdDetalles = detalle.unidadId;

                            // Buscar nombre de la unidad asociada al detalle
                            var nombreUnidad = unidades.find(u => u.unidadId == unidadIdDetalles)?.nombreUnidad;

                            // Buscar nombre de la unidad con unidadId igual a 1
                            var nombreUnidadUno = unidades.find(u => u.unidadId == 1)?.nombreUnidad;

                            // Asignar nombre de unidad al campo de texto usando jQuery
                            $('#UnidadTxt').val(nombreUnidad);

                            // Limpiar opciones anteriores del datalist
                            const dataList = document.getElementById('UnidadIdList');
                            dataList.innerHTML = '';

                            // Agregar opción para nombreUnidad al datalist
                            if (nombreUnidad) {
                                const option = document.createElement('option');
                                option.value = nombreUnidad;
                                option.setAttribute('data-id', unidadIdDetalles);
                                dataList.appendChild(option);
                            }

                            // Agregar opción para nombreUnidadUno (unidadId == 1) al datalist
                            if (nombreUnidadUno) {
                                const optionUno = document.createElement('option');
                                optionUno.value = nombreUnidadUno;
                                optionUno.setAttribute('data-id', 1); // Asignar unidadId 1
                                dataList.appendChild(optionUno);
                            }
                        });
                    } else {
                        console.log('No se encontraron detalles para el productoId:', productId);
                    }

                }

                // Procesar lotes
                const lotesProducto = lotesData.filter(lote => lote.productoId == productId);
                if (lotesProducto.length > 0) {
                    let loteProximoVencimiento = null;
                    for (const lote of lotesProducto) {
                        if (lote.cantidad > 0 && lote.estadoLote != 0) {
                            if (loteProximoVencimiento === null || new Date(lote.fechaVencimiento) < new Date(loteProximoVencimiento.fechaVencimiento)) {
                                loteProximoVencimiento = lote;
                            }
                        }
                    }
                    if (loteProximoVencimiento !== null) {
                        const precio = loteProximoVencimiento.precioPorPresentacion;
                        const preciopormayor = loteProximoVencimiento.precioPorUnidadProducto
                        console.log("preciomayor", preciopormayor);
                        $('#PrecioUnitario').val(precio);
                        $('#PrecioUnitariohiddenpormayor').val(preciopormayor);


                        $('#LoteId').val(loteProximoVencimiento.loteId);
                    } else {
                     

                        $('#PrecioUnitario').val('');
                        $('#LoteId').val('');
                        $('#PrecioUnitariohiddenpormayor').val('');

                    }
                } else {
                    
                    $('#PrecioUnitario').val('');
                    $('#LoteId').val('');
                    $('#PrecioUnitariohiddenpormayor').val('');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al obtener los datos');
            });
    }


    $(document).ready(function () {
        $('#CantidadTxt').on('input', function () {
            // Obtener el valor ingresado en el campo de cantidad y convertirlo a número
            const cantidadIngresada = parseFloat($(this).val());
            console.log('Cantidad ingresada:', cantidadIngresada);
            const cantidadDisponible = parseFloat($('#CantidadTxt').attr('placeholder').split(':')[1].trim());

            // Obtener y convertir a número los valores de los otros campos
            var unidadprecio = parseFloat($('#unidadtotal').val());
            var descuento = parseFloat($('#Descuento').val());
            var aplicadomayor = parseFloat($('#CantidadAPlicada').val());
            var precio = parseFloat($('#PrecioUnitario').val());
            var UnidadId = parseInt($('#unidadHidden').val()); // Asumiendo que UnidadId es un número entero
            var preciomayor = parseFloat($('#PrecioUnitariohiddenpormayor').val());

            // Calcular el descuento aplicado en función del descuento porcentual
            var descuentoaplicar = descuento / 100;
            var descuentoaplicado = precio * descuentoaplicar;
            var mayordescentoaplicado = preciomayor * descuentoaplicar;

            // Calcular el precio con descuento para la unidad estándar y mayorista
            var precioConDescuento = precio - descuentoaplicado;
            var precioMayorConDescuento = preciomayor - mayordescentoaplicado;

            // Calcular la cantidad total por unidad
            var cantidadenviar = cantidadIngresada * unidadprecio;
            $('#CantidadPorUnidad').val(cantidadenviar);


            console.log("Valor de cantidadenviar:", cantidadenviar);

            // Aplicar lógica según las condiciones especificadas
            if (UnidadId === 1) {
                // Si la unidad es 1, aplicar lógica para precioenviar basado en precio estándar
                if (cantidadenviar > aplicadomayor) {
                    $('#PrecioEnviar').val(precioConDescuento);
                    console.log("Precio con descuento aplicado (unidad estándar).");
                } else {
                    $('#PrecioEnviar').val(precio);
                    console.log("Precio estándar sin descuento aplicado.");
                }
            } else {
                // Si la unidad no es 1, aplicar lógica para precioenviar basado en precio mayorista
                if (cantidadenviar > aplicadomayor) {
                    $('#PrecioEnviar').val(precioMayorConDescuento);
                    console.log("Precio con descuento aplicado (unidad mayorista).");
                } else {
                    $('#PrecioEnviar').val(preciomayor);
                    console.log("Precio mayorista sin descuento aplicado.");
                }
            }

            if (isNaN(cantidadenviar)) {
                $('#CantidadTxt').addClass('input-validation-error'); // Agregar la clase de error al campo
                $('span[data-valmsg-for="CantidadTxt"]').text('Por favor, ingrese una cantidad válida'); // Mostrar el mensaje de error
                $('#CantidadTxt').addClass('is-invalid'); // Agregar la clase de error al campo para los estilos de Bootstrap
                $('#btnEnviar').prop('disabled', true); // Deshabilitar el botón de enviar

                console.log("no se puede enviar");
            }
            else if (cantidadenviar > cantidadDisponible) {
            // Si la cantidad ingresada es mayor que la cantidad disponible, mostrar mensaje de error
            $('#CantidadTxt').addClass('input-validation-error');
            // Agregar la clase de error al campo
            $('span[data-valmsg-for="Cantidad"]').text('La cantidad ingresada no puede ser mayor que la cantidad disponible');
            $('#btnEnviar').prop('disabled', true); // Deshabilitar el botón de enviar
            $('#CantidadTxt').addClass('is-invalid'); // Agregar la clase de error al campo para los estilos de Bootstrap
            } else if (cantidadenviar <= 0) {
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
    });
    $('#UnidadId').on('input', function () {
        var selectedValue = $(this).val();
        var selectedOption = $('#UnidadIdList option').filter(function () {
            return $(this).val() === selectedValue || $(this).data('id') == selectedValue; // Utiliza '==' para permitir comparación de tipos mixtos
        }).first();

        if (selectedOption.length > 0) {
            var unidadId = selectedOption.attr('data-id');
            console.log("ID de la unidad seleccionada:", unidadId);

            // Buscar la unidad en el arreglo global "unidades"
            var unidadSeleccionada = unidades.find(u => u.unidadId == unidadId);
            if (unidadSeleccionada) {
                // Asignar el valor de cantidadPorUnidad al campo "unidadtotal"
                $('#unidadtotal').val(unidadSeleccionada.cantidadPorUnidad);
            } else {
                console.log("No se encontró la unidad con ID:", unidadId);
            }

            // Asignar el ID de la unidad seleccionada al campo oculto
            $('#unidadHidden').val(unidadId);
        } else if (!isNaN(selectedValue) && selectedValue !== '') {
            // Código para manejar la entrada de número si no se encuentra en el datalist
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
                    $('#unidadtotal').val(''); // Limpiar el campo de cantidadPorUnidad
                    $('#CantidadTxt').val(''); // Limpiar el campo de cantidad
                    $('#PrecioEnviar').val(''); // Limpiar el campo de precio
                })
                .catch(error => {
                    console.error('There has been a problem with your fetch operation:', error);
                });
        } else {
            // Limpiar campos si no se selecciona ninguna unidad válida
            $('#unidadHidden').val('');
            $('#unidadtotal').val('');
            $('#CantidadTxt').val('');
            $('#PrecioEnviar').val('');
        }
    });


    // Función para limpiar los detalles del producto
    function limpiarDetallesProducto() {
        $('#PrecioUnitario').val('');
        $('#ProductoId').val('');
        $('#ProductoIdtxt').val('');
        $('#ProductosList').val('');
        $('#unidadHidden').val('');
        $('#UnidadId').val('');
        $('#unidadtotal').val('');
        $('#CantidadTxt').attr('placeholder', '');
        $('#LoteId').val('');

        $('#PrecioUnitariohiddenpormayordescuento').val('');
        $('#PrecioEnviar').val('');
        $('#PrecioUnitariohiddenpormayor').val('');
        $('#CantidadAPlicada').val('');
        $('#Descuento').val('');
    }

    // Evento input para el campo "Cantidad"
  

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



$(document).ready(function () {
    $('#CantidadPorUnidad').on('input', function () {
        const cantidadIngresadaporunidad = parseFloat($(this).val()); // Convertir el valor a un número flotante
        const cantidadDisponible = parseFloat($('#CantidadTxt').attr('placeholder').split(':')[1].trim());

        console.log('Cantidad ingresada por unidad:', cantidadIngresadaporunidad);
        console.log('Cantidad disponible:', cantidadDisponible);
    });
});
