
function limpiarFormulario() {
    // Limpiar los valores de los campos del formulario
    $('#ProveedorId, #NombreEmpresa, #NombreContacto,#Direccion,#Telefono,#Correo,#EstadoProveedor #ProveedorIdAct, #NombreEmpresaAct, #NombreContactoAct,#DireccionAct,#TelefonoAct,#CorreoAct,#EstadoProveedorAct').val('');

    // Restaurar mensajes de error
    $('.Mensaje, .MensajeAct').text(' *');
    $('.Mensaje, .MensajeAct').show();// Mostrar mensajes de error

    $('.text-danger, .text-dangerAct').text(''); // Limpiar mensajes de error

    // Ocultar el formulario de actualización y mostrar el formulario de agregar

    $('#FormularioAgregar').show();
    $('#FormActualizarProveedor').hide();
}








function obtenerProveedorid(ProveedorId) {

    fetch(`https://localhost:7013/api/Proveedores/GetProveedorById?Id=${ProveedorId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos');
            }
            return response.json();
        })
        .then(proveedor => {

            document.getElementById('ProveedorIdAct').value = proveedor.proveedorId;
            document.getElementById('NombreEmpresaAct').value = proveedor.nombreEmpresa;
            document.getElementById('NombreContactoAct').value = proveedor.nombreContacto;


            document.getElementById('DireccionAct').value = proveedor.direccion;
            document.getElementById('TelefonoAct').value = proveedor.telefono;
            document.getElementById('CorreoAct').value = proveedor.correo;
            document.getElementById('EstadoProveedorAct').value = proveedor.estadoProveedor;


            console.log(proveedor);
        })
        .catch(error => {
            console.error("Error :", error)
        });
}





document.querySelectorAll('#btnEditar').forEach(button => {
    button.addEventListener('click', function () {
        const Id = this.getAttribute('data-proveedor-id');

        document.getElementById('FormularioAgregar').style.display = 'none';
        document.getElementById('FormActualizarProveedor').style.display = 'block';
        obtenerProveedorid(Id); // Aquí se pasa el Id como argumento a la función obtenercategoriaid()
    });
});



$('.modal').on('click', function (e) {
    if (e.target === this) {
        limpiarFormulario(); // Limpia el formulario si se hace clic fuera de la modal
        $(this).modal('hide'); // Oculta la modal
    }
});

function actualizarEstadoProveedor(ProveedorId, EstadoProveedor) {
    fetch(`https://localhost:7013/api/Proveedores/UpdateEstadoProveedor/${ProveedorId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ EstadoProveedor: EstadoProveedor ? 1 : 0 })
    })
        .then(response => {
            if (response.ok) {
                console.log(EstadoProveedor);
                setTimeout(() => {
                    location.reload(); // Recargar la página
                }, 500);
            } else {
                console.error('Error al actualizar el estado del cliente');
            }
        })
        .catch(error => {
            console.error('Error de red:', error);
        });
}


document.getElementById('buscarProveedor').addEventListener('input', function () {
    var input = this.value.trim().toLowerCase();
    var rows = document.querySelectorAll('.proveedoresPaginado');

    if (input === "") {
        rows.forEach(function (row) {
            row.style.display = '';
        });
        var icon = document.querySelector('#btnNavbarSearch i');
        icon.className = 'fas fa-search';
        icon.style.color = 'gray';
    } else {
        rows.forEach(function (row) {
            row.style.display = 'none';
        });
        var icon = document.querySelector('#btnNavbarSearch i');
        icon.className = 'fas fa-times';
        icon.style.color = 'gray';
    }
    var rowsTodos = document.querySelectorAll('.Proveedores');

    rowsTodos.forEach(function (row) {
        if (input === "") {
            row.style.display = 'none';
        } else {
            var proveedorId = row.querySelector('td:nth-child(1)').textContent.trim().toLowerCase();
            var nombreE = row.querySelector('td:nth-child(2)').textContent.trim().toLowerCase();
            var nombreC = row.querySelector('td:nth-child(3)').textContent.trim().toLowerCase();
            var direccion = row.querySelector('td:nth-child(4)').textContent.trim().toLowerCase();
            var telefono = row.querySelector('td:nth-child(5)').textContent.trim().toLowerCase();
            var correo = row.querySelector('td:nth-child(6)').textContent.trim().toLowerCase();
          

            row.style.display = (proveedorId.includes(input) || nombreE.includes(input) || nombreC.includes(input) || direccion.includes(input) || telefono.includes(input) || correo.includes(input)) ? 'table-row' : 'none';
        }
    });
});

function vaciarInput() {
    document.getElementById('buscarProveedor').value = "";
    var icon = document.querySelector('#btnNavbarSearch i');
    icon.className = 'fas fa-search';
    icon.style.color = 'gray';

    var rows = document.querySelectorAll('.proveedoresPaginado');
    rows.forEach(function (row) {
        row.style.display = 'table-row';
    });

    var rowsTodos = document.querySelectorAll('.Proveedores');

    rowsTodos.forEach(function (row) {
        row.style.display = 'none';
    });
}



