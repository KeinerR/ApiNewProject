
    // Objeto de compra
    var compra = {
        proveedorId: 0,
        numeroFactura: 0,
        fechaCompra: new Date().toISOString(), // Obtener la fecha actual en formato ISO
        valorTotalCompra: 0,
        estadoCompra: 1,
        detallecompras: []
    };


    //Se Usa Para verificar que el cliente no cambie los campos antes de agregar el detalle  
var verificarProducto = "";
var ganancia = ""; 
var cantidadPorUnidad = "";

//Se usa para dar un tiempo antes de la signacion del id al nombre especifico en los datalist
let timeout = null;

//Capturar el nombre del producto para agregar al detalle de tabla ;)
var nombreProducto = "";

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


// Función para llenar correcgtamente la compra antes agregar productos a la compra
    function agregarProductos() {
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
            } else if(proveedorId === '') {
                $('#ProveedorIdHidden').val(''); // Limpiar el valor del campo ProveedorIdHidden
                mostrarAlertaDataList('Proveedor');
                return;

            } 
        }

        // Actualizar los valores del objeto compra
        compra.proveedorId = proveedorId;
        compra.numeroFactura = numeroFactura;
        compra.fechaCompra = fechaCompra;
        botonAgregar.classList.add('noBe'); // Remover clase is-invalid
        $('#ModalDetallesCompra').modal('show');
        $('#ModalCompra').modal('hide');
       
    }


