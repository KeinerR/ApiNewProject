

function limpiarFormulario() {
    // Limpiar los valores de los campos del formulario
    $('#UnidadId, #NombreUnidad, #CantidadPorUnidad,#DescripcionUnidad,#EstadoUnidad #UnidadesIdAct, #NombreUnidadAct, #CantidadUnidadAct,#DescripcionUnidadAct,#EstadoUnidadAct').val('');

    // Restaurar mensajes de error
    $('.Mensaje, .MensajeAct').text(' *');
    $('.Mensaje, .MensajeAct').show(); // Mostrar mensajes de error

    $('.text-danger, .text-dangerAct').text(''); // Limpiar mensajes de error

    // Ocultar el formulario de actualización y mostrar el formulario de agregar
    $('#AgregarUnidades').show();
    $('#FormActualizarUnidades').hide();
}

// Cerrar la modal cuando se hace clic fuera de ella
$('.modal').on('click', function (e) {
    if (e.target === this) {
        limpiarFormulario(); // Limpia el formulario si se hace clic fuera de la modal
        $(this).modal('hide'); // Oculta la modal
    }
});



function obtenerUnidad(Id) {
    fetch(`https://localhost:7013/api/Unidades/GetUnidadById?Id=${Id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos de la marca.');
            }
            return response.json();
        })
        .then(unidad => {
            document.getElementById('UnidadesIdAct').value = unidad.unidadId;
            document.getElementById('NombreUnidadAct').value = unidad.nombreUnidad;
            document.getElementById('CantidadUnidadAct').value = unidad.cantidadPorUnidad;
            document.getElementById('DescripcionUnidadAct').value = unidad.descripcionUnidad;
            document.getElementById('EstadoUnidadAct').value = unidad.estadoUnidad;

            // Si EstadoMarcaAct es un elemento select

            console.log(unidad);


        })
        .catch(error => {
            console.error('Error:', error);
        });
}


document.querySelectorAll('#btnEditar').forEach(button => {
    button.addEventListener('click', function () {
        const Id = this.getAttribute('data-unidad-id');
        document.getElementById('AgregarUnidades').style.display = 'none';
        document.getElementById('FormActualizarUnidades').style.display = 'block';
        obtenerUnidad(Id);
    });
});







function actualizarEstadoUnidad(UnidadId, EstadoUnidad) {
    fetch(`https://localhost:7013/api/Unidades/UpdateEstadoUnidad/${UnidadId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ EstadoUnidad: EstadoUnidad ? 1 : 0 })
    })
        .then(response => {
            if (response.ok) {
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

document.getElementById('buscarUnidad').addEventListener('input', function () {
    var input = this.value.trim().toLowerCase();
    var rows = document.querySelectorAll('.unidadesPaginado');

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
    var rowsTodos = document.querySelectorAll('.Unidades');

    rowsTodos.forEach(function (row) {
        if (input === "") {
            row.style.display = 'none';
        } else {
            var unidadId = row.querySelector('td:nth-child(1)').textContent.trim().toLowerCase();
            var nombreU = row.querySelector('td:nth-child(2)').textContent.trim().toLowerCase();
            var cantidadporU = row.querySelector('td:nth-child(3)').textContent.trim().toLowerCase();

            row.style.display = (unidadId.includes(input) || nombreU.includes(input) || cantidadporU.includes(input)) ? 'table-row' : 'none';
        }
    });
});

function vaciarInput() {
    document.getElementById('buscarUnidad').value = "";
    var icon = document.querySelector('#btnNavbarSearch i');
    icon.className = 'fas fa-search';
    icon.style.color = 'gray';

    var rows = document.querySelectorAll('.unidadesPaginado');
    rows.forEach(function (row) {
        row.style.display = 'table-row';
    });

    var rowsTodos = document.querySelectorAll('.Unidades');

    rowsTodos.forEach(function (row) {
        row.style.display = 'none';
    });
}



