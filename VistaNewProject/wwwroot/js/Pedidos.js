
//function inicializarEventos() {
//    // Botón para abrir el modal de agregar cliente
//    $('#clienteModal').on('show.bs.modal', function (event) {
//        // Llama a la función para obtener los datos de los clientes
//        obtenerDatosUsuarios();
//    });
//}

//const { data } = require("jquery");

//const { data } = require("jquery");

/*const { data } = require("jquery");*/

//// Función para obtener los datos de los clientes
//function obtenerDatosUsuarios() {
//    fetch('https://localhost:7013/api/Clientes/GetClientes')
//        .then(response => {
//            if (!response.ok) {
//                throw new Error('Error al obtener los Clientes.');
//            }
//            return response.json();
//        })
//        .then(data => {
//            cliente = data; // Asignamos el resultado de la petición a la variable usuarios
//            console.log('Clientes obtenidos:', cliente);
//            // Una vez que hayas obtenido los datos, puedes hacer lo que necesites con ellos,
//            // como llenar un formulario en el modal.
//        })
//        .catch(error => {
//            console.error('Error:', error);
//        });
//}

//$(document).ready(function () {
//    inicializarEventos();
//});

//var fechaActual = new Date();
//var fechaFormateada = fechaActual.toISOString().slice(0, 16);
//document.getElementById("FechaPedido1").value = fechaFormateada;

//var fechaFormateada1 = fechaActual.toISOString().slice(0, 16);

//// Asignar la fecha formateada al campo de entrada
//document.getElementById("FechaEntrega3").value = fechaFormateada1;


//var fechaActual = new Date();
//var fechaFormateada = fechaActual.toISOString().slice(0, 16);
//document.getElementById("FechaPedido1").value = fechaFormateada;

//var fechaFormateada1 = fechaActual.toISOString().slice(0, 16);

//// Asignar la fecha formateada al campo de entrada
//document.getElementById("FechaEntrega3").value = fechaFormateada1;




//document.getElementById("btnGuardarPedido").onclick = function () {

//    var tipoServicio = document.getElementById("TipoServicio1").value;
//    var EstadoPedido = document.getElementById("EstadoPedido1").value;

//    if (tipoServicio === "Domicilio") {
//        pedido = {
//            ClienteId: document.getElementById("ClienteId1").value,
//            TipoServicio: tipoServicio,
//            FechaPedido: document.getElementById("FechaPedido1").value,
//            EstadoPedido: EstadoPedido,
//            Detallepedidos: detallespedido,
//            Domicilios: domicilios
//        };
//    } else {
//        pedido = {
//            ClienteId: document.getElementById("ClienteId1").value,
//            TipoServicio: tipoServicio,
//            FechaPedido: document.getElementById("FechaPedido1").value,
//            EstadoPedido: EstadoPedido,
//            Detallepedidos: detallespedido
//        };
//    }


//document.getElementById("btnGuardarPedido").onclick = function () {

//    var tipoServicio = document.getElementById("TipoServicio1").value;
//    var EstadoPedido = document.getElementById("EstadoPedido1").value;

//    if (tipoServicio === "Domicilio") {
//        pedido = {
//            ClienteId: document.getElementById("ClienteId1").value,
//            TipoServicio: tipoServicio,
//            FechaPedido: document.getElementById("FechaPedido1").value,
//            EstadoPedido: EstadoPedido,
//            Detallepedidos: detallespedido,
//            Domicilios: domicilios
//        };
//    } else {
//        pedido = {
//            ClienteId: document.getElementById("ClienteId1").value,
//            TipoServicio: tipoServicio,
//            FechaPedido: document.getElementById("FechaPedido1").value,
//            EstadoPedido: EstadoPedido,
//            Detallepedidos: detallespedido
//        };
//    }


