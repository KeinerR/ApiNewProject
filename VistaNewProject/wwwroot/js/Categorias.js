document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const mostrarAlerta = urlParams.get('mostrarAlerta');
    const categoriaId = urlParams.get('categoriaId');
    const API_URL = 'https://localhost:7013/api/Categorias';

    categorias = {};
    var todoValido = true;

    // Función para obtener todas las marcas
    function obtenerDatosCategorias() {
        fetch(`${API_URL}/GetCategorias`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener las marcas.');
                }
                return response.json();
            })
            .then(data => {
                categorias = data;
                NoCamposVacios();
            })
            .catch(error => {
                console.error('Error al obtener las marcas:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un error al obtener las marcas. Por favor, inténtalo de nuevo más tarde.'
                });
            });
    }
    obtenerDatosCategorias();
    if (mostrarAlerta === 'true' && categoriaId) {
        obtenerDatosMarca(categoriaId);
        // Obtener el botón que activa la modal
        const botonModal = document.querySelector('[data-bs-target="#CategoriaModal"]');
        if (botonModal) {
            // Simular el clic en el botón para mostrar la modal
            botonModal.click();
        }
    }

    // Función para validar campos y mostrar mensaje inicial de validación
    function NoCamposVacios() {
        // Mostrar mensaje inicial de validación
        $('#MensajeInicial').text(' Completa todos los campos con *');
        $('.Mensaje').text(' *');


        $('#NombreCategoria').on('input', function () {
            validarCampo($(this));

            // Validar si todos los campos son válidos antes de agregar el usuario
            todoValido = $('.text-danger').filter(function () {
                return $(this).text() !== '';
            }).length === 0;

            todolleno = $('.Mensaje ').filter(function () {
                return $(this).text() !== '';
            }).length === 0;
            console.log('Todos los campos son válidos:', todoValido);

            // Si todos los campos son válidos, ocultar el mensaje en todos los campos
            if (todolleno) {
                $('#MensajeInicial').hide();
            } else {
                $('#MensajeInicial').show(); // Mostrar el mensaje si no todos los campos son válidos
            }
        });
    }

    function validarCampo(input) {
        var valor = input.val().trim(); // Obtener el valor del campo y eliminar espacios en blanco al inicio y al final
        var spanError = input.next('.text-danger'); // Obtener el elemento span de error asociado al input
        var spanVacio = input.prev('.Mensaje'); // Obtener el elemento span vacío asociado al input

        // Limpiar el mensaje de error previo
        spanError.text('');
        spanVacio.text('');

        // Validar el campo y mostrar mensaje de error si es necesario
        if (valor === '') {
            spanVacio.text(' *obligatorio');
            spanError.text('');
        } else if (input.is('#NombreCategoria')) {
            if (valor.length < 2) {
                spanError.text('Este debe tener un mínimo de 2 caracteres.');
                spanVacio.text('');
            } else if (!/^(?!.*(\w)\1\1\1)[\w\s]+$/.test(valor)) {
                spanError.text('Este nombre es redundante.');
                spanVacio.text('');
                todoValido = false;
            } else if (/^\d+$/.test(valor)) {
                spanError.text('Este campo no puede ser solo numérico.');
                spanVacio.text('');
                todoValido = false;
            } else {
                var nombreRepetido = categorias.some(function (categoria) {
                    return categoria.nombreCategoria.toLowerCase() === valor.toLowerCase() &&
                        categoria.categoriaId != $('#CategoriaId').val().trim();
                });

                if (nombreRepetido) {
                    spanError.text('Esta Categoria ya se encuentra registrada.');
                    spanVacio.text('');
                    todoValido = false;
                } else {
                    spanError.text('');
                    spanVacio.text('');
                }
            }
        }

        return todoValido; // Devuelve el estado de validación al finalizar la función
    }

    function agregarCategoria() {
        if (!todoValido) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                timer: 3000, // Tiempo en milisegundos (en este caso, 3 segundos)
                timerProgressBar: true,
                text: 'Por favor, completa correctamente todos los campos  para poder registrar la categoria.'
            });
            return;
        }
        const nombreCategoria = document.getElementById('NombreCategoria').value;
        if (
            nombreCategoria.trim() === ''
        ) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                timer: 3000,
                timerProgressBar: true,
                text: 'Por favor, completa todos los campos con * para poder registrar la categoria.'
            });
            return;
        }
        const categoriaObjeto = {
            NombreCategoria: nombreCategoria
        };

        fetch(`${API_URL}/InsertarCategoria`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(categoriaObjeto)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ocurrió un error al enviar la solicitud.');
                }
                return response.json();
            })
            .then(data => {
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Categoria agregada correctamente.',
                    timer: 3000,
                    timerProgressBar: true
                }).then(() => {
                    location.reload(); // Recargar la página
                });
            })
            .catch(error => {
                console.error('Error al agregar la categoria:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un error al agregar la categoria. Por favor, inténtalo de nuevo más tarde.'
                });
            });
    }


    function obtenerDatosCategoria(categoriaId) {
        fetch(`${ API_URL }/GetCategoriaById?Id=${categoriaId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los datos de la categoria.');
                }
                return response.json();
            })
            .then(categoria => {
                // Llenar los campos del formulario modal con los datos del cliente
                document.getElementById('CategoriaId').value = categoria.categoriaId;
                document.getElementById('NombreCategoria').value = categoria.nombreCategoria;

                // Cambiar el título de la ventana modal
                document.getElementById('TituloModal').innerText = 'Editar Categoria';

                $('#MensajeInicial').text('');
                var mensajes = document.querySelectorAll('.Mensaje');
                mensajes.forEach(function (mensaje) {
                    mensaje.textContent = ''; // Restaurar mensajes de error
                    mensaje.style.display = 'inline-block';
                });
                // Ocultar el botón "Agregar" y mostrar el botón "Actualizar Usuario"
                document.getElementById('btnGuardar').style.display = 'none';
                document.getElementById('btnEditar').style.display = 'inline-block'; // Mostrar el botón "Actualizar Usuario"
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }



    function ActualizarCategoria() {
        if (!todoValido) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                timer: 3000, // Tiempo en milisegundos (en este caso, 3 segundos)
                timerProgressBar: true,
                text: 'Por favor, completa correctamente todos los campos  para poder actualizar la marca.'
            });
            return;
        }
        const categoriaId = document.getElementById('CategoriaId').value;
        const nombreCategoria = document.getElementById('NombreCategoria').value;

        if (
            nombreCategoria.trim() === ''
        ) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                timer: 3000,
                timerProgressBar: true,
                text: 'Por favor, completa todos los campos con * para poder actualizar la categoria.'
            });
            return;
        }
        const categoriaObjeto = {
            CategoriaId: categoriaId,
            NombreCategoria: nombreCategoria
        };

        fetch(`https://localhost:7013/api/Categorias/UpdateCategorias`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(categoriaObjeto)
        })
            .then(response => {
                if (response.ok) {
                    // Mostrar SweetAlert
                    Swal.fire({
                        icon: 'success',
                        title: 'Éxito',
                        text: 'Se ha actualizado la categoria con éxito.',
                        timer: 3000, // Tiempo en milisegundos (en este caso, 3 segundos)
                        timerProgressBar: true
                    }).then((result) => {
                        location.reload();
                    });
                } else {
                    throw new Error('Error al actualizar la categoria.');
                }
            })
            .catch(error => {
                console.error('Error al actualizar la categoria:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un error al actualizar la categoria. Por favor, inténtalo de nuevo más tarde.'
                });
            });
    }


    function eliminarCategoria(categoriaId) {
        // Hacer la solicitud DELETE al servidor para eliminar la categoriaId
        fetch(`${API_URL}/DeleteCategoria/${categoriaId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al eliminar la marca.');
                }
                return response.json();
            })
            .then(data => {
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Categoria Eliminada correctamente.',
                    timer: 1500,
                    timerProgressBar: true,
                    showConfirmButton: false
                }).then(() => {
                    location.reload();
                });
            })
            .catch(error => {
                console.error('Error al eliminar la categoria:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un error al eliminar la categoria. Por favor, verifica que la categoria no tenga productos asociados e inténtalo de nuevo más tarde.'
                });
            });
    }

    document.getElementById('btnGuardar').addEventListener('click', function () {
        agregarCategoria();
    });

    document.querySelectorAll('#btnEdit').forEach(button => {
        button.addEventListener('click', function () {
            const marcaId = this.getAttribute('data-categoria-id');
            obtenerDatosCategoria(marcaId);
        });
    });

    document.getElementById('btnEditar').addEventListener('click', function () {
        ActualizarCategoria();
    });
    document.querySelectorAll('#btnDelete').forEach(button => {
        button.addEventListener('click', function () {
            const marcaId = this.getAttribute('data-categoria-id');
            eliminarCategoria(marcaId);
        });
    });
});





function limpiarFormulario() {
    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = urlParams.get('page');
    // Limpiar los valores de los campos del formulario
    document.getElementById('CategoriaId').value = '';
    document.getElementById('NombreCategoria').value = '';

    document.getElementById('TituloModal').innerText = 'Agregar Categoria';
    document.getElementById('btnGuardar').style.display = 'inline-block'; // Mostrar el botón "Actualizar Usuario"
    document.getElementById('btnEditar').style.display = 'none';

    mensajes.forEach(function (mensaje) {
        mensaje.textContent = ' *'; // Restaurar mensajes de error
        mensaje.style.display = 'inline-block'; // Establecer estilo si es necesario
    });
    const mensajesError = document.querySelectorAll('.text-danger');
    mensajesError.forEach(span => {
        span.innerText = ''; // Limpiar contenido del mensaje
    });
    if (currentPage) {
        window.location.replace(`/Categorias?page=${currentPage}`);
    } else {
        window.location.replace('/Categorias');
    }
}
