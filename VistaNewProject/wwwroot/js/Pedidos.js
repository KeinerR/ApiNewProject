

function actualizarEstadoDomicilio(DomicilioId, estado) {
    console.log(DomicilioId);
    let estadodomiclio = ""; // Por defecto, el estado del pedido es una cadena vacía

    // Determinar el estado del pedido basado en el valor recibido
    if (estado === "Pendiente" ||  estado === "Realizado" || estado === "Cancelado") {
        estadodomiclio = estado;
    } else {
        console.error("Estado de pedido no válido:", estado);
        return; // Salir de la función si el estado del pedido no es válido
    }

    console.log("Estado actual del pedido:", estadodomiclio); // Imprimir el estado actual del pedido

    fetch(`https://localhost:7013/api/Domicilios/UpdateEstadoDomicilio/${DomicilioId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ EstadoDomicilio: estadodomiclio })
    })
        .then(response => {
            if (response.ok) {
                console.log("Estado actualizado correctamente");

                // Llama al método DescontardeInventario pasando el DomicilioId y tipo "Domicilio"
                $.ajax({
                    url: '/Pedidos/DescontardeInventario',
                    type: 'GET',
                    data: { id: DomicilioId, tipo: "Domicilio" },
                    success: function (response) {
                        console.log("Inventario descontado correctamente");
                        location.reload(); // Recargar la página para reflejar los cambios
                    },
                    error: function (xhr, status, error) {
                        console.error("Error al descontar el inventario:", error);
                    }
                });
            } else {
                console.error('Error al actualizar el estado del pedido');
            }
        })
        .catch(error => {
            console.error('Error de red:', error);
        });
}

function actualizarEstadoPedido(PedidoId, estado) {
    console.log(PedidoId);
    let estadoPedido = ""; // Por defecto, el estado del pedido es una cadena vacía

    // Determinar el estado del pedido basado en el valor recibido
    if (estado === "Pendiente" || estado === "Anulado" || estado === "Realizado" || estado === "Cancelado") {
        estadoPedido = estado;
    } else {
        console.error("Estado de pedido no válido:", estado);
        return; // Salir de la función si el estado del pedido no es válido
    }

    console.log("Estado actual del pedido:", estadoPedido); // Imprimir el estado actual del pedido

    fetch(`https://localhost:7013/api/Pedidos/UpdateEstadoPedido/${PedidoId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ EstadoPedido: estadoPedido })
    })
        .then(response => {
            if (response.ok) {
                location.reload(); // Recargar la página para reflejar los cambios

                console.log("Estado actualizado correctamente");

                // Llama al método DescontardeInventario pasando el PedidoId y tipo "Pedido"
                return $.ajax({
                    url: '/Pedidos/DescontardeInventario',
                    type: 'GET',
                    data: { id: PedidoId, tipo: "Pedido" }
                });
            } else {
                throw new Error('Error al actualizar el estado del pedido');
            }
        })
        .then(response => {
            console.log("Inventario descontado correctamente");
            location.reload(); // Recargar la página para reflejar los cambios
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function updateEstadoPedido() {
    var tipo = document.getElementById("TipoServicio").value;
    var estado = document.getElementById("EstadoPedido");

    if (tipo === "Caja") {
        estado.value = "Realizado";
        for (var i = 0; i < estado.options.length; i++) {
            if (estado.options[i].value !== "Realizado") {
                estado.options[i].style.display = 'none';
            } else {
                estado.options[i].style.display = 'block';
            }
        }
    } else if (tipo === "Domicilio") {
        estado.value = "Pendiente";
        for (var i = 0; i < estado.options.length; i++) {
            if (estado.options[i].value !== "Pendiente") {
                estado.options[i].style.display = 'none';
            } else {
                estado.options[i].style.display = 'block';
            }
        }
    } else {
        for (var i = 0; i < estado.options.length; i++) {
            estado.options[i].style.display = 'block';
        }
        estado.value = ""; // Reset to default or desired value if needed
    }
}

// Run the function on page load to ensure the correct state if the form is pre-filled
document.addEventListener("DOMContentLoaded", function () {
    updateEstadoPedido();
});

document.addEventListener("DOMContentLoaded", function () {
    // Obtener el elemento de input de fecha
    var fechaInput = document.getElementById("FechaPedido");

    // Obtener la fecha y hora actual en formato ISO8601
    var now = new Date().toISOString().slice(0, 16); // Agregamos la parte de la hora

    // Establecer el valor del campo de entrada de fecha y hora
    fechaInput.value = now;

    // Establecer el atributo "min" para evitar fechas pasadas
    fechaInput.min = now;
    fechaInput.max = now;

    // Agregar un evento de cambio al elemento de input de fecha
    fechaInput.addEventListener("change", function () {
        // Obtener la fecha actual
        var fechaActual = new Date(now);
        // Obtener la fecha ingresada por el usuario
        var fechaIngresada = new Date(this.value);

        // Verificar si la fecha ingresada es mayor que la fecha actual
        if (fechaIngresada > fechaActual) {
            // Si la fecha ingresada es mayor, restaurar la fecha actual en el campo de fecha
            this.value = now;
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    var clienteIdTxt = document.getElementById("ClienteIdTxt");
    var clienteIdHidden = document.getElementById("ClienteIdHidden");
    var form = document.querySelector('form');

    clienteIdTxt.addEventListener("input", function () {
        var option = document.querySelector('option[value="' + this.value + '"]');
        if (option) {
            clienteIdTxt.value = option.value; // Mostrar el nombre de la entidad
            clienteIdHidden.value = option.getAttribute('data-cliente-id'); // Establecer el ID real
        } else {
            clienteIdHidden.value = ''; // Limpiar el ID si no se selecciona ninguna opción
        }
    });

    form.addEventListener('submit', function (event) {
        if (clienteIdTxt.value.trim() === '') {
            event.preventDefault(); // Evitar el envío del formulario
            // Mostrar mensaje de error con SweetAlert
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Por favor, complete el campo de Cliente'
            });
        }
    });
});

