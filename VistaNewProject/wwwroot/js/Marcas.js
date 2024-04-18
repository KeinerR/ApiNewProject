﻿document.addEventListener('DOMContentLoaded', function () {

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
        } else if (input.is('#NombreMarca')) {
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
                var nombreRepetido = marcas.some(function (marca) {
                    return marca.nombreMarca.toLowerCase() === valor.toLowerCase() &&
                        marca.marcaId != $('#MarcaId').val().trim();
                });

                if (nombreRepetido) {
                    spanError.text('Esta marca ya se encuentra registrada.');
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
         
    function agregarMarca() {
        if (!todoValido) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                timer: 3000, // Tiempo en milisegundos (en este caso, 3 segundos)
                timerProgressBar: true,
                text: 'Por favor, completa correctamente todos los campos  para poder registrar la marca.'
            });
            return;
        }
        const nombreMarca = document.getElementById('NombreMarca').value.trim();
        const estadoMarca = document.getElementById('EstadoMarca').value;
        if (
            nombreMarca.trim() === ''
        ) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                timer: 3000,
                timerProgressBar: true,
                text: 'Por favor, completa todos los campos con * para poder registrar la marca.'
            });
            return;
        }
        const marcaObjeto = {
            NombreMarca: nombreMarca,
            estadoMarcaÑ: estadoMarca
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
                document.getElementById('EstadoMarca').value = marca.estadoMarca;

                document.getElementById('Estadomarca').style.display = 'block';
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
        const estadoMarca = document.getElementById('EstadoMarca').value;

        if (
            nombreMarca.trim() === ''
        ) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                timer: 3000,
                timerProgressBar: true,
                text: 'Por favor, completa todos los campos con * para poder actualizar la marca'
            });
            return;
        }
        const marcaObjeto = {
            MarcaId: marcaId,
            NombreMarca: nombreMarca,
            EstadoMarca: estadoMarca
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
                    // Mostrar SweetAlert
                    Swal.fire({
                        icon: 'success',
                        title: 'Éxito',
                        text: 'Se ha actualizado la marca con éxito.',
                        timer: 3000, // Tiempo en milisegundos (en este caso, 3 segundos)
                        timerProgressBar: true
                    }).then((result) => {
                        location.reload();
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
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Marca Eliminada correctamente.',
                    timer: 1500,
                    timerProgressBar: true,
                    showConfirmButton: false
                }).then(() => {
                    location.reload();
                });
            })
            .catch(error => {
                console.error('Error al eliminar la marca:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un error al eliminar la marca. Por favor, verifica que la marca no tenga productos asociados e inténtalo de nuevo más tarde.'
                });
            });
    }

    document.getElementById('btnGuardar').addEventListener('click', function () {
        agregarMarca();
    });

    document.querySelectorAll('#btnEdit').forEach(button => {
        button.addEventListener('click', function () {
            const marcaId = this.getAttribute('data-marca-id');
            obtenerDatosMarca(marcaId);
        });
    });

    document.getElementById('btnEditar').addEventListener('click', function () {
        ActualizarMarca();
    });
    document.querySelectorAll('#btnDelete').forEach(button => {
        button.addEventListener('click', function () {
            const marcaId = this.getAttribute('data-marca-id');
            eliminarMarca(marcaId);
        });
    });

});


function limpiarFormulario() {
    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = urlParams.get('page');
    // Limpiar los valores de los campos del formulario
    document.getElementById('MarcaId').value = '';
    document.getElementById('NombreMarca').value = '';

    // Ocultar el campo de Estado Usuario y mostrar elementos con clase "Novisible"
    document.getElementById('Estadomarca').style.display = 'none';



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


function buscarMarcas() {
    var searchTerm = $('#searchInput').val().toLowerCase();

    // Filtra las filas de la tabla basándose en el término de búsqueda
    $('tbody tr').each(function () {
        var filaVisible = false;

        // Itera sobre cada campo de la entidad Marca en la fila
        $(this).find('.nombre-marca, .marca-id').each(function () {
            var textoCampo = $(this).is(':hidden') ? $(this).text() : $(this).html().toLowerCase();

            // Comprueba si el término de búsqueda está presente en el campo
            if (textoCampo.indexOf(searchTerm) !== -1) {
                filaVisible = true;
                return false; // Rompe el bucle si se encuentra una coincidencia en la fila
            }
        });

        // Muestra u oculta la fila según si se encontró una coincidencia
        if (filaVisible) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });

    // Mostrar u ocultar el botón de limpiar búsqueda según si hay texto en el campo de búsqueda
    if (searchTerm !== '') {
        $('#btnClearSearch').show();
    } else {
        $('#btnClearSearch').hide();
    }
}

// Ocultar el botón de limpiar búsqueda al principio
$('#btnClearSearch').hide();

// Evento de clic en el botón de búsqueda
$('#btnNavbarSearch').on('click', function () {
    buscarMarcas();
});

// Evento de clic en el icono de búsqueda
$('#btnNavbarSearch i').on('click', function () {
    buscarMarcas();
});

// Evento de presionar Enter en el campo de búsqueda
$('#searchInput').on('keypress', function (e) {
    if (e.which === 13) { // Verifica si la tecla presionada es Enter
        buscarMarcas();
        e.preventDefault(); // Evita que la tecla Enter provoque la acción por defecto (puede ser un envío de formulario)
    }
});

// Evento de clic en el botón para limpiar la búsqueda
$('#btnClearSearch').on('click', function () {
    // Limpiar el campo de búsqueda
    $('#searchInput').val('');
    // Mostrar todos los registros normales
    $('tbody tr').show();
    // Ocultar el botón de limpiar búsqueda al limpiar la búsqueda
    $(this).hide();
});
