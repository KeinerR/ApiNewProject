

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



function validarpedido() {
    var cliente = document.getElementById("ClienteIdTxt").value;
    var isValid = true;
    if (!validarCliente(cliente)) {
        isValid = false;
    }
    return isValid;
}



$("#ClienteIdTxt").on("input", function () {
    validarCliente(this.value);
});


// Función para validar el cliente en tiempo real
function validarCliente(cliente) {
    var nombreclienteInput = document.getElementById("ClienteIdTxt");
    var nombreClienteError = document.getElementById("ClienteIdspan");
    var clienteIdInput = document.getElementById("ClienteIdHidden");

    cliente = cliente.trim(); // Elimina espacios en blanco al principio y al final del valor

    if (!clienteIdInput.value || cliente === "") {
        mostrarError(nombreclienteInput, nombreClienteError, "El campo cliente está vacío o no está registrado.");
        clienteIdInput.value = ""; // Limpiar el campo hidden
        return false;
    } else {
        quitarError(nombreclienteInput, nombreClienteError);
    }
    return true;
}

function mostrarError(inputElement, errorElement, errorMessage) {
    inputElement.classList.add("is-invalid");
    errorElement.textContent = errorMessage;
}

function quitarError(inputElement, errorElement) {
    inputElement.classList.remove("is-invalid");
    errorElement.textContent = "";
}









