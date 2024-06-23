function agregarLote() {
    const detalleCompraId = document.getElementById('DetalleCompraId').value;
    const productoId = document.getElementById('ProductoId').value;
    const numeroLote = document.getElementById('NumeroLote').value;
    const precioCompra = document.getElementById('PrecioCompra').value;
    const precioDetal = document.getElementById('PrecioDetal').value;
    const precioxMayor = document.getElementById('PrecioxMayor').value;
    const fechaVencimiento = document.getElementById('FechaVencimiento').value;
    const cantidad = document.getElementById('Cantidad').value;
    const estadoLote = document.getElementById('EstadoLote').value;

    const loteObjeto = {
        DetalleCompraId: detalleCompraId,
        ProductoId: productoId,
        NumeroLote: numeroLote,
        PrecioCompra: precioCompra,
        PrecioDetal: precioDetal,
        PrecioxMayor: precioxMayor,
        FechaVencimiento: fechaVencimiento,
        Cantidad: cantidad,
        EstadoLote: estadoLote
    };

    fetch('https://localhost:7013/api/Lotes/InsertarLote', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loteObjeto)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ocurri� un error al enviar la solicitud.');
            }
            return response.json();
        })
        .then(data => {
            console.log('Respuesta del servidor:', data);
            location.reload(); // Recargar la p�gina
        })
        .catch(error => {
            console.error('Error:', error);
        });
}



function obtenerDatosLote(loteId) {
    fetch(`https://localhost:7013/api/Lotes/GetLoteById?Id=${loteId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos de la lote.');
            }
            return response.json();
        })
        .then(lote => {
            // Llenar los campos del formulario modal con los datos del cliente
            document.getElementById('LoteId').value = lote.loteId;
            document.getElementById('DetalleCompraId').value = lote.detalleCompraId;
            document.getElementById('ProductoId').value = lote.productoId;
            document.getElementById('NumeroLote').value = lote.numeroLote;
            document.getElementById('PrecioCompra').value = lote.precioCompra;
            document.getElementById('PrecioDetal').value = lote.precioDetal;
            document.getElementById('PrecioxMayor').value = lote.precioxMayor;
            document.getElementById('FechaVencimiento').value = lote.fechaVencimiento;
            document.getElementById('Cantidad').value = lote.cantidad;
            document.getElementById('EstadoLote').value = lote.estadoLote;

            // Cambiar el t�tulo de la ventana modal
            document.getElementById('TituloModal').innerText = 'Editar lote';
            // Ocultar el bot�n "Agregar" y mostrar el bot�n "Actualizar Usuario"
            document.getElementById('btnGuardar').style.display = 'none';
            document.getElementById('botonEditarar').style.display = 'inline-block'; // Mostrar el bot�n "Actualizar Usuario"
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function ActualizarLote() {
    const loteId = document.getElementById('LoteId').value;
    const detalleCompraId = document.getElementById('DetalleCompraId').value;
    const productoId = document.getElementById('ProductoId').value;
    const numeroLote = document.getElementById('NumeroLote').value;
    const precioCompra = document.getElementById('PrecioCompra').value;
    const precioDetal = document.getElementById('PrecioDetal').value;
    const precioxMayor = document.getElementById('PrecioxMayor').value;
    const fechaVencimiento = document.getElementById('FechaVencimiento').value;
    const cantidad = document.getElementById('Cantidad').value;
    const estadoLote = document.getElementById('EstadoLote').value;

    const loteObjeto = {
        LoteId: loteId,
        DetalleCompraId: detalleCompraId,
        ProductoId: productoId,
        NumeroLote: numeroLote,
        PrecioCompra: precioCompra,
        PrecioDetal: precioDetal,
        PrecioxMayor: precioxMayor,
        FechaVencimiento: fechaVencimiento,
        Cantidad: cantidad,
        EstadoLote: estadoLote
    };

    fetch(`https://localhost:7013/api/Lotes/UpdateLotes`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loteObjeto)
    })
        .then(response => {
            if (response.ok) {
                alert('Lote actualizadO correctamente.');
                location.reload(true); // Recargar la p�gina despu�s de la actualizaci�n
            } else {
                alert("Error en la actualizaci�n. Por favor, int�ntalo de nuevo m�s tarde.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Error en la actualizaci�n. Por favor, int�ntalo de nuevo m�s tarde.");
        });
}

