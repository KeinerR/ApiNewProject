

// Función para verificar si hay conexión a Internet
function checkInternetConnection() {
    return navigator.onLine;
}

// Función para establecer valores por defecto si no hay conexión
function valoresPorDefaultSinConexion() {
    if (!checkInternetConnection()) {
        // Obtener todos los elementos de botón dentro de la tabla
        const botonesEditar = document.querySelectorAll(".botonEditar");
        const botonesEliminar = document.querySelectorAll(".botonEliminar");
        const botonesDetalle = document.querySelectorAll(".botonDetalle");

        // Iterar sobre cada elemento de botón y establecer su valor
        botonesEditar.forEach(boton => {
            boton.innerText = "Editar";
        });

        botonesEliminar.forEach(boton => {
            boton.innerText = "Borrar";
        });

        botonesDetalle.forEach(boton => {
            boton.innerText = "Detalle";
        });
    }
    const urlParams = new URLSearchParams(window.location.search);
    const mostrarAlerta = urlParams.get('mostrarAlerta');
    const marcaId = urlParams.get('marcaId');
    const API_URL = 'https://localhost:7013/api/Marcas';
    var todoValido = true;
    var marcas = [];

    if (mostrarAlerta === 'true' && marcaId) {
        obtenerMarca(marcaId);

        // Obtener el botón que activa la modal
        const botonModal = document.querySelector('[data-bs-target="#MarcaModal"]');
        document.getElementById('FormAgregar').style.display = 'none';
        document.getElementById('FormActualizar').style.display = 'block';
        if (botonModal) {
            // Simular el clic en el botón para mostrar la modal
            botonModal.click();
        }
    }

    function MostrarTodasLasMarcas() {
        fetch(`${API_URL}/GetMarcas`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener las marcas');
                }
                return response.json();
            })
            .then(data => {
                marcas = data;
                console.log(marcas);
                NoCamposVacios();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    MostrarTodasLasMarcas();

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

    function NoCamposVaciosAct() {
        // Mostrar mensaje inicial de validación
        $('#NombreMarcaAct').on('input', function () {
            validarCampoAct($(this));

            // Validar si todos los campos son válidos antes de agregar el usuario
            todoValido = $('.text-dangerAct').filter(function () {
                return $(this).text() !== '';
            }).length === 0;

            todolleno = $('.MensajeAct').filter(function () {
                return $(this).text() !== '';
            }).length === 0;
            console.log('Todos los campos son válidos:', todoValido);

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
            spanVacio.text(' *');
            spanError.text('');
        } else if (input.is('#NombreMarca')) {
            if (valor.length < 3) {
                spanError.text('Este campo debe tener un mínimo de 3 caracteres.');
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

    function validarCampoAct(input) {
        var valor = input.val().trim(); // Obtener el valor del campo y eliminar espacios en blanco al inicio y al final
        var spanError = input.next('.text-dangerAct'); // Obtener el elemento span de error asociado al input
        var spanVacio = input.prev('.MensajeAct'); // Obtener el elemento span vacío asociado al input

        // Limpiar el mensaje de error previo
        spanError.text('');
        spanVacio.text('');

        // Validar el campo y mostrar mensaje de error si es necesario
        if (valor === '') {
            spanVacio.text(' *obligatorio');
            spanError.text('');
        } else if (input.is('#NombreMarcaAct')) {
            if (valor.length < 3) {
                spanError.text('Este campo debe tener un mínimo de 3 caracteres.');
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
    // Función para obtener los datos de una marca por su ID
    function obtenerMarca(Id) {
        fetch(`${API_URL}/GetMarcaById?Id=${Id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los datos de la marca.');
                }
                return response.json();
            })
            .then(marca => {
                document.getElementById('MarcaIdAct').value = marca.marcaId;
                document.getElementById('NombreMarcaAct').value = marca.nombreMarca;
                document.getElementById('EstadoMarcaAct').value = marca.estadoMarca; // Si EstadoMarcaAct es un elemento select

                console.log(marca);
                NoCamposVaciosAct();

            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    // Evento click en botones de editar
    document.querySelectorAll('#btnEdit').forEach(button => {
        button.addEventListener('click', function () {
            const Id = this.getAttribute('data-marca-id');
            document.getElementById('FormAgregar').style.display = 'none';
            document.getElementById('FormActualizar').style.display = 'block';
            obtenerMarca(Id);
        });
    });
    $('.delete-button').on('click', function (event) {
        event.preventDefault(); // Prevenir el comportamiento predeterminado del botón

        var form = $(this).closest('form');
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Quieres eliminar esta marca?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                form[0].submit(); // Enviar el formulario manualmente
            }
        });
    });
}


// Llamar a la función al cargar la página
window.onload = function () {
    valoresPorDefaultSinConexion();

};



function limpiarFormulario() {
    // Limpiar los valores de los campos del formulario
    document.getElementById('MarcaId').value = '';
    document.getElementById('NombreMarca').value = '';
    document.getElementById('EstadoMarca').value = '';
    document.getElementById('MarcaIdAct').value = '';
    document.getElementById('NombreMarcaAct').value = '';
    document.getElementById('EstadoMarcaAct').value = '';


    document.getElementById('FormActualizar').style.display = 'none';
    document.getElementById('FormAgregar').style.display = 'block';

    var mensajes = document.querySelectorAll('.Mensaje');
    mensajes.forEach(function (mensaje) {
        mensaje.textContent = ' *'; // Restaurar mensajes de error
        mensaje.style.display = 'inline-block'; // Establecer estilo si es necesario
    });
    const mensajesError = document.querySelectorAll('.text-danger');
    mensajesError.forEach(span => {
        span.innerText = ''; // Limpiar contenido del mensaje
    });
    var mensajesAct = document.querySelectorAll('.MensajeAct');
    mensajesAct.forEach(function (mensajeAct) {
        mensajeAct.textContent = ''; // Restaurar mensajes de error
        mensajeAct.style.display = 'inline-block'; // Establecer estilo si es necesario
    });
    const mensajesErrorAct = document.querySelectorAll('.text-dangerAct');
    mensajesErrorAct.forEach(span => {
        span.innerText = ''; // Limpiar contenido del mensaje
    });

    $('#FormAgregar').show();
    $('#FormActualizar').hide();
}



document.getElementById('buscarMarca').addEventListener('input', function () {
    var input = this.value.trim().toLowerCase();
    var rows = document.querySelectorAll('.marcasPaginado');

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
    var rowsTodos = document.querySelectorAll('.Marcas');

    rowsTodos.forEach(function (row) {
        if (input === "") {
            row.style.display = 'none';
        } else {
            var marcaId = row.querySelector('td:nth-child(1)').textContent.trim().toLowerCase();
            var nombreM = row.querySelector('td:nth-child(2)').textContent.trim().toLowerCase();

            row.style.display = (marcaId.includes(input) || nombreM.includes(input)) ? 'table-row' : 'none';
        }
    });
});

function vaciarInput() {
    document.getElementById('buscarMarca').value = "";
    var icon = document.querySelector('#btnNavbarSearch i');
    icon.className = 'fas fa-search';
    icon.style.color = 'gray';

    var rows = document.querySelectorAll('.marcasPaginado');
    rows.forEach(function (row) {
        row.style.display = 'table-row';
    });

    var rowsTodos = document.querySelectorAll('.Marcas');

    rowsTodos.forEach(function (row) {
        row.style.display = 'none';
    });
}






function actualizarEstadoMarca(MarcaId, EstadoMarca) {
    fetch(`https://localhost:7013/api/Marcas/UpdateEstadoMarca/${MarcaId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ EstadoMarca: EstadoMarca ? 1 : 0 })
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






