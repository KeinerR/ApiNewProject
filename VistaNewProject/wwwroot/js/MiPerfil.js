$(function () {
    var usuarioInicial = {};
    var usuarios = [];
    var nombreRepetido = false;
    var apellidoRepetido = false;
    var todoValido = true; // Variable para validar todos los campos

    var usuarioId = document.getElementById('UsuarioId').value;
    obtenerDatosUsuario(usuarioId);

    fetch('https://localhost:7013/api/Usuarios/GetUsuarios')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los usuarios.');
            }
            return response.json();
        })
        .then(data => {
            usuarios = data;

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

    function validarCampo(input, usuarios) {
        var valor = input.val().trim();
        var spanError = input.next('.text-danger');

        if (valor == '') {
            spanError.text('Este campo es obligatorio.');
            todoValido = false; // Marcar como no válido si algún campo está vacío
        } else if (input.is('#Nombre')) {
            validarNombreYApellido(input, valor, $('#Apellido'), $('#Apellido').val());
            if (apellidoRepetido || nombreRepetido) {
                spanError.text('El usuario ya se encuentra registrado.');
            } else if (valor.length < 4) {
                spanError.text('El nombre debe tener un mínimo de 4 caracteres');
            } else {
                spanError.text('');
            }
        } else if (input.is('#Telefono')) {
            if (valor.length < 6 || valor.length > 12) {
                spanError.text('El teléfono debe tener entre 6 y 12 caracteres.');
            } else if (valor !== usuarioInicial.telefono) {
                var telefonoDuplicado = usuarios.some(function (user) {
                    return user.telefono === valor;
                });
                if (telefonoDuplicado) {
                    spanError.text('El número celular ya está registrado para otro usuario.');
                } else {
                    spanError.text('');
                }
            } else {
                spanError.text('');
            }
        } else if (input.is('#Apellido')) {
            validarNombreYApellido($('#Nombre'), $('#Nombre').val(), input, valor);
            if (apellidoRepetido || nombreRepetido) {
                spanError.text('El usuario ya se encuentra registrado.');
            } else if (valor.length < 4) {
                spanError.text('El apellido debe tener un mínimo de 4 caracteres');
            } else {
                spanError.text('');
            }
        } else if (input.is('#Correo') && !isValidEmail(valor)) {
            spanError.text('El formato del correo electrónico no es válido.');
        } else if (input.is('#Usuario1')) {
            if (valor.length < 6) {
                spanError.text('El usuario debe contener al menos 6 caracteres.');
            } else if (valor !== usuarioInicial.usuario1) {
                var valorMinuscula = valor.toLowerCase();
                var usuarioDuplicado = usuarios.some(function (user) {
                    return user.usuario1.toLowerCase() === valorMinuscula;
                });
                if (usuarioDuplicado) {
                    spanError.text('El usuario ya está registrado para otro usuario.');
                } else {
                    spanError.text('');
                }
            } else {
                spanError.text('');
            }
        } else if (input.is('#Correo')) {
            if (valor !== usuarioInicial.correo) {
                var usuarioDuplicado = usuarios.some(function (user) {
                    return user.correo === valor;
                });
                if (usuarioDuplicado) {
                    spanError.text('El correo electrónico ya está registrado para otro usuario.');
                } else {
                    spanError.text('');
                }
            } else {
                spanError.text('');
            }
        } else {
            spanError.text('');
        }
    }

    function isValidEmail(email) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validarNombreYApellido(inputNombre, valorNombre, inputApellido, valorApellido) {
        var spanErrorNombre = inputNombre.next('.text-danger');
        var spanErrorApellido = inputApellido.next('.text-danger');

        if (valorNombre === '') {
            spanErrorNombre.text('El nombre es obligatorio.');
        } else if (valorNombre === usuarioInicial.nombre && valorApellido === usuarioInicial.apellido) {
            spanErrorNombre.text('');
        } else {
            var nombreRepetido = usuarios.some(function (user) {
                return user.nombre.toLowerCase() === valorNombre.toLowerCase() &&
                    user.apellido.toLowerCase() === valorApellido.toLowerCase();
            });

            if (nombreRepetido) {
                spanErrorNombre.text('Este nombre y apellido ya se encuentran registrados.');
            } else {
                spanErrorNombre.text('');
            }
        }

        if (valorApellido === '') {
            spanErrorApellido.text('El apellido es obligatorio.');
        } else if (valorNombre === usuarioInicial.nombre && valorApellido === usuarioInicial.apellido) {
            spanErrorApellido.text('');
        } else {
            var apellidoRepetido = usuarios.some(function (user) {
                return user.nombre.toLowerCase() === valorNombre.toLowerCase() &&
                    user.apellido.toLowerCase() === valorApellido.toLowerCase();
            });

            if (apellidoRepetido) {
                spanErrorApellido.text('Este nombre y apellido ya se encuentran registrados.');
            } else {
                spanErrorApellido.text('');
            }
        }
    }

        function obtenerDatosUsuario(usuarioId) {
            return new Promise((resolve, reject) => {
                fetch(`https://localhost:7013/api/Usuarios/GetUsuarioById?Id=${usuarioId}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Error al obtener los datos del usuario.');
                        }
                        return response.json();
                    })
                    .then(usuario => {
                        usuarioInicial = {
                            id: usuario.usuarioId,
                            nombre: usuario.nombre,
                            apellido: usuario.apellido,
                            correo: usuario.correo,
                            telefono: usuario.telefono,
                            contrase\u00f1a: usuario.contrase\u00f1a,
                            usuario1: usuario.usuario1
                        };
                        resolve(usuarioInicial); // Resolvemos la promesa con los datos del usuario inicial
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        reject(error); // Rechazamos la promesa en caso de error
                    });
            });
        }
        $('#btnEditar').on('click', function () {
            obtenerDatosUsuario(usuarioId).then(usuarioInicial => {
                if (todoValido) { // Validar que todos los campos sean válidos antes de actualizar
                    ActualizarUsuario();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        timer: 3000, // Tiempo en milisegundos (en este caso, 3 segundos)
                        timerProgressBar: true,
                        text: 'Por favor, completa correctamente todos los campos para poder actualizar.'
                    });
                }
            });
        });

        function ActualizarUsuario() {
            const usuarioId = document.getElementById('UsuarioId').value;
            const rolId = document.getElementById('RolId').value;
            const nombre = document.getElementById('Nombre').value;
            const apellido = document.getElementById('Apellido').value;
            const usuario = document.getElementById('Usuario1').value;
            const contrasena = document.getElementById('Password').value;
            const telefono = document.getElementById('Telefono').value;
            const correo = document.getElementById('Correo').value;
            const estadoUsuario = document.getElementById('EstadoUsuario').value;
            const usuarioObjeto = {
                UsuarioId: usuarioId,
                RolId: rolId,
                Nombre: nombre,
                Apellido: apellido,
                Usuario1: usuario,
                Contrase\u00f1a: contrasena,
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
                        if (usuarioInicial.usuario1 != usuarioObjeto.Usuario1) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Perfil actualizado correctamente',
                                text: 'Ya que se cambió el nombre de usuario debes ingresar de nuevo al aplicativo',
                                showConfirmButton: true,
                                allowOutsideClick: false
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    window.location.href = '/Login/Logout';
                                }
                            });
                        } else {
                            Swal.fire({
                                icon: 'success',
                                title: 'Perfil actualizado correctamente',
                                showConfirmButton: true,
                                allowOutsideClick: false
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    window.location.href = '/MiPerfil'; // Corregido el nombre de la URL
                                }
                            });
                        }
                    } else {
                        alert("Error en la actualización. Por favor, inténtalo de nuevo más tarde.");
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert("Error en la actualización. Por favor, inténtalo de nuevo más tarde.");
                });
        }

});