function eliminarLote(loteId) {
    // Hacer la solicitud DELETE al servidor para eliminar la lote
    fetch(`https://localhost:7013/api/Lotes/DeleteLote/${loteId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar la lote.');
            }
            // Aqu� puedes manejar la respuesta si es necesario
            console.log('Lote eliminado correctamente.');
            // Recargar la p�gina o actualizar la lista de clientes, seg�n sea necesario
            location.reload(); // Esto recarga la p�gina
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function limpiarFormulario() {
    // Limpiar los valores de los campos del formulario
    document.getElementById('LoteId').value = '';
    document.getElementById('DetalleCompraId').value = '';
    document.getElementById('ProductoId').value = '';
    document.getElementById('NumeroLote').value = '';
    document.getElementById('PrecioCompra').value = '';
    document.getElementById('PrecioDetal').value = '';
    document.getElementById('PrecioxMayor').value = '';
    document.getElementById('FechaVencimiento').value = '';
    document.getElementById('Cantidad').value = '';
    document.getElementById('EstadoLote').value = '';

    document.getElementById('TituloModal').innerText = 'Agregar Lote';
    document.getElementById('btnGuardar').style.display = 'inline-block'; // Mostrar el bot�n "Actualizar Usuario"
    document.getElementById('botonEditarar').style.display = 'none';
}


// Evento para capturar cuando se comienza a escribir en el campo
function searchLote() {
    var input = $('#buscarLote').val().trim().toLowerCase();    //Obtiene el valor del buscadpor
    var rows = document.querySelectorAll('.lotesPaginado');    //Obtiene el tr de Usuario Paginado.
    var rowsTodos = document.querySelectorAll('.Lotes');      //Obtiene el tr de Usuario que esta en none
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
        paginationContainer.classList.remove('noBe'); // Oculta el contenedor de paginaci�n

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
        paginationContainer.classList.add('noBe'); // Oculta el contenedor de paginaci�n


    }

    rowsTodos.forEach(function (row) {
        if (input === "") {
            row.style.display = 'none';
        } else {
            var loteId = row.querySelector('td:nth-child(2)').textContent.trim().toLowerCase();
            var detalleC = row.querySelector('td:nth-child(3)').textContent.trim().toLowerCase();
            var productoId = row.querySelector('td:nth-child(4)').textContent.trim().toLowerCase();
            var numeroL = row.querySelector('td:nth-child(5').textContent.trim().toLowerCase();
            var precioC = row.querySelector('td:nth-child(6').textContent.trim().toLowerCase();
            var precioPP = row.querySelector('td:nth-child(7').textContent.trim().toLowerCase();
            var fechaV = row.querySelector('td:nth-child(8').textContent.trim().toLowerCase();
            var cantidad = row.querySelector('td:nth-child(9').textContent.trim().toLowerCase();

            row.style.display = (input === "" || loteId.includes(input) || detalleC.includes(input) || productoId.includes(input) || numeroL.includes(input) || precioC.includes(input) || precioPP.includes(input) || fechaV.includes(input) || cantidad.includes(input)) ? 'table-row' : 'none';
        }
    });
}

function vaciarInputLote() {
    var paginationContainer = document.getElementById('paginationContainer');
    document.getElementById('buscarLote').value = "";
    var icon = document.querySelector('#btnNavbarSearch i');
    icon.className = 'fas fa-search';
    icon.style.color = 'white';

    var contador = document.querySelector('.contador');
    contador.innerText = '#';
    var contadores = document.querySelectorAll('.contadorB');
    contadores.forEach(function (contador) {
        contador.classList.add('noIs'); // Removemos la clase 'noIs'
    });

    var rows = document.querySelectorAll('.lotesPaginado');
    rows.forEach(function (row) {
        row.style.display = 'table-row';
    });

    var rowsTodos = document.querySelectorAll('.Lotes');

    rowsTodos.forEach(function (row) {
        row.style.display = 'none';
    });
    paginationContainer.classList.remove('noBe'); // Oculta el contenedor de paginaci�n

}




