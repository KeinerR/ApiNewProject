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
        validarCampoCompra($(this));

        // Validar si todos los campos son válidos antes de agregar la categoria
        var todoValido = $('.text-danger').filter(function () {
            return $(this).text() !== '';
        }).length === 0;

        // Si todos los campos son válidos, ocultar el mensaje inicial
        if (todoValido) {
            $('#MensajeInicial').hide();
        } else {
            $('#MensajeInicial').show();
        }
    });
}

function NoCamposVaciosAct() {
    // Mostrar mensaje inicial de validación
    $('#NombreCategoriaAct').on('input', function () {
        validarCampoCompraAct($(this));

        // Validar si todos los campos son válidos antes de actualizar la categoria
        var todoValido = $('.text-dangerAct').filter(function () {
            return $(this).text() !== '';
        }).length === 0;
    });
}



function NoCamposVacios() {
    // Mostrar mensaje inicial de validación
    $('#MensajeInicial').text(' Completa todos los campos con *');
    $('.Mensaje').text(' *');

    // Definir todoValido dentro del ámbito de la función NoCamposVacios
    var todoValido = true;

    $('#NombreCategoria').on('input', function () {
        todoValido = validarCampoCompra($(this)); // Actualizar el valor de todoValido según la validación del campo

        // Validar si todos los campos son válidos antes de agregar la categoría
        $('.text-danger').each(function () {
            if ($(this).text() !== '') {
                todoValido = false;
                return false; // Salir del bucle each si se encuentra un campo inválido
            }
        });

        // Si todos los campos son válidos, ocultar el mensaje inicial
        if (todoValido) {
            $('#MensajeInicial').hide();
        } else {
            $('#MensajeInicial').show();
        }
    });
}


function NoCamposVaciosAct() {
    // Mostrar mensaje inicial de validación
    $('#NombreCategoriaAct').on('input', function () {
        validarCampoCompraAct($(this));

        // Validar si todos los campos son válidos antes de actualizar la categoria
        var todoValido = $('.text-dangerAct').filter(function () {
            return $(this).text() !== '';
        }).length === 0;
    });
}

//function limpiarFormulario() {
//    // Limpiar los valores de los campos del formulario
//    $('#CategoriaId, #NombreCategoria, #EstadoCategoria, #CategoriaIdAct, #NombreCategoriaAct, #EstadoCategoriaAct').val('');

//    // Restaurar mensajes de error
//    $('.Mensaje, .MensajeAct').text(' *');
//    $('.Mensaje, .MensajeAct').show(); // Mostrar mensajes de error

//    $('.text-danger, .text-dangerAct').text(''); // Limpiar mensajes de error
//    $('#CategoriaAgregar').show();
//    $('#FormActualizarCategoria').hide();
//}


//$('.modal').on('click', function (e) {
//    if (e.target === this) {
//        limpiarFormulario(); // Limpia el formulario si se hace clic fuera de la modal
//        $(this).modal('hide'); // Oculta la modal
//    }
//});

function validarCampoCompra(input) {
    var valor = input.val().trim(); // Obtener el valor del campo y eliminar espacios en blanco al inicio y al final
    var spanError = input.next('.text-danger'); // Obtener el elemento span de error asociado al input
    var spanVacio = input.prev('.Mensaje'); // Obtener el elemento span vacío asociado al input
    var todoValido = false;

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

function validarCampoCompraAct(input) {
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
                spanError.text('Esta categoria ya se encuentra registrada.');
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

document.querySelectorAll('#btnEditar').forEach(button => {
    button.addEventListener('click', function () {
        const Id = this.getAttribute('data-categoria-id');

        document.getElementById('CategoriaAgregar').style.display = 'none';
        document.getElementById('FormActualizarCategoria').style.display = 'block';
        obtenercategoriaid(Id); // Aquí se pasa el Id como argumento a la función obtenercategoriaid()
    });
});




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

document.getElementById('buscarCategoria').addEventListener('input', function () {
    var input = this.value.trim().toLowerCase();
    var rows = document.querySelectorAll('.categoriasPaginado');

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
    var rowsTodos = document.querySelectorAll('.Categorias');

    rowsTodos.forEach(function (row) {
        if (input === "") {
            row.style.display = 'none';
        } else {
            var categoriaId = row.querySelector('td:nth-child(1)').textContent.trim().toLowerCase();
            var nombreC = row.querySelector('td:nth-child(2)').textContent.trim().toLowerCase();

            row.style.display = (categoriaId.includes(input) || nombreC.includes(input)) ? 'table-row' : 'none';
        }
    });
});

function vaciarInputS() {
    document.getElementById('buscarCategoria').value = "";
    var icon = document.querySelector('#btnNavbarSearch i');
    icon.className = 'fas fa-search';
    icon.style.color = 'gray';

    var rows = document.querySelectorAll('.categoriasPaginado');
    rows.forEach(function (row) {
        row.style.display = 'table-row';
    });

    var rowsTodos = document.querySelectorAll('.Categorias');

    rowsTodos.forEach(function (row) {
        row.style.display = 'none';
    });
}


