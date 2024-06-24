// Function to update the order status
function actualizarEstadoPedido(PedidoId, estado) {
    console.log(PedidoId);
    let estadoPedido = ""; // By default, the order status is an empty string

    // Determine the order status based on the received value
    if (estado === "Pendiente" || estado === "Anulado" || estado === "Realizado" || estado === "Cancelado") {
        estadoPedido = estado;
    } else {
        console.error("Invalid order status:", estado);
        return; // Exit the function if the order status is invalid
    }

    console.log("Current order status:", estadoPedido); // Print the current order status

    fetch(`http://optimusweb-001-site1.ctempurl.com/api/Pedidos/UpdateEstadoPedido/${PedidoId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ EstadoPedido: estadoPedido })
    })
        .then(response => {
            if (response.ok) {
                location.reload(); // Reload the page to reflect the changes

                console.log("Status updated successfully");

                // Call the DescontardeInventario method passing the PedidoId and type "Pedido"
                return $.ajax({
                    url: '/Pedidos/DescontardeInventario',
                    type: 'GET',
                    data: { id: PedidoId, tipo: "Pedido" }
                });
            } else {
                throw new Error('Error updating the order status');
            }
        })
        .then(response => {
            console.log("Inventory discounted successfully");
            location.reload(); // Reload the page to reflect the changes
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Function to update the order status options based on service type
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

// Function to validate the order before submission
function validarpedido() {
    var cliente = document.getElementById("Clientes").value;
    return validarCliente(cliente);
}

// Function to validate the client
function validarCliente(cliente) {
    var nombreclienteInput = document.getElementById("Clientes");
    var clienteIdInput = document.getElementById("ClinteHiden");
    var nombreClienteError = document.getElementById("clienteerror");

    cliente = cliente.trim();

    if (!clienteIdInput.value || cliente === "") {
        mostrarError(nombreclienteInput, nombreClienteError, "El campo cliente no es el que está registrado ");
        return false;
    } else {
        quitarError(nombreclienteInput, nombreClienteError);
    }

    return true;
}

// Function to show error message
function mostrarError(inputElement, errorElement, errorMessage) {
    inputElement.classList.add("is-invalid");
    errorElement.textContent = errorMessage;
}

// Function to remove error message
function quitarError(inputElement, errorElement) {
    inputElement.classList.remove("is-invalid");
    errorElement.textContent = "";
}

// Set the current date and time in the FechaPedido input
document.addEventListener('DOMContentLoaded', function () {
    var fechaPedido = document.getElementById("FechaPedido");

    var fechaActual = new Date();
    var formateada = fechaActual.toISOString().slice(0, 16);

    fechaPedido.value = formateada;
});

$("#Clientes").on("change", function () {
    var inputValue = $(this).val();
    var selectedOption = $("#clientes option").filter(function () {
        return $(this).val() === inputValue || $(this).data("id") == inputValue; // Ensure type coercion for numeric comparison
    });

    if (selectedOption.length) {
        $("#ClinteHiden").val(selectedOption.data("id"));
        $("#Clientes").val(selectedOption.val()); // Set the Clientes input to the name of the entity
        quitarError(this, document.getElementById("clienteerror"));
    } else {
        // Check if the entered value is a number
        if (!isNaN(parseFloat(inputValue)) && isFinite(inputValue)) {
            var option = $("#clientes option[data-id='" + inputValue + "']");
            if (option.length) {
                $("#ClinteHiden").val(inputValue);
                $("#Clientes").val(option.val()); // Set the Clientes input to the name of the entity
            } else {
                $("#ClinteHiden").val("");
                $("#Clientes").val(""); // Clear the Clientes input if no entity is found
            }
        } else {
            $("#ClinteHiden").val("");
            $("#Clientes").val(""); // Clear the Clientes input if the value is not a valid number
        }
    }
});

// Add event listener to validate the form on submission
document.querySelector('form').addEventListener('submit', function (event) {
    if (!validarpedido()) {
        event.preventDefault(); // Prevent form submission if validation fails
    }
});// Función para vaciar el input de búsqueda
