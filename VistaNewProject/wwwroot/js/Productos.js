


document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const mostrarAlerta = urlParams.get('mostrarAlerta');
    const productoId = urlParams.get('productoId');
    const API_URL = 'https://localhost:7013/api/Productos';

    var productos = [];
    let todoValido = true;
    function obtenerDatosProductos() {
        fetch(`${API_URL}/GetProductos`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los productos.');
                }
                return response.json();
            })
            .then(data => {
                productos = data;
                console.log(productos);
                NoCamposVacios();
            })
            .catch(error => {

            });
    }
    obtenerDatosProductos();

    if (mostrarAlerta === 'true' && productoId) {
        obtenerDatosPresentacion(productoId);

        // Obtener el botón que activa la modal
        const botonModal = document.querySelector('[data-bs-target="#ProductoModal"]');
        if (botonModal) {
            // Simular el clic en el botón para mostrar la modal
            botonModal.click();
        }
    }

    function NoCamposVacios() {
        // Mostrar mensaje inicial de validación
        $('#MensajeInicial').text('Completa todos los campos con *');
        $('.Mensaje').text('*');

        // Función para validar campos y mostrar/ocultar mensaje inicial
        function validarCampos() {
            validarCampo($(this));

            // Validar si todos los campos son válidos antes de agregar la presentación
            var todoValido = $('.text-danger').filter(function () {
                return $(this).text() !== '';
            }).length === 0;

            const todosLlenos = $('.Mensaje').filter(function () {
                return $(this).text() !== '';
            }).length === 0;

            console.log('Todos los campos son válidos:', todoValido);

            // Si todos los campos son válidos, ocultar el mensaje inicial en todos los campos
            if (todosLlenos) {
                $('#MensajeInicial').hide();
            } else {
                $('#MensajeInicial').show(); // Mostrar el mensaje si no todos los campos son válidos
            }
        }

        // Asignar validación a los campos NombreProducto, PresentacionId, MarcaId, CategoriaId
        $('#PresentacionId, #MarcaId, #CategoriaId').on('input', validarCampos);

        // Función para manejar la selección de opciones en los campos MarcaId, CategoriaId, PresentacionId
        function seleccionarOpcion(input, dataList, hiddenInput) {
            var selectedOption = Array.from(dataList.options).find(function (option) {
                return option.value === input.value;
            });

            if (selectedOption) {
                input.value = selectedOption.text; // Mostrar el nombre seleccionado
                hiddenInput.value = selectedOption.value; // Asignar el ID al campo oculto
            } else if (!input.value.trim()) {
                // Mantener el valor actual si el campo de entrada está vacío
                input.value = '';
            }
        }

        // Asignar función de selección a los campos MarcaId, CategoriaId, PresentacionId
        $('#MarcaId').on('input', function () {
            seleccionarOpcion(this, document.getElementById('marcas'), document.getElementById('MarcaIdHidden'));
        });

        $('#CategoriaId').on('input', function () {
            seleccionarOpcion(this, document.getElementById('categorias'), document.getElementById('CategoriaIdHidden'));
        });

        $('#PresentacionId').on('input', function () {
            seleccionarOpcion(this, document.getElementById('presentaciones'), document.getElementById('PresentacionIdHidden'));
        });
    }

    function validarCampo(input) {
        const valor = input.val().trim();
        var valorPresentacion = $('#PresentacioIdHidden').val();
        var valorMarca = $('#MarcaIdHidden').val();
        var valorCategoria = $('#CategoriaIdHidden').val();

        const spanError = input.next('.text-danger');
        const spanVacio = input.siblings('.Mensaje'); // Cambio aquí: uso siblings() en lugar de prev()
        const redundante = /^(?!.*(\w)\1\1\1)[\w\s]+$/;
        const soloNumeros = /^\d+$/;
        spanError.text('');
        spanVacio.text('');

        if (valor === '') {
            spanVacio.text('* Obligatorio');
            spanError.text('');
        } if (input.is('#NombreProducto')) {
            if (valor === '') {
                spanError.text('');
                spanVacio.text('*obligatorio');
            } else if (valor.length < 3) {
                spanError.text('Este campo debe tener un mínimo de 3 caracteres.');
                spanVacio.text('');
            } else if (soloNumeros.test(valor)) {
                spanError.text('Este campo no puede ser solo numérico.');
                spanVacio.text('');
            } else {
                if (redundante.test(valor)) {
                    spanError.text('');
                    spanVacio.text('');
                } else {
                    spanError.text('Este nombre es redundante');
                    spanVacio.text('');
                }
            }


        }

        return todoValido;
    }

    function agregarProducto() {
        if (!todoValido) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                timer: 3000,
                timerProgressBar: true,
                text: 'Por favor, completa correctamente todos los campos para poder registrar el producto.'
            });
            return;
        }

        const presentacionId = document.getElementById('PresentacionIdHidden').value;
        const marcaId = document.getElementById('MarcaIdHidden').value;
        const categoriaId = document.getElementById('CategoriaIdHidden').value;
        const nombreProducto = document.getElementById('NombreProducto').value;
        const estado = document.getElementById('EstadoProducto').value;


        // Verificar que todos los campos obligatorios estén llenos
        if (marcaId.trim() === '' || categoriaId.trim() === '' || presentacionId.trim() === '' || nombreProducto === '') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                timer: 3000,
                timerProgressBar: true,
                text: 'Por favor, completa todos los campos con * para poder registrar el producto.'
            });
            return;
        }

        const productoObjeto = {
            PresentacionId: presentacionId,
            MarcaId: marcaId,
            CategoriaId: categoriaId,
            NombreProducto: nombreProducto,
            Estado: estado
        };

        fetch(`${API_URL}/InsertarProducto`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productoObjeto)
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
                    text: 'Producto agregado correctamente.',
                    timer: 3000,
                    timerProgressBar: true
                }).then(() => {
                    location.reload(); // Recargar la página
                });
            })
            .catch(error => {
                console.error('Error al agregar el producto:', error);
                console.log(productoObjeto)
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un error al agregar el producto. Por favor, inténtalo de nuevo más tarde.'
                });
            });
    }


    function obtenerDatosProducto(productoId) {
        fetch(`https://localhost:7013/api/Productos/GetProductoById?Id=${productoId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los datos de la producto.');
                }
                return response.json();
            })
            .then(producto => {
                // Llenar los campos del formulario modal con los datos del cliente
                document.getElementById('ProductoId').value = producto.productoId;
                document.getElementById('PresentacionId').value = producto.presentacionId;
                document.getElementById('MarcaId').value = producto.marcaId;
                document.getElementById('CategoriaId').value = producto.categoriaId;
                document.getElementById('NombreProducto').value = producto.nombreProducto;
                document.getElementById('CantidadTotal').value = producto.cantidadTotal;
                document.getElementById('EstadoProducto').value = producto.estado;

                $('#MensajeInicial').text('');
                var mensajes = document.querySelectorAll('.Mensaje');
                mensajes.forEach(function (mensaje) {
                    mensaje.textContent = ''; // Restaurar mensajes de error
                    mensaje.style.display = 'inline-block';
                });

                // Cambiar el título de la ventana modal
                document.getElementById('TituloModal').innerText = 'Editar producto';
                // Ocultar el botón "Agregar" y mostrar el botón "Actualizar Usuario"
                document.getElementById('btnGuardar').style.display = 'none';
                document.getElementById('btnEditar').style.display = 'inline-block'; // Mostrar el botón "Actualizar Usuario"
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function ActualizarProducto() {
        const productoId = document.getElementById('ProductoId').value;
        const presentacionId = document.getElementById('PresentacionId').value;
        const marcaId = document.getElementById('MarcaId').value;
        const categoriaId = document.getElementById('CategoriaId').value;
        const unidadId = document.getElementById('UnidadId').value;
        const nombreProducto = document.getElementById('NombreProducto').value;
        const cantidadTotal = document.getElementById('CantidadTotal').value;
        const estado = document.getElementById('EstadoProducto').value;

        const productoObjeto = {
            ProductoId: productoId,
            PresentacionId: presentacionId,
            MarcaId: marcaId,
            CategoriaId: categoriaId,
            UnidadId: unidadId,
            NombreProducto: nombreProducto,
            CantidadTotal: cantidadTotal,
            Estado: estado
        };

        fetch(`https://localhost:7013/api/Productos/UpdateProductos`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productoObjeto)
        })
            .then(response => {
                if (response.ok) {
                    alert('Producto actualizada correctamente.');
                    location.reload(true); // Recargar la página después de la actualización
                } else {
                    alert("Error en la actualización. Por favor, inténtalo de nuevo más tarde.");
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert("Error en la actualización. Por favor, inténtalo de nuevo más tarde.");
            });
    }

    document.getElementById('btnGuardar').addEventListener('click', function () {
        agregarProducto();
    });

    document.querySelectorAll('#btnEdit').forEach(button => {
        button.addEventListener('click', function () {
            const presentacionId = this.getAttribute('data-presentacion-id');
            obtenerDatosProducto(presentacionId);
        });
    });

    document.getElementById('btnEditar').addEventListener('click', function () {
        ActualizarProducto();
    });
    document.querySelectorAll('#btnDelete').forEach(button => {
        button.addEventListener('click', function () {
            const presentacionId = this.getAttribute('data-presentacion-id');
            eliminarProducto(presentacionId);
        });
    });





});




