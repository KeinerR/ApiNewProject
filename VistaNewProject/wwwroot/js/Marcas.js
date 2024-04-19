$(document).ready(function () {
    // Función para validar campos y mostrar mensaje inicial de validación
    function validarCampos() {
        var todoValido = true;
        var todoLleno = true;

        // Validar campo Nombre Marca
        $('#nombreMarca').on('input', function () {
            var input = $(this);
            var valor = input.val().trim();
            var spanError = input.next('.text-danger'); // Obtener el elemento span de error asociado al input
            var spanVacio = input.prev('.Mensaje'); // Obtener el elemento span vacío asociado al input

            // Limpiar el mensaje de error previo
            spanError.text('');
            spanVacio.text('');

            // Validar si el campo está vacío
            if (valor === '') {
                spanVacio.text(' *obligatorio');
                spanError.text('');
                todoLleno = false;
            } else {
                todoLleno = true;
                // Validar longitud mínima del nombre
                if (valor.length < 2) {
                    spanError.text('Este campo debe tener al menos 2 caracteres.');
                    todoValido = false;
                } else if (!/^(?!.*(\w)\1\1\1)[\w\s]+$/.test(valor)) {
                    spanError.text('Este nombre es redundante.');
                    todoValido = false;
                } else if (/^\d+$/.test(valor)) {
                    spanError.text('Este campo no puede ser solo numérico.');
                    todoValido = false;
                } else {
                    // Validar si el nombre ya está repetido
                    var nombreRepetido = marcas.some(function (marca) {
                        return marca.nombreMarca.toLowerCase() === valor.toLowerCase() &&
                            marca.marcaId != $('#marcaId').val().trim();
                    });

                    if (nombreRepetido) {
                        spanError.text('Esta marca ya se encuentra registrada.');
                        todoValido = false;
                    }
                }
            }

            return todoValido && todoLleno;
        });

        // Validar campo Estado Marca
        $('#EstadoMarca').on('input', function () {
            var input = $(this);
            var valor = input.val().trim();
            var spanError = input.next('.text-danger'); // Obtener el elemento span de error asociado al input

            // Limpiar el mensaje de error previo
            spanError.text('');

            // Validar si el campo Estado Marca no está vacío
            if (valor === '') {
                spanError.text(' *obligatorio');
                todoLleno = false;
            } else {
                todoLleno = true;
            }

            return todoValido && todoLleno;
        });
    }

    // Función para limpiar el formulario
    function limpiarFormulario() {
        $('#MarcaModal').find('input, select').val('');
        $('.text-danger').text('');
        $('.Mensaje').text(' *');
        $('#TituloModal').text('Agregar Marca');
        $('#btnGuardar').text('Agregar');
    }

    // Evento submit del formulario de agregar marca
    $('#MarcaModal form').submit(function (event) {
        event.preventDefault(); // Evitar que se envíe el formulario automáticamente

        var nombreMarcaInput = $('#nombreMarca');
        var valorNombreMarca = nombreMarcaInput.val().trim();
        var spanError = nombreMarcaInput.next('.text-danger'); // Obtener el elemento span de error asociado al input
        var spanVacio = nombreMarcaInput.prev('.Mensaje'); // Obtener el elemento span vacío asociado al input

        // Limpiar el mensaje de error previo
        spanError.text('');
        spanVacio.text('');

        // Validar si el campo está vacío
        if (valorNombreMarca === '') {
            spanVacio.text(' *obligatorio');
            spanError.text('');
            // Mostrar mensaje de error si el campo está vacío
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor, completa el campo Nombre Marca.'
            });
        } else {
            // Validar longitud mínima del nombre
            if (valorNombreMarca.length < 2) {
                spanError.text('Este campo debe tener al menos 2 caracteres.');
                // Mostrar mensaje de error si el nombre es demasiado corto
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'El campo Nombre Marca debe tener al menos 2 caracteres.'
                });
            } else if (!/^(?!.*(\w)\1\1\1)[\w\s]+$/.test(valorNombreMarca)) {
                spanError.text('Este nombre es redundante.');
                // Mostrar mensaje de error si el nombre es redundante
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'El nombre de la marca es redundante.'
                });
            } else if (/^\d+$/.test(valorNombreMarca)) {
                spanError.text('Este campo no puede ser solo numérico.');
                // Mostrar mensaje de error si el nombre es solo numérico
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'El nombre de la marca no puede ser solo numérico.'
                });
            } else {
                // Enviar el formulario si el campo Nombre Marca es válido
                $(this).unbind('submit').submit();
            }
        }
    });


    // Evento click del botón de limpiar búsqueda
    $('#btnClearSearch').click(function () {
        $('#searchInput').val('');
        buscarMarcas();
    });

    // Resto del código para eventos de búsqueda, edición, eliminación, etc.
});