//    console.log('Pedido guardado:', pedido.Detallepedidos);
//    console.log('Pedido guardado:', pedido.Domicilios);
//    confirm(" real mente desea envial los datos");    // Enviar la solicitud POST al servidor utilizando la Fetch API
//    fetch('https://localhost:7013/api/Pedidos/InsertPedidos', {
//        method: 'POST',
//        headers: {
//            'Content-Type': 'application/json'
//        },
//        body: JSON.stringify(pedido)

//    })

//        .then(response => {
//            if (response.ok) {
//                alert('Pedido guardado correctamente.');
//                location.reload(true); // Recargar la página después de la actualización
//            } else {
//                alert("Error en la actualización. Por favor, inténtalo de nuevo más tarde.");
//            }
//        })
//        .catch(error => {
//            console.error('Error:', error);
//            alert("Error en la actualización. Por favor, inténtalo de nuevo más tarde.");
//        });

//    // Limpiar el formulario de pedido y el objeto pedido
//    pedido = null;
//    document.getElementById("formPedido").reset();
//};


//var detallespedido = [];
//var indiceEdicion = null; // Variable global para almacenar el índice del detalle que se está editando

//document.getElementById("btnAgregardetalle").onclick = function () {
//    if (indiceEdicion !== null) {
//        // Si hay un índice de edición establecido, actualiza el detalle existente en lugar de agregar uno nuevo
//        detallespedido[indiceEdicion] = {
//            ProductoId: document.getElementById("ProductoId2").value,
//            UnidadId: document.getElementById("UnidadId").value,

//            Cantidad: document.getElementById("Cantidad2").value,
//            PrecioUnitario: document.getElementById("PrecioUnitario2").value
//        };
//        // Restablece el índice de edición a null después de editar
//        indiceEdicion = null;
//    } else {
//        // Si no hay un índice de edición, agrega un nuevo detalle
//        var detallePedido = {
//            ProductoId: document.getElementById("ProductoId2").value,
//            UnidadId: document.getElementById("UnidadId").value,

//            Cantidad: document.getElementById("Cantidad2").value,
//            PrecioUnitario: document.getElementById("PrecioUnitario2").value
//        };
//        detallespedido.push(detallePedido);
//    }

//    alert('Detalle de pedido agregado:', detallePedido);
//    console.log(detallePedido);

//    // Reiniciar el formulario de detalles del pedido
//    document.getElementById("formDetallePedido").reset();

//    // Actualizar la tabla de detalles del pedido después de agregar o editar un detalle
//    actualizarTablaDetalle();
//};

//function editarDetalle(index) {
//    // Establecer el índice de edición al índice seleccionado
//    indiceEdicion = index;

//    var detallePedido = detallespedido[index];

//    // Rellenar los campos del formulario de edición con los datos del detalle del pedido
//    document.getElementById("ProductoId2").value = detallePedido.ProductoId;

//    document.getElementById("UnidadId").value = detallePedido.UnidadId,


//    document.getElementById("Cantidad2").value = detallePedido.Cantidad;
//    document.getElementById("PrecioUnitario2").value = detallePedido.PrecioUnitario;

//    // Mostrar el formulario de edición de detalles del pedido
//    document.getElementById("detallecontainer").classList.remove("d-none");

//    // Mostrar el datalist nuevamente
//    document.getElementById("productoList").hidden = false;
//}





//function actualizarTablaDetalle() {
//    var detalleTableBody = document.getElementById("detalleTableBody");
//    detalleTableBody.innerHTML = "";

//    detallespedido.forEach(function (detallePedido, index) {
//        var row = detalleTableBody.insertRow();
//        var cell1 = row.insertCell(0);
//        var cell2 = row.insertCell(1);
//        var cell3 = row.insertCell(2);
//        var cell4 = row.insertCell(3);
//        var cell5 = row.insertCell(4);

//        cell1.textContent = detallePedido.ProductoId;
//        cell2.textContent = detallePedido.UnidadId;
//        cell3.textContent = detallePedido.Cantidad;
//        cell4.textContent = detallePedido.PrecioUnitario;

