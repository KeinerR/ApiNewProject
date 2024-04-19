function setHoraActual() {
    // Obtener la hora actual con Moment.js
    var fechaHoraActual = moment().format('YYYY-MM-DDTHH:mm');

    // Asignar la fecha y hora actual al campo datetime-local
    document.getElementById('FechaCompra').value = fechaHoraActual;
}

// Llamar a setHoraActual al cargar la página para mostrar la hora actual
setHoraActual();

function agregarProductos() {
    document.getElementById('RegistrarCompra').style.display = 'none';
    document.getElementById('DetallesCompra').style.display = 'block';
    document.getElementById('verCompra').style.display = 'block';
  
}

function volverARegistrarCompra() {
    document.getElementById('DetallesCompra').style.display = 'none';
    document.getElementById('RegistrarCompra').style.display = 'block';
    document.getElementById('verCompra').style.display = 'none';
    document.getElementById('CompraId').value = '';
    document.getElementById('NumeroFactura').value = '';
    document.getElementById('ProveedorId').value = '';
    setHoraActual();

}

function verCompra() {
    document.getElementById('DetallesCompra').style.display = 'block';
    document.getElementById('RegistrarCompra').style.display = 'block';
    document.getElementById('verCompra').style.display = 'block';
}
