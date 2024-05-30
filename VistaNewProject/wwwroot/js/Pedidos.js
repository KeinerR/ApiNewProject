

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


function validarpedido() {
    var cliente = document.getElementById("ClienteIdTxt").value;
    return validarCliente(cliente);
}





function validarCliente(cliente) {
    var nombreclienteInput = document.getElementById("ClienteIdTxt");
    var clienteIdInput = document.getElementById("ClienteIdHidden");
    var nombreClienteError = document.getElementById("ClienteIdspan");

    cliente = cliente.trim();

    if (!clienteIdInput.value || cliente === "") {
        mostrarError(nombreclienteInput, nombreClienteError, "El campo cliente no es el que esta registrardo ");
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

//$('#ClienteIdTxt').on('input', function () {
//    clearTimeout(timeout);
//    timeout = setTimeout(() => {
//        var selectedValue = $(this).val();
//        var selectedUserId = $('#clientesList').find('option[value="' + selectedValue + '"]').attr('data-id');

//        console.log("cliente seleccionado:", selectedValue);
//        $('#ClienteIdHidden').val(selectedUserId);
//        console.log("Id", selectedUserId)
//    }, 650);
//});


document.addEventListener('DOMContentLoaded', function () {
    var fechaPedido = document.getElementById("FechaPedido");

    var fechaActual = new Date();
    var formateada = fechaActual.toISOString().slice(0, 16);


    fechaPedido.value = formateada;


    $("#ClienteIdTxt").on("blur", function () {
        var nombreCliente = $(this).val().trim();  // Obtener el valor del input y eliminar espacios en blanco
        if (nombreCliente === "") {
            $("#ClienteIdHidden").val("");  // Limpiar el campo oculto si el campo de texto está vacío
        }
        validarCliente(nombreCliente);  // Llamar a la función de validación
    });

    $('#ClienteIdTxt').on('input', function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            seleccionarOpcion(this, document.getElementById('clientesList'), document.getElementById('ClienteIdHidden'));
        }, 650);
    });
});



document.getElementById('buscarPedido').addEventListener('input', function () {
    var input = this.value.trim().toLowerCase();
    var rows = document.querySelectorAll('.pedidosPaginado');

    if (input === "") {
        rows.forEach(function (row) {
            row.style.display = '';
        });
        var icon = document.querySelector('#btnNavbarSearch i');
        icon.className = 'fas fa-search';
        icon.style.color = 'white';
    } else {
        rows.forEach(function (row) {
            row.style.display = 'none';
        });
        var icon = document.querySelector('#btnNavbarSearch i');
        icon.className = 'fas fa-times';
        icon.style.color = 'white';
    }
    var rowsTodos = document.querySelectorAll('.Pedidos');

    rowsTodos.forEach(function (row) {
        if (input === "") {
            row.style.display = 'none';
        } else {
            var clienteId = row.querySelector('td:nth-child(1)').textContent.trim().toLowerCase();
            var tipoP = row.querySelector('td:nth-child(2)').textContent.trim().toLowerCase();
            var fechaP = row.querySelector('td:nth-child(3)').textContent.trim().toLowerCase();

            row.style.display = (clienteId.includes(input) || tipoP.includes(input) || fechaP.includes(input)) ? 'table-row' : 'none';
        }
    });
});

function vaciarInput() {
    document.getElementById('buscarPedido').value = "";
    var icon = document.querySelector('#btnNavbarSearch i');
    icon.className = 'fas fa-search';
    icon.style.color = 'gray';

    var rows = document.querySelectorAll('.pedidosPaginado');
    rows.forEach(function (row) {
        row.style.display = 'table-row';
    });

    var rowsTodos = document.querySelectorAll('.Pedidos');
    rowsTodos.forEach(function (row) {
        row.style.display = 'none';
    });
}

