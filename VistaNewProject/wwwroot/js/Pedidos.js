// Function to update the order status

function actualizarEstadoPedido(PedidoId, estado) {
    console.log(PedidoId);
    console.log(estado); // Verificar que se esté recibiendo el estado correctamente

    let estadoPedido = ""; // Por defecto, el estado del pedido es una cadena vacía

    // Determinar el estado del pedido basado en el valor recibido
    if (estado === "Pendiente" || estado === "Anulado" || estado === "Realizado" || estado === "Cancelado") {
        estadoPedido = estado;
    } else {
        console.error("Estado de pedido inválido:", estado);
        return; // Salir de la función si el estado del pedido es inválido
    }

    console.log("Estado actual del pedido:", estadoPedido); // Imprimir el estado actual del pedido

    fetch(`/Pedidos/UpdateEstadoPedido/${PedidoId}?estado=${estadoPedido}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
                location.reload(); // Recargar la página para reflejar los cambios

                console.log("Estado actualizado correctamente");

                // Llamar al método DescontardeInventario pasando PedidoId y tipo "Pedido"
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


//// Function to update the order status options based on service type
//function updateEstadoPedido() {
//    var tipo = document.getElementById("TipoServicio").value;
//    var estado = document.getElementById("EstadoPedido");

//    if (tipo === "Caja") {
//        estado.value = "Realizado";
//        for (var i = 0; i < estado.options.length; i++) {
//            if (estado.options[i].value !== "Realizado") {
//                estado.options[i].style.display = 'none';
//            } else {
//                estado.options[i].style.display = 'block';
//            }
//        }
//    } else if (tipo === "Domicilio") {
//        estado.value = "Pendiente";
//        for (var i = 0; i < estado.options.length; i++) {
//            if (estado.options[i].value !== "Pendiente") {
//                estado.options[i].style.display = 'none';
//            } else {
//                estado.options[i].style.display = 'block';
//            }
//        }
//    } else {
//        for (var i = 0; i < estado.options.length; i++) {
//            estado.options[i].style.display = 'block';
//        }
//        estado.value = ""; // Reset to default or desired value if needed
//    }
//}

//// Run the function on page load to ensure the correct state if the form is pre-filled
//document.addEventListener("DOMContentLoaded", function () {
//    updateEstadoPedido();
//});

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
//document.addEventListener('DOMContentLoaded', function () {
//    var fechaPedido = document.getElementById("FechaPedido");

//    var fechaActual = new Date();
//    var formateada = fechaActual.toISOString().slice(0, 16);

//    fechaPedido.value = formateada;
//});

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

function searchPedido() {
    var input = $('#buscarPedido').val().trim().toLowerCase();       //Obtiene el valor del buscadpor
    var rows = document.querySelectorAll('.pedidosPaginado');       //Obtiene el tr de Usuario Paginado.
    var rowsTodos = document.querySelectorAll('.Pedidos');      //Obtiene el tr de Usuario que esta en none
    var icon = document.querySelector('#btnNavbarSearch i');    //Obtiene el icino de buscar
    var contador = document.querySelector('.contador');        //Obtiene la columna que tiene el # 
    var contadores = document.querySelectorAll('.contadorB'); //Obtiene el contadorB que esta en none y lo hace visible para mostrar el consecutivo y el ID
    var paginationContainer = document.getElementById('paginationContainer');
    if (input === "") {
        rows.forEach(function (row) { //Esconde los usuarios paginado
            row.style.display = '';
        });
        contadores.forEach(function (contador) {
            contador.classList.add('noIs'); // Removemos la clase 'noIs' para mostrar la columna
        });
        icon.className = 'fas fa-search';
        icon.style.color = 'white';
        contador.innerText = '#';
        paginationContainer.classList.remove('noBe'); // Oculta el contenedor de paginación

    } else {
        rows.forEach(function (row) {
            row.style.display = 'none';
        });
        contadores.forEach(function (contador) {
            contador.classList.remove('noIs'); // Removemos la clase 'noIs'
        });
        icon.className = 'fas fa-times';
        icon.style.color = 'white';
        contador.innerText = 'ID';
        paginationContainer.classList.add('noBe'); // Oculta el contenedor de paginación

    }

    rowsTodos.forEach(function (row) {
        if (input === "") {
            row.style.display = 'none';
        } else {
            var pedidoId = row.querySelector('td:nth-child(2)').textContent.trim().toLowerCase();
            var cliente = row.querySelector('td:nth-child(3)').textContent.trim().toLowerCase();
            var tipoServicio = row.querySelector('td:nth-child(4)').textContent.trim().toLowerCase();
            var fechaPedido = row.querySelector('td:nth-child(5)').textContent.trim().toLowerCase();
            row.style.display = (input === "" || pedidoId.includes(input) || fechaPedido.includes(input) || tipoServicio.includes(input) || cliente.includes(input)) ? 'table-row' : 'none';
        }
    });
}

function vaciarInputPedido() {
    var paginationContainer = document.getElementById('paginationContainer');
    document.getElementById('buscarPedido').value = "";
    var icon = document.querySelector('#btnNavbarSearch i');
    icon.className = 'fas fa-search';
    icon.style.color = 'white';

    var contador = document.querySelector('.contador');
    contador.innerText = '#';
    var contadores = document.querySelectorAll('.contadorB');
    contadores.forEach(function (contador) {
        contador.classList.add('noIs'); // Removemos la clase 'noIs'
    });

    var rows = document.querySelectorAll('.pedidosPaginado');
    rows.forEach(function (row) {
        row.style.display = 'table-row';
    });

    var rowsTodos = document.querySelectorAll('.Pedidos');

    rowsTodos.forEach(function (row) {
        row.style.display = 'none';
    });
    paginationContainer.classList.remove('noBe'); // Oculta el contenedor de paginación

}
