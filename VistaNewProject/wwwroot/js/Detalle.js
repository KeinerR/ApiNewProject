
/*Funcion para enviar ala vista de detalle*/
function redireccionarYEditar(id, vista, nombreid) {
    place = vista.toLowerCase().trim();
    // Redirigir a la p�gina especificada y agregar un par�metro a la URL para indicar que se debe mostrar la alerta
    window.location.href = `/${vista}/Index?mostrarAlerta=true&${nombreid}Id=${id}`;
}

function redirectToOrder(selectElement) {
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const url = selectedOption.getAttribute('data-url');
    if (url) {
        window.location.href = url;
    }
}
async function actualizarEstadoCategoriaxUnidad(unidadId, categoriaId, isChecked) {
    // Validaci�n b�sica
    if (!unidadId || !categoriaId) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'ID de Unidad y ID de Categor�a son requeridos.',
        });
        return;
    }

    const url = isChecked ? '/CategoriasxTabla/CrearCategoriaxUnidad' : '/CategoriasxTabla/DeleteCategoriaxUnidad';
    const method = isChecked ? 'POST' : 'DELETE';
    const data = isChecked ? JSON.stringify({ categoriaId: categoriaId, unidadId: unidadId }) : JSON.stringify({ categoriaId: categoriaId, unidadId: unidadId });

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        });

        const result = await response.json();

        if (response.ok) {
            //Swal.fire({
            //    icon: 'success',
            //    title: '�xito',
            //    text: result.message,
            //});
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: result.message || 'Ocurri� un error al procesar la solicitud.',
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurri� un error inesperado.',
        });
        console.error('Error:', error);
    }
}
    
async function actualizarEstadoCategoriaxPresentacion(presentacionId, categoriaId, isChecked) {
    // Validaci�n b�sica
    if (!presentacionId || !categoriaId) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'ID de Unidad y ID de Categor�a son requeridos.',
        });
        return;
    }

    const url = isChecked ? '/CategoriasxTabla/CrearCategoriaxPresentacion' : '/CategoriasxTabla/DeleteCategoriaxPresentacion';
    const method = isChecked ? 'POST' : 'DELETE';
    const data = isChecked ? JSON.stringify({ categoriaId: categoriaId, presentacionId: presentacionId }) : JSON.stringify({ categoriaId: categoriaId, presentacionId: presentacionId });

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        });

        const result = await response.json();

        if (response.ok) {
            //Swal.fire({
            //    icon: 'success',
            //    title: '�xito',
            //    text: result.message,
            //});
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: result.message || 'Ocurri� un error al procesar la solicitud.',
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurri� un error inesperado.',
        });
        console.error('Error:', error);
    }
}

async function actualizarEstadoCategoriaxMarca(marcaId, categoriaId, isChecked) {
    console.log(marcaId, categoriaId);
    // Validaci�n b�sica
    if (!marcaId || !categoriaId) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'ID de Unidad y ID de Marca son requeridos.',
        });
        return;
    }

    const url = isChecked ? '/CategoriasxTabla/CrearCategoriaxMarca' : '/CategoriasxTabla/DeleteCategoriaxMarca';
    const method = isChecked ? 'POST' : 'DELETE';
    const data = isChecked ? JSON.stringify({ categoriaId: categoriaId, marcaId: marcaId }) : JSON.stringify({ categoriaId: categoriaId, marcaId: marcaId });

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        });

        const result = await response.json();

        if (response.ok) {
            //Swal.fire({
            //    icon: 'success',
            //    title: '�xito',
            //    text: result.message,
            //});
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: result.message || 'Ocurri� un error al procesar la solicitud.',
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurri� un error inesperado.',
        });
        console.error('Error:', error);
    }
}