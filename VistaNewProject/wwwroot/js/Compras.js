// Crear el Objeto de compra vacio
var compra = {
        compraId:0,
        proveedorId: 0,
        numeroFactura: 0,
        fechaCompra: new Date().toISOString(), // Obtener la fecha actual en formato ISO
        valorTotalCompra: 0,
        estadoCompra: 1,
        detallecompras: []
    };


 //Se Usa Para verificar que el cliente no cambie los campos antes de agregar el detalle  
var verificarProducto = 0;
var verificarUnidad = 0;
var verificarCantidad = 0;
var verificarPrecioCompra= 0;
var ganancia = ""; 

//Se usa para dar un tiempo antes de la signacion del id al nombre especifico en los datalist
let timeout ;
//Se usa para la funcionalidad del input de tipo cantidad con  sus signos aritmeticos + -  
var intervalo;
var contador = 0;


//Capturar el nombre del producto para agregar al detalle de tabla ;)
var nombreProducto = "";
let idContador = 1;
// Función para envia la compra al controlador para ser procesada y registrada
function RegistrarBuy() {
    var valorTotalCompra = document.getElementById('ValorTotal').value;
    valorTotalCompra = valorTotalCompra.replace(/\./g, ''); // Elimina todos los puntos
    compra.valorTotalCompra = valorTotalCompra;
    console.log(compra);
    // Verifica si hay al menos un detalle de compra
    if (compra.detallecompras.length === 0) {
        Swal.fire({
            position: "center",
            icon: 'warning',
            title: '¡Atención!',
            text: 'Debes agregar al menos un producto a la compra.',
            showConfirmButton: false,
            timer: 3000
        });
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
            // Si el usuario confirma, enviar la solicitud POST al servidor utilizando AJAX
            localStorage.removeItem('numerosLote');
            $.ajax({
                url: '/Compras/InsertarCompra',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(compra),
                success: function (response) {
                    Swal.fire({
                        position: "center",
                        icon: 'success',
                        title: '¡Compra guardada!',
                        text: 'La compra se ha registrado correctamente.',
                        showConfirmButton: false,
                        timer: 3000
                    });
                    // Recargar la página después de la actualización
                    setTimeout(() => {
                        location.reload(true);
                    }, 3000); // Esperar 3 segundos antes de recargar la página
                },
                error: function (xhr, status, error) {
                    console.error('Error:', error);
                    Swal.fire({
                        position: "center",
                        icon: 'error',
                        title: 'Error',
                        text: 'Error al registrar la compra. Por favor, inténtalo de nuevo más tarde.',
                        showConfirmButton: false,
                        timer: 3000
                    });
                    // Devolver el objeto compra a la vista
                    console.log(compra);
                }
            });
        }

    });
}


// Función para llenar la compra correctamnete antes y abrir la modal para agregar productos a la compra
async function agregarProductos() {
    // Obtener los valores de los campos del formulario
    var proveedorId = document.getElementById('ProveedorIdHidden').value;
    var numeroFactura = document.getElementById('NumeroFactura').value;
    var fechaCompra = document.getElementById('FechaCompra').value;
    var MensajaInicial = document.getElementById('MensajeInicial');
    var botonAgregar = document.getElementById('agregarDetalle');
    var mensajes = document.querySelectorAll('.Mensaje');
    var inputs = document.querySelectorAll('.inputs');



    for (var i = 0; i < 3; i++) {
        var mensaje = mensajes[i];
        if (mensaje.textContent.trim().length > 0) {
            MensajaInicial.innerText = 'Completa correctamente todos los campos con *.';
            return; // Terminar la función si hay mensajes con contenido
        }
    }
    for (var i = 0; i < inputs.length; i++) {
        var campo = inputs[i];
        if (campo.classList.contains('is-invalid')) {
            MensajaInicial.innerText = 'Completa correctamente todos los campos.';
            return; // Terminar la función si hay algún campo inválido
        } else if (proveedorId === '') {
            $('#ProveedorIdHidden').val(''); // Limpiar el valor del campo ProveedorIdHidden
            mostrarAlertaDataList('Proveedor');
            return;

        }
    }
    var respuesta = await verificarNumeroFactura(numeroFactura);
    if (respuesta !== null) {
        if (respuesta == "ok") {
            // Actualizar los valores del objeto compra
            compra.proveedorId = proveedorId;
            compra.numeroFactura = numeroFactura;
            compra.fechaCompra = fechaCompra;
            botonAgregar.classList.add('noBe'); // Remover clase is-invalid
            $('#ModalDetallesCompra').modal('show');
            $('#ModalCompra').modal('hide');
            var opcionesCambiarDatosCompra = document.getElementById('opcinesCambiarDatosCompra');
            opcionesCambiarDatosCompra.classList.remove('noSee'); // Remover clase is-invalid
        } else {
            mostrarAlertaAtencionPersonalizadaConBoton("Este numero de factura ya esta registrado usa otro");
        }
    }


}

//Funcion para actualizar la compra
async function actualizarCompra() {
    var proveedorId = document.getElementById('ProveedorIdHidden').value;
    var numeroFactura = document.getElementById('NumeroFactura').value;
    var fechaCompra = document.getElementById('FechaCompra').value;
    if (numeroFactura === '' || fechaCompra === '') {
        mostrarAlertaCampoVacio(numeroFactura === '' ? 'numeroFactura' : 'fechaCompra');
        return;
    } else if (proveedorId === '') { // Corregido a "!=="
        mostrarAlertaDataList('Proveedor');
        return;
    } else {
        // Actualizar los valores de la compra
        var respuesta = await verificarNumeroFactura(numeroFactura);
        if (respuesta !== null) {
            if (respuesta == "ok") {
                compra.proveedorId = proveedorId;
                compra.numeroFactura = numeroFactura;
                compra.fechaCompra = fechaCompra;
                mostrarAlertaAllGood('Datos de compra actualizados.');
                $('#ModalCompra').modal('hide');
                $('#ModalDetallesCompra').modal('show');
            } else {
                mostrarAlertaAtencionPersonalizadaConBoton("Este número de factura ya esta registrado usa otro");
            }
        }
    }
}



/*-------------------------------------------------------------------------------------------------------------------------------------*/
// Función para agregar un detalle de compra al objeto principal
async function agregarDetalleCompraend(objeto) {
    if (isNaN(objeto.precioVentaxPresentacion) || isNaN(objeto.precioCompraxPresentacion)) {
        objeto.precioVentaxPresentacion = 0;
        objeto.precioCompraxPresentacion = 0;
    }
    nombreProducto = document.getElementById('NombreProducto').value; 

    var loteValido = await agregarNumeroLote(objeto.numeroLote);
  
    if (loteValido === true) {
        var detalleCompra = {
            productoId: objeto.productoId,
            compraId: 0,
            unidadId: objeto.unidadId,
            cantidad: objeto.cantidadUnidad,
            lotes: [] // Inicialmente sin lotes
        };

        // Aquí es donde se crea el detalle de compra después de la validación del cliente
        var nuevoLote = {
            productoId: objeto.productoId,
            detalleCompraId: 0,
            numeroLote: objeto.numeroLote,
            precioCompra: objeto.precioCompra,
            precioPorUnidad: objeto.precioVentaxUnidad,
            precioPorPresentacion: objeto.precioVentaxPresentacion,
            precioPorUnidadProducto: objeto.precioVentaxUnidadPresentacion,
            precioPorUnidadCompra: objeto.precioCompraxUnidad,
            precioPorPresentacionCompra: objeto.precioCompraxPresentacion,
            precioPorUnidadProductoCompra: objeto.precioCompraxUnidadPresentacion,
            fechaVencimiento: objeto.fechaVencimiento,
            cantidad: objeto.cantidad,
            cantidadCompra: objeto.cantidadCompra,
            cantidadPorUnidad: objeto.cantidadPorUnidad,
            cantidadPorUnidadCompra: objeto.cantidadPorUnidadCompra,
            estadoLote: 1 // Estado por defecto
        };

        detalleCompra.lotes.push(nuevoLote);
        compra.detallecompras.push(detalleCompra);
        LimpiarFormulario();
        agregarFilaDetalle(detalleCompra); // Llama a la función para agregar la fila de detalle a la tabla
    } else {
        mostrarAlertaAtencionPersonalizadaConBoton('Este número de lote ya existe. Por favor, ingresa uno diferente.');
    }
    
}

