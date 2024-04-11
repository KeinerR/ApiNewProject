document.addEventListener('DOMContentLoaded', function () {
    usuarios = {}; // Inicializamos la variable usuarios como un objeto vacío
    var todoValido = true;
   
 

    function obtenerDatosUsuarios() {
        fetch('https://localhost:7013/api/Usuarios/GetUsuarios')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los usuarios.');
                }
                return response.json();
            })
            .then(data => {
                usuarios = data; // Asignamos el resultado de la petición a la variable usuarios

                // Por ejemplo, validar campos como lo muestras en tu código
                $('#Usuario1,#Nombre,#Apellido, #Correo, #Telefono').on('input', function () {
                    if (usuarios) {
                        validarCampo($(this), usuarios);
                        // Validar si todos los campos son válidos
                        todoValido = $('.text-danger').filter(function () {
                            return $(this).text() !== '';
                        }).length === 0;
                    }
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    // Llamamos a la función obtenerDatosUsuario con el ID del usuario que quieras obtener
    obtenerDatosUsuarios(); // Aquí puedes pasar el ID del usuario que necesites

    // Función para validar un campo y mostrar mensajes de error en el span asociado
    function validarCampo(input) {
        var valor = input.val().trim(); // Obtener el valor del campo y eliminar espacios en blanco al inicio y al final
        var spanError = input.next('.text-danger'); // Obtener el elemento span de error asociado al input

        // Limpiar el mensaje de error previo
        spanError.text('');

        // Validar el campo y mostrar mensaje de error si es necesario
        if (valor === '') {
            spanError.text('Este campo es obligatorio.');
            todoValido = false;
        }
        if (input.is('#RolId')) {
            var spanError = $('#RolIdError');
            // Resto del código de validación del campo RolId
        }

        if (input.is('#Apellido')) {
            var spanError = input.next('.text-danger'); // Obtén el elemento span correspondiente al campo de entrada
            var valor = input.val().trim(); // Obtén el valor del campo de entrada
            const apellidoValido = /^[a-zA-Z]+(\s[a-zA-Z]+)*$/.test(valor);
            if (valor === '') {
                spanError.text('Este campo es obligatorio.');
            } else if (valor.length < 3) {
                spanError.text('El apellido debe tener mas de 6 carateres.');
            } else if (!apellidoValido) {
                spanError.text('El apellido no puede contener números ni caracteres especiales (excepto espacios en nombres compuestos).');
            } else {
                var apellidoRepetido = usuarios.some(function (user) {
                    return user.nombre.toLowerCase() === $('#Nombre').val().trim().toLowerCase() &&
                        user.apellido.toLowerCase() === $('#Apellido').val().trim().toLowerCase() &&
                        user.usuarioId != $('#UsuarioId').val().trim();
                });

                if (apellidoRepetido) {
                    spanError.text('Este nombre y apellido ya se encuentran registrados.');
                } else {
                    spanError.text('');
                }
            }
        }
        if (input.is('#Nombre')) {
            var spanError = input.next('.text-danger'); // Obtén el elemento span correspondiente al campo de entrada
            var valor = input.val().trim(); // Obtén el valor del campo de entrada
            var nombre = $('#Nombre').val().trim();
            

            if (valor === '') {
                spanError.text('Este campo es obligatorio.');
            } else if (nombre.length < 3) {
                spanError.text('Este debe tener un minimo de 3 carateres.');
            } else if (/^[a-zA-Z]+\s[a-zA-Z]$/.test(valor)) {
                spanError.text('El nombre no puede contener números ni caracteres especiales (excepto espacios en nombres compuestos).');
            } else {
                var nombreRepetido = usuarios.some(function (user) {
                    return user.nombre.toLowerCase() === $('#Nombre').val().trim().toLowerCase() &&
                        user.apellido.toLowerCase() === $('#Apellido').val().trim().toLowerCase() &&
                        user.usuarioId != $('#UsuarioId').val().trim();
                });

                if (nombreRepetido) {
                    spanError.text('Este nombre y apellido ya se encuentran registrados.');
                } else {
                    spanError.text('');
                }
            }
        }
       
        
        // Validación de teléfono
        if (input.is('#Telefono')) {
            const telefonoValido = /^\d{6,15}$/.test(valor); // Verifica que el teléfono tenga entre 6 y 15 dígitos numéricos
            if (valor.length < 6) {
                spanError.text('El teléfono debe tener minimo 6 dígitos numéricos.');
                todoValido = false;
            } else if (!telefonoValido) {
                spanError.text('este campo no permite letras u espacios');
                todoValido = false;
            } else {
                var telefonoRepetido = usuarios.some(function (user) {
                    return user.telefono === valor
                 });

                if (telefonoRepetido) {
                    spanError.text('Este telefono ya se encuentra registrado por otro usuario.');
                } else {
                    spanError.text('');
                }
            }
        }

        // Validación de correo electrónico
        if (input.is('#Correo')) {
            const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor); // Verifica el formato de correo electrónico
            if (valor === '') {
                spanError.text('Este campo es necesario. Si desea omitirlo, use: correo@gmail.com');
                todoValido = false;
            } else if (valor.toLowerCase() === 'correo@gmail.com') {
                spanError.text('');
                todoValido = true;
            } else if (!correoValido) {
                spanError.text('Ingrese un correo electrónico válido.');
                todoValido = false;
            } else {
                var correoRepetido = usuarios.some(function (user) {
                    return user.correo === valor
                });

                if (correoRepetido) {
                    spanError.text('Este correo ya se encuentra registrado por otro usuario.');
                } else {
                    spanError.text('');
                }
            }
        }



        // Validación de usuario
        if (input.is('#Usuario')) {
            const usuarioValido = /^[a-zA-Z]{4,}[a-zA-Z0-9_-]{0,16}$/.test(valor); // Verifica que el usuario cumpla con el formato especificado
            if (valor.length > 0 && valor.length < 4) {
                spanError.text('El usuario debe contener entre 4 y 16 caracteres y empezar con letras. ejemplo:juan123 ');
                todoValido = false;
            } else if (!usuarioValido) {
                spanError.text('El usuario debe contener entre 4 y 16 caracteres alfanumericos, guiones bajos (_) o guiones medios (-).');
                todoValido = false;
            } else {
                var usuarioRepetido = usuarios.some(function (user) {
                    return user.usuario1 === valor
                });

                if (usuarioRepetido) {
                    spanError.text('Este usuario ya se encuentra registrado.');
                } else {
                    spanError.text('');
                }
            }
        }

        // Validación de contraseña
        if (input.is('#Contraseña')) {
            const contraseñaValida = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?/|\\~-]).{6,}$/.test(valor);


            if (!contraseñaValida) {
                spanError.text('La contraseña debe contener al menos 6 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial.');
                todoValido = false;
            }
        }

        
    }
    // Asignar la función validarCampo a los eventos input de los campos que quieres validar
    $('#Nombre,#Apellido,#Usuario,#Contraseña,#Correo').on('input', function () {
        validarCampo($(this));
        // Validar si todos los campos son válidos antes de agregar el usuario
        todoValido = $('.text-danger').filter(function () {
            return $(this).text() !== '';
        }).length === 0;
    });

    // Función para agregar un usuario después de validar los campos
    function agregarUsuario() {
        // Validar si todos los campos son válidos
        if (!todoValido) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                timer: 3000, // Tiempo en milisegundos (en este caso, 3 segundos)
                timerProgressBar: true,
                text: 'Por favor, completa correctamente todos los campos para poder registrar este usuario.'
            });
            return;
        }

        // Obtener los valores de los campos del formulario
        const nombre = document.getElementById('Nombre').value.trim();
        const rolId = document.getElementById('RolId').value;
        const apellido = document.getElementById('Apellido').value.trim();
        const usuario = document.getElementById('Usuario').value.trim();
        const contraseña = document.getElementById('Contraseña').value.trim();
        const telefono = document.getElementById('Telefono').value.trim();
        const correo = document.getElementById('Correo').value.trim();
        const estadoUsuario = document.getElementById('EstadoUsuario').value;
        
        if (
            nombre.trim() === '' ||
            rolId.trim() === '' ||
            apellido.trim() === '' ||
            usuario.trim() === '' ||
            contraseña.trim() === '' ||
            telefono.trim() === '' ||
            correo.trim() === '' ||
            estadoUsuario.trim() === ''
        ) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                timer: 3000,
                timerProgressBar: true,
                text: 'Por favor, completa todos los campos para poder registrar este usuario.'
            });
            return;
        }
        // Crear un objeto con los valores del formulario
        const usuarioObjeto = {
            RolId: rolId,
            Nombre: nombre,
            Apellido: apellido,
            Usuario1: usuario,
            Contraseña: contraseña,
            Telefono: telefono,
            Correo: correo,
            EstadoUsuario: estadoUsuario
        };

        // Enviar la solicitud POST al servidor utilizando la Fetch API
        fetch('https://localhost:7013/api/Usuarios/InsertUsuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuarioObjeto)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ocurrió un error al enviar la solicitud.');
                }
                return response.json();
            })
            .then(data => {
                console.log('Respuesta del servidor:', data);
                // Manejar la respuesta del servidor según sea necesario
                location.reload(); // Esto recarga la página
            })
            .catch(error => {
                console.error('Error:', error);
                // Manejar errores de la solicitud
            });
    }

    


    function ActualizarUsuario() {
        if (!todoValido) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                timer: 3000, // Tiempo en milisegundos (en este caso, 3 segundos)
                timerProgressBar: true,
                text: 'Por favor, completa correctamente todos los campos para poder actualizar este usuario.'
            });
            return;
        }
        const usuarioId = document.getElementById('UsuarioId').value;
        const rolId = document.getElementById('RolId').value;
        const nombre = document.getElementById('Nombre').value;
        const apellido = document.getElementById('Apellido').value;
        const usuario = document.getElementById('Usuario').value;
        const contraseña = document.getElementById('Contraseña').value;
        const telefono = document.getElementById('Telefono').value;
        const correo = document.getElementById('Correo').value;
        const estadoUsuario = document.getElementById('EstadoUsuario').value;

        const usuarioObjeto = {
            UsuarioId: usuarioId,
            RolId: rolId,
            Nombre: nombre,
            Apellido: apellido,
            Usuario1: usuario,
            Contraseña: contraseña,
            Telefono: telefono,
            Correo: correo,
            EstadoUsuario: estadoUsuario
        };

        fetch(`https://localhost:7013/api/Usuarios/UpdateUsuarios`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuarioObjeto)
        })
            .then(response => {
                if (response.ok) {
                    alert('Usuario actualizado correctamente.');
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

    function eliminarUsuario(usuarioId) {
        // Hacer la solicitud DELETE al servidor para eliminar el cliente
        fetch(`https://localhost:7013/api/Usuarios/DeleteUser/${usuarioId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al eliminar el usuario.');
                }
                // Aquí puedes manejar la respuesta si es necesario
                Swal.fire({
                    icon: 'success',
                    title: 'Exito',
                    timer: 3000,
                    timerProgressBar: true,
                    text: 'Usuario eliminado correctamente.'
                });
                // Recargar la página o actualizar la lista de clientes, según sea necesario
                location.reload(); // Esto recarga la página
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    // Llamar a la función agregarUsuario al hacer clic en el botón de agregar
    document.getElementById('btnGuardar').addEventListener('click', function () {
        agregarUsuario();
    });


    document.getElementById('btnEditar').addEventListener('click', function () {
        ActualizarUsuario();
    });
 
    // Llamar a la función obtenerDatosUsuario al hacer clic en el botón de editar
    document.querySelectorAll('#btnDelete').forEach(button => {
        button.addEventListener('click', function () {
            const usuarioId = this.getAttribute('data-cliente-id');
            eliminarUsuario(usuarioId);
        });
    });
    
});

function obtenerDatosUsuario(usuarioId) {
    fetch(`https://localhost:7013/api/Usuarios/GetUsuarioById?Id=${usuarioId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos del usuario.');
            }
            return response.json();
        })
        .then(usuario => {
            // Llenar los campos del formulario modal con los datos del cliente
            document.getElementById('UsuarioId').value = usuario.usuarioId;
            document.getElementById('RolId').value = usuario.rolId;
            document.getElementById('Nombre').value = usuario.nombre;
            document.getElementById('Apellido').value = usuario.apellido;
            document.getElementById('Usuario').value = usuario.usuario1;
            document.getElementById('Contraseña').value = usuario.contraseña;
            document.getElementById('Telefono').value = usuario.telefono;
            document.getElementById('Correo').value = usuario.correo;
            document.getElementById('EstadoUsuario').value = usuario.estadoUsuario;
            // Cambiar el título de la ventana modal
            document.getElementById('TituloModal').innerText = 'Editar Usuario';
            // Ocultar el botón "Agregar" y mostrar el botón "Actualizar Usuario"
            document.getElementById('btnGuardar').style.display = 'none';
            document.getElementById('btnEditar').style.display = 'inline-block'; // Mostrar el botón "Actualizar Usuario"
            var selectRol = document.getElementById('RolId');

            if (usuario.rolId === 1) {
                selectRol.value = '1';
            } else if (usuario.rolId === 2) {
                selectRol.value = '2';
            } else {
                selectRol.value = '3';
            }

           
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function limpiarFormulario() {
    // Limpiar los valores de los campos del formulario
    document.getElementById('UsuarioId').value = '';
    document.getElementById('RolId').value = '';
    document.getElementById('Nombre').value = '';
    document.getElementById('Apellido').value = '';
    document.getElementById('Usuario').value = '';
    document.getElementById('Contraseña').value = '';
    document.getElementById('Telefono').value = '';
    document.getElementById('Correo').value = '';
    document.getElementById('EstadoUsuario').value = '';

    document.getElementById('TituloModal').innerText = 'Agregar Usuario';
    document.getElementById('btnGuardar').style.display = 'inline-block'; // Mostrar el botón "Actualizar Usuario"
    document.getElementById('btnEditar').style.display = 'none';
    // Eliminar los mensajes de error
    // Eliminar los mensajes de error
    const mensajesError = document.querySelectorAll('.text-danger');
    mensajesError.forEach(span => {
        span.innerText = ''; // Limpiar el contenido del mensaje
    });
}