//        var editButton = document.createElement("button");
//        editButton.innerHTML = '<i class="fas fa-edit"></i>'; // Corrección de la sintaxis
//        editButton.classList.add("btn", "btn-warning", "btn-editar-detalle");
//        editButton.dataset.index = index;
//        cell5.appendChild(editButton);

//        // Agregar botón de eliminar con emoji
//        var deleteButton = document.createElement("button");
//        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
//        deleteButton.classList.add("btn", "btn-danger", "btn-eliminar-detalle");
//        deleteButton.dataset.index = index;
//        cell5.appendChild(deleteButton);
//    });

//    // Agregar eventos de clic a los botones de "Editar"
//    agregarEventoEditar();
//    agregarEventoEliminar();
//}

//// Función para agregar eventos de clic a los botones de "Editar"
//function agregarEventoEditar() {
//    var botonesEditar = document.querySelectorAll(".btn-editar-detalle");
//    botonesEditar.forEach(function (boton) {
//        boton.addEventListener("click", function () {
//            var index = this.dataset.index;
//            editarDetalle(index);
//        });
//    });
//}
//function agregarEventoEliminar() {
//    var botonesEliminar = document.querySelectorAll(".btn-eliminar-detalle");
//    botonesEliminar.forEach(function (boton) {
//        boton.addEventListener("click", function () {
//            var index = this.dataset.index;
//            eliminarDetalle(index);
//        });
//    });
//}

//// Función para eliminar un detalle del pedido
//function eliminarDetalle(index) {
//    detallespedido.splice(index, 1); // Eliminar el detalle del pedido de la lista de detalles
//    actualizarTablaDetalle(); // Actualizar la tabla de detalles del pedido después de eliminar un detalle
//}
//// Función para editar un detalle del pedido


//var domicilios = [];
//var indiceEdicionDomicilio = null; // Variable global para almacenar el índice del domicilio que se está editando

//document.getElementById("btnAgregarDomicilio").onclick = function () {
//    if (indiceEdicionDomicilio !== null) {
//        // Si hay un índice de edición establecido, actualiza el domicilio existente en lugar de agregar uno nuevo
//        domicilios[indiceEdicionDomicilio] = {
//            UsuarioId: document.getElementById("UsuarioId3").value,
//            Observacion: document.getElementById("Observacion3").value,
//            FechaEntrega: document.getElementById("FechaEntrega3").value,
//            DireccionDomiciliario: document.getElementById("DireccionDomiciliario3").value
//        };
//        // Restablece el índice de edición a null después de editar
//        indiceEdicionDomicilio = null;
//    } else {
//        // Si no hay un índice de edición, agrega un nuevo domicilio
//        var domicilio = {
//            UsuarioId: document.getElementById("UsuarioId3").value,
//            Observacion: document.getElementById("Observacion3").value,
//            FechaEntrega: document.getElementById("FechaEntrega3").value,
//            DireccionDomiciliario: document.getElementById("DireccionDomiciliario3").value
//        };
//        domicilios.push(domicilio);
//    }

//    alert('Domicilio agregado:', domicilio);
//    console.log(domicilios);

//    // Reiniciar el formulario de domicilio
//    document.getElementById("formDomicilio").reset();

//    // Actualizar la tabla de domicilios después de agregar o editar un domicilio
//    actualizarTablaDomicilio();
//};

//// Función para editar un domicilio
//function editarDomicilio(index) {
//    // Establecer el índice de edición al índice seleccionado
//    indiceEdicionDomicilio = index;

//    var domicilio = domicilios[index];

//    // Rellenar los campos del formulario de edición con los datos del domicilio
//    document.getElementById("UsuarioId3").value = domicilio.UsuarioId;
//    document.getElementById("Observacion3").value = domicilio.Observacion;
//    document.getElementById("FechaEntrega3").value = domicilio.FechaEntrega;
//    document.getElementById("DireccionDomiciliario3").value = domicilio.DireccionDomiciliario;

