document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const mostrarAlerta = urlParams.get('mostrarAlerta');
    const proveedorId = urlParams.get('proveedorId');
    const API_URL = 'https://localhost:7013/api/Proveedores';


    proveedores = {};
    var todoValido = true;

    // Función para obtener todas las proveedores
    function obtenerDatosProveedores() {
        fetch(`${API_URL}/GetProveedores`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener las proveedores.');
                }
                return response.json();
            })
            .then(data => {
                proveedores = data;
                NoCamposVacios();
            })
            .catch(error => {
                console.error('Error al obtener las proveedores:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un error al obtener las proveedores. Por favor, inténtalo de nuevo más tarde.'
                });
            });
    }
    obtenerDatosProveedores();

    if (mostrarAlerta === 'true' && proveedorId) {
        obtenerDatosProveedor(proveedorId);
        // Obtener el botón que activa la modal
        const botonModal = document.querySelector('[data-bs-target="#ProveedorModal"]');
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


        $('#NombreEmpresa , #NombreContacto, #Direccion, #Telefono, #Correo').on('input', function () {
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
        var valor = input.val().trim();
        var spanError = input.next('.text-danger');
        var spanVacio = input.prev('.Mensaje');

        spanError.text('');
        spanVacio.text('');
       
       

            if (valor === '') {
                spanVacio.text('* Obligatorio');
                spanError.text('');
            }
            if (input.is('#NombreEmpresa') || input.is('#NombreContacto')) {
                var spanErrorEmpresa = $('#NombreEmpresa').next('.text-danger'); // Obtén el elemento span correspondiente al campo Nombre
                var spanErrorContacto = $('#NombreContacto').next('.text-danger'); // Obtén el elemento span correspondiente al campo Apellido
                var valorEmpresa = $('#NombreEmpresa').val().trim(); // Obtén el valor del campo Nombre
                var valorContacto = $('#NombreContacto').val().trim(); // Obtén el valor del campo Apellido
                var spanVacioEmpresa = $('#NombreEmpresa').prev('.Mensaje');
                var spanVacioContacto = $('#NombreContacto').prev('.Mensaje');

                if (valorEmpresa == '') {
                    spanErrorEmpresa.text('')
                    spanVacioEmpresa.text(' *obligatorio')

                }else if (valorEmpresa.length < 2) {
                    spanErrorEmpresa.text('Este debe tener un mínimo de 2 caracteres.');
                    spanVacioEmpresa.text('');
                } else if (!/^(?!.*(\w)\1\1\1)[\w\s]+$/.test(valorEmpresa)) {
                    spanErrorEmpresa.text('Este nombre es redundante.');
                    spanVacioEmpresa.text('');
                } else if (/^\d+$/.test(valorEmpresa)) {
                    spanErrorEmpresa.text('Este campo no puede ser solo numérico.');
                    spanVacioEmpresa.text('');
                } else {
                    spanErrorEmpresa.text('');
                    spanVacioEmpresa.text('');
                }
                if (valorContacto == '') {
                    spanErrorContacto.text('');
                    spanVacioContacto.text(' *');
                } else if (valorContacto.length < 2) {
                    spanErrorContacto.text('Este debe tener un mínimo de 2 caracteres.');
                    spanVacioContacto.text('');
                } else if (!/^(?!.*(\w)\1\1\1)[\w\s]+$/.test(valorContacto)) {
                    spanErrorContacto.text('Este nombre es redundante.');
                    spanVacioContacto.text('');
                } else if (/^\d+$/.test(valorContacto)) {
                    spanErrorContacto.text('Este campo no puede ser solo numérico.');
                    spanVacioContacto.text('');
                } else {
                    spanErrorContacto.text('');
                    spanVacioContacto.text('');
                }
                var nombreRepetido = proveedores.some(function (proveedores) {
                    return proveedores.nombreEmpresa.toLowerCase() === valorEmpresa.toLowerCase() &&
                        proveedores.nombreContacto.toLowerCase() === valorContacto.toLowerCase() &&
                        proveedores.proveedorId != $('#ProveedorId').val().trim();
                });

                if (nombreRepetido) {
                    spanErrorEmpresa.text('Este Proveedor ya se encuentra registrado.');
                    spanErrorContacto.text('Este Proveedor ya se encuentra registrado.');
                    todoValido = false;
                }
            }
            if (input.is('#Direccion')) {
                if (valor == '') {
                    spanError.text('');
                    spanVacio.text(' *obligatorio');
                } else if (valor.length < 5 || valor.length > 100) {
                    spanError.text(`La dirección debe tener entre 5 y 10 caracteres`);
                    return;
                } else if (/^[a-zA-Z0-9\s,'-]*$/.test(valor)) {
                    // La dirección no cumple con el formato esperado
                    spanError.text('Dirección inválida');
                    return;
                } else {
                    spanError.text('')
                    spanVacio.text('')
                }
                // Validaciones específicas para Direccion
            }
            if (input.is('#Telefono')) {
                    var telefonoValido = /^\d{7,}$/.test(valor); // Permite al menos 6 dígitos
                    if (valor === '') {
                        spanError.text('');
                        spanVacio.text(' *obligatorio');
                    } else if (valor.length < 7 && valor.length > 0) {
                        spanError.text('El teléfono debe tener minimo 7 dígitos numéricos.');
                        spanVacio.text('');
                    } else if (!telefonoValido) {
                        spanError.text('este campo no permite letras u espacios');
                        spanVacio.text('');
                    } else {
                        var telefonoRepetido = proveedores.some(function (proveedor) {
                            return proveedor.telefono === valor
                        });

                        if (telefonoRepetido) {
                            spanError.text('Este telefono ya se encuentra registrado por otro usuario.');
                            spanVacio.text('');
                        } else {
                            spanError.text('');
                            spanVacio.text('');
                        }
                    }
        }
        if (input.is('#Correo')) {
            const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor); // Verifica el formato de correo electrónico
            if (valor === '') {
                spanError.text('Este campo es necesario. Si desea omitirlo, use: empresa@gmail.com');
                spanVacio.text('');
            } else if (valor.toLowerCase() === 'empresa@gmail.com') {
                spanError.text('');
                spanVacio.text('');
            } else if (!correoValido) {
                spanError.text('Ingrese un correo electrónico válido.');
                spanVacio.text('');
            } else {
                var correoRepetido = proveedores.some(function (proveedor) {
                    return proveedor.correo === valor
                });

                if (correoRepetido) {
                    spanError.text('Este correo ya se encuentra registrado por otro usuario.');
                    spanVacio.text('');
                } else {
                    spanError.text('');
                    spanVacio.text('');
                }
            }
            return todoValido; // Devuelve el estado de validación al finalizar la función
        }
    }

    function agregarProveedor() {
        if (!todoValido) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                timer: 3000, // Tiempo en milisegundos (en este caso, 3 segundos)
                timerProgressBar: true,
                text: 'Por favor, completa correctamente todos los campos para poder registrar este proveedor.'
            });
            return;
        }
        // Obtener los valores de los campos del formulario
        const nombreEmpresa = document.getElementById('NombreEmpresa').value;
        const nombreContacto = document.getElementById('NombreContacto').value;
        const direccion = document.getElementById('Direccion').value;
        const telefono = document.getElementById('Telefono').value;
        const correo = document.getElementById('Correo').value;
        const estadoProveedor = document.getElementById('EstadoProveedor').value;

        if(
            nombreEmpresa.trim() === '' ||
            nombreContacto.trim() === '' ||
            telefono.trim() === '' ||
            direccion.trim() === '' ||
            correo.trim() === '' ||
            estadoProveedor.trim() === ''
        ) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                timer: 3000,
                timerProgressBar: true,
                text: 'Por favor, completa todos los campos con * para poder registrar este proveedor.'
            });
            return;
        }
        // Crear un objeto con los valores del formulario
        const proveedorObjeto = {
            NombreEmpresa: nombreEmpresa,
            NombreContacto: nombreContacto,
            Direccion: direccion,
            Telefono: telefono,
            Correo: correo,
            EstadoProveedor: estadoProveedor
        };

        // Enviar la solicitud POST al servidor utilizando la Fetch API
        fetch('https://localhost:7013/api/Proveedores/InsertarProveedor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(proveedorObjeto)
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
                    title: '&Eacutexito',
                    text: 'Proveedor agregado correctamente.',
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


    // Función para obtener los datos del cliente
    function obtenerDatosProveedor(proveedorId) {
        fetch(`https://localhost:7013/api/Proveedores/GetProveedorById?Id=${proveedorId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los datos del Proveedor.');
                }
                return response.json();
            })
            .then(proveedor => {
             
                document.getElementById('ProveedorId').value = proveedor.proveedorId;
                document.getElementById('NombreEmpresa').value = proveedor.nombreEmpresa;
                document.getElementById('NombreContacto').value = proveedor.nombreContacto;
                document.getElementById('Direccion').value = proveedor.direccion;
                document.getElementById('Telefono').value = proveedor.telefono;
                document.getElementById('Correo').value = proveedor.correo;
                document.getElementById('EstadoProveedor').value = proveedor.estadoProveedor;

                $('#MensajeInicial').text('');
                var mensajes = document.querySelectorAll('.Mensaje');
                mensajes.forEach(function (mensaje) {
                    mensaje.textContent = ''; // Restaurar mensajes de error
                    mensaje.style.display = 'inline-block';
                });
                // Cambiar el título de la ventana modal
                document.getElementById('TituloModal').innerText = 'Editar Proveedor';
                // Ocultar el botón "Agregar" y mostrar el botón "Actualizar Proveedor"
                document.getElementById('btnGuardar').style.display = 'none';
                document.getElementById('btnEditar').style.display = 'inline-block'; // Mostrar el botón "Actualizar Proveedor"


            })
            .catch(error => {
                console.error('Error:', error);
            });
    }


    function ActualizarProveedor() {
        if (!todoValido) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                timer: 3000, // Tiempo en milisegundos (en este caso, 3 segundos)
                timerProgressBar: true,
                text: 'Por favor, completa correctamente todos los campos para poder actualizar este proveedor.'
            });
            return;
        }
        const proveedorId = document.getElementById('ProveedorId').value;
        const nombreEmpresa = document.getElementById('NombreEmpresa').value;
        const nombreContacto = document.getElementById('NombreContacto').value;
        const direccion = document.getElementById('Direccion').value;
        const telefono = document.getElementById('Telefono').value;
        const correo = document.getElementById('Correo').value;
        const estadoProveedor = document.getElementById('EstadoProveedor').value;

        if (
            nombreEmpresa.trim() === '' ||
            nombreContacto.trim() === '' ||
            telefono.trim() === '' ||
            direccion.trim() === '' ||
            correo.trim() === '' ||
            estadoProveedor.trim() === ''
        ) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                timer: 3000,
                timerProgressBar: true,
                text: 'Por favor, completa todos los campos con * para poder registrar este proveedor.'
            });
            return;
        }

        const proveedorObjeto = {
            ProveedorId: proveedorId,
            NombreEmpresa: nombreEmpresa,
            nombreContacto: nombreContacto,
            Direccion: direccion,
            Telefono: telefono,
            Correo: correo,
            EstadoProveedor: estadoProveedor
        };

        fetch(`https://localhost:7013/api/Proveedores/UpdateProveedores`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(proveedorObjeto)
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
                        text: 'Se ha actualizado con éxito.',
                        timer: 3000, // Tiempo en milisegundos (en este caso, 3 segundos)
                        timerProgressBar: true
                    }).then((result) => {
                        // Redirigir a la misma página después de la actualización
                        if (currentPage) {
                            window.location.replace(`/Proveedores?page=${currentPage}`);
                        } else {
                            window.location.replace('/Proveedores');
                        }
                    });
                } else {
                    throw new Error('Error al actualizar la marca.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert("Error en la actualización. Por favor, inténtalo de nuevo más tarde.");
            });
    }


    function eliminarProveedor(proveedorId) {
        // Hacer la solicitud DELETE al servidor para eliminar el cliente
        fetch(`https://localhost:7013/api/Proveedores/DeleteProveedor/${proveedorId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al eliminar el proveedor.');
                    return response.json();
                }
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Proveedor eliminada correctamente.',
                    timer: 1000,
                    timerProgressBar: true
                }).then(() => {
                    location.reload();
                    // Redirigir o recargar la página
                });
            })
            .catch(error => {
                console.error('Error al eliminar el proveedor:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un error al eliminar el proveedor. Por favor, verifica que el proveedor no tenga productos asociados e inténtalo de nuevo más tarde.'
                });
            });
    }


    document.getElementById('btnGuardar').addEventListener('click', function () {
        agregarProveedor();
    });


    document.querySelectorAll('#btnEdit').forEach(button => {
        button.addEventListener('click', function () {
            const marcaId = this.getAttribute('data-cliente-id');
            obtenerDatosProveedor(marcaId);
        });
    });


    document.getElementById('btnEditar').addEventListener('click', function () {
        ActualizarProveedor();
    });
    document.querySelectorAll('#btnDelete').forEach(button => {
        button.addEventListener('click', function () {
            const proveedorId = this.getAttribute('data-cliente-id');
            eliminarProveedor(proveedorId);
        });
    });

});


function limpiarFormulario() {
    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = urlParams.get('page');
    // Limpiar los valores de los campos del formulario
 
    document.getElementById('ProveedorId').value = '';
    document.getElementById('NombreEmpresa').value = '';
    document.getElementById('NombreContacto').value = '';
    document.getElementById('Direccion').value = '';
    document.getElementById('Telefono').value = '';
    document.getElementById('Correo').value = '';
    document.getElementById('EstadoProveedor').value = '';

    document.getElementById('TituloModal').innerText = 'Agregar Proveedor';
    document.getElementById('btnGuardar').style.display = 'inline-block';
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
        window.location.replace(`/Proveedores?page=${currentPage}`);
    } else {
        window.location.replace('/Proveedores');
    }
}