// Función para agregar un detalle de compra al objeto principal
function agregarDetalleCompraend(objeto) {
    nombreProducto = document.getElementById('NombreProducto').value;
    var detalleCompra = {
        productoId: objeto.productoId,
        unidadId: objeto.unidadId,
        cantidad: objeto.cantidad,
        lotes: [] // Inicialmente sin lotes
    };

    // Aquí es donde se crea el detalle de compra después de la validación del cliente
    var nuevoLote = {
        productoId: detalleCompra.productoId,
        numeroLote: objeto.numeroLote,
        precioCompra: objeto.precioCompra,
        precioPorUnidad: objeto.precioVentaxUnidad,
        precioPorPresentacion: objeto.precioVentaxPresentacion,
        precioPorUnidadProducto: objeto.precioVentaxUnidadPresentacion,
        fechaVencimiento: objeto.fechaVencimiento,
        cantidad: objeto.cantidadLote,
        estadoLote: 1 // Estado por defecto
    };

    detalleCompra.lotes.push(nuevoLote);
    compra.detallecompras.push(detalleCompra);
    LimpiarFormulario();
    agregarFilaDetalle(detalleCompra); // Llama a la función para agregar la fila de detalle a la tabla
}
// Función para agregar un detalle de compra al objeto principal
function agregarDetalleCompra() {
    // Obtener valores de los campos
    var unidad = document.getElementById('UnidadIdHidden').value;
    var productoId = document.getElementById('ProductoIdHidden').value;
    var cantidad = document.getElementById('Cantidad').value;
    var porcentajeAGanar = document.getElementById('PorcentajeGanancia').value;
    cantidadPorUnidad = document.getElementById('CantidadPorUnidad').value;


    // Validar los campos obligatorios y las condiciones necesarias antes de agregar el detalle de compra
    if (productoId != verificarProducto) {
        mostrarAlertaAtencionPersonalizadaConBoton('¡Atención! Parece que has modificado el campo de producto. Por favor, asegúrate de realizar de nuevo el cálculo.');
        noVerCalculo();
        return;
    }
    // Validar campos obligatorios y condiciones
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

    var cantidadLote = cantidad * cantidadUnidad;
    var fechaVencimiento = document.getElementById('FechaVencimiento').value;

    var todolleno = $('.Mensaje').filter(function () {
        return $(this).text() !== '';
    }).length === 0;

    // Validar si los campos están llenos


    // Validar la fecha de vencimiento
    if (!fechaVencimiento || isNaN(new Date(fechaVencimiento))) {
        // Si la fecha no es de tipo date time o es nula, establecerla en '2000-01-01T00:00'
        fechaVencimiento = '2000-01-01T00:00';
    }
    var diferencia = Math.abs(precioCompra - (precioCompraUnidad * cantidad));
    if (diferencia > 10) {
        mostrarAlertaAtencionPersonalizadaConBoton('Has modificado un campo, por favor has click de nuevo en el boton calcular');
        noVerCalculo();
        return;
    }
    var diferenciaTwo = Math.abs(precioCompraUnidad - (precioCompraPorProducto * cantidadUnidad));
    if (diferenciaTwo > 10) {
        mostrarAlertaAtencionPersonalizadaConBoton('¡Atención! Parece que has modificado el campo de unidad. Por favor, asegúrate de dar click de nuevo en  el boton de  cálcular.');
        noVerCalculo();
        return;
    }

    let mensajeAlerta = ``; // Inicializar la variable mensajeAlerta fuera del bloque if
    // Validar si se están vendiendo a un valor menor que al comprado
    if (precioVentaxUnidad < precioCompraUnidad || precioVentaxPresentacion < precioCompraPorProducto || precioVentaxUnidadPresentacion < PrecioDeCompraUnitario) {
        let cantidadMenores = 0; // Variable para contar cuántos son menores
        let confirmaMensajeAlerta = ``;

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
                confirmaMensajeAlerta = `<div id="divAlertaConfirmar"><ul>`;
                mensajeAlerta = `<div id="divAlerta"><strong>Estás vendiendo a un valor menor al que compraste en los siguientes campos:</strong><ul>`;
                //confirmaMensajeAlerta = `<div id="divAlertaConfirmar">`;
                //mensajeAlerta = `<div id="divAlerta"><strong>Estás vendiendo a un valor menor al que compraste en el siguiente campo:</strong><ul>`;
            }

            if (precioVentaxUnidad < precioCompraUnidad) {
                let diferencia = precioVentaxUnidad - precioCompraUnidad;
                let perdida = Math.abs(diferencia);
                // Calcular el porcentaje de pérdida
                var porcentajePerdida = Math.round((perdida / precioCompraUnidad) * 100);
                perdida = Math.abs(perdida).toLocaleString();
                confirmaMensajeAlerta += `<li class="textoAlerta">Precio de venta x Unidad:<br/><span class="textoAlerta">Estás perdiendo ${perdida}</span></li>`;
                /*<p class="textoAlerta">Precio de venta x Unidad:<br /><span class="textoAlerta">Estás perdiendo ${porcentajePerdida}% de lo invertido.</span></p>*/
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
                                cantidad: cantidad,
                                numeroLote: numeroLote,
                                precioCompra: precioCompra,
                                precioVentaxUnidad: precioVentaxUnidad,
                                precioVentaxPresentacion: precioVentaxPresentacion,
                                precioVentaxUnidadPresentacion: precioVentaxUnidadPresentacion,
                                cantidadLote: cantidadLote,
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
                                            cantidad: cantidad,
                                            numeroLote: numeroLote,
                                            precioCompra: precioCompra,
                                            precioVentaxUnidad: precioVentaxUnidad,
                                            precioVentaxPresentacion: precioVentaxPresentacion,
                                            precioVentaxUnidadPresentacion: precioVentaxUnidadPresentacion,
                                            cantidadLote: cantidadLote,
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
    } else if (todolleno) {
        // Mostrar la alerta con SweetAlert para confirmar la acción del usuario
        let mensajeAlerta = `<div id="divAlerta"><strong>Estás esperando ganancias por:</strong><ul>`;
        if (precioVentaxUnidad >= precioCompraUnidad) {
            let diferenciaUnidad = precioVentaxUnidad - precioCompraUnidad;
            let gananciaUnidad = Math.abs(diferenciaUnidad);
            let gananciaUnidadConPuntos = gananciaUnidad.toLocaleString('es-ES');
            let porcentajeGanancia = Math.round((gananciaUnidad / precioCompraUnidad) * 100);
            mensajeAlerta += `<li>x Unidad: <br/> ${gananciaUnidadConPuntos} o ${porcentajeGanancia}%</li>`;
        }
        if (cantidadPresentacion > 1) {
            if (precioVentaxPresentacion > precioVentaxUnidadPresentacion) {

                if (precioVentaxPresentacion > precioCompraPorProducto) {
                    let diferenciaProducto = precioVentaxPresentacion - precioCompraPorProducto;
                    let gananciaProducto = Math.abs(diferenciaProducto);
                    let gananciaProductoConPuntos = gananciaProducto.toLocaleString('es-ES');
                    let porcentajeGanancia = Math.round((gananciaProducto / precioCompraPorProducto) * 100);
                    mensajeAlerta += `<li>x Producto: <br/> ${gananciaProductoConPuntos} o ${porcentajeGanancia}%</li>`;
                }

                if (precioVentaxUnidadPresentacion > PrecioDeCompraUnitario) {
                    let diferenciaUnidadProducto = precioVentaxUnidadPresentacion - PrecioDeCompraUnitario;
                    let gananciaUnidadProducto = Math.abs(diferenciaUnidadProducto);
                    let gananciaUnidadProductoConPuntos = gananciaUnidadProducto.toLocaleString('es-ES');
                    let porcentajeGananciaProducto = Math.round((gananciaUnidadProducto / PrecioDeCompraUnitario) * 100);
                    mensajeAlerta += `<li>x Unidad de Producto: <br/> ${gananciaUnidadProductoConPuntos} o ${porcentajeGananciaProducto}%</li>`;
                }
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
                    cantidad: cantidad,
                    numeroLote: numeroLote,
                    precioCompra: precioCompra,
                    precioVentaxUnidad: precioVentaxUnidad,
                    precioVentaxPresentacion: precioVentaxPresentacion,
                    precioVentaxUnidadPresentacion: precioVentaxUnidadPresentacion,
                    cantidadLote: cantidadLote,
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
                                cantidad: cantidad,
                                numeroLote: numeroLote,
                                precioCompra: precioCompra,
                                precioVentaxUnidad: precioVentaxUnidad,
                                precioVentaxPresentacion: precioVentaxPresentacion,
                                precioVentaxUnidadPresentacion: precioVentaxUnidadPresentacion,
                                cantidadLote: cantidadLote,
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
                        cantidad: cantidad, 
                        numeroLote: numeroLote,
                        precioCompra: precioCompra,
                        precioVentaxUnidad: precioVentaxUnidad,
                        precioVentaxPresentacion: precioVentaxPresentacion,
                        precioVentaxUnidadPresentacion: precioVentaxUnidadPresentacion,
                        cantidadLote: cantidadLote,
                        fechaVencimiento: fechaVencimiento
                    };

                    agregarDetalleCompraend(objeto); // Llamar a la función optimizada con el objeto
                }
            });
        }

    }
}

