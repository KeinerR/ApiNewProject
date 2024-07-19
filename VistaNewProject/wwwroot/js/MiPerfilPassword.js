$(function () {
    var usuarioInicial = {};
    var usuarioId = $("#UsuarioId").val();
    var todoValido = false;
    obtenerDatosUsuario(usuarioId);
    $('#currentPassword,#newPassword,#verifyPassword').on('input', function () {
        validarCampoCompra($(this));
        todoValido = $('.text-danger').filter(function () {
            return $(this).text() !== '';
        }).length === 0;
    });

    function obtenerDatosUsuario(usuarioId) {
        return new Promise((resolve, reject) => {
            $.get(`http://optimusweb-001-site1.ctempurl.com/api/Usuarios/GetUsuarioById?Id=${usuarioId}`)
                .done(usuario => {
                    usuarioInicial = {
                        id: usuario.usuarioId,
                        rol: usuario.rolId,
                        nombre: usuario.nombre,
                        apellido: usuario.apellido,
                        correo: usuario.correo,
                        telefono: usuario.telefono,
                        contraseña: usuario.contraseña,
                        usuario1: usuario.usuario1,
                        estado: usuario.estadoUsuario
                    };
                    resolve(usuarioInicial);
                })
                .fail(error => {
                    console.error('Error:', error);
                    reject(error);
                });
        });
    }



    function validarCampoCompra(input) {
        var valor = input.val().trim();
        var spanError = input.next('.text-danger');
        var passwordInicial = usuarioInicial.contraseña;
        var newPassword = $('#newPassword').val().trim();
        var verifyPassword = $('#verifyPassword').val().trim();

        if (valor == '') {
            spanError.text('Este campo es obligatorio.');
            console.log(usuarioInicial.usuario1)
            todoValido = false;
        } else if (input.is('#currentPassword')) {
            if (valor != passwordInicial) {
                spanError.text('La contraseña actual no coincide con la contraseña registrada.');
                todoValido = false;
            } else {
                spanError.text('');
                todoValido = true;
            }
        } else if (input.is('#newPassword')) {
            if (valor.length < 6) { // Debes verificar la longitud del valor, no el valor en sí
                spanError.text('El campo debe tener más de 6 caracteres.'); // Corregido el error de tipeo
                todoValido = false;
            } else {
                spanError.text(''); // Si verifyPassword está vacío, no hay error
                todoValido = true; // Y todoValido debe ser true
            }
        } else if (input.is('#verifyPassword')) { 
            if (newPassword != '') { // Solo necesitas verificar si verifyPassword no está vacío
                if (newPassword != verifyPassword) {
                    spanError.text('Las contraseñas nuevas no coinciden.'); // El mensaje de error debe ser relevante
                    todoValido = false;
                } else {
                    spanError.text('');
                    todoValido = true;
                }
            } else {
                spanError.text(''); // Si verifyPassword está vacío, no hay error
                todoValido = true; // Y todoValido debe ser true
            }
      
        
        }
        else {
            spanError.text('');
            todoValido = true;
        }
    }

    $('#btnPassword').on('click', function () {
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
    function ActualizarUsuario() {
        const usuarioId = usuarioInicial.id;
        const rolId = usuarioInicial.rol;
        const nombre = usuarioInicial.nombre;
        const apellido = usuarioInicial.apellido;
        const usuario = usuarioInicial.usuario1;
        const contrasena = document.getElementById('newPassword').value;
        const telefono = usuarioInicial.telefono;
        const correo = usuarioInicial.correo;
        const estadoUsuario = usuarioInicial.estado;
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

        fetch(`http://optimusweb-001-site1.ctempurl.com/api/Usuarios/UpdateUsuarios`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuarioObjeto)
        })
            .then(response => {
                if (response.ok) {
                    if (usuarioInicial.contraseña != usuarioObjeto.Contrase\u00f1a) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Perfil actualizado correctamente',
                            text: 'Ya que se cambió la contraseña de usuario debes ingresar de nuevo al aplicativo',
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

