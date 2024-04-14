//// Agrega un evento de clic al botón de agregar dentro del modal
//document.getElementById('btnGuardar').addEventListener('click', function () {
//    agregarMarca(); // Llama a la función para agregar la marca
//});
// Función para agregar la marca


document.addEventListener('DOMContentLoaded', function () {

    const urlParams = new URLSearchParams(window.location.search);
    const mostrarAlerta = urlParams.get('mostrarAlerta');
    const marcaId = urlParams.get('marcaId');
    const API_URL = 'https://localhost:7013/api/Marcas';

    marcas = {};
    var todoValido = true;


    // Función para obtener todas las marcas
    function obtenerDatosMarcas() {
        fetch(`${API_URL}/GetMarcas`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener las marcas.');
                }
                return response.json();
            })
            .then(data => {
                marcas = data;
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
    obtenerDatosMarcas();

    if (mostrarAlerta === 'true' && marcaId) {
        obtenerDatosMarca(marcaId);
        // Obtener el botón que activa la modal
        const botonModal = document.querySelector('[data-bs-target="#MarcaModal"]');
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


        $('#NombreMarca').on('input', function () {
            validarCampo($(this));

            // Validar si todos los campos son válidos antes de agregar el usuario
             todoValido = $('.Mensaje').filter(function () {
                return $(this).text() !== '';
            }).length === 0 && $('.text-danger').filter(function () {
                return $(this).text() !== '';
            }).length === 0;

            console.log('Todos los campos son válidos:', todoValido);

            // Si todos los campos son válidos, ocultar el mensaje en todos los campos
            if (todoValido) {
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
            spanError.text(' ');
        } else if (input.is('#NombreMarca')) {
            if (valor.length < 2) {
                spanError.text('Este debe tener un mínimo de 2 caracteres.');
                spanVacio.text(' *');
            } else if (!/^(?!.*(\w)\1\1\1)[\w\s]+$/.test(valor)) {
                spanError.text('Este nombre es redundante.');
                spanVacio.text('');
                todoValido = false;
            } else if (/^\d+$/.test(valor)) {
                spanError.text('Este campo no puede ser solo numérico.');
                spanVacio.text(' *');
                todoValido = false;
            } else {
                var nombreRepetido = marcas.some(function (marca) {
                    return marca.nombreMarca.toLowerCase() === valor.toLowerCase() &&
                        marca.usuarioId !== $('#MarcaId').val().trim();
                });

                if (nombreRepetido) {
                    spanError.text('Esta marca ya se encuentra registrada.');
                    spanVacio.text(' *');
                    todoValido = false;
                } else {
                    spanError.text('');
                }
            }
        }

        return todoValido; // Devuelve el estado de validación al finalizar la función
    }
         
    function agregarMarca() {
        if (!todoValido) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                timer: 3000, // Tiempo en milisegundos (en este caso, 3 segundos)
                timerProgressBar: true,
                text: 'Por favor, completa correctamente todos los campos  para poder registrar este usuario.'
            });
            return;
        }
        const nombreMarca = document.getElementById('NombreMarca').value.trim();
        if (
            nombreMarca.trim() === ''
        ) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                timer: 3000,
                timerProgressBar: true,
                text: 'Por favor, completa todos los campos con * para poder registrar este usuario.'
            });
            return;
        }
        const marcaObjeto = {
            NombreMarca: nombreMarca
        };

        fetch(`${API_URL}/InsertarMarca`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(marcaObjeto)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al agregar la marca.');
                }
                return response.json();
            })
            .then(data => {
                console.log('Marca agregada:', data);
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Marca agregada correctamente.',
                    timer: 3000,
                    timerProgressBar: true
                }).then(() => {
                    location.reload(); // Recargar la página
                });
            })
            .catch(error => {
                console.error('Error al agregar la marca:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un error al agregar la marca. Por favor, inténtalo de nuevo más tarde.'
                });
            });
    }

    function obtenerDatosMarca(marcaId) {
        fetch(`https://localhost:7013/api/Marcas/GetMarcaById?Id=${marcaId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los datos de la marca.');
                }
                return response.json();
            })
            .then(marca => {
                // Llenar los campos del formulario modal con los datos del cliente
                document.getElementById('MarcaId').value = marca.marcaId;
                document.getElementById('NombreMarca').value = marca.nombreMarca;

                // Cambiar el título de la ventana modal
                document.getElementById('TituloModal').innerText = 'Editar marca';
                // Ocultar el botón "Agregar" y mostrar el botón "Actualizar Usuario"
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
    function ActualizarMarca() {
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
        const marcaId = document.getElementById('MarcaId').value;
        const nombreMarca = document.getElementById('NombreMarca').value.trim();
        if (
            nombreMarca.trim() === ''
        ) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                timer: 3000,
                timerProgressBar: true,
                text: 'Por favor, completa todos los campos con * para poder registrar actualizar la marca'
            });
            return;
        }
        const marcaObjeto = {
            MarcaId: marcaId,
            NombreMarca: nombreMarca
        };

        fetch(`${API_URL}/UpdateMarcas`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(marcaObjeto)
        })
            .then(response => {
                if (response.ok) {
                    // Obtener el número de página actual de la URL
                    const urlParams = new URLSearchParams(window.location.search);
                    const currentPage = urlParams.get('page');
                    // Mostrar SweetAlert
                    Swal.fire({
                        icon: 'success',
                        title: 'Éxito',
                        text: 'Se ha actualizado la marca con éxito.',
                        timer: 3000, // Tiempo en milisegundos (en este caso, 3 segundos)
                        timerProgressBar: true
                    }).then((result) => {
                        // Redirigir a la misma página después de la actualización
                        if (currentPage) {
                            window.location.replace(`/Marcas?page=${currentPage}`);
                        } else {
                            window.location.replace('/Marcas');
                        }
                    });
                } else {
                    throw new Error('Error al actualizar la marca.');
                }
            })
            .catch(error => {
                console.error('Error al actualizar la marca:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un error al actualizar la marca. Por favor, inténtalo de nuevo más tarde.'
                });
            });
    }
    function eliminarMarca(marcaId) {
        fetch(`https://localhost:7013/api/Marcas/DeleteMarca/${marcaId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al eliminar la marca.');
                }
                return response.json();
            })
            .then(data => {
                const urlParams = new URLSearchParams(window.location.search);
                const currentPage = urlParams.get('page');
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Marca eliminada correctamente.',
                    timer: 3000,
                    timerProgressBar: true
                }).then(() => {
                    if (currentPage) {
                        window.location.replace(`/Marcas?page=${currentPage}`);
                    } else {
                        window.location.replace('/Marcas');
                    }
                    // Redirigir o recargar la página
                });
            })
            .catch(error => {
                console.error('Error al eliminar la marca:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un error al eliminar la marca. Por favor, inténtalo de nuevo más tarde.'
                });
            });
    }

    document.getElementById('btnGuardar').addEventListener('click', function () {
        agregarMarca();
    });

    document.querySelectorAll('#editar').forEach(button => {
        button.addEventListener('click', function () {
            const marcaId = this.getAttribute('data-cliente-id');
            obtenerDatosMarca(marcaId);
        });
    });

    document.getElementById('btnEditar').addEventListener('click', function () {
        ActualizarMarca();
    });
    document.querySelectorAll('#btnDelete').forEach(button => {
        button.addEventListener('click', function () {
            const marcaId = this.getAttribute('data-cliente-id');
            eliminarMarca(marcaId);
        });
    });

});


function limpiarFormulario() {
    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = urlParams.get('page');
    // Mostrar SweetAlert
    // Limpiar los valores de los campos del formulario
    document.getElementById('MarcaId').value = '';
    document.getElementById('NombreMarca').value = '';



    document.getElementById('TituloModal').innerText = 'Agregar Marca';
    document.getElementById('btnGuardar').style.display = 'inline-block'; // Mostrar el botón "Actualizar Usuario"
    document.getElementById('btnEditar').style.display = 'none';
    var mensajes = document.querySelectorAll('.Mensaje');
    mensajes.forEach(function (mensaje) {
        mensaje.textContent = ' *'; // Restaurar mensajes de error
        mensaje.style.display = 'inline-block'; // Establecer estilo si es necesario
    });
    const mensajesError = document.querySelectorAll('.text-danger');
    mensajesError.forEach(span => {
        span.innerText = ''; // Limpiar contenido del mensaje
    });
    if (currentPage) {
        window.location.replace(`/Marcas?page=${currentPage}`);
    } else {
        window.location.replace('/Marcas');
    }
}