//    // Mostrar el formulario de edición de domicilio
//    document.getElementById("formDomicilioContainer").classList.remove("d-none");
//}

//// Función para actualizar la tabla de domicilios
//function actualizarTablaDomicilio() {
//    var domicilioTableBody = document.getElementById("domicilioTableBody");
//    domicilioTableBody.innerHTML = "";

//    domicilios.forEach(function (domicilio, index) {
//        var row = domicilioTableBody.insertRow();
//        var cell1 = row.insertCell(0);
//        var cell2 = row.insertCell(1);
//        var cell3 = row.insertCell(2);
//        var cell4 = row.insertCell(3);
//        var cell5 = row.insertCell(4);

//        cell1.textContent = domicilio.UsuarioId;
//        cell2.textContent = domicilio.Observacion;
//        cell3.textContent = domicilio.FechaEntrega;
//        cell4.textContent = domicilio.DireccionDomiciliario;

//        var editButton = document.createElement("button");
//        editButton.innerHTML = '<i class="fas fa-edit"></i>'; // Corrección de la sintaxis
//        editButton.classList.add("btn", "btn-warning", "btn-editar-domicilio");
//        editButton.dataset.index = index;
//        cell5.appendChild(editButton);


//        // Agregar botón de eliminar con emoji
//        var deleteButton = document.createElement("button");
//        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
//        deleteButton.classList.add("btn", "btn-danger", "btn-eliminar-domicilio");
//        deleteButton.dataset.index = index;
//        cell5.appendChild(deleteButton);
//    });

//    // Agregar eventos de clic a los botones de "Editar"
//    agregarEventoEditarDomicilio();
//    agregarEventoEliminarDomicilio();
//}

//// Función para agregar eventos de clic a los botones de "Editar" en la tabla de domicilios
//function agregarEventoEditarDomicilio() {
//    var botonesEditar = document.querySelectorAll(".btn-editar-domicilio");
//    botonesEditar.forEach(function (boton) {
//        boton.addEventListener("click", function () {
//            var index = this.dataset.index;
//            editarDomicilio(index);
//        });
//    });
//}

//// Función para agregar eventos de clic a los botones de "Eliminar" en la tabla de domicilios
//function agregarEventoEliminarDomicilio() {
//    var botonesEliminar = document.querySelectorAll(".btn-eliminar-domicilio");
//    botonesEliminar.forEach(function (boton) {
//        boton.addEventListener("click", function () {
//            var index = this.dataset.index;
//            eliminarDomicilio(index);
//        });
//    });
//}

//// Función para eliminar un domicilio de la lista
//function eliminarDomicilio(index) {
//    domicilios.splice(index, 1); // Eliminar el domicilio de la lista
//    actualizarTablaDomicilio(); // Actualizar la tabla de domicilios después de eliminar un domicilio
//}

//document.getElementById("TipoServicio1").addEventListener("change", function () {
//    var tipoServicio = this.value;
//    var domicilioFormContainer = document.getElementById("formDomicilioContainer");
//    if (tipoServicio === "Domicilio") {
//        domicilioFormContainer.classList.remove("d-none");
//    } else {
//        domicilioFormContainer.classList.add("d-none");
//    }
//});



//document.getElementById("TipoServicio1").addEventListener("change", function () {
//    var tipoServicio = this.value;
//    var domicilioFormContainer = document.getElementById("domiciliotable");
//    if (tipoServicio === "Domicilio") {
//        domicilioFormContainer.classList.remove("d-none");
//    } else {
//        domicilioFormContainer.classList.add("d-none");
//    }
//});

//document.getElementById("cerradomicilio").onclick = function () {
//    var domicilioContainer = document.getElementById("formDomicilioContainer");
//    if (!domicilioContainer.classList.contains("d-none")) {
//        domicilioContainer.classList.add("d-none");
//    }
//};





