document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const mostrarAlerta = urlParams.get('mostrarAlerta');
    const usuarioId = urlParams.get('usuarioId');

   
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
                console.log('Usuarios obtenidos:', usuarios);
                // Llamar a la función para validar campos después de obtener los usuarios
                NoCamposVacios();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
  

    // Llamamos a la función obtenerDatosUsuarios 
    obtenerDatosUsuarios(); 
    if (mostrarAlerta === 'true' && usuarioId) {
        obtenerDatosUsuario(usuarioId);

        // Obtener el botón que activa la modal
        const botonModal = document.querySelector('[data-bs-target="#usuarioModal"]');
        if (botonModal) {
            // Simular el clic en el botón para mostrar la modal
            botonModal.click();
        }
    } else {
        console.log('UsuarioId no encontrado en la URL');
    }
    function mostrarOcultarContrasena(idCampo) {
        var inputContrasena = document.getElementById(idCampo);
        /*var iconoOjo = document.getElementById("MostrarOcultar" + idCampo.charAt(idCampo.length - 1)).querySelector("img");*/

        if (inputContrasena.type === "password") {
            inputContrasena.type = "text";
            // iconoOjo.src = "ruta/para/el/ícono-de-ojo-cerrado.svg";
        } else {
            inputContrasena.type = "password";
            // iconoOjo.src = "ruta/para/el/ícono-de-ojo-abierto.svg";
        }
    }
    // Función para validar campos y mostrar mensaje inicial de validación
    function NoCamposVacios() {
        // Mostrar mensaje inicial de validación
        $('#MensajeInicial').text(' Completa todos los campos con *');
        $('.Mensaje').text(' *');
        

        $('#Nombre,#RolId, #Apellido,#Telefono,#RepetirContraseña, #Usuario, #Contraseña, #Correo').on('input', function () {
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

    // Función para validar un campo y mostrar mensajes de error en el span asociado
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
            spanError.text('Este campo es obligatorio.');
        }
        if (input.is('#RolId')) {
            if (valor) {
                spanError.text('');
                spanVacio.text('');
            } else { 
                spanError.text(' ')
                spanVacio.text(' *obligatorio');
  
            }
            // Resto del código de validación del campo RolId
        }
        if (input.is('#Nombre') || input.is('#Apellido')) {
            var spanErrorNombre = $('#Nombre').next('.text-danger'); // Obtén el elemento span correspondiente al campo Nombre
            var spanErrorApellido = $('#Apellido').next('.text-danger'); // Obtén el elemento span correspondiente al campo Apellido
            var valorNombre = $('#Nombre').val().trim(); // Obtén el valor del campo Nombre
            var valorApellido = $('#Apellido').val().trim(); // Obtén el valor del campo Apellido
            var spanVacioNombre = $('#Nombre').prev('.Mensaje');
            var spanVacioApellido = $('#Apellido').prev('.Mensaje');


            if (valorNombre === '') {
                spanErrorNombre.text(' ');
                spanVacioNombre.text(' *');
            } else if ($('#Nombre').val().trim().length < 3) {
                spanErrorNombre.text('Este campo debe tener un mínimo de 3 caracteres.');
                spanVacioNombre.text('');
            } else if (/^[a-zA-Z]+\s[a-zA-Z]+$/.test(valorNombre)) {
                spanErrorNombre.text('El nombre no puede contener números ni caracteres especiales (excepto espacios en nombres compuestos).');
            } else {
                spanErrorNombre.text('');
                spanVacioNombre.text('');
            }

            if (valorApellido === '') {
                spanErrorApellido.text(' ');
                spanVacioApellido.text(' *');
            } else if ($('#Apellido').val().trim().length < 3) {
                spanErrorApellido.text('Este campo debe tener un mínimo de 3 caracteres.');
                spanVacioApellido.text('');
            } else if (/^[a-zA-Z]+\s[a-zA-Z]+$/.test(valorApellido)) {
                spanErrorApellido.text('El apellido no puede contener números ni caracteres especiales (excepto espacios en apellidos compuestos).');
                spanVacioApellido.text('');
            } else {
                spanErrorApellido.text('');
                spanVacioApellido.text('');
            }

            var nombreRepetido = usuarios.some(function (user) {
                return user.nombre.toLowerCase() === valorNombre.toLowerCase() &&
                    user.apellido.toLowerCase() === valorApellido.toLowerCase() &&
                    user.usuarioId != $('#UsuarioId').val().trim();
            });

            if (nombreRepetido) {
                spanErrorNombre.text('Este nombre y apellido ya se encuentran registrados.');
                spanErrorApellido.text('Este nombre y apellido ya se encuentran registrados.');
                spanVacio.text('');
            }
        }

       

        // Validación de teléfono
        if (input.is('#Telefono')) {
            var telefonoValido = /^\d{7,}$/.test(valor); // Permite al menos 6 dígitos
            
            if (valor === '') {
                spanError.text('');
                spanVacio.text(' *obligatorio');
            }else if (valor.length < 7 && valor.length > 0) {
                spanError.text('El teléfono debe tener minimo 7 dígitos numéricos.');
                spanVacio.text('');
            } else if (!telefonoValido) {
                spanError.text('este campo no permite letras u espacios');
                spanVacio.text('');
            } else {
                var telefonoRepetido = usuarios.some(function (user) {
                    return user.telefono === valor
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

        // Validación de correo electrónico
        if (input.is('#Correo')) {
            const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor); // Verifica el formato de correo electrónico
            if (valor === '') {
                spanError.text('Este campo es necesario. Si desea omitirlo, use: correo@gmail.com');
                spanVacio.text(' *');
            } else if (valor.toLowerCase() === 'correo@gmail.com') {
                spanError.text('');
                spanVacio.text('');
            } else if (!correoValido) {
                spanError.text('Ingrese un correo electrónico válido.');
                spanVacio.text('');
            } else {
                var correoRepetido = usuarios.some(function (user) {
                    return user.correo === valor
                });

                if (correoRepetido) {
                    spanError.text('Este correo ya se encuentra registrado por otro usuario.');
                    spanVacio.text('');
                } else {
                    spanError.text('');
                    spanVacio.text('');
                }
            }
        }



        // Validación de usuario
        if (input.is('#Usuario')) {
            const usuarioValido = /^[a-zA-Z]{3,}[a-zA-Z0-9_-]{0,16}$/.test(valor); // Verifica que el usuario cumpla con el formato especificado
            if (valor === '') {
                spanVacio.text(' *obligatorio');
            } else if (valor.length < 4 && valor.length > 1) {
                spanVacio.text('');
                spanError.text('El usuario debe contener entre 4 y 16 caracteres y empezar con letras. ejemplo:juan123 ');
            } else if (!usuarioValido) {
                spanVacio.text('');
                spanError.text('El usuario debe contener entre 4 y 16 caracteres alfanumericos, guiones bajos (_) o guiones medios (-).');
            } else {
                var usuarioRepetido = usuarios.some(function (user) {
                    return user.usuario1 === valor
                });

                if (usuarioRepetido) {
                    spanVacio.text('');
                    spanError.text('Este usuario ya se encuentra registrado.');
                } else {
                    spanError.text('');
                    spanVacio.text('');
                }
            }
        }

        // Validación de contraseña
        if (input.is('#Contraseña')) {
            var spanErrorRepetir = $('#RepetirContraseña').next('.text-danger'); // Obtén el elemento span correspondiente al campo Nombre
            const contraseñaValida = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?/|\\~-]).{6,}$/.test(valor);
            const contraseña = $('#RepetirContraseña').val();
            if (!contraseñaValida) {
                spanError.text('La contraseña debe contener al menos 6 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial.');
                spanVacio.text('');
            } else {
                spanError.text('');
                spanVacio.text('');
            }
            if (contraseña) {
                if (contraseña !== valor) {
                    spanErrorRepetir.text('Las contraseñas no coinciden')
                } else {
                    spanErrorRepetir.text('')
                }
            }
            
        }
        if (input.is('#RepetirContraseña')) {
            const contraseña = $('#Contraseña').val();
            const repetirContraseña = valor;

            if (contraseña !== repetirContraseña) {
                spanError.text('Las contraseñas no coinciden.');
                spanVacio.text('');
            } else {
                spanError.text('');
                spanVacio.text('');
            }
        }
        
        return todoValido; // Devuelve el estado de validación al finalizar la función
    }
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
                text: 'Por favor, completa todos los campos con * para poder registrar este usuario.'
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
                // Mostrar SweetAlert
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Se ha registro al usuario con éxito.',
                    timer: 3000, // Tiempo en milisegundos (en este caso, 3 segundos)
                    timerProgressBar: true
                }).then((result) => {
                    if (result.dismiss === Swal.DismissReason.timer) {
                        console.log('El usuario cerró el SweetAlert después del tiempo establecido');
                    }
                    // Recargar la página
                    location.reload();
                });
            })
            .catch(error => {
                console.error('Error:', error);
                // Manejar errores de la solicitud
            });
    }

    

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




                // Seleccionar el valor correcto en el campo de Estado Usuario
                var selectEstadoUsuario = document.getElementById('EstadoUsuario');
                if (usuario.estadoUsuario === 1) {
                    selectEstadoUsuario.value = '1'; // Activo
                } else if (usuario.estadoUsuario === 0) {
                    selectEstadoUsuario.value = '0'; // Inactivo
                }

                // Cambiar el título de la ventana modal
                document.getElementById('TituloModal').innerText = 'Editar Usuario';

                // Ocultar el botón "Agregar" y mostrar el botón "Actualizar Usuario"
                $('#MensajeInicial').text('');
                var mensajes = document.querySelectorAll('.Mensaje');
                mensajes.forEach(function (mensaje) {
                    mensaje.textContent = ''; // Restaurar mensajes de error
                    mensaje.style.display = 'inline-block';
                });

                document.getElementById('btnGuardar').style.display = 'none';
                document.getElementById('btnEditar').style.display = 'inline-block'; // Mostrar el botón "Actualizar Usuario"

                // Seleccionar el valor correcto en el campo de Rol
                var selectRol = document.getElementById('RolId');
                if (usuario.rolId === 1) {
                    selectRol.value = '1';
                } else if (usuario.rolId === 2) {
                    selectRol.value = '2';
                } else {
                    selectRol.value = '3';
                }
                // Mostrar el campo de Estado Usuario
                document.getElementById('EstadoUser').style.display = 'block';
                document.querySelectorAll('.Novisible').forEach(function (element) {
                    element.style.display = 'none';
                });
            })
            .catch(error => {
                console.error('Error:', error);
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
                    // Mostrar SweetAlert
                    Swal.fire({
                        icon: 'success',
                        title: 'Éxito',
                        text: 'Se ha actualizado con éxito.',
                        timer: 3000, // Tiempo en milisegundos (en este caso, 3 segundos)
                        timerProgressBar: true
                    }).then((result) => {
                        location.reload();
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No Se ha podido actualizar el usuario intentalo de nuevo luego.',
                        timer: 3000, // Tiempo en milisegundos (en este caso, 3 segundos)
                        timerProgressBar: true
                    }).then((result) => {
                        if (result.dismiss === Swal.DismissReason.timer) {
                            console.log('El usuario cerró el SweetAlert después del tiempo establecido');
                        }
                        // Recargar la página
                        location.reload();
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert("Error en la actualización. Por favor, inténtalo de nuevo más tarde.");
            });
    }

    

    // Attach the ojoMostrarContraseña function to the button's onclick event
    document.getElementById('MostrarOcultar1').onclick = function () {
        mostrarOcultarContrasena('Contraseña');
    };

    document.getElementById('MostrarOcultar2').onclick = function () {
        mostrarOcultarContrasena('RepetirContraseña');
    };
    // Llamar a la función agregarUsuario al hacer clic en el botón de agregar
    document.getElementById('btnGuardar').addEventListener('click', function () {
        agregarUsuario();
    });
    document.getElementById('btnEditar').addEventListener('click', function () {
        ActualizarUsuario();
    });

    document.querySelectorAll('#btnEdit').forEach(button => {
        button.addEventListener('click', function () {
            const usuarioId = this.getAttribute('data-cliente-id');
            obtenerDatosUsuario(usuarioId);
        });
    });
    // Llamar a la función obtenerDatosUsuario al hacer clic en el botón de editar
    document.querySelectorAll('#btnDelete').forEach(button => {
        button.addEventListener('click', function () {
            const usuarioId = this.getAttribute('data-cliente-id');
            eliminarUsuario(usuarioId);
        });
    });
    
    
});
function eliminarUsuario(usuarioId) {
    // Hacer la solicitud DELETE al servidor para eliminar el cliente
    fetch(`https://localhost:7013/api/Usuarios/DeleteUser/${usuarioId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar el usuario.');
            } else {
                // Aquí puedes manejar la respuesta si es necesario
                Swal.fire({
                    icon: 'success',
                    title: 'Exito',
                    text: 'Usuario eliminado.'
                }).then((result) => {
                    // Aquí puedes agregar más lógica si lo necesitas
                    // Recargar la página
                    location.reload();
                });
            }
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                timerProgressBar: true,
                text: 'No puedes eliminar un usuario con acciones asociadas en el aplicativo.'
            }).then((result) => {
                if (result.dismiss === Swal.DismissReason.timer) {
                    console.error('Error:', error);
                }
                // Recargar la página
                location.reload();
            });

        });
}


function limpiarFormulario() {
    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = urlParams.get('page');
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

    // Ocultar el campo de Estado Usuario y mostrar elementos con clase "Novisible"
    document.getElementById('EstadoUser').style.display = 'none';
    document.querySelectorAll('.Novisible').forEach(function (element) {
        element.style.display = 'block';
    });

    // Cambiar el título de la ventana modal y mostrar botón "Agregar Usuario"
    document.getElementById('TituloModal').innerText = 'Agregar Usuario';
    document.getElementById('btnGuardar').style.display = 'inline-block';
    document.getElementById('btnEditar').style.display = 'none';

    // Restaurar mensajes de error y eliminar mensajes de error
    var mensajes = document.querySelectorAll('.Mensaje');
    mensajes.forEach(function (mensaje) {
        mensaje.textContent = ' *'; // Restaurar mensajes de error
        mensaje.style.display = 'inline-block'; // Establecer estilo si es necesario
    });
    // Limpiar mensajes de error en elementos de texto
    const mensajesError = document.querySelectorAll('.text-danger');
    mensajesError.forEach(span => {
        span.innerText = ''; // Limpiar contenido del mensaje
    });
    if (currentPage) {
        window.location.replace(`/Usuarios?page=${currentPage}`);
    } else {
        window.location.replace('/Usuarios');
    }
}



function mostraralerta(usuarioId) {
    alert('El estado del usuario a cambiado usaurioId:'+usuarioId)
}