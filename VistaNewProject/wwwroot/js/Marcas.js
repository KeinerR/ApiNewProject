
$(document).ready(function () {
    // Evento click del botón "Agregar"
    $('#btnGuardar').click(function () {
        // Enviar el formulario al hacer clic en el botón "Agregar"
        $('#MarcaModal form').submit();
    });

    // Resto de tu código...
});
$(document).ready(function () {
    // Función para validar campos y mostrar mensaje inicial de validación
    function validarCampos() {
        var todoValido = true;
        var todoLleno = true;

        // Validar campo Nombre Marca
        $('#nombreMarca').on('input', function () {
            var input = $(this);
            var valor = input.val().trim();
            var spanError = input.next('.text-danger');
            var spanVacio = input.prev('.Mensaje');

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
                // Validar solo letras
                if (!/^[a-zA-Z\s]+$/.test(valor)) {
                    spanError.text('Este campo solo puede contener letras.');
                    todoValido = false;
                }
            }

            return todoValido && todoLleno;
        });

        // Validar campo Estado Marca
        $('#EstadoMarca').on('input', function () {
            var input = $(this);
            var valor = input.val().trim();
            var spanError = input.next('.text-danger');
            var spanVacio = input.prev('.Mensaje');

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
                // Validar solo números
                if (!/^\d+$/.test(valor)) {
                    spanError.text('Este campo solo puede contener números.');
                    todoValido = false;
                }
            }

            return todoValido && todoLleno;
        });

        // Validar la entrada del usuario al presionar Enter
        $('#nombreMarca').on('keypress', function (event) {
            if (event.which === 13) {
                event.preventDefault();
                Actualizarmarca();
            }
        });
    }

    // Función para limpiar el formulario
    function limpiarFormulario() {
        // ... (código previo)
    }

    // Evento que se ejecuta al mostrar el modal
    $('#MarcaModal').on('show.bs.modal', function (event) {
        // Habilitar o deshabilitar el botón de guardar según el contexto
        if (event.relatedTarget.id === 'btnAgregarMarca') {
            $('#btnGuardar').prop('disabled', true);
        } else {
            $('#btnGuardar').prop('disabled', false);
        }
    });

    // Evento click del botón de limpiar búsqueda
    $('#btnClearSearch').click(function () {
        // ... (código previo)
    });

    // Resto del código para eventos de búsqueda, edición, eliminación, etc.
});
function Obtenermarca(marcaId) {
    fetch(`https://localhost:7013/api/Marcas/GetMarcaById?id=${marcaId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos de la marca');
            }
            return response.json();
        })
        .then(marca => {
            console.log(marca);

            $('#MarcaModal').modal('show'); // Abre el modal

            // Mostrar el campo EstadoMarca
            const estadoMarcaInput = $('#EstadoMarca');
            estadoMarcaInput.parent('.form-group').removeClass('d-none');
            estadoMarcaInput.removeAttr('disabled'); // Remover el atributo disabled

            $('#marcaId').val(marca.marcaId);
            $('#nombreMarca').val(marca.nombreMarca);
            $('#EstadoMarca').val(marca.estadoMarca);

            $('#TituloModal').text('Editar Marca');
            $('#btnGuardar').hide();
            $('#btnEditar').show();

        })
        .catch(error => {
            console.log('Error', error);
        });
}


function Actualizarmarca() {
    const marcaId = document.getElementById('marcaId').value;
    const nombreMarca = document.getElementById('nombreMarca').value;
    const EstadoMarca = document.getElementById('EstadoMarca').value;

    const marca = {
        MarcaId: marcaId,
        NombreMarca: nombreMarca,
        EstadoMarca: EstadoMarca
    };

    console.log(nombreMarca);

    fetch(`https://localhost:7013/api/Marcas/UpdateMarcas`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(marca)
    })
        .then(response => {
            if (response.ok) {
                // SweetAlert en lugar de alert
                Swal.fire({
                    position: 'top-center',
                    icon: 'success',
                    title: 'Marca actualizada correctamente',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    location.reload(true); // Recargar la página después de la actualización
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Error en la actualización. Por favor, inténtalo de nuevo más tarde.'
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error en la actualización. Por favor, inténtalo de nuevo más tarde.'
            });
        });
}

function MostrarTodasLasMarcas() {
    fetch('https://localhost:7013/api/Marcas/GetMarcas')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener las marcas');
            }
            return response.json();
        })
        .then(data => {
            console.log('Todas las marcas:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