//function actualizarTablaDetalle() {
//    var detalleTableBody = document.getElementById("detalleTableBody");
//    detalleTableBody.innerHTML = "";

//    detallespedido.forEach(function (detallePedido, index) {
//        var row = detalleTableBody.insertRow();
//        var cell1 = row.insertCell(0);
//        var cell2 = row.insertCell(1);
//        var cell3 = row.insertCell(2);
//        var cell4 = row.insertCell(3);

//        cell1.textContent = detallePedido.ProductoId;
//        cell2.textContent = detallePedido.Cantidad;
//        cell3.textContent = detallePedido.PrecioUnitario;

//        var editButton = document.createElement("button");
//        editButton.innerHTML = '<i class="fas fa-edit"></i>'; // Corrección de la sintaxis
//        editButton.classList.add("btn", "btn-warning", "btn-editar-detalle");
//        editButton.dataset.index = index;
//        cell4.appendChild(editButton);

//        // Agregar botón de eliminar con emoji
//        var deleteButton = document.createElement("button");
//        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
//        deleteButton.classList.add("btn", "btn-danger", "btn-eliminar-detalle");
//        deleteButton.dataset.index = index;
//        cell4.appendChild(deleteButton);
//    });

//    // Agregar eventos de clic a los botones de "Editar"
//    agregarEventoEditar();
//    agregarEventoEliminar();
//}

//// Función para agregar eventos de clic a los botones de "Editar"
//function agregarEventoEditar() {
//    var botonesEditar = document.querySelectorAll(".btn-editar-detalle");
//    botonesEditar.forEach(function (boton) {
//        boton.addEventListener("click", function () {
//            var index = this.dataset.index;
//            editarDetalle(index);
//        });
//    });
//}
//function agregarEventoEliminar() {
//    var botonesEliminar = document.querySelectorAll(".btn-eliminar-detalle");
//    botonesEliminar.forEach(function (boton) {
//        boton.addEventListener("click", function () {
//            var index = this.dataset.index;
//            eliminarDetalle(index);
//        });
//    });
//}

//// Función para eliminar un detalle del pedido
//function eliminarDetalle(index) {
//    detallespedido.splice(index, 1); // Eliminar el detalle del pedido de la lista de detalles
//    actualizarTablaDetalle(); // Actualizar la tabla de detalles del pedido después de eliminar un detalle
//}
//// Función para editar un detalle del pedido


//var domicilios = [];
//var indiceEdicionDomicilio = null; // Variable global para almacenar el índice del domicilio que se está editando

//document.getElementById("btnAgregarDomicilio").onclick = function () {
//    if (indiceEdicionDomicilio !== null) {
//        // Si hay un índice de edición establecido, actualiza el domicilio existente en lugar de agregar uno nuevo
//        domicilios[indiceEdicionDomicilio] = {
//            UsuarioId: document.getElementById("UsuarioId3").value,
//            Observacion: document.getElementById("Observacion3").value,
//            FechaEntrega: document.getElementById("FechaEntrega3").value,
//            DireccionDomiciliario: document.getElementById("DireccionDomiciliario3").value
//        };
//        // Restablece el índice de edición a null después de editar
//        indiceEdicionDomicilio = null;
//    } else {
//        // Si no hay un índice de edición, agrega un nuevo domicilio
//        var domicilio = {
//            UsuarioId: document.getElementById("UsuarioId3").value,
//            Observacion: document.getElementById("Observacion3").value,
//            FechaEntrega: document.getElementById("FechaEntrega3").value,
//            DireccionDomiciliario: document.getElementById("DireccionDomiciliario3").value
//        };
//        domicilios.push(domicilio);
//    }

//    alert('Domicilio agregado:', domicilio);
//    console.log(domicilios);

//    // Reiniciar el formulario de domicilio
//    document.getElementById("formDomicilio").reset();

//    // Actualizar la tabla de domicilios después de agregar o editar un domicilio
//    actualizarTablaDomicilio();
//};

