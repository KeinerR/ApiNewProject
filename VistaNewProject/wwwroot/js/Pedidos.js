
//function inicializarEventos() {
//    // Botón para abrir el modal de agregar cliente
//    $('#clienteModal').on('show.bs.modal', function (event) {
//        // Llama a la función para obtener los datos de los clientes
//        obtenerDatosUsuarios();
//    });
//}

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