/*-------------------------------------------------------------------------------------------------------------------------------------*/
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

//Paginado
function cambiarPagina(direccion) {
    const filasPorPagina = 3; // Cambia el número de filas por página según tus necesidades
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
    cellProducto.innerHTML = detalleCompra.productoId;
    cellProducto.setAttribute('title', nombreProducto);
    cellCantidad.innerHTML = detalleCompra.cantidad * cantidadPorUnidad;
    cellPrecioUnitario.innerHTML = ultimoLote.precioCompra / (detalleCompra.cantidad * cantidadPorUnidad);
    cellSubtotal.innerHTML = ultimoLote.precioCompra;
    cellAcciones.innerHTML = '<button onclick="eliminarFilaDetalle(this)">Eliminar</button>';



    //verifica si es necesario que se vea u no el paginado
    verificarPaginado() 
    // Actualizar el valor total
    actualizarValorTotal();
    cambiarPagina(2);

}


// Funcion para eliminar un solo detalle al que se presione el boton
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
   

    if (numeroFactura === '' || fechaCompra === '') {
        mostrarAlertaCampoVacio(numeroFactura === '' ? 'numeroFactura' : 'fechaCompra');
        return;
    } else if (proveedorId === '') { // Corregido a "!=="
        mostrarAlertaDataList('Proveedor');
        return; 
    } else {
        // Actualizar los valores de la compra
        compra.proveedorId = proveedorId;
        compra.numeroFactura = numeroFactura;
        compra.fechaCompra = fechaCompra;

        alert('Compra actualizada');
        $('#ModalCompra').modal('hide');
        $('#ModalDetallesCompra').modal('show');
    }
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
    document.getElementById('NumeroFactura').value = '';
    location.reload();
}
function verCompra() {
    var opcionesCambiarDatosCompra = document.getElementById('opcinesCambiarDatosCompra');
    opcionesCambiarDatosCompra.classList.remove('noSee'); // Remover clase is-invalid
    $('#ModalCompra').modal('show');
    $('#ModalDetallesCompra').modal('hide');
  
}
function noVerDetalle() {
    document.getElementById('agregarDetalle').style.display = 'none';
    document.getElementById('PrincipalCompra').style.display = 'none';
    document.getElementById('DetallesCompra').style.display = 'block';
    document.getElementById('verCompra').style.display = 'block';
    document.getElementById('PrecioBougth').style.display = 'none';
    document.getElementById('PrecioBuy').style.display = 'none';
    document.getElementById('TablaDetalles').style.display = 'flex';

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

function noVerDatosCompra() {
    $('#ModalCompra').modal('hide');
    $('#ModalDetallesCompra').modal('show');
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

    
    inputCantidad.addEventListener('input', function () {
        formatoNumeroINT(this);
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
    function seleccionarOpcionCompra(input, dataList, hiddenInput, campo) {
        var selectedValue = input.value.trim();


        if (/^\d+[a-zA-Z]$/.test(selectedValue)) {
            // Si selectedValue es un número seguido de una letra, realizar la acción correspondiente
            console.log('Número seguido de letra encontrado:', selectedValue);
            var selectedOptionByName = Array.from(dataList.options).find(function (option) {
                return option.value === selectedValue;
            });

        } else {
            var selectedOptionByName = Array.from(dataList.options).find(function (option) {
                return option.value === selectedValue;
            });
        } if (/^\d+$/.test(selectedValue)) {
            var selectedOptionById = Array.from(dataList.options).find(function (option) {
                return option.getAttribute('data-id') === selectedValue;
            });
            if (!selectedOptionById) {
                Swal.fire({
                    icon: 'warning',
                    title: `No se encontró ningún resultado con este ID de ${campo}`,
                    showConfirmButton: false,
                    timer: 1800 // Duración rápida en milisegundos (1.5 segundos)
                });
                input.value = '';
                input.dispatchEvent(new Event('input'));
            }
        }

        if (selectedOptionByName) {
            // Si se seleccionó un nombre del datalist, mostrar el nombre y enviar el data-id al input hidden
            input.value = selectedOptionByName.value;
            hiddenInput.value = selectedOptionByName.getAttribute('data-id');

            // Verificar si es el campo NombreProducto y el resto del código...
        } else if (selectedOptionById) {
            // Si se ingresó un ID en el campo de entrada, mostrar el nombre correspondiente y enviar el ID al input hidden
            input.value = selectedOptionById.value;
            hiddenInput.value = selectedOptionById.getAttribute('data-id');

            // Verificar si es el campo NombreProducto y el resto del código...
        }
        if (selectedOptionByName) {
            // Si se seleccionó un nombre del datalist, mostrar el nombre y enviar el data-id al input hidden
            input.value = selectedOptionByName.value;
            hiddenInput.value = selectedOptionByName.getAttribute('data-id');

            // Verificar si es el campo NombreProducto
            if (input.id === 'NombreProducto') {
                document.getElementById('NombreProducto').value = selectedOptionByName.value;
                document.getElementById('CantidadPorPresentacionHidden').value = selectedOptionByName.getAttribute('data-cantidad') || '';
            }
            // Verificar si es el campo NombreUnidad
            if (input.id === 'NombreUnidad') {
                document.getElementById('CantidadPorUnidad').value = selectedOptionByName.getAttribute('data-cantidad') || '';
            }
        } else if (selectedOptionById) {
            // Si se ingresó un ID en el campo de entrada, mostrar el nombre correspondiente y enviar el ID al input hidden
            input.value = selectedOptionById.value;
            hiddenInput.value = selectedOptionById.getAttribute('data-id');

            // Verificar si es el campo NombreProducto
            if (input.id === 'NombreProducto') {
                document.getElementById('NombreProducto').value = selectedOptionById.value;
                document.getElementById('CantidadPorPresentacionHidden').value = selectedOptionById.getAttribute('data-cantidad') || '';
            }
            // Verificar si es el campo NombreUnidad
            if (input.id === 'NombreUnidad') {
                document.getElementById('CantidadPorUnidad').value = selectedOptionById.getAttribute('data-cantidad') || '';
            }
        }
    }




    // Asignar función de selección a los campos NombreProveedor, NombreProducto y NombreUnidad
    document.getElementById('NombreProveedor').addEventListener('input', function () {
        if (this.value.length > 5) {
            clearTimeout(timeout);
            seleccionarOpcionCompra(this, document.getElementById('proveedores'), document.getElementById('ProveedorIdHidden'), 'proveedor');
        }else {
        timeout = setTimeout(() => {
            seleccionarOpcionCompra(this, document.getElementById('proveedores'), document.getElementById('ProveedorIdHidden'), 'proveedor');
        }, 700); // Esperar 500 milisegundos (0.5 segundos) antes de ejecutar la función
        }
        
    });
   
    document.getElementById('NombreProducto').addEventListener('input', function () {
        if (this.value.length > 5) {
            clearTimeout(timeout);
            seleccionarOpcionCompra(this, document.getElementById('productos'), document.getElementById('ProductoIdHidden'), 'Producto');
        } else {
            timeout = setTimeout(() => {
                seleccionarOpcionCompra(this, document.getElementById('productos'), document.getElementById('ProductoIdHidden'), 'Producto');
            }, 700); // Esperar 500 milisegundos (0.5 segundos) antes de ejecutar la función
        }
    });

    document.getElementById('NombreUnidad').addEventListener('input', function () {
        if (this.value.length > 5) {
            clearTimeout(timeout);
            seleccionarOpcionCompra(this, document.getElementById('unidades'), document.getElementById('UnidadIdHidden'), 'Unidad');
        } else {
            timeout = setTimeout(() => {
                seleccionarOpcionCompra(this, document.getElementById('unidades'), document.getElementById('UnidadIdHidden'), 'Unidad');
            }, 700); // Esperar 500 milisegundos (0.5 segundos) antes de ejecutar la función
        }
    });



    // Agregar un evento de clic al botón "Calcular"
    document.getElementById('btnCalcular').addEventListener('click', () => {
      
        const productoId = document.getElementById('ProductoIdHidden').value;
        const porcentajeAGanarConPuntos = document.getElementById('PorcentajeGanancia').value;
        ganancia = porcentajeAGanarConPuntos; 
        verificarProducto = productoId;
        const cantidad = document.getElementById('Cantidad').value;
        const precioCompraConPuntos = document.getElementById('PrecioDeCompra').value;
        const unidad = document.getElementById('CantidadPorUnidad').value;
        const cantidadPorPresentacion = document.getElementById('CantidadPorPresentacionHidden').value;

        const producto = document.getElementById('NombreProducto').value;
        const unidadId = document.getElementById('UnidadIdHidden').value;
        const datalist = [
            { id: 'UnidadIdHidden', nombre: 'Unidad' },
            { id: 'ProductoIdHidden', nombre: 'Producto' },
        ];
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
            event.preventDefault();
            return;
        }
        const precioCompra = parseFloat(precioCompraConPuntos.replace(/\./g, ''));
        const porcentajeAGanar = parseFloat(porcentajeAGanarConPuntos.replace(/\./g, ''));

        if (isNaN(precioCompra) || isNaN(porcentajeAGanar)) {
            mostrarAlertaAtencionPersonalizadaConBoton('El precio de compra y el porcentaje a ganar deben ser números válidos.');
            noVerCalculo();
            return;
        }

        /* Precio por unidad*/
        const precioPorUnidadIndividualSinPuntos = precioCompra / cantidad;

        /* Precio por producto*/
        const cantidadUnitariaPorPresentacionSinPuntos = precioCompra / (unidad * cantidad);
        // Precio por unidad de producto
        const precioIndividualUnitarioSinPuntos = (precioCompra / unidad) / (cantidadPorPresentacion * cantidad);

        /* Precio venta por unidad*/
        const precioVentaIndividualUnitarioSinPuntos = precioPorUnidadIndividualSinPuntos + (precioPorUnidadIndividualSinPuntos * porcentajeAGanar / 100);
        /* Precio venta por producto*/
        const precioVentaPorPresentacionSinPuntos = cantidadUnitariaPorPresentacionSinPuntos + (cantidadUnitariaPorPresentacionSinPuntos * porcentajeAGanar / 100);
        // Precio venta por unidad de producto
        const precioVentaPorUnidadDeProducto = precioIndividualUnitarioSinPuntos + (precioIndividualUnitarioSinPuntos * porcentajeAGanar / 100);

        const precioIndividualUnitario = formatNumber(Math.round(precioIndividualUnitarioSinPuntos));
        const cantidadUnitariaPorPresentacion = formatNumber(Math.round(cantidadUnitariaPorPresentacionSinPuntos));
        const precioPorUnidad = formatNumber(Math.round(precioPorUnidadIndividualSinPuntos));

        const precioVentaPorUnidad = formatNumber(Math.round(precioVentaIndividualUnitarioSinPuntos));
        const precioVentaPorProducto = formatNumber(Math.round(precioVentaPorPresentacionSinPuntos));
        const precioVentaIndividualUnitario = formatNumber(Math.round(precioVentaPorUnidadDeProducto));

        // Mostrar los resultados en los campos correspondientes
        if (precioPorUnidadIndividualSinPuntos < 100) {
            mostrarAlertaAtencionPersonalizadaConBoton('El precio de compra es demasiado bajo');
            noVerCalculo();
            return;
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
    });

    document.getElementById('btnCalcularVenta').addEventListener('click', () => {
        // Obtener los valores de los campos
        const precioVentaxProductoConPuntos = document.getElementById('PrecioDeVentaUnitario').value;

        const precioVentaxProducto = precioVentaxProductoConPuntos.replace(/\./g, '');

        // Verificar si los campos requeridos están completos
        if (precioVentaxProducto === '') {
            MostrarAlerta2('Ingresa un valor antes para poder hacer el calculo');
            return;
        }
        const cantidadPorPresentacion = document.getElementById('CantidadPorPresentacionHidden').value;
        const precioUnitarioPorPresentacion = formatNumber(Math.ceil(precioVentaxProducto / cantidadPorPresentacion));


        document.getElementById('PrecioDeVentaxUnidadPresentacion').value = precioUnitarioPorPresentacion;
    });

    document.getElementById('checkboxNoVencimiento').addEventListener('click', cambioFechaVencimiento);

        
});






/*LIMPIADORES */
// Se uas para eliminar todos los detalles de la tabla en la venta modal
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
    document.getElementById('NombreProducto').value = '';
    document.getElementById('ProductoIdHidden').value = '';
    document.getElementById('UnidadIdHidden').value = '';
    document.getElementById('CantidadPorUnidad').value = '';
    document.getElementById('CantidadPorPresentacionHidden').value = 1;
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





/*Validaciones */
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
$('#NumeroFactura, #NombreProveedor, #FechaCompra, #NombreProducto, #FechaVencimiento, #NumeroLote, #NombreUnidad, #PrecioDeCompra, #PorcentajeGanancia, #PrecioDeVentaPorUnidad, #PrecioDeVentaxUnidadPresentacion, #PrecioDeVentaUnitario').on('input', function () {
    var input = $(this);
    var campo = input.attr('id'); // Obtener el id del input actual como nombre de campo
    validarCampoCompras(input, campo);
});