//// Función para editar un domicilio
//function editarDomicilio(index) {
//    // Establecer el índice de edición al índice seleccionado
//    indiceEdicionDomicilio = index;

//    var domicilio = domicilios[index];

//    // Rellenar los campos del formulario de edición con los datos del domicilio
//    document.getElementById("UsuarioId3").value = domicilio.UsuarioId;
//    document.getElementById("Observacion3").value = domicilio.Observacion;
//    document.getElementById("FechaEntrega3").value = domicilio.FechaEntrega;
//    document.getElementById("DireccionDomiciliario3").value = domicilio.DireccionDomiciliario;

//    // Mostrar el formulario de edición de domicilio
//    document.getElementById("formDomicilioContainer").classList.remove("d-none");
//}

//// Función para actualizar la tabla de domicilios
//function actualizarTablaDomicilio() {
//    var domicilioTableBody = document.getElementById("domicilioTableBody");
//    domicilioTableBody.innerHTML = "";

//    domicilios.forEach(function (domicilio, index) {
//        var row = domicilioTableBody.insertRow();
//        var cell1 = row.insertCell(0);
//        var cell2 = row.insertCell(1);
//        var cell3 = row.insertCell(2);
//        var cell4 = row.insertCell(3);
//        var cell5 = row.insertCell(4);

//        cell1.textContent = domicilio.UsuarioId;
//        cell2.textContent = domicilio.Observacion;
//        cell3.textContent = domicilio.FechaEntrega;
//        cell4.textContent = domicilio.DireccionDomiciliario;

//        var editButton = document.createElement("button");
//        editButton.innerHTML = '<i class="fas fa-edit"></i>'; // Corrección de la sintaxis
//        editButton.classList.add("btn", "btn-warning", "btn-editar-domicilio");
//        editButton.dataset.index = index;
//        cell5.appendChild(editButton);


//        // Agregar botón de eliminar con emoji
//        var deleteButton = document.createElement("button");
//        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
//        deleteButton.classList.add("btn", "btn-danger", "btn-eliminar-domicilio");
//        deleteButton.dataset.index = index;
//        cell5.appendChild(deleteButton);
//    });

//    // Agregar eventos de clic a los botones de "Editar"
//    agregarEventoEditarDomicilio();
//    agregarEventoEliminarDomicilio();
//}

//// Función para agregar eventos de clic a los botones de "Editar" en la tabla de domicilios
//function agregarEventoEditarDomicilio() {
//    var botonesEditar = document.querySelectorAll(".btn-editar-domicilio");
//    botonesEditar.forEach(function (boton) {
//        boton.addEventListener("click", function () {
//            var index = this.dataset.index;
//            editarDomicilio(index);
//        });
//    });
//}

//// Función para agregar eventos de clic a los botones de "Eliminar" en la tabla de domicilios
//function agregarEventoEliminarDomicilio() {
//    var botonesEliminar = document.querySelectorAll(".btn-eliminar-domicilio");
//    botonesEliminar.forEach(function (boton) {
//        boton.addEventListener("click", function () {
//            var index = this.dataset.index;
//            eliminarDomicilio(index);
//        });
//    });
//}

//// Función para eliminar un domicilio de la lista
//function eliminarDomicilio(index) {
//    domicilios.splice(index, 1); // Eliminar el domicilio de la lista
//    actualizarTablaDomicilio(); // Actualizar la tabla de domicilios después de eliminar un domicilio
//}

//document.getElementById("TipoServicio1").addEventListener("change", function () {
//    var tipoServicio = this.value;
//    var domicilioFormContainer = document.getElementById("formDomicilioContainer");
//    if (tipoServicio === "Domicilio") {
//        domicilioFormContainer.classList.remove("d-none");
//    } else {
//        domicilioFormContainer.classList.add("d-none");
//    }
//});