function eliminarProducto(productoId) {
    // Hacer la solicitud DELETE al servidor para eliminar la producto
    fetch(`https://localhost:7013/api/Productos/DeleteProducto/${productoId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar la producto.');
            }
            // Aquí puedes manejar la respuesta si es necesario
            console.log('Producto eliminado correctamente.');
            // Recargar la página o actualizar la lista de clientes, según sea necesario
            location.reload(); // Esto recarga la página
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function limpiarFormulario() {
    // Limpiar los valores de los campos del formulario
    document.getElementById('ProductoId').value = '';
    document.getElementById('PresentacionId').value = '';
    document.getElementById('MarcaId').value = '';
    document.getElementById('CategoriaId').value = '';
    document.getElementById('NombreProducto').value = '';
    document.getElementById('CantidadTotal').value = '';
    document.getElementById('EstadoProducto').value = '1';

    document.getElementById('TituloModal').innerText = 'Agregar Producto';
    document.getElementById('btnGuardar').style.display = 'inline-block'; // Mostrar el botón "Actualizar Usuario"
    document.getElementById('btnEditar').style.display = 'none';
}

function actualizarEstadoProducto(ProductoId, Estado) {
    fetch(`https://localhost:7013/api/Productos/UpdateEstadoProducto/${ProductoId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Estado: Estado ? 1 : 0 })
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













