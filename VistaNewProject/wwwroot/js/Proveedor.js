

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







function obtenerProveedorid(ProveedorId) {

    fetch(`https://localhost:7013/api/Proveedores/GetProveedorById?Id=${ProveedorId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos');
            }
            return response.json();
        })
        .then(proveedor => {

            document.getElementById('ProveedorIdAct').value = proveedor.proveedorId;
            document.getElementById('NombreEmpresaAct').value = proveedor.nombreEmpresa;
            document.getElementById('NombreContactoAct').value = proveedor.nombreContacto;


            document.getElementById('DireccionAct').value = proveedor.direccion;
            document.getElementById('TelefonoAct').value = proveedor.telefono;
            document.getElementById('CorreoAct').value = proveedor.correo;
            document.getElementById('EstadoProveedorAct').value = proveedor.estadoProveedor;


            console.log(proveedor);
        })
        .catch(error => {
            console.error("Error :", error)
        });
}
   


document.querySelectorAll('#btnEdit').forEach(button => {
    button.addEventListener('click', function () {
        const Id = this.getAttribute('data-proveedor-id');

        document.getElementById('FormularioAgregar').style.display = 'none';
        document.getElementById('FormActualizarProveedor').style.display = 'block';
        obtenerProveedorid(Id); // Aquí se pasa el Id como argumento a la función obtenercategoriaid()
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



function actualizarEstadoProveedor(ProveedorId, EstadoProveedor) {
    fetch(`https://localhost:7013/api/Proveedores/UpdateEstadoProveedor/${ProveedorId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ EstadoProveedor: EstadoProveedor ? 1 : 0 })
    })
        .then(response => {
            if (response.ok) {
                console.log(EstadoProveedor);
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

