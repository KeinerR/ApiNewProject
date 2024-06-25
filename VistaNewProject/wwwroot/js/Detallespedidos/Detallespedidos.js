var detallesdepedidp = [];


function agregarDetalle(url) {
    var unidadId = document.getElementById("unidadHidden").value;
    var cantidad = document.getElementById("CantidadTxt").value;
    var precioUnitario = document.getElementById("PrecioUnitario").value;
    var pedidoId = document.getElementById("PedidoId").value;

    var detalle = {
        PedidoId: pedidoId,
        LoteId: document.getElementById("LoteId").value,
        ProductoId: document.getElementById("ClinteHiden").value,
        Cantidad: cantidad,
        PrecioUnitario: precioUnitario,
        UnidadId: unidadId,
        Subtotal: cantidad * precioUnitario
    };

    // Validar el detalle del pedido
    if (validarDetalle(detalle)) {
        detallesdepedidp.push(detalle);
        enviarDetallePedido(detalle, url);
        mostrarDetallesPedido();
        mostrarDetallesActuales();
        limpiarCampos();
    }
}

function validarDetalle(detalle) {
    var isValid = true;

    if (!validarPrecioUnitario(detalle.PrecioUnitario)) {
        isValid = false;
    }
    if (!validarProducto(detalle.ProductoId)) {
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
        })
        .catch((error) => {
            console.error("Error al enviar el detalle del pedido al servidor:", error);
        });
}

function limpiarCampos() {
    document.getElementById("Clientes").value = "";
    document.getElementById("CantidadTxt").value = "";
    document.getElementById("CantidadAPlicada").value = "";
    document.getElementById("Descuento").value = "";
    document.getElementById("PrecioUnitario").value = "";
    document.getElementById("UnidadId").value = "";
    document.getElementById("LoteId").value = "";
    document.getElementById("busqueda").value = "";
    document.getElementById("CantidadTxt").placeholder = "Ingrese cantidad";
    document.getElementById("unidadHidden").value = "";
}

function validarProducto(ProductoId) {
    var nombreUsuarioInput = document.getElementById("Clientes");
    var nombreUsuarioError = document.getElementById("clienteerror");
    var usuarioIdInput = document.getElementById("ClinteHiden");

    if (!usuarioIdInput.value || ProductoId.trim() === "" || usuarioIdInput.value === "") {
        mostrarError(nombreUsuarioInput, nombreUsuarioError, "El producto no está registrado.");
        return false;
    } else {
        quitarError(nombreUsuarioInput, nombreUsuarioError);
    }
    return true;
}

function validarUnidad(UnidadId) {
    var nombreUsuarioInput = document.getElementById("UnidadId");
    var nombreUsuarioError = document.getElementById("UnidadError");
    var usuarioIdInput = document.getElementById("unidadHidden");

    if (!usuarioIdInput.value || UnidadId.trim() === "" || usuarioIdInput.value === "") {
        mostrarError(nombreUsuarioInput, nombreUsuarioError, "La unidad no está registrada.");
        return false;
    } else {
        quitarError(nombreUsuarioInput, nombreUsuarioError);
    }
    return true;
}

function validarCantidad(Cantidad) {
    var observacionInput = document.getElementById("CantidadTxt");
    var observacionError = document.getElementById("CantidadError");

    if (!Cantidad || Cantidad.trim() === "" || isNaN(Cantidad) || parseFloat(Cantidad) <= 0) {
        mostrarError(observacionInput, observacionError, "El campo Cantidad es requerido y debe ser un número mayor que cero.");
        return false;
    }

    quitarError(observacionInput, observacionError);
    return true;
}

function validarPrecioUnitario(precio) {
    var observacionInput = document.getElementById("PrecioUnitario");
    var observacionError = document.getElementById("PrecioUnitarioError");

    if (!precio || precio.trim() === "" || isNaN(precio) || parseFloat(precio) <= 0) {
        mostrarError(observacionInput, observacionError, "El campo Precio Unitario es requerido y debe ser un número mayor que cero.");
        return false;
    }

    quitarError(observacionInput, observacionError);
    return true;
}

$("#Clientes").on("change", function () {
    var selectedOption = $("#clientes option[value='" + $(this).val() + "']");
    if (selectedOption.length) {
        $("#ClinteHiden").val(selectedOption.data("id"));
        quitarError(this, document.getElementById("clienteerror"));
    } else {
        $("#ClinteHiden").val("");
    }
});

$("#UnidadId").on("change", function () {
    var selectedOption = $("#UnidadIdList option[value='" + $(this).val() + "']");
    if (selectedOption.length) {
        $("#unidadHidden").val(selectedOption.data("id"));
        quitarError(this, document.getElementById("UnidadError"));
    } else {
        $("#unidadHidden").val("");
    }
});

$("#CantidadTxt").on("input", function () {
    validarCantidad(this.value);
});

$("#PrecioUnitario").on("input", function () {
    validarPrecioUnitario(this.value);
});

function mostrarError(inputElement, errorElement, errorMessage) {
    inputElement.classList.add("is-invalid");
    errorElement.textContent = errorMessage;
}

function quitarError(inputElement, errorElement) {
    inputElement.classList.remove("is-invalid");
    errorElement.textContent = "";
}

$(document).ready(function () {
    // Función para cargar los productos
    $("#UnidadId").prop("disabled", true);

    // Función para cargar los productos
    $("#Clientes").on("change", function () {
        var inputValue = $(this).val();
        var selectedOption = $("#clientes option").filter(function () {
            return $(this).val() === inputValue || $(this).data("id") == inputValue; // Ensure type coercion for numeric comparison
        });

        if (selectedOption.length) {
            $("#ClienteHidden").val(selectedOption.data("id"));
            $("#Clientes").val(selectedOption.val()); // Set the Clientes input to the name of the entity
            quitarError(this, document.getElementById("clienteerror"));

            // Capturar el ID del cliente seleccionado en una variable
            var clienteIdSeleccionado = selectedOption.data("id");
            $("#ClinteHiden").val(clienteIdSeleccionado);

            console.log("Cliente seleccionado:", clienteIdSeleccionado);

            // Enable "Unidad" and "Cantidad" fields
            $("#UnidadId").prop("disabled", false);

            // Llamar a la función para obtener detalles del producto pasando el clienteId
            obtenerDetallesProducto(clienteIdSeleccionado);
        } else {
            // Check if the entered value is a number
            if (!isNaN(parseFloat(inputValue)) && isFinite(inputValue)) {
                var option = $("#clientes option[data-id='" + inputValue + "']");
                if (option.length) {
                    $("#ClinteHiden").val(inputValue);
                    $("#Clientes").val(option.val()); // Set the Clientes input to the name of the entity

                    // Capturar el ID del cliente seleccionado en una variable
                    var clienteIdSeleccionado = inputValue;
                    console.log("Cliente seleccionado:", clienteIdSeleccionado);

                    // Enable "Unidad" and "Cantidad" fields
                    $("#UnidadId").prop("disabled", false);

                    // Llamar a la función para obtener detalles del producto pasando el clienteId
                    obtenerDetallesProducto(clienteIdSeleccionado);
                } else {
                    $("#ClienteHidden").val("");
                    $("#Clientes").val("");
                    limpiarDetallesProducto();

                    // Disable "Unidad" and "Cantidad" fields
                    $("#UnidadId").prop("disabled", true);
                    $("#CantidadTxt").prop("disabled", true);


                    // Clear the Clientes input if no entity is found
                }
            } else {
                $("#ClienteHidden").val("");
                $("#Clientes").val("");
                limpiarDetallesProducto();

                // Disable "Unidad" and "Cantidad" fields
                $("#UnidadId").prop("disabled", true);
                $("#CantidadTxt").prop("disabled", true);

            }
        }
    });


    let unidades = [];

    function obtenerDetallesProducto(productId) {
        // Llamada para obtener los datos de la unidad y los lotes
        const fetchUnidades = fetch(`/DetallePedidos/GeUnidades`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener las unidades');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                unidades = data;
                console.log(unidades);// Guardar unidades en una variable global
            });

        const fetchLotes = fetch(`/DetallePedidos/GetLotes`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los lotes del producto');
                }
                return response.json();
            })



            });

        const fetchProductos = fetch(`/DetallePedidos/GetProductos`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener las compras');
                }
                return response.json();
            })
        

        // Esperar a que todas las solicitudes se completen
        Promise.all([fetchUnidades, fetchLotes, fetchProductos])
            .then(([unidadesData, lotesData, productosData]) => {
                console.log("Unidades:", unidadesData);
                console.log("lotes:", lotesData);


                console.log("Productos:", productosData);

                // Procesar datos de producto
                const productoSeleccionado = productosData.find(producto => producto.productoId == productId);
                console.log(productoSeleccionado);

                if (productoSeleccionado) {
                    var nombre = productoSeleccionado.nombreCompletoProducto;
                    mostrarDetallesPedido(nombre)
                    var AplicarPormayor = productoSeleccionado.cantidadAplicarPorMayor;
                    var descuento = productoSeleccionado.descuentoAplicarPorMayor;
                    $('#Descuento').val(descuento);
                    $('#CantidadAPlicada').val(AplicarPormayor);


                    console.log(AplicarPormayor);
                    console.log(descuento);;
                    const cantidadTotal = productoSeleccionado.cantidadTotal;
                    const cantidadReservada = productoSeleccionado.cantidadReservada;
                    const cantidadReservadaPorunidad = productoSeleccionado.cantidadPorUnidadReservada;
                    const cantidadDisponible = cantidadTotal - cantidadReservada;

                    const cantidadpresentacion = productoSeleccionado.cantidadPorPresentacion;
                    const cantidadunidadaplicar = cantidadDisponible * cantidadpresentacion;


                    const cantidadDisponibleunidad = cantidadunidadaplicar - cantidadReservadaPorunidad
                    console.log("cahjkjhfgjklkjhghjkl",cantidadDisponibleunidad)
                    habilitarUnidades(cantidadDisponibleunidad, cantidadDisponible);
                   

                    if (cantidadDisponible > 0) {
                        $('#CantidadTxt').attr('placeholder', `Disponible: ${cantidadDisponible}`);
                    } if (cantidadDisponible <= 0) {
                        $('#btnEnviar').prop('disabled', true);
                        $('#CantidadTxt').attr('placeholder', 'No hay productos disponibles');


                    }


                    // Obtener detalles de compras y unidades
                    // Obtener detalles de compras y unidades
                    

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
                        const precio = loteProximoVencimiento.precioPorUnidadProducto;
                        const preciopormayor = loteProximoVencimiento.precioPorPresentacion;





                        $('#PrecioUnitario').val(precio);

                        console.log("keienr precio menor ", precio)
                        console.log("keienr precio mayor ", preciopormayor)


                        $('#PrecioUnitariohiddenpormayor').val(preciopormayor);


                        $('#LoteId').val(loteProximoVencimiento.loteId);
                        habilitarUnidades()
                    } else {
                     
                        $('#PrecioEnviar').val('');

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


   




    // Función para limpiar los detalles del producto
    function limpiarDetallesProducto() {
        $('#PrecioUnitario').val('');
        $('#Clientes').val('');
        $('#clientes').val('');
        $('#ClinteHiden').val('');

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
$(document).ready(function () {

    
    $('#CantidadTxt').on('input', function () {
        const cantidadIngresada = parseFloat($(this).val()); // Obtener la cantidad ingresada y convertirla a número
        const cantidadDisponible = parseFloat($('#CantidadTxt').attr('placeholder').trim()); // Obtener la cantidad disponible



        // Verificar si hay valores válidos para las unidades y descuentos
       


       
     

      
        // Aplicar lógica según las condiciones especificadas
        if (isNaN(cantidadIngresada)) {
            mostrarError('Por favor, ingrese una cantidad válida');
        } else if (cantidadIngresada > cantidadDisponible) {
            mostrarError('La cantidad ingresada no puede ser mayor que la cantidad disponible');
        } else if (cantidadIngresada <= 0) {
            mostrarError('La cantidad ingresada no puede ser menor o igual a 0');
        } else {
            quitarError(); // Si la cantidad ingresada es válida, quitar mensaje de error
        }
    });

    // Función para mostrar mensaje de error y deshabilitar el botón de enviar
    function mostrarError(mensaje) {
        $('#CantidadTxt').addClass('input-validation-error');
        $('span[data-valmsg-for="CantidadTxt"]').text(mensaje);
        $('#CantidadTxt').addClass('is-invalid');
        $('#btnEnviar').prop('disabled', true);
    }

    // Función para quitar mensaje de error y habilitar el botón de enviar
    function quitarError() {
        $('#CantidadTxt').removeClass('input-validation-error');
        $('span[data-valmsg-for="CantidadTxt"]').text('');
        $('#CantidadTxt').removeClass('is-invalid');
        $('#btnEnviar').prop('disabled', false);
    }
});





function mostrarDetallesActuales() {
    // Realizar una solicitud al servidor para obtener la lista global de detalles
    $.get('/DetallePedidos/ObtenerDetalles', function (data) {
        // Mostrar los detalles en la consola
        console.log('Detalles actuales:', data);
    });
}

function mostrarDetallesPedido(nombre) {
    var tablaDetalles = document.getElementById("listaDetallesPedido").getElementsByTagName("tbody")[0];
    tablaDetalles.innerHTML = "";

    var cantidadAcumuladaPorProducto = {};
    detallesdepedidp.forEach(function (detalle, index) {
        // Crear una clave única combinando ProductoId, PedidoId y UnidadId
        var clave = `${detalle.ProductoId}-${detalle.PedidoId}-${detalle.UnidadId}`;

        // Verificar si ya se ha agregado un detalle para esta combinación
        if (cantidadAcumuladaPorProducto.hasOwnProperty(clave)) {
            // Si ya existe una cantidad acumulada para este producto, sumar la nueva cantidad
            cantidadAcumuladaPorProducto[clave].Cantidad += parseFloat(detalle.Cantidad);
            cantidadAcumuladaPorProducto[clave].Subtotal += parseFloat(detalle.Subtotal);
        } else {
            // Si es la primera vez que se encuentra este producto con el mismo PedidoId y UnidadId, almacenar sus detalles
            cantidadAcumuladaPorProducto[clave] = {
                ProductoId: detalle.ProductoId,
                PedidoId: detalle.PedidoId,
                UnidadId: detalle.UnidadId,
                Cantidad: parseFloat(detalle.Cantidad),
                PrecioUnitario: parseFloat(detalle.PrecioUnitario),
                Subtotal: parseFloat(detalle.Subtotal),
                Index: index  // Guardar el índice para la eliminación
            };
        }
    });

    Object.keys(cantidadAcumuladaPorProducto).forEach(function (clave) {
        var fila = tablaDetalles.insertRow();
        fila.insertCell(0).innerHTML = cantidadAcumuladaPorProducto[clave].ProductoId; // ProductoId
        fila.insertCell(1).innerHTML = cantidadAcumuladaPorProducto[clave].Cantidad; // Cantidad acumulada
        fila.insertCell(2).innerHTML = cantidadAcumuladaPorProducto[clave].PrecioUnitario; // PrecioUnitario
        fila.insertCell(3).innerHTML = cantidadAcumuladaPorProducto[clave].UnidadId; // UnidadId
        fila.insertCell(4).innerHTML = cantidadAcumuladaPorProducto[clave].Subtotal; // Subtotal

        // Agregar un botón de eliminar en la última celda de cada fila
        var btnEliminar = document.createElement("button");
        btnEliminar.innerHTML = '<i class="fa-solid fa-trash-can"></i>'; // Icono de eliminación
        btnEliminar.onclick = function () {
            eliminarDetalle(cantidadAcumuladaPorProducto[clave].Index);
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
            console.log('Detalle eliminado exitosamente');
            // Eliminar el detalle de la lista detallesdepedidp
            detallesdepedidp.splice(index, 1);
            // Actualizar la tabla de detalles
            mostrarDetallesPedido();
            mostrarDetallesActuales(); // Actualizar los detalles mostrados en la tabla
        },
        error: function (xhr, status, error) {
            console.error('Error al eliminar el detalle:', error);
        }
    });
}




$(document).ready(function () {
    // Call filtrarProductos with an empty string to load all products initially
    filtrarProductos('');
});

function buscarProductos() {
    var busqueda = $('#busqueda').val(); // Obtener el valor del campo de búsqueda
    console.log(busqueda);
    // Llamar a la función para filtrar productos por categoría
    filtrarProductos(busqueda);
}

function filtrarProductos(busqueda) {
    console.log("Buscando productos con:", busqueda);
    $.ajax({
        url: '/DetallePedidos/FiltrarProductos',
        type: 'GET',
        data: { busqueda: busqueda },
        success: function (response) {
            console.log("Productos filtrados:", response);

            // Limpiar el datalist de productos
            $('#clientes').empty();

            // Añadir los productos filtrados al datalist
            $.each(response, function (index, producto) {
                $('#clientes').append('<option value="' + producto.nombreCompletoProducto + '" data-id="' + producto.productoId + '">' + producto.nombreCompletoProducto + '</option>');
            });
        },
        error: function (xhr, status, error) {
            console.error('Error al filtrar productos:', xhr.responseText);
        }
    });
}

$(document).ready(function () {
    // Inicialmente deshabilitar el campo CantidadTxt
    $("#CantidadTxt").prop("disabled", true);
});

function habilitarUnidades(cantidadDisponibleunidad, cantidadDisponible) {
    var uni = cantidadDisponibleunidad;
    var dispo = cantidadDisponible;

    console.log("unitariassssssss", uni);

    var precio = parseFloat($('#PrecioUnitario').val());
    var preciomayor = parseFloat($('#PrecioUnitariohiddenpormayor').val());
    console.log("unitario", precio);
    console.log("mayor", preciomayor);

    $("#UnidadId").on("change", function () {
        var inputValue = $(this).val();
        var selectedOption = $("#UnidadIdList option").filter(function () {
            return $(this).val() === inputValue || $(this).data("id") == inputValue; // Ensure type coercion for numeric comparison
        });

        if (selectedOption.length) {
            $("#unidadHidden").val(selectedOption.data("id"));
            $("#UnidadId").val(selectedOption.val()); // Set the Clientes input to the name of the entity
            quitarError(this, document.getElementById("UnidadError"));

            // Capturar el ID del cliente seleccionado en una variable
            var clienteIdSeleccionado = selectedOption.data("id");
            $("#unidadHidden").val(clienteIdSeleccionado);

            if (clienteIdSeleccionado == 2) {
                // Obtener el precio por mayor y actualizar el campo PrecioUnitario
                $('#PrecioUnitario').val(precio);
                console.log("Precio por mayor:", precio);

                $('#CantidadTxt').attr('placeholder', uni); // Cambiar el placeholder de la cantidad a 'uni'
                $("#CantidadTxt").prop("disabled", false); // Habilitar el campo CantidadTxt
            } else if (clienteIdSeleccionado == 1) {
                // Obtener el precio por mayor y actualizar el campo PrecioUnitario
                $('#PrecioUnitario').val(preciomayor);
                console.log("Precio por hgfghjkjhg:", preciomayor);
                $('#CantidadTxt').attr('placeholder', dispo); // Cambiar el placeholder de la cantidad a 'uni'
                $("#CantidadTxt").prop("disabled", false); // Habilitar el campo CantidadTxt
            }
        } else {
            // Check if the entered value is a number
            if (!isNaN(parseFloat(inputValue)) && isFinite(inputValue)) {
                var option = $("#UnidadIdList option[data-id='" + inputValue + "']");
                if (option.length) {
                    $("#unidadHidden").val(inputValue);
                    $("#UnidadId").val(option.val()); // Set the Clientes input to the name of the entity

                    // Capturar el ID del cliente seleccionado en una variable
                    var clienteIdSeleccionado = inputValue;
                    console.log("Cliente seleccionado:", clienteIdSeleccionado);
                    $("#CantidadTxt").prop("disabled", false); // Habilitar el campo CantidadTxt
                } else {
                    $("#unidadHidden").val("");
                    $("#UnidadId").val("");
                    $('#CantidadTxt').val("");
                    $("#CantidadTxt").prop("disabled", true); // Deshabilitar el campo CantidadTxt
                }
            } else {
                $("#unidadHidden").val("");
                $("#UnidadId").val("");
                $('#CantidadTxt').val("");
                $("#CantidadTxt").prop("disabled", true); // Deshabilitar el campo CantidadTxt
            }
        }
    });
}