//document.getElementById("TipoServicio1").addEventListener("change", function () {
//    var tipoServicio = this.value;
//    var domicilioFormContainer = document.getElementById("domiciliotable");
//    if (tipoServicio === "Domicilio") {
//        domicilioFormContainer.classList.remove("d-none");
//    } else {
//        domicilioFormContainer.classList.add("d-none");
//    }
//});

//document.getElementById("cerradomicilio").onclick = function () {
//    var domicilioContainer = document.getElementById("formDomicilioContainer");
//    if (!domicilioContainer.classList.contains("d-none")) {
//        domicilioContainer.classList.add("d-none");
//    }
//};

//// Manejar clic en el botón "Agregar Detalle"
//document.getElementById("btnAgregarDetalle").addEventListener("click", function () {
//    // Obtener los valores del formulario de detalle
//    var productoId2 = document.getElementById("productoId2").value;
//    var cantidad = document.getElementById("Cantidad").value;
//    var precioUnitario = document.getElementById("PrecioUnitario").value;

//    // Enviar los datos al servidor
//    fetch('/Pedidos/CreateDetalle', {
//        method: 'POST',
//        headers: {
//            'Content-Type': 'application/json'
//        },
//        body: JSON.stringify({
//            productoId2: productoId2,
//            cantidad: cantidad,
//            precioUnitario: precioUnitario
//        })
//    })
//        .then(response => {
//            if (response.ok) {
//                // Mostrar mensaje de éxito
//                Swal.fire('Detalle agregado correctamente');
//            } else {
//                // Mostrar mensaje de error
//                Swal.fire('Error al agregar el detalle');
//            }
//        })
//        .catch(error => {
//            // Mostrar mensaje de error
//            Swal.fire('Error al agregar el detalle');
//        });
//});


// Llamada al método DescontardeInventario con el pedidoId

function actualizarEstadoDomicilio(DomicilioId, estado) {
    console.log(DomicilioId);
    let estadodomiclio = ""; // Por defecto, el estado del pedido es una cadena vacía

    // Determinar el estado del pedido basado en el valor recibido
    if (estado === "Pendiente" || estado === "Realizado" || estado === "Cancelado") {
        estadodomiclio = estado;
    } else {
        console.error("Estado de pedido no válido:", estado);
        return; // Salir de la función si el estado del pedido no es válido
    }

    console.log("Estado actual del pedido:", estadodomiclio); // Imprimir el estado actual del pedido

    fetch(`https://localhost:7013/api/Domicilios/UpdateEstadoDomicilio/${DomicilioId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ EstadoDomicilio: estadodomiclio })
    })
        .then(response => {
            if (response.ok) {
                console.log("Estado actualizado correctamente");

                // Llama al método DescontardeInventario pasando el DomicilioId y tipo "Domicilio"
                $.ajax({
                    url: '/Pedidos/DescontardeInventario',
                    type: 'GET',
                    data: { id: DomicilioId, tipo: "Domicilio" },
                    success: function (response) {
                        console.log("Inventario descontado correctamente");
                        location.reload(); // Recargar la página para reflejar los cambios
                    },
                    error: function (xhr, status, error) {
                        console.error("Error al descontar el inventario:", error);
                    }
                });
            } else {
                console.error('Error al actualizar el estado del pedido');
            }
        })
        .catch(error => {
            console.error('Error de red:', error);
        });
}

function actualizarEstadoPedido(PedidoId, estado) {
    console.log(PedidoId);
    let estadoPedido = ""; // Por defecto, el estado del pedido es una cadena vacía

    // Determinar el estado del pedido basado en el valor recibido
    if (estado === "Pendiente" || estado === "Realizado" || estado === "Cancelado") {
        estadoPedido = estado;
    } else {
        console.error("Estado de pedido no válido:", estado);
        return; // Salir de la función si el estado del pedido no es válido
    }

    console.log("Estado actual del pedido:", estadoPedido); // Imprimir el estado actual del pedido

    fetch(`https://localhost:7013/api/Pedidos/UpdateEstadoPedido/${PedidoId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ EstadoPedido: estadoPedido })
    })
        .then(response => {
            if (response.ok) {
                console.log("Estado actualizado correctamente");

                // Llama al método DescontardeInventario pasando el PedidoId y tipo "Pedido"
                $.ajax({
                    url: '/Pedidos/DescontardeInventario',
                    type: 'GET',
                    data: { id: PedidoId, tipo: "Pedido" },
                    success: function (response) {
                        console.log("Inventario descontado correctamente");
                        location.reload(); // Recargar la página para reflejar los cambios
                    },
                    error: function (xhr, status, error) {
                        console.error("Error al descontar el inventario:", error);
                    }
                });
            } else {
                console.error('Error al actualizar el estado del pedido');
            }
        })
        .catch(error => {
            console.error('Error de red:', error);
        });
}

