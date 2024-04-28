document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const mostrarAlerta = urlParams.get('mostrarAlerta');
    const marcaId = urlParams.get('marcaId');
    const API_URL = 'https://localhost:7013/api/Unidades';
    unidades = {}; // Inicializamos la variable usuarios como un objeto vacío
    var todoValido = true;


    function obtenerDatosMarcas() {
        fetch(`${API_URL}/GetUnidades`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los usuarios.');
                }
                return response.json();
            })
            .then(data => {
                unidades = data; // Asignamos el resultado de la petición a la variable usuarios
                NoCamposVacios();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    obtenerDatosMarcas();

    if (mostrarAlerta === 'true' && marcaId) {
        obtenerDatosUsuario(marcaId);

        // Obtener el botón que activa la modal
        const botonModal = document.querySelector('[data-bs-target="#usuarioModal"]');
        if (botonModal) {
            // Simular el clic en el botón para mostrar la modal
            botonModal.click();
        }
    } else {
        console.log('UsuarioId no encontrado en la URL');
    }


    function NoCamposVacios() {
        // Mostrar mensaje inicial de validación
        $('#MensajeInicial').text(' Completa todos los campos con *');
        $('.Mensaje').text(' *');


        $('#NombreUnidad,#CantidadPorUnidad,#DescripcionUnidad').on('input', function () {
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
        } else if (input.is('#DescripcionUnidad')) {
            if (valor.length < 5) {
                spanError.text('Este campo debe tener un mínimo de 5 caracteres.');
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
                var nombreRepetido = unidades.some(function (unidad) {
                    return unidad.descripcionUnidad.toLowerCase() === valor.toLowerCase() &&
                        unidad.unidadId != $('#UnidadId').val().trim();
                });

                if (nombreRepetido) {
                    spanError.text('Esta unidad ya se encuentra registrada.');
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






    

    document.querySelectorAll('#btnEdit').forEach(button => {
        button.addEventListener('click', function () {
            const unidadId = this.getAttribute('data-unidad-id');
            obtenerDatosUnidad(unidadId);
        });
    });


   



});

