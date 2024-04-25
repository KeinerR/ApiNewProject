function checkInternetConnection() {
    return navigator.onLine;
}

function MostrarTodasLasCategoria() {
    fetch(`https://localhost:7013/api/Categorias/GetCategorias`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener las categoria');
            }
            return response.json();
        })
        .then(data => {
            categoria = data;
            console.log(categoria);
            NoCamposVacios();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

MostrarTodasLasCategoria();

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


function NoCamposVaciosAct() {
    // Mostrar mensaje inicial de validación
    $('#NombreCategoriaAct').on('input', function () {
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
        spanVacio.text(' *obligatorio');
        spanError.text('');
    } else if (input.is('#NombreCategoria')) {
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
            var nombreRepetido = categoria.some(function (categoria) {
                return categoria.nombreCategoria.toLowerCase() === valor.toLowerCase() &&
                    categoria.CategoriaId != $('#CategoriaId').val().trim();
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
    } else if (input.is('#NombreCategoriaAct')) {
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
            var nombreRepetido = categoria.some(function (categoria) {
                return categoria.nombreCategoria.toLowerCase() === valor.toLowerCase() &&
                    categoria.CategoriaId != $('#CategoriaId').val().trim();
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

function obtenercategoriaid(CategoriaId) {

    fetch(`https://localhost:7013/api/Categorias/GetCategoriaById?Id=${CategoriaId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos');
            }
            return response.json();
        })
        .then(categoria => {

            document.getElementById('CategoriaIdAct').value = categoria.categoriaId;
            document.getElementById('NombreCategoriaAct').value = categoria.nombreCategoria;
            document.getElementById('EstadoCategoriaAct').value = categoria.estadoCategoria;

            console.log(categoria);
        })
        .catch(error => {
            console.error("Error :", error)
        });
}

document.querySelectorAll('#btnEdit').forEach(button => {
    button.addEventListener('click', function () {
        const Id = this.getAttribute('data-categoria-id');

        document.getElementById('CategoriaAgregar').style.display = 'none';
        document.getElementById('FormActualizarCategoria').style.display = 'block';
        obtenercategoriaid(Id); // Aquí se pasa el Id como argumento a la función obtenercategoriaid()
    });
});


function limpiarFormulario() {
    // Limpiar los valores de los campos del formulario
    document.getElementById('CategoriaId').value = '';
    document.getElementById('NombreCategoria').value = '';
    document.getElementById('EstadoCategoria').value = '';
    document.getElementById('CategoriaIdAct').value = '';
    document.getElementById('NombreCategoriaAct').value = '';
    document.getElementById('EstadoCategoriaAct').value = '';

    document.getElementById('FormActualizarCategoria').style.display = 'none';
    document.getElementById('CategoriaAgregar').style.display = 'block';


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

}


    function actualizarEstadoCategoria(CategoriaId, EstadoCategoria) {
        fetch(`https://localhost:7013/api/Categorias/UpdateEstadoCategoria/${CategoriaId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ EstadoCategoria: EstadoCategoria ? 1 : 0 })
        })
            .then(response => {
                if (response.ok) {
                    console.log("estado ", EstadoCategoria);
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