function updateEstadoPedido() {
    var tipo = document.getElementById("TipoServicio").value;
    var estado = document.getElementById("EstadoPedido");

    if (tipo === "Caja") {
        estado.value = "Realizado";
        for (var i = 0; i < estado.options.length; i++) {
            if (estado.options[i].value !== "Realizado") {
                estado.options[i].style.display = 'none';
            } else {
                estado.options[i].style.display = 'block';
            }
        }
    } else if (tipo === "Domicilio") {
        estado.value = "Pendiente";
        for (var i = 0; i < estado.options.length; i++) {
            if (estado.options[i].value !== "Pendiente") {
                estado.options[i].style.display = 'none';
            } else {
                estado.options[i].style.display = 'block';
            }
        }
    } else {
        for (var i = 0; i < estado.options.length; i++) {
            estado.options[i].style.display = 'block';
        }
        estado.value = ""; // Reset to default or desired value if needed
    }
}

// Run the function on page load to ensure the correct state if the form is pre-filled
document.addEventListener("DOMContentLoaded", function () {
    updateEstadoPedido();
});

document.addEventListener("DOMContentLoaded", function () {
    // Obtener el elemento de input de fecha
    var fechaInput = document.getElementById("FechaPedido");

    // Obtener la fecha y hora actual en formato ISO8601
    var now = new Date().toISOString().slice(0, 16); // Agregamos la parte de la hora

    // Establecer el valor del campo de entrada de fecha y hora
    fechaInput.value = now;

    // Establecer el atributo "min" para evitar fechas pasadas
    fechaInput.min = now;
    fechaInput.max = now;

    // Agregar un evento de cambio al elemento de input de fecha
    fechaInput.addEventListener("change", function () {
        // Obtener la fecha actual
        var fechaActual = new Date(now);
        // Obtener la fecha ingresada por el usuario
        var fechaIngresada = new Date(this.value);

        // Verificar si la fecha ingresada es mayor que la fecha actual
        if (fechaIngresada > fechaActual) {
            // Si la fecha ingresada es mayor, restaurar la fecha actual en el campo de fecha
            this.value = now;
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    var clienteIdTxt = document.getElementById("ClienteIdTxt");
    var clienteIdHidden = document.getElementById("ClienteIdHidden");
    var form = document.querySelector('form');

    clienteIdTxt.addEventListener("input", function () {
        var option = document.querySelector('option[value="' + this.value + '"]');
        if (option) {
            clienteIdTxt.value = option.value; // Mostrar el nombre de la entidad
            clienteIdHidden.value = option.getAttribute('data-cliente-id'); // Establecer el ID real
        } else {
            clienteIdHidden.value = ''; // Limpiar el ID si no se selecciona ninguna opción
        }
    });

    form.addEventListener('submit', function (event) {
        if (clienteIdTxt.value.trim() === '') {
            event.preventDefault(); // Evitar el envío del formulario
            // Mostrar mensaje de error con SweetAlert
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Por favor, complete el campo de Cliente'
            });
        }
    });
});
