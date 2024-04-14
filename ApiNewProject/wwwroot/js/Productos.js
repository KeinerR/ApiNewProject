function agregarProducto() {
    const presentacionId = document.getElementById('PresentacionId').value;
    const marcaId = document.getElementById('MarcaId').value;
    const categoriaId = document.getElementById('CategoriaId').value;
    const unidadId = document.getElementById('UnidadId').value;
    const nombreProducto = document.getElementById('NombreProducto').value;
    const cantidadTotal = document.getElementById('CantidadTotal').value;
    const estado = document.getElementById('EstadoProducto').value;
   
    const productoObjeto = {
        PresentacionId: presentacionId,
        MarcaId: marcaId,
        CategoriaId: categoriaId,
        UnidadId: unidadId,
        NombreProducto: nombreProducto,
        CantidadTotal: cantidadTotal,
        Estado: estado
    };

    fetch('https://localhost:7013/api/Productos/InsertarProducto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(productoObjeto)
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



function obtenerDatosProducto(productoId) {
    fetch(`https://localhost:7013/api/Productos/GetProductoById?Id=${productoId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos de la producto.');
            }
            return response.json();
        })
        .then(producto => {
            // Llenar los campos del formulario modal con los datos del cliente
            document.getElementById('ProductoId').value = producto.productoId;
            document.getElementById('PresentacionId').value = producto.presentacionId;
            document.getElementById('MarcaId').value = producto.marcaId;
            document.getElementById('CategoriaId').value = producto.categoriaId;
            document.getElementById('UnidadId').value = producto.unidadId;
            document.getElementById('NombreProducto').value = producto.nombreProducto;
            document.getElementById('CantidadTotal').value = producto.cantidadTotal;
            document.getElementById('EstadoProducto').value = producto.estado;



            // Cambiar el t�tulo de la ventana modal
            document.getElementById('TituloModal').innerText = 'Editar producto';
            // Ocultar el bot�n "Agregar" y mostrar el bot�n "Actualizar Usuario"
            document.getElementById('btnGuardar').style.display = 'none';
            document.getElementById('btnEditar').style.display = 'inline-block'; // Mostrar el bot�n "Actualizar Usuario"
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function ActualizarProducto() {
    const productoId = document.getElementById('ProductoId').value;
    const presentacionId = document.getElementById('PresentacionId').value;
    const marcaId = document.getElementById('MarcaId').value;
    const categoriaId = document.getElementById('CategoriaId').value;
    const unidadId = document.getElementById('UnidadId').value;
    const nombreProducto = document.getElementById('NombreProducto').value;
    const cantidadTotal = document.getElementById('CantidadTotal').value;
    const estado = document.getElementById('EstadoProducto').value;

    const productoObjeto = {
        ProductoId: productoId,
        PresentacionId: presentacionId,
        MarcaId: marcaId,
        CategoriaId: categoriaId,
        UnidadId: unidadId,
        NombreProducto: nombreProducto,
        CantidadTotal: cantidadTotal,
        Estado: estado
    };

    fetch(`https://localhost:7013/api/Productos/UpdateProductos`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(productoObjeto)
    })
        .then(response => {
            if (response.ok) {
                alert('Producto actualizada correctamente.');
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

function eliminarProducto(productoId) {
    // Hacer la solicitud DELETE al servidor para eliminar la producto
    fetch(`https://localhost:7013/api/Productos/DeleteProducto/${productoId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar la producto.');
            }
            // Aqu� puedes manejar la respuesta si es necesario
            console.log('Producto eliminado correctamente.');
            // Recargar la p�gina o actualizar la lista de clientes, seg�n sea necesario
            location.reload(); // Esto recarga la p�gina
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function limpiarFormulario() {
    // Limpiar los valores de los campos del formulario
    document.getElementById('ProductoId').value = '';
    document.getElementById('PresentacionId').value = '';
    document.getElementById('MarcaId').value = '';
    document.getElementById('CategoriaId').value = '';
    document.getElementById('UnidadId').value = '';
    document.getElementById('NombreProducto').value = '';
    document.getElementById('CantidadTotal').value = '';
    document.getElementById('EstadoProducto').value = '';

    document.getElementById('TituloModal').innerText = 'Agregar Producto';
    document.getElementById('btnGuardar').style.display = 'inline-block'; // Mostrar el bot�n "Actualizar Usuario"
    document.getElementById('btnEditar').style.display = 'none';
}