// Función para procesar y pasar el objeto detalle para ser añadido al objeto compra principal
function agregarDetalleCompra() {
    // Obtener valores de los campos para crear el objeto
    var unidad = document.getElementById('UnidadIdHidden').value;
    var productoId = document.getElementById('ProductoIdHidden').value;
    var cantidad = document.getElementById('Cantidad').value;
    var precioCompraEnd = document.getElementById('PrecioDeCompra').value;


    // Validar los campos obligatorios y las condiciones necesarias antes de empezar a hacer calculos para agregar el detalle de compra
    if (productoId != verificarProducto) {
        mostrarAlertaAtencionPersonalizadaConBoton('¡Atención! Parece que has modificado el campo de producto. Por favor, asegúrate de realizar de nuevo el cálculo.');
        noVerCalculo();
        return;
    }
    
    if (unidad != verificarUnidad) {
        mostrarAlertaAtencionPersonalizadaConBoton('¡Atención! Parece que has modificado el campo de unidad. Por favor, asegúrate de realizar de nuevo el cálculo.');
        noVerCalculo();
        return;
    }

    if (cantidad != verificarCantidad) {
        mostrarAlertaAtencionPersonalizadaConBoton('¡Atención! Parece que has modificado el campo de cantidad. Por favor, asegúrate de realizar de nuevo el cálculo.');
        noVerCalculo();
        return;
    }
    if (precioCompraEnd != verificarPrecioCompra) {
        mostrarAlertaAtencionPersonalizadaConBoton('¡Atención! Parece que has modificado el campo de precio de compra. Por favor, asegúrate de realizar de nuevo el cálculo.');
        noVerCalculo();
        return;
    }
    var porcentajeAGanar = document.getElementById('PorcentajeGanancia').value;
    // Obtener valores necesarios para realizar los calculos
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

    var cantidadTotalPorPresentacion = cantidad * cantidadUnidad;
    var cantidadTotalPorUnidad = (cantidad * cantidadUnidad) * cantidadPresentacion;
    
    if(unidad == 2){
        cantidadTotalPorUnidad = cantidadTotalPorPresentacion;
        cantidadTotalPorPresentacion = 0;
    }

    var fechaVencimiento = document.getElementById('FechaVencimiento').value;


    var todolleno = $('.Mensaje').filter(function () {
        return $(this).text() !== '';
    }).length === 0;

    // Validar la fecha de vencimiento
    if (!fechaVencimiento || isNaN(new Date(fechaVencimiento))) {
        // Si la fecha no es de tipo date time o es nula, establecerla en '2000-01-01'
        fechaVencimiento = '2000-01-01';
    }

    let mensajeAlerta = ``; // Inicializar la variable mensajeAlerta fuera del bloque if
    let confirmaMensajeAlerta = ``;
    // Validar si se están vendiendo a un valor menor que al comprado
    if (precioVentaxUnidad < precioCompraUnidad || precioVentaxPresentacion < precioCompraPorProducto || precioVentaxUnidadPresentacion < PrecioDeCompraUnitario) {
        let cantidadMenores = 0; // Variable para contar cuántos son menores
        if (precioVentaxUnidad < precioCompraUnidad) {
            cantidadMenores++;
        }
        if (precioVentaxPresentacion < precioCompraPorProducto) {
            cantidadMenores++;
        }
        if (precioVentaxUnidadPresentacion < PrecioDeCompraUnitario) {
            cantidadMenores++;
        }

        if (cantidadMenores >= 0) {
            if (cantidadMenores > 1) {
                confirmaMensajeAlerta = `<div id="divAlerta"><strong>¿Seguro que deseas continuar?:</strong><ul>`;
                mensajeAlerta = `<div id="divAlerta"><strong>Estás vendiendo a un valor menor al que compraste en los siguientes campos:</strong><ul>`;
            }
            else {
                confirmaMensajeAlerta = `<div id="divAlerta"><strong>¿Seguro que deseas continuar?:</strong><ul>`;
                mensajeAlerta = `<div id="divAlerta"><strong>Estás vendiendo a un valor menor al que compraste en el siguiente campo:</strong><ul>`;
            }

            if (precioVentaxUnidad < precioCompraUnidad) {
                let diferencia = precioVentaxUnidad - precioCompraUnidad;
                let perdida = Math.abs(diferencia);
                // Calcular el porcentaje de pérdida
                var porcentajePerdida = Math.round((perdida / precioCompraUnidad) * 100);
                perdida = Math.abs(perdida).toLocaleString();
                confirmaMensajeAlerta += `<li class="textoAlerta">Precio de venta x Unidad:<br/><span class="textoAlerta">Estás perdiendo ${porcentajePerdida}% de lo invertido.</span></li>`;
                mensajeAlerta += `<li class="textoAlerta">Precio de venta x Unidad:<br/><span class="textoAlerta">Estás perdiendo ${perdida}</span></li>`;
            }
            if (precioVentaxPresentacion < precioCompraPorProducto) {
                let diferencia = precioVentaxPresentacion - precioCompraPorProducto;
                let perdida = Math.abs(diferencia);
                // Calcular el porcentaje de pérdida
                var porcentajePerdida = Math.round((perdida / precioCompraPorProducto) * 100);
                perdida = Math.abs(perdida).toLocaleString();
                confirmaMensajeAlerta += `<li class="textoAlerta">Precio de venta x Producto:<br/><span class="textoAlerta">Estás perdiendo ${porcentajePerdida}% de lo invertido.<span></li>`;
                mensajeAlerta += `<li class="textoAlerta">Precio de venta x Producto:<br/><span class="textoAlerta">Estás perdiendo ${perdida}<span></li>`;
            }
            if (precioVentaxUnidadPresentacion < PrecioDeCompraUnitario) {
                let diferencia = precioVentaxUnidadPresentacion - PrecioDeCompraUnitario;
                let perdida = Math.abs(diferencia);
                // Calcular el porcentaje de pérdida
                var porcentajePerdida = Math.round((perdida / PrecioDeCompraUnitario) * 100);
                perdida = Math.abs(perdida).toLocaleString();
                confirmaMensajeAlerta += `<li class="textoAlerta">Precio de venta x Unidad de Producto:<br/><span>Estás perdiendo ${porcentajePerdida}% de lo invertido.</span> </li>`;;
                mensajeAlerta += `<li class="textoAlerta">Precio de venta x Unidad de Producto:<br/><span>Estás perdiendo ${perdida}</span></li>`;
            }

            mensajeAlerta += "</ul></div>";
            confirmaMensajeAlerta += "</ul></div>";

            // Mostrar la alerta con SweetAlert para confirmar la decisión del usuario
            Swal.fire({
                title: "Advertencia",
                html: mensajeAlerta,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Continuar",
                cancelButtonText: "Actualizar"
            }).then((result) => {
                if (!result.isConfirmed) {
                    return;
                } else {
                    // Mostrar la alerta de confirmación final
                    Swal.fire({
                        html: confirmaMensajeAlerta + "\n<strong>¿Continuar?</strong> ",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Continuar",
                        cancelButtonText: "Cancelar",
                    }).then((result) => {
                        if (!result.isConfirmed) {
                            return;
                        } else {
                            // Crear objeto con los datos necesarios
                            var objeto = {
                                productoId: productoId,
                                unidadId: unidad,
                                cantidadUnidad: cantidad,
                                cantidad: cantidadTotalPorPresentacion,
                                cantidadPorUnidad: cantidadTotalPorUnidad,
                                cantidadCompra: cantidadTotalPorPresentacion,
                                cantidadPorUnidadCompra: cantidadTotalPorUnidad,
                                numeroLote: numeroLote,
                                precioCompra: precioCompra,
                                precioCompraxUnidad: precioCompraUnidad,
                                precioCompraxPresentacion: precioCompraPorProducto,
                                precioCompraxUnidadPresentacion: PrecioDeCompraUnitario,
                                precioVentaxUnidad: precioVentaxUnidad,
                                precioVentaxPresentacion: precioVentaxPresentacion,
                                precioVentaxUnidadPresentacion: precioVentaxUnidadPresentacion,
                                fechaVencimiento: fechaVencimiento
                            };

                            agregarDetalleCompraend(objeto); // Llamar a la función optimizada con el objeto

                        }
                    });
                }
            });
        }
        if (porcentajeAGanar !== ganancia && porcentajeAGanar != "") {
            // Mostrar la alerta con SweetAlert para confirmar la acción del usuario
            let mensajeAlerta = 'Cambiaste el campo % A Ganar y olvidaste realizar de nuevo el cálculo';
            Swal.fire({
                title: "Advertencia",
                position: "top",
                text: mensajeAlerta + "\nSi deseas continuar con los valores actuales, presiona omitir",
                showCancelButton: true,
                confirmButtonText: "Calcular",
                cancelButtonText: "Omitir"
            }).then((result) => {
                if (result.isConfirmed) {
                    setTimeout(() => {
                        document.getElementById('btnCalcular').click();
                    }, 500);
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    // Verificar cuántos son menores y actualizar la variable cantidadMenores 
                    if (precioVentaxUnidad < precioCompraUnidad) {
                        cantidadMenores++;
                    }
                    if (precioVentaxPresentacion < precioCompraPorProducto) {
                        cantidadMenores++;
                    }
                    if (precioVentaxUnidadPresentacion < PrecioDeCompraUnitario) {
                        cantidadMenores++;
                    }

                    if (cantidadMenores >= 0) {
                        if (cantidadMenores > 1) {
                            confirmaMensajeAlerta = `<div id="divAlertaConfirmar"><ul>`;
                            mensajeAlerta = `<div id="divAlerta"><strong>Estás vendiendo a un valor menor al que compraste en los siguientes campos:</strong><ul>`;
                        } else {
                            confirmaMensajeAlerta = `<div id="divAlertaConfirmar">`;
                            mensajeAlerta = `<div id="divAlerta"><strong>Estás vendiendo a un valor menor al que compraste en el siguiente campo:</strong><ul>`;
                        }

                        if (precioVentaxUnidad < precioCompraUnidad) {
                            let diferencia = precioVentaxUnidad - precioCompraUnidad;
                            let perdida = Math.abs(diferencia);
                            // Calcular el porcentaje de pérdida
                            var porcentajePerdida = Math.round((perdida / precioCompraUnidad) * 100);
                            perdida = Math.abs(perdida).toLocaleString();
                            confirmaMensajeAlerta += `<p class="textoAlerta">Precio de venta x Unidad:<br/><span class="textoAlerta">Estás perdiendo ${porcentajePerdida}% de lo invertido.</span></p>`;
                            mensajeAlerta += `<li class="textoAlerta">Precio de venta x Unidad:<br/><span class="textoAlerta">Estás perdiendo ${perdida}</span></li>`;
                        }
                        if (precioVentaxPresentacion < precioCompraPorProducto) {
                            let diferencia = precioVentaxPresentacion - precioCompraPorProducto;
                            let perdida = Math.abs(diferencia);
                            // Calcular el porcentaje de pérdida
                            var porcentajePerdida = Math.round((perdida / precioCompraPorProducto) * 100);
                            perdida = Math.abs(perdida).toLocaleString();
                            confirmaMensajeAlerta += `<p class="textoAlerta">Precio de venta x Producto:<br/><span class="textoAlerta">Estás perdiendo ${porcentajePerdida}% de lo invertido.</p>`;
                            mensajeAlerta += `<li class="textoAlerta">Precio de venta x Producto:<br/><span class="textoAlerta">Estás perdiendo ${perdida}<span></li>`;
                        }
                        if (precioVentaxUnidadPresentacion < PrecioDeCompraUnitario) {
                            let diferencia = precioVentaxUnidadPresentacion - PrecioDeCompraUnitario;
                            let perdida = Math.abs(diferencia);
                            // Calcular el porcentaje de pérdida
                            var porcentajePerdida = Math.round((perdida / PrecioDeCompraUnitario) * 100);
                            perdida = Math.abs(perdida).toLocaleString();
                            confirmaMensajeAlerta += `<p class="textoAlerta">Precio de venta x Unidad de Producto:<br/><span>Estás perdiendo ${porcentajePerdida}% de lo invertido.</span> </p>`;
                            mensajeAlerta += `<li class="textoAlerta">Precio de venta x Unidad de Producto:<br/><span>Estás perdiendo ${perdida}</span></li>`;
                        }

                        mensajeAlerta += "</ul></div>";
                        confirmaMensajeAlerta += "</ul></div>";

                        // Mostrar la alerta con SweetAlert para confirmar la decisión del usuario
                        Swal.fire({
                            title: "Advertencia",
                            html: mensajeAlerta,
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonText: "Continuar",
                            cancelButtonText: "Actualizar"
                        }).then((result) => {
                            if (!result.isConfirmed) {
                                return;
                            } else {
                                // Mostrar la alerta de confirmación final
                                Swal.fire({
                                    title: "¿Seguro que deseas continuar?",
                                    html: confirmaMensajeAlerta + "\n<strong>¿Continuar?</strong> ",
                                    icon: "warning",
                                    showCancelButton: true,
                                    confirmButtonText: "Continuar",
                                    cancelButtonText: "Cancelar",
                                }).then((result) => {
                                    if (!result.isConfirmed) {
                                        return;
                                    } else {
                                        // Crear objeto con los datos necesarios
                                        var objeto = {
                                            productoId: productoId,
                                            unidadId: unidad,
                                            cantidadUnidad: cantidad,
                                            cantidad: cantidadTotalPorPresentacion,
                                            cantidadPorUnidad: cantidadTotalPorUnidad,
                                            cantidadCompra: cantidadTotalPorPresentacion,
                                            cantidadPorUnidadCompra: cantidadTotalPorUnidad,
                                            numeroLote: numeroLote,
                                            precioCompra: precioCompra,
                                            precioCompraxUnidad: precioCompraUnidad,
                                            precioCompraxPresentacion: precioCompraPorProducto,
                                            precioCompraxUnidadPresentacion: PrecioDeCompraUnitario,
                                            precioVentaxUnidad: precioVentaxUnidad,
                                            precioVentaxPresentacion: precioVentaxPresentacion,
                                            precioVentaxUnidadPresentacion: precioVentaxUnidadPresentacion,
                                            fechaVencimiento: fechaVencimiento
                                        };

                                        agregarDetalleCompraend(objeto); // Llamar a la función optimizada con el objeto

                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
    }
    else if (todolleno) {
        // Mostrar la alerta con SweetAlert para confirmar la acción del usuario
        let mensajeAlerta = `<div id="divAlerta"><strong>Estás esperando ganancias por:</strong><ul>`;
       
        if (cantidadPresentacion > 1 && unidad == 2) {
                if (precioVentaxUnidadPresentacion >= PrecioDeCompraUnitario) {
                    let diferenciaUnidadProducto = precioVentaxUnidadPresentacion - PrecioDeCompraUnitario;
                    let gananciaUnidadProducto = Math.abs(diferenciaUnidadProducto);
                    let gananciaUnidadProductoConPuntos = gananciaUnidadProducto.toLocaleString('es-ES');
                    let porcentajeGananciaProducto = Math.round((gananciaUnidadProducto / PrecioDeCompraUnitario) * 100);
                    mensajeAlerta += `<li>x Unidad de Producto: <br/> ${gananciaUnidadProductoConPuntos} o ${porcentajeGananciaProducto}%</li>`;
                }
        }
        else {
            if (precioVentaxUnidad != precioVentaxPresentacion) {
                if (precioVentaxUnidad > precioCompraUnidad) {
                    let diferenciaUnidad = precioVentaxUnidad - precioCompraUnidad;
                    let gananciaUnidad = Math.abs(diferenciaUnidad);
                    let gananciaUnidadConPuntos = gananciaUnidad.toLocaleString('es-ES');
                    let porcentajeGanancia = Math.round((gananciaUnidad / precioCompraUnidad) * 100);
                    mensajeAlerta += `<li>x Unidad: <br/> ${gananciaUnidadConPuntos} o ${porcentajeGanancia}%</li>`;
                }
                if (precioVentaxPresentacion >= precioCompraPorProducto) {
                    let diferenciaProducto = precioVentaxPresentacion - precioCompraPorProducto;
                    let gananciaProducto = Math.abs(diferenciaProducto);
                    let gananciaProductoConPuntos = gananciaProducto.toLocaleString('es-ES');
                    let porcentajeGanancia = Math.round((gananciaProducto / precioCompraPorProducto) * 100);
                    mensajeAlerta += `<li>x Producto: <br/> ${gananciaProductoConPuntos} o ${porcentajeGanancia}%  </li>`;
                }
            } else {
                if (precioVentaxPresentacion >= precioCompraPorProducto) {
                    let diferenciaProducto = precioVentaxPresentacion - precioCompraPorProducto;
                    let gananciaProducto = Math.abs(diferenciaProducto);
                    let gananciaProductoConPuntos = gananciaProducto.toLocaleString('es-ES');
                    let porcentajeGanancia = Math.round((gananciaProducto / precioCompraPorProducto) * 100);
                    mensajeAlerta += `<li>x Producto: <br/> ${gananciaProductoConPuntos} o ${porcentajeGanancia}%  </li>`;
                }
            }
            
        }
        mensajeAlerta += "</ul></div>";
        // Mostrar la alerta con SweetAlert
        Swal.fire({
            html: mensajeAlerta + "\n¿Deseas Continuar?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Continuar",
            cancelButtonText: "Actualizar",
        }).then((result) => {
            if (!result.isConfirmed) {
                return;
            } else {
                // Crear objeto con los datos necesarios
                var objeto = {
                    productoId: productoId,
                    unidadId: unidad,
                    cantidadUnidad: cantidad,
                    cantidad: cantidadTotalPorPresentacion,
                    cantidadPorUnidad: cantidadTotalPorUnidad,
                    cantidadCompra: cantidadTotalPorPresentacion,
                    cantidadPorUnidadCompra: cantidadTotalPorUnidad,
                    numeroLote: numeroLote,
                    precioCompra: precioCompra,
                    precioCompraxUnidad: precioCompraUnidad,
                    precioCompraxPresentacion: precioCompraPorProducto,
                    precioCompraxUnidadPresentacion: PrecioDeCompraUnitario,
                    precioVentaxUnidad: precioVentaxUnidad,
                    precioVentaxPresentacion: precioVentaxPresentacion,
                    precioVentaxUnidadPresentacion: precioVentaxUnidadPresentacion,
                    fechaVencimiento: fechaVencimiento
                };

                agregarDetalleCompraend(objeto); // Llamar a la función optimizada con el objeto
            }
        });
        if (porcentajeAGanar !== ganancia && porcentajeAGanar != "") {
            // Mostrar la alerta con SweetAlert para confirmar la acción del usuario
            let mensajeInicial = 'Cambiaste el campo % A Ganar y olvidaste realizar de nuevo el cálculo';
            let mensajeAlerta = '<div id="divAlerta"><strong>Estás esperando ganancias por:</strong><ul>';
            Swal.fire({
                title: "Advertencia",
                position: "top",
                text: mensajeInicial + "\nSi deseas continuar con los valores actuales, presiona omitir",
                showCancelButton: true,
                confirmButtonText: "Calcular",
                cancelButtonText: "Omitir"
            }).then((result) => {
                if (result.isConfirmed) {
                    setTimeout(() => {
                        document.getElementById('btnCalcular').click();
                    }, 500);
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    if (precioVentaxUnidad > precioCompraUnidad) {
                        let diferenciaUnidad = precioVentaxUnidad - precioCompraUnidad;
                        let gananciaUnidad = Math.abs(diferenciaUnidad);
                        let gananciaUnidadConPuntos = gananciaUnidad.toLocaleString('es-ES');
                        let porcentajeGanancia = Math.round((gananciaUnidad / precioCompraUnidad) * 100);
                        mensajeAlerta += `<li>x Unidad: <br/> ${gananciaUnidadConPuntos} o ${porcentajeGanancia}%</li>`;
                    }
                    if (precioVentaxPresentacion !== precioVentaxUnidadPresentacion) {
                        if (precioVentaxPresentacion > precioCompraPorProducto) {
                            let diferenciaProducto = precioVentaxPresentacion - precioCompraPorProducto;
                            let gananciaProducto = Math.abs(diferenciaProducto);
                            let gananciaProductoConPuntos = gananciaProducto.toLocaleString('es-ES');
                            let porcentajeGanancia = Math.round((gananciaProducto / precioCompraPorProducto) * 100);
                            mensajeAlerta += `<li>x Producto: <br/> ${gananciaProductoConPuntos} o ${porcentajeGanancia}%</li>`;
                        }

                        if (precioVentaxUnidadPresentacion > PrecioDeCompraUnitario) {
                            let diferenciaUnidad = precioVentaxUnidadPresentacion - PrecioDeCompraUnitario;
                            let gananciaUnidad = Math.abs(diferenciaUnidad);
                            let gananciaUnidadConPuntos = gananciaUnidad.toLocaleString('es-ES');
                            let porcentajeGanancia = Math.round((gananciaUnidad / PrecioDeCompraUnitario) * 100);
                            mensajeAlerta += `<li>x Unidad de Producto: <br/> ${gananciaUnidadConPuntos} o ${porcentajeGanancia}%</li>`;
                        }
                    } else {
                        let diferenciaProducto = precioVentaxPresentacion - precioCompraPorProducto;
                        let gananciaProducto = Math.abs(diferenciaProducto);
                        let gananciaProductoConPuntos = gananciaProducto.toLocaleString('es-ES');
                        let porcentajeGanancia = Math.round((gananciaProducto / precioCompraPorProducto) * 100);
                        mensajeAlerta += `<li>x Producto: <br/> ${gananciaProductoConPuntos} o ${porcentajeGanancia}%  </li>`;
                    }

                    mensajeAlerta += "</ul></div>";

                    // Mostrar la alerta con SweetAlert
                    Swal.fire({
                        html: mensajeAlerta + "\n¿Deseas Continuar?",
                        icon: "question",
                        showCancelButton: true,
                        confirmButtonText: "Continuar",
                        cancelButtonText: "Actualizar",
                    }).then((result) => {
                        if (!result.isConfirmed) {
                            return;
                        } else {
                            // Crear objeto con los datos necesarios
                            var objeto = {
                                productoId: productoId,
                                unidadId: unidad,
                                cantidadUnidad: cantidad,
                                cantidad: cantidadTotalPorPresentacion,
                                cantidadPorUnidad: cantidadTotalPorUnidad,
                                cantidadCompra: cantidadTotalPorPresentacion,
                                cantidadPorUnidadCompra: cantidadTotalPorUnidad,
                                numeroLote: numeroLote,
                                precioCompra: precioCompra,
                                precioCompraxUnidad: precioCompraUnidad,
                                precioCompraxPresentacion: precioCompraPorProducto,
                                precioCompraxUnidadPresentacion: PrecioDeCompraUnitario,
                                precioVentaxUnidad: precioVentaxUnidad,
                                precioVentaxPresentacion: precioVentaxPresentacion,
                                precioVentaxUnidadPresentacion: precioVentaxUnidadPresentacion,
                                fechaVencimiento: fechaVencimiento
                            };

                            agregarDetalleCompraend(objeto); // Llamar a la función optimizada con el objeto

                        }
                    });
                } else {
                    // Crear objeto con los datos necesarios
                    var objeto = {
                        productoId: productoId,
                        unidadId: unidad,
                        cantidadUnidad: cantidad,
                        cantidad: cantidadTotalPorPresentacion,
                        cantidadPorUnidad: cantidadTotalPorUnidad,
                        cantidadCompra: cantidadTotalPorPresentacion,
                        cantidadPorUnidadCompra: cantidadTotalPorUnidad,
                        numeroLote: numeroLote,
                        precioCompra: precioCompra,
                        precioCompraxUnidad: precioCompraUnidad,
                        precioCompraxPresentacion: precioCompraPorProducto,
                        precioCompraxUnidadPresentacion: PrecioDeCompraUnitario,
                        precioVentaxUnidad: precioVentaxUnidad,
                        precioVentaxPresentacion: precioVentaxPresentacion,
                        precioVentaxUnidadPresentacion: precioVentaxUnidadPresentacion,
                        fechaVencimiento: fechaVencimiento
                    };

                    agregarDetalleCompraend(objeto); // Llamar a la función optimizada con el objeto
                }
            });
        }

    }
}

/*-------------------------------------------------------------------------------------------------------------------------------------*/
//Paginado
function cambiarPagina(direccion) {
    const filasPorPagina = 10; // Cambia el número de filas por página según tus necesidades
    const filas = Array.from(document.getElementById('detalleTableBody').rows);
    let paginasTotales = Math.ceil(filas.length / filasPorPagina);

    if (direccion === 2) {
        paginaActual = paginasTotales - 1;
    } else if (direccion === 1) {
        paginaActual = Math.min(paginaActual + 1, paginasTotales - 1);
       
    } else if (direccion === -1) {
        paginaActual = Math.max(paginaActual - 1, 0);
    } else {
        // Verificar si hay suficientes registros en la página actual después de eliminar un registro
        const inicio = paginaActual * filasPorPagina;
        const fin = inicio + filasPorPagina;

        if (inicio >= filas.length) {
            // Si no hay suficientes registros en la página actual, eliminar la página actual y retroceder
            paginaActual = Math.max(paginaActual - 1, 0);
        }
    }
    // Establecer la visibilidad de los botones "Anterior" y "Siguiente"
    document.getElementById('btnAnterior').style.display = (paginaActual > 0) ? 'block' : 'none';
    document.getElementById('btnSiguiente').style.display = (paginaActual < paginasTotales - 1) ? 'block' : 'none';


    filas.forEach((fila, indice) => {
        const inicio = paginaActual * filasPorPagina;
        const fin = inicio + filasPorPagina;

        fila.style.display = (indice >= inicio && indice < fin) ? '' : 'none';
    });
}
//verificar si es necesario mostrar uno el paginado
function verificarPaginado() {
    // Verificar si hay más de una página después de agregar la fila
    const filasPorPagina = 3; // Cambia este valor según tus necesidades
    const filas = Array.from(detalleTableBody.rows);
    let paginasTotales = Math.ceil(filas.length / filasPorPagina);
    document.getElementById('modal-header-ValorTotal').style.display= 'flex';
    document.getElementById('modal-header-ValorTotal').style.visibility = 'visible';
    if (paginasTotales > 1) {
        document.getElementById('contenedorTablaDetallesBotones').style.display = 'block';
        document.getElementById('contenedorTablaDetallesBotones').style.visibility = 'visible'; 
    } else {
        document.getElementById('contenedorTablaDetallesBotones').style.display = 'none';
        document.getElementById('contenedorTablaDetallesBotones').style.visibility = 'hidden'; 
    }
}
/*-------------------------------------------------------------------------------------------------------------------------------------*/
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
    cellProducto.innerHTML = nombreProducto;
    cellProducto.setAttribute('title', detalleCompra.productoId);
    cellCantidad.innerHTML = ultimoLote.cantidad;
    cellPrecioUnitario.innerHTML = ultimoLote.precioPorPresentacion;
    cellSubtotal.innerHTML = ultimoLote.precioCompra;
    cellAcciones.innerHTML = '<button onclick="eliminarFilaDetalle(this)">Eliminar</button>';


    // Verifica si es necesario que se vea o no el paginado
    verificarPaginado();

    // Actualizar el valor total
    actualizarValorTotal();
    actualizarIndicesTabla();

    // Cambiar a la página 2 (o cualquier otra lógica de paginación que tengas)
    cambiarPagina(2);
}

// Funcion para eliminar un solo detalle al que se presione el boton
function eliminarFilaDetalle(button) {
    var row = button.parentNode.parentNode; // Obtener la fila de la tabla
    var indice = row.getAttribute('data-indice'); // Obtener el índice de la fila
    // Obtener el detalle de compra a eliminar
    var detalleEliminado = compra.detallecompras[indice];
    var lote = detalleEliminado.lotes;

    eliminarNumeroLote(lote[0].numeroLote);

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


    //verifica si es necesario que se vea u no el paginado
    verificarPaginado() 
    // Actualizar los índices de las filas restantes en la tabla
    actualizarIndicesTabla();
    actualizarValorTotal();
    cambiarPagina(-2); // Dirección -1 para página anterior
   
}

// Funcion para eliminar un solo detalle al que se presione el boton
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
    row.cells[3].innerHTML = detalleCompra.cantidad * ultimoLote.precioCompraPorProducto;
}

// Función para calcular y actualizar el valor total
async function actualizarValorTotal() {
    var total = 0;
    // Obtener todas las filas de la tabla
    var filas = document.querySelectorAll('#detalleTableBody tr');
    // Iterar sobre las filas y sumar los subtotales
    filas.forEach(function (fila) {
        var subtotal = parseFloat(fila.cells[3].innerHTML);
        total += subtotal;
    });
    total = await formatNumber(total);
    document.getElementById('ValorTotal').value = total;
}

/*-------------------------------------------------------------------------------------------------------------------------------------*/
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
    document.getElementById('NombreProveedor').value = '';
    document.getElementById('NombreProducto').value = '';
    document.getElementById('NombreUnidad').value = '';
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
        mensaje.textContent = '*'; // Restaurar mensajes de error
        mensaje.style.display = 'flex'; // Establecer estilo si es necesario
    }

    setHoraActual();
}

function reiniciarCompra() {
    location.reload();
}

/*-----------------------------------------Mago--------------------------------------------------------------------------------------------*/
function verCompra() {
    $('#ModalCompra').modal('show');
    $('#ModalDetallesCompra').modal('hide');
  
}
function noVerDatosCompra() {
    $('#ModalCompra').modal('hide');
    $('#ModalDetallesCompra').modal('show');
}
function verFormularioDetalle() {

    $('#ModalDetallesCompra').modal('show');
    $('#ModalProductosCompra').modal('hide');
  
}
function verOpcionesAgregadas() {
    const button = document.getElementById('noOpcionesAgregadas');
    button.onclick = noVerOpcionesAgregadas;
    button.innerHTML = '<i class="fas fa-minus"></i>';
    button.title = "Ver menos elementos";
    $('.opcionesAgregadas').each(function () {
        $(this).removeClass('noBe');
    });
}
function noVerOpcionesAgregadas() {
    const button = document.getElementById('noOpcionesAgregadas');
    button.onclick = verOpcionesAgregadas;
    button.innerHTML = '<i class="fas fa-plus"></i>';
    button.title = "Ver más elementos";
    // Aquí puedes agregar el código para ocultar las opciones agregadas.
    let opciones = document.querySelectorAll('.opcionesAgregadas');
    opciones.forEach(opcion => {
        opcion.classList.add('noBe');
    });

}
function verProductos() {
    $('#ModalDetallesCompra').modal('show');
    $('#ModalProductosCompra').modal('show');
  
}
function verCalculo() {
    document.getElementById('PrecioBougth').style.display = 'flex';
    document.getElementById('PrecioBuy').style.display = 'flex';
    document.getElementById('modal-header-botonAgregarDetalle').style.visibility = 'visible';
    document.getElementById('modal-header-botonAgregarDetalle').style.display = 'block';

}
function noVerCalculo() {
    document.getElementById('modal-header-botonAgregarDetalle').style.visibility = 'hidden';
    document.getElementById('modal-header-botonAgregarDetalle').style.display = "none"
    document.getElementById('PrecioBougth').style.display = 'none';
    document.getElementById('PrecioBuy').style.display = 'none';
}
function cambioFechaVencimiento() {
    const checkboxNoVencimiento = document.getElementById('checkboxNoVencimiento');
    const fechaVencimiento = document.getElementById('FechaVencimiento');
    const fechaVencimientoNunca = document.getElementById('FechaVencimientoNunca');
    const labelFechaVencimiento = document.getElementById('Vencimiento');
    const spanMensajeNoFecha = document.querySelector('.col-3 .Mensaje');
    const spanText = document.querySelector('span#spanFechaVencimiento.text-danger');

    checkboxNoVencimiento.addEventListener('change', () => {
        if (checkboxNoVencimiento.checked) {
            fechaVencimiento.style.display = 'none'; // Ocultar la fecha de vencimiento
            fechaVencimientoNunca.style.display = 'block'; // Mostrar el texto "Producto no perecedero"
            labelFechaVencimiento.textContent = 'Aplica click';
            fechaVencimiento.value = ''; // Asignar un valor vacío por defecto
            if (spanMensajeNoFecha) {
                spanMensajeNoFecha.textContent = ''; // Cambia el contenido del span a vacío
            }
            if (spanText) {
                spanText.textContent = '';
            }
        } else {
            fechaVencimiento.style.display = 'block'; // Mostrar la fecha de vencimiento
            fechaVencimientoNunca.style.display = 'none'; // Ocultar el texto "Producto no perecedero"
            fechaVencimiento.classList.remove('is-invalid'); // Remover clase is-invalid
            labelFechaVencimiento.textContent = 'No aplica click';
            if (spanMensajeNoFecha) {
                spanMensajeNoFecha.textContent = '*'; // Cambia el contenido del span a '*'
            }
        }
    });
}

/*-----------------------------------------Cantidad y datalist--------------------------------------------------------------------------------------------*/

function seleccionarOpcionesHidden(input,Peticion){
    let soloNumerosRegex = /^[0-9]+$/;
    // Limpia el temporizador existente
    clearTimeout(timeout);

    if (soloNumerosRegex.test(input.value)) {
        timeout = setTimeout(() => {
            if (Peticion == "Proveedor") {
                seleccionarOpcion(input, document.getElementById('proveedores'), document.getElementById('ProveedorIdHidden'), 'ProveedorCompra', 'proveedor');
            } 
            if (Peticion == "Producto") {
                seleccionarOpcion(input, document.getElementById('productos'), document.getElementById('ProductoIdHidden'), 'ProductoCompra', 'producto');

            } 
            if (Peticion == "Unidad") {
                seleccionarOpcion(input, document.getElementById('unidades'), document.getElementById('UnidadIdHidden'), 'UnidadCompra', 'unidad');
            } 
        }, 500); // Esperar 500 milisegundos antes de ejecutar la función
    } else {
        if (Peticion == "Proveedor") {
            seleccionarOpcion(input, document.getElementById('proveedores'), document.getElementById('ProveedorIdHidden'), 'ProveedorCompra', 'proveedor');
        } 
        if (Peticion == "Producto") {
            seleccionarOpcion(input, document.getElementById('productos'), document.getElementById('ProductoIdHidden'), 'ProductoCompra', 'producto');

        }
        if (Peticion == "Unidad") {
            seleccionarOpcion(input, document.getElementById('unidades'), document.getElementById('UnidadIdHidden'), 'UnidadCompra', 'unidad');
        }
    }
    
}
// Función para incrementar la cantidad
function incrementarCantidad() {
    var inputCantidad = document.getElementById('Cantidad');
    var valorActual = parseInt(inputCantidad.value);
    if (valorActual < 99) { // Establecer el límite máximo
        inputCantidad.value = valorActual + 1;
    }
}

// Función para decrementar la cantidad
function decrementarCantidad() {
    var inputCantidad = document.getElementById('Cantidad');
    var valorActual = parseInt(inputCantidad.value);
    if (valorActual > 1) { // Establecer el límite mínimo
        inputCantidad.value = valorActual - 1;
    }
}

// Función para iniciar el intervalo al mantener presionado el botón
function iniciarIntervalo(funcion) {
    clearInterval(intervalo); // Limpiar cualquier intervalo existente
    contador = 0; // Reiniciar el contador
    intervalo = setInterval(function () {
        contador++;
        if (contador > 5) { // Incremento más rápido después de cierto tiempo
            funcion();
        }
    }, 100); // Intervalo inicial de 100ms
}

// Función para detener el intervalo al soltar el botón
function detenerIntervalo() {
    clearInterval(intervalo); // Detener el intervalo
    contador = 0; // Reiniciar el contador al soltar el botón
}

/*-----------------------------------------Calculos--------------------------------------------------------------------------------------------*/

function calcularPreciosCompra() {
    var productoId = document.getElementById('ProductoIdHidden').value;
    var porcentajeAGanarConPuntos = document.getElementById('PorcentajeGanancia').value;
    var cantidad = document.getElementById('Cantidad').value;
    var precioCompraConPuntos = document.getElementById('PrecioDeCompra').value;
    var unidad = document.getElementById('CantidadPorUnidad').value;
    var nombreUnidad = document.getElementById('NombreUnidad').value;
    var cantidadPorPresentacion = document.getElementById('CantidadPorPresentacionHidden').value;
    var producto = document.getElementById('NombreProducto').value;
    var unidadId = document.getElementById('UnidadIdHidden').value;
    var datalist = [
        { id: 'UnidadIdHidden', nombre: 'Unidad' },
        { id: 'ProductoIdHidden', nombre: 'Producto' },
    ];
    verificarProducto = productoId;
    verificarUnidad = unidadId;
    verificarPrecioCompra = precioCompraConPuntos;
    verificarCantidad = cantidad;
    // Verificar si los campos requeridos están completos
    if (
        precioCompraConPuntos === '' ||
        producto === '' ||
        unidadId === '' ||
        porcentajeAGanarConPuntos === '' ||
        unidadId === '' ||
        cantidad === ''
    ) {
        mostrarAlertaCampoVacio(
            producto === ''
                ? 'Producto'
                : unidadId === ''
                    ? 'Unidad'
                    : precioCompraConPuntos === ''
                        ? 'Precio de Compra'
                        : porcentajeAGanarConPuntos === ''
                            ? '% A Ganar'
                            : cantidad === ''
                                ? 'Cantidad'
                                : ''
        );
        return;
    }
    if (!verificarCamposDataList(datalist)) {
        preventDefault();
        return;
    }
    if (unidadId == 2 && cantidadPorPresentacion < 2) {
        mostrarAlertaAtencionPersonalizadaConBoton(`Este producto no se puede comprar por la unidad: ${nombreUnidad}.`);
        noVerCalculo();
        return;
    }

    var precioCompra = parseFloat(precioCompraConPuntos.replace(/\./g, ''));
    var porcentajeAGanar = parseFloat(porcentajeAGanarConPuntos.replace(/\./g, ''));
    ganancia = porcentajeAGanarConPuntos;
    if (isNaN(precioCompra) || isNaN(porcentajeAGanar)) {
        mostrarAlertaAtencionPersonalizadaConBoton('El precio de compra y el porcentaje a ganar deben ser números válidos.');
        noVerCalculo();
        return;
    }

    /* Precio por unidad*/
    var precioPorUnidadIndividualSinPuntos = precioCompra / cantidad;

    /* Precio por producto*/
    var cantidadUnitariaPorPresentacionSinPuntos = precioCompra / (unidad * cantidad);
    // Precio por unidad de producto
    var precioIndividualUnitarioSinPuntos = (precioCompra / unidad) / (cantidadPorPresentacion * cantidad);

    /* Precio venta por unidad*/
    var precioVentaIndividualUnitarioSinPuntos = precioPorUnidadIndividualSinPuntos + (precioPorUnidadIndividualSinPuntos * porcentajeAGanar / 100);
    /* Precio venta por producto*/
    var precioVentaPorPresentacionSinPuntos = cantidadUnitariaPorPresentacionSinPuntos + (cantidadUnitariaPorPresentacionSinPuntos * porcentajeAGanar / 100);
    // Precio venta por unidad de producto
    var precioVentaPorUnidadDeProducto = precioIndividualUnitarioSinPuntos + (precioIndividualUnitarioSinPuntos * porcentajeAGanar / 100);

    var precioIndividualUnitario = formatNumber(Math.round(precioIndividualUnitarioSinPuntos));
    var cantidadUnitariaPorPresentacion = formatNumber(Math.round(cantidadUnitariaPorPresentacionSinPuntos));
    var precioPorUnidad = formatNumber(Math.round(precioPorUnidadIndividualSinPuntos));

    var precioVentaPorUnidad = formatNumber(Math.round(precioVentaIndividualUnitarioSinPuntos));
    var precioVentaPorProducto = formatNumber(Math.round(precioVentaPorPresentacionSinPuntos));
    var precioVentaIndividualUnitario = formatNumber(Math.round(precioVentaPorUnidadDeProducto));

    // Mostrar los resultados en los campos correspondientes
    if (precioPorUnidadIndividualSinPuntos < 50) {
        mostrarAlertaAtencionPersonalizadaConBoton('El precio de compra es demasiado bajo');
        noVerCalculo();
        return;
    }
    var PrecioDeVentaUnitario = document.getElementById("PrecioDeVentaUnitario");

    if (unidadId == 2) {

        // Deshabilitar el campo
        PrecioDeVentaUnitario.disabled = true;
        // Otros ajustes según la condición
        var precioIndividualUnitario = precioPorUnidad;
        var cantidadUnitariaPorPresentacion = "No aplica";
        var precioVentaIndividualUnitario = precioVentaPorUnidad;
        var precioVentaPorProducto = "No aplica";
    } else {
        // Habilitar el campo
        PrecioDeVentaUnitario.disabled = false;

    }
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
    }

    verCalculo();


    // Aquí puedes realizar cualquier operación adicional con los valores calculados

}
async function calcularPrecioPorUnidad(input) {
    var cantidadUnidad = document.getElementById('CantidadPorUnidad').value;
    var cantidadPorPresentacion = document.getElementById('CantidadPorPresentacionHidden').value;

    var precioUnitarioPorPresentacion = 0;
    var precioPorUnidad = 0;
    
    const precioVentaxProducto = input.value.replace(/\./g, '');

    // Verificar si los campos requeridos están completos
    if (precioVentaxProducto === '') {
        mostrarAlertaAtencionPersonalizadaConBoton('Ingresa un valor antes para poder hacer el calculo');
        return;
    }

    if (cantidadUnidad == 1 && cantidadPorPresentacion == 1) {
        var precioUnitarioPorPresentacion = await formatNumber(Math.ceil(precioVentaxProducto / cantidadPorPresentacion));
        var precioPorUnidad = precioUnitarioPorPresentacion;
    }

    if (cantidadUnidad > 1 && cantidadPorPresentacion > 1) {
        var precioUnitarioPorPresentacion = await formatNumber(Math.ceil(precioVentaxProducto / cantidadPorPresentacion));
        var precioPorUnidad = await formatNumber(Math.ceil(precioVentaxProducto * cantidadUnidad));
    }

    if (cantidadUnidad > 1 && cantidadPorPresentacion == 1) {
        var precioUnitarioPorPresentacion = await formatNumber(Math.ceil(precioVentaxProducto / cantidadPorPresentacion));
        var precioPorUnidad = await formatNumber(Math.ceil(precioVentaxProducto * cantidadUnidad));
    }

    if(cantidadUnidad == 1 && cantidadPorPresentacion > 1) {
        var precioUnitarioPorPresentacion = await formatNumber(Math.ceil(precioVentaxProducto / cantidadPorPresentacion));
        var precioPorUnidad = await formatNumber(Math.ceil(precioVentaxProducto * cantidadUnidad));
    }
    simularEscritura('PrecioDeVentaxUnidadPresentacion', precioUnitarioPorPresentacion);
    simularEscritura('PrecioDeVentaPorUnidad', precioPorUnidad);
}

function precioUnidadToo(input) {
    if (input.id === "PrecioDeVentaxUnidadPresentacion") {
        var precioVentaUnitario = document.getElementById("PrecioDeVentaUnitario");
        var precioVentaPorUnidad = document.getElementById("PrecioDeVentaPorUnidad");

        if (precioVentaUnitario && precioVentaPorUnidad && precioVentaUnitario.disabled) {
            precioVentaPorUnidad.value = input.value;
        }
    }
}
function simularEscritura(elementId, value) {
    const element = document.getElementById(elementId);

    // Clear any existing value
    element.value = '';

    // Set the value all at once
    element.value = value;

    // Create and dispatch the 'input' event
    const event = new Event('input', { bubbles: true });
    element.dispatchEvent(event);
}
/*-----------------------------------------LIMPIADORES--------------------------------------------------------------------------------------------*/

// Se usa para eliminar todos los detalles de la tabla en la venta modal
function eliminarTodosLosDetalles() {
    var filasDetalles = document.querySelectorAll('#tablaDetalles tbody tr');
    // Iterar sobre todas las filas de detalles y eliminarlas una por una
    filasDetalles.forEach(function (fila) {
        var botonEliminar = fila.querySelector('.btnEliminar');
        eliminarFilaDetalle(botonEliminar); // Llamar a la función eliminarFilaDetalle para cada fila
    });
}
// Función para limpiar el formulario
function LimpiarFormulario() {
    // Limpiar los valores de los campos del formulario
    iconoLimpiarCampo(['NombreProducto', 'ProductoIdHidden', 'CantidadPorPresentacionHidden'], 'NombreProducto');
    iconoLimpiarCampo(['NombreUnidad', 'UnidadIdHidden', 'CantidadPorUnidad'], 'NombreUnidad');
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
    document.getElementById('PorcentajeGanancia').value = '';
    document.getElementById('checkboxNoVencimiento').checked = false;
    document.getElementById('modal-header-botonAgregarDetalle').style.display = 'none'; 
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
    // Iterar sobre los mensajes, omitiendo los primeros 3 y los últimos 3
    for (var i = 3; i < mensajes.length - 3; i++) {
        var mensaje = mensajes[i];
        mensaje.textContent = '*'; // Restaurar mensajes de error
    }
    const mensajesError = document.querySelectorAll('.text-danger');
    mensajesError.forEach(span => {
        span.innerText = ''; // Limpiar contenido del mensaje
    });
    noVerCalculo();
}
// Se usa para reiniciar la compra
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
    // Ocultar elementos
    document.getElementById('PrecioBougth').style.display = 'none';
    document.getElementById('PrecioBuy').style.display = 'none';
    document.getElementById('TablaDetalles').style.display = 'none';
    document.getElementById('tituloCompra').style.display = 'block';
    document.getElementById('tituloCompra').style.visibility = 'visible';
    document.getElementById('subtituloCompra').style.display = 'none';
    document.getElementById('PrincipalCompra').style.display = 'block';
    document.getElementById('agregarDetalle').style.display = 'block';
    document.getElementById('DetallesCompra').style.display = 'none';
    document.getElementById('actualizarCompra').style.visibility = 'hidden';
    document.getElementById('actualizarCompra').style.display = 'none';
    document.getElementById('verCompra').style.display = 'none';
    // Limpiar los valores de los campos del formulario
    document.getElementById('NombreProveedor').value = '';
    document.getElementById('NumeroFactura').value = '';
    document.getElementById('NombreProducto').value = '';
    document.getElementById('NombreUnidad').value = '';
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
    for (var i = 0; i < mensajes.length; i++) {
        if (i !== 1) { // Omitir el segundo mensaje (índice 1)
            var mensaje = mensajes[i];
            mensaje.textContent = '*'; // Restaurar mensajes de error
        }
    }
    const mensajesError = document.querySelectorAll('.text-danger');
    mensajesError.forEach(span => {
        span.innerText = ''; // Limpiar contenido del mensaje
    });


}




/*-----------------------------------------Validaciones--------------------------------------------------------------------------------------------*/
function validarCampoCompras(input, campo) {
    var valor = input.val().trim();
    var spanError = input.next('.text-danger');
    var labelForCampo = $('label[for="' + campo + '"]');
    var spanVacio = labelForCampo.find('.Mensaje');
    var spanDanger = input.closest('.col-4').find('span#spanErmitanio.text-danger');
    spanError.text('');
    spanVacio.text('');
    if (valor != '') {
        spanError.text(''); // Se corrigió aquí para limpiar el texto de error
        input.removeClass('is-invalid');
    } else if (valor === "" && input.attr('id') !== "PorcentajeGanancia") {
        input.addClass('is-invalid');
        spanVacio.text('*');
    }
    if (input.is('#NombreProveedor')) {
        if (valor === "") {
            $('#ProveedorIdHidden').val(''); // Vacía el valor del campo oculto
            iconoLimpiarCampo(['NombreProveedor', 'ProveedorIdHidden'], 'NombreProveedor');
        }
    }
    if (input.is('#FechaCompra')) {
        var fechaCompra = new Date(valor);
        var ahora = new Date(); // Fecha actual con hora
        var hoy = new Date();
        hoy.setHours(0, 0, 0, 0); // Establecer la hora de hoy a las 00:00:00
        var dosDiasAntes = new Date();
        dosDiasAntes.setDate(hoy.getDate() - 20); // Restar 20 días a la fecha de hoy
        dosDiasAntes.setHours(0, 0, 0, 0); // Establecer la hora de dos días antes a las 00:00:00

        if (fechaCompra.getTime() === ahora.getTime()) {
            // La fecha de compra es exactamente igual a la fecha y hora actual
            // No se realiza ninguna acción, ya que no se permite este caso según tu descripción
        } else if (fechaCompra > ahora) {
            // La fecha de compra es mayor que la fecha y hora actual
            input.addClass('is-invalid');
            spanError.text('La fecha de compra no puede ser mayor que la fecha y hora actual.');
        } else if (fechaCompra < dosDiasAntes) {
            // La fecha de compra es menor que 20 días antes de la fecha de hoy
            input.addClass('is-invalid');
            spanError.text('La fecha de compra no puede ser más de 20 días antes de la fecha actual.');
        } else if (fechaCompra.getFullYear().toString().length !== 4) {
            spanError.text('El año no debe tener mas de 4 caracteres.');
            input.addClass('is-invalid');
        }
    }
    if (input.is('#NumeroFactura')) {
        if (valor.length < 2) {
            input.addClass('is-invalid');
            spanError.text('El número de factura debe tener al menos 2 caracteres.');
        }
    }
    if (input.is('#NombreProducto')) {
        if (valor === "") {
            $('#ProductoIdHidden').val('');
            $('#CantidadPorPresentacionHidden').val('');
            iconoLimpiarCampo(['NombreProducto', 'ProductoIdHidden', 'CantidadPorPresentacionHidden'], 'NombreProducto');
            localStorage.removeItem('filtrocompraUnidadesxProducto');
        }
    }
    if (input.is('#FechaVencimiento')) {
        var fechaVencimiento = new Date(valor);
        var ahora = new Date(); // Fecha actual con hora
        if (fechaVencimiento.getTime() === ahora.getTime()) {
            // La fecha de compra es exactamente igual a la fecha y hora actual
            // No se realiza ninguna acción, ya que no se permite este caso según tu descripción
        } else if (fechaVencimiento < ahora) {
            // La fecha de compra es mayor que la fecha y hora actual
            input.addClass('is-invalid');
            spanError.text('La fecha de vencimiento no puede ser menor que la fecha actual.');
        } else if (fechaVencimiento.getFullYear().toString().length !== 4) {
            spanError.text('El año no debe tener mas de 4 caracteres.');
            input.addClass('is-invalid');
        } else {
            // La fecha de compra es válida
        }
    }
    if (input.is('#NumeroLote')) {
        if (valor.length < 2) {
            input.addClass('is-invalid');
            spanError.text('El número de lote debe tener al menos 2 caracteres.');
        }
    }
    if (input.is('#NombreUnidad')) {
        if (valor === "") {
            $('#UnidadIdHidden').val('');
            $('#CantidadPorUnidad').val('');
            iconoLimpiarCampo(['NombreUnidad', 'UnidadIdHidden', 'CantidadPorUnidad'], 'NombreUnidad');
        }
    }



    if (input.is('#PrecioDeVentaUnitario')) {
        if (valor != '') {
            spanDanger.text('');
        } else {
            spanDanger.text('Validar campo no vacio');
        }
    }
}

// Controlador de eventos para campos de entrada al hacer input en ellos 
$('#NumeroFactura,#NombreProveedor,#NombreUnidad,#NombreProducto, #FechaCompra, #FechaVencimiento, #NumeroLote, #PrecioDeCompra, #PorcentajeGanancia, #PrecioDeVentaPorUnidad, #PrecioDeVentaxUnidadPresentacion, #PrecioDeVentaUnitario').on('input', function () {
    var input = $(this);
    var campo = input.attr('id'); // Obtener el id del input actual como nombre de campo
    validarCampoCompras(input, campo);
});




/*----------------------------------------- No #ros de factura u lote iguales -----------------------------------------------------------------------*/

async function verificarNumeroFactura(numeroFactura) {
    try {
        var numeroF = numeroFactura;
        const data = await new Promise((resolve, reject) => {
            $.ajax({
                url: '/Compras/CompararNumerosDeFactura', // Ruta relativa al controlador y la acción
                type: 'GET',
                data: { NumeroFactura: numeroF }, // Asegúrate de que el nombre del parámetro coincida
                success: function (data) {
                    resolve(data);
                },
                error: function () {
                    alert('Error al verificar el número de factura.');
                    reject(null);
                }
            });
        });
        return data;
    } catch (error) {
        alert(error.message);
        return null;
    }
}
async function verificarNumeroLote(numeroL) {
    try {
        var numeroLote = numeroL;
        const data = await new Promise((resolve, reject) => {
            $.ajax({
                url: '/Compras/CompararNumerosDeLote', // Ruta relativa al controlador y la acción
                type: 'GET',
                data: { NumeroLote: numeroLote}, // Asegúrate de que el nombre del parámetro coincida
                success: function (data) {
                    resolve(data);
                },
                error: function () {
                    alert('Error al verificar el número de lote.');
                    reject(null);
                }
            });
        });
        return data;
    } catch (error) {
        alert(error.message);
        return null;
    }
}

/*----------------------------------------- Filtros --------------------------------------------------------------------------------------------*/

async function filtrarxCategoria() {
    try {
        // Obtener el valor del input y el ícono de limpieza
        const inputElement = document.getElementById('filtroPxC');
        const iconoequis = document.getElementById('compraFiltrarPorCategoria');

        await procesarSeleccion(inputElement, iconoequis);
        
    } catch (error) {
        console.error('Error en filtrarxCategoria:', error);
    }
}
async function procesarSeleccion(inputElement, iconoequis) {
    try {
        if (inputElement.value.length == 0) {
            limpiarFiltroCategoriaCompra();
            return;
        }
        // Obtener todas las opciones del datalist
        const options = document.querySelectorAll('#categorias option');

        // Buscar la opción que coincide con el valor del input
        let selectedOption = null;
        options.forEach(option => {
            if (option.value === inputElement.value) {
                selectedOption = option;
            }
        });
        // Si se encuentra la opción seleccionada, obtener el data-id y realizar la llamada fetch
        if (selectedOption) {
            var filtrocompraxCategoriaActivo = true;
            localStorage.setItem('filtrocompraxCategoriaActivo', filtrocompraxCategoriaActivo); // Guardar la variable en el Local Storage
            inputElement.classList.remove('campoBad'); // Remueve la clase 'campoBad' si se encuentra la opción
            inputElement.classList.add('campoGood'); // Remueve la clase 'campoBad' si se encuentra la opción
            iconoequis.classList.remove('noBe'); // Muestra el ícono de limpieza si se encuentra la opción
            const filtrar = selectedOption.getAttribute('data-id');
            let url = `/Compras/filtrarxCategoria/${filtrar}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Error al cargar los productos');
            }
            const data = await response.json();

            fillList('#productos', data.producto, { ID: 'productoId', Nombre: 'nombreCompletoProducto', Cantidad: 'cantidadPorPresentacion' }, 'No hay productos disponibles','productosCompra');
            fillList('#unidades', data.unidad, { ID: 'unidadId', Nombre: 'nombreCompletoUnidad', Cantidad: 'cantidadPorUnidad' }, 'No hay unidades disponibles','unidadesCompra');
        } else {
            let miVariableRecuperada = localStorage.getItem('filtrocompraxCategoriaActivo');
            if (miVariableRecuperada == null) {
                inputElement.classList.add('campoBad'); // Remueve la clase 'campoBad' si se encuentra la opción
                iconoequis.classList.remove('noBe'); // Muestra el ícono de limpieza si se encuentra la opción
            }
        }
    } catch (error) {
        console.error('Error en procesarSeleccion:', error);
    }
}
async function limpiarFiltroCategoriaCompra() {
    try {
        // Obtiene el elemento input por su ID
        var inputElement = document.getElementById('filtroPxC');
        if (inputElement) {
            // Restablece el valor del input a vacío
            inputElement.value = '';
            inputElement.classList.remove('campoBad'); // Remueve la clase 'campoBad' si se encuentra la opción
            inputElement.classList.remove('campoGood'); // Remueve la clase 'campoBad' si se encuentra la opción

        }

        await limpiarDatalist();


        // Obtiene el ícono de limpieza y lo oculta
        var iconoLimpiar = document.getElementById('compraFiltrarPorCategoria');
        if (iconoLimpiar) {
            iconoLimpiar.classList.add('noBe');
        }

    } catch (error) {
        console.error('Error en limpiarFiltroCategoriaCompra:', error);
    }
}
async function limpiarDatalist() {
    try {

        let miVariableRecuperada = localStorage.getItem('filtrocompraxCategoriaActivo');
        // Compara la variable recuperada con la cadena 'true'
        if (miVariableRecuperada === 'true') {
            // Eliminar la variable del Local Storage
            localStorage.removeItem('filtrocompraxCategoriaActivo');
            // Realiza la llamada fetch para limpiar el filtro
            let url = `/Compras/filtrarxCategoria/0`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Error al cargar los productos');
            }
            const data = await response.json();
            fillList('#productos', data.producto, { ID: 'productoId', Nombre: 'nombreCompletoProducto', Cantidad: 'cantidadPorPresentacion' }, 'No hay productos disponibles', 'productosCompra');
            fillList('#unidades', data.unidad, { ID: 'unidadId', Nombre: 'nombreCompletoUnidad', Cantidad: 'cantidadPorUnidad' }, 'No hay unidades disponibles', 'unidadesCompra');
        }
       
    } catch (error) {
        console.error('Error en limpiarDatalist:', error);
    }
}
async function filtrarxUnidadesxProducto() {
    try {
        var productoId = $('#ProductoIdHidden').val();
        if ($('#checkboxUnidadesxProducto').prop('checked')) {
            if (productoId.length > 0) {
                var miVariable = true;
                localStorage.setItem('filtrocompraUnidadesxProducto', miVariable);
                filtrarDatalistxUnidadesxProducto();
            } else {
                var miVariable = false;
                localStorage.setItem('filtrocompraUnidadesxProducto', miVariable);
                filtrarDatalistxUnidadesxProducto();
            }
        } else {
            var miVariable = false;
            localStorage.setItem('filtrocompraUnidadesxProducto', miVariable);
            filtrarDatalistxUnidadesxProducto();
        }
    } catch (error) {
        console.error('Error en filtrarxUnidadesxProducto:', error);
    }
}
async function filtrarDatalistxUnidadesxProducto() {
    let miVariableRecuperada = localStorage.getItem('filtrocompraUnidadesxProducto');
    var productoId = $('#ProductoIdHidden').val();
    var cantidad = $('#CantidadPorPresentacionHidden').val();

    // Verifica si `cantidad` es un número antes de usarla
    if (cantidad !== null && cantidad !== undefined && cantidad.length > 0) {
        cantidad = parseInt(cantidad);
    } else {
        cantidad = null;
    }

    if (miVariableRecuperada === 'true' && productoId.length >= 1) {
        let url = `/Compras/filtrarUnidadesxProductoDatalist/${productoId}/${cantidad !== null ? cantidad : ''}`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al cargar los productos');
            }

            const data = await response.json();
            fillList('#unidades', data.Unidad, { ID: 'unidadId', Nombre: 'nombreCompletoUnidad', Cantidad: 'cantidadPorUnidad' }, 'No hay unidades disponibles', 'unidadesCompra');

        } catch (error) {
            console.error('Error en filtrarDatalistxUnidadesxProducto:', error);
        }
    } else {
        let url = `/Compras/filtrarUnidadesxProductoDatalist/0/${cantidad !== null ? cantidad : ''}`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al cargar los productos');
            }

            const data = await response.json();
            fillList('#unidades', data.unidad, { ID: 'unidadId', Nombre: 'nombreCompletoUnidad', Cantidad: 'cantidadPorUnidad' }, 'No hay unidades disponibles', 'unidadesCompra');

        } catch (error) {
            console.error('Error en filtrarDatalistxUnidadesxProducto:', error);
        }
    }
}


/*----------------------------------------- LocalStorage --------------------------------------------------------------------------------------------*/



// Función para agregar un número de lote al array y guardarlo en localStorage
async function agregarNumeroLote(numeroLote) {
    // Verificar si ya hay datos en localStorage
    let numerosLote = JSON.parse(localStorage.getItem('numerosLote')) || [];
    let loteExistente = await verificarNumeroLote(numeroLote);
    // Agregar el nuevo número de lote al array si no está presente y loteExistente es "ok"
    if (!numerosLote.includes(numeroLote) && loteExistente == "ok") {
        numerosLote.push(numeroLote);
        localStorage.setItem('numerosLote', JSON.stringify(numerosLote));
        return true;
    } else {
        return false;
    }
}

// Función para eliminar un número de lote del array en localStorage
function eliminarNumeroLote(numeroLote) {
    let numerosLote = JSON.parse(localStorage.getItem('numerosLote')) || [];

    // Filtrar el array para eliminar el número de lote específico
    numerosLote = numerosLote.filter(lote => lote !== numeroLote);

    // Actualizar localStorage con el nuevo array filtrado
    localStorage.setItem('numerosLote', JSON.stringify(numerosLote));
}

// Función para eliminar el array de números de lote del localStorage
function eliminarArrayNumerosLote() {
    localStorage.removeItem('numerosLote');
}

window.onload = function () {
    // Verificar si estamos en la vista de compras
    if (window.location.href.includes('/Compras')) {
        // Verificar y eliminar filtrocompraUnidadesxProducto si existe en localStorage
        if (localStorage.getItem('filtrocompraUnidadesxProducto')) {
            localStorage.removeItem('filtrocompraUnidadesxProducto');
        }

        // Verificar y eliminar numerosLote si existe en localStorage
        if (localStorage.getItem('numerosLote')) {
            localStorage.removeItem('numerosLote');
        }
    }
};
