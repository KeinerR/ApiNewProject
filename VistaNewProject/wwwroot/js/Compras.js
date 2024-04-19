function setHoraActual() {
    // Obtener la hora actual con Moment.js
    var fechaHoraActual = moment().format('YYYY-MM-DDTHH:mm');

    // Asignar la fecha y hora actual al campo datetime-local
    document.getElementById('FechaCompra').value = fechaHoraActual;
}

// Llamar a setHoraActual al cargar la página para mostrar la hora actual
setHoraActual();

function agregarProductos() {
    document.getElementById('DetallesCompra').style.display = 'block';
    document.getElementById('verCompra').style.display = 'block';
    document.getElementById('PrincipalCompra').style.display = 'none';
    document.getElementById('tituloModal').style.display = 'none';
    document.getElementById('subTituloModal').style.display = 'block';
    document.getElementById('agregarDetalle').style.display = 'none';
    document.getElementById('expandir').style.display = 'inline-block';
    document.getElementById('expandir').style.visibility = 'visible';


}


function volverARegistrarCompra() {
    document.getElementById('tituloModal').style.display = 'block';
    document.getElementById('subTituloModal').style.display = 'none';
    document.getElementById('PrincipalCompra').style.display = 'block';
    document.getElementById('agregarDetalle').style.display = 'block';
    document.getElementById('DetallesCompra').style.display = 'none';
    document.getElementById('verCompra').style.display = 'none';
    document.getElementById('CompraId').value = '';
    document.getElementById('NumeroFactura').value = '';
    document.getElementById('NumeroLote').value = '';
    document.getElementById('ProveedorId').value = '';
    setHoraActual();

}


function verCompra() {
    document.getElementById('agregarDetalle').style.display = 'none';
    document.getElementById('PrincipalCompra').style.display = 'block';
    document.getElementById('DetallesCompra').style.display = 'block';
    document.getElementById('verCompra').style.display = 'block';
    document.getElementById('reducir').style.display = 'inline-block';
    document.getElementById('reducir').style.visibility = 'visible';
    document.getElementById('expandir').style.display = 'none';
    document.getElementById('expandir').style.visibility = 'hidden';
}

function noVerCompra() {
    document.getElementById('PrincipalCompra').style.display = 'none';  
    document.getElementById('reducir').style.display = 'none';
    document.getElementById('reducir').style.visibility = 'hidden';
    document.getElementById('expandir').style.display = 'inline-block';
    document.getElementById('expandir').style.visibility = 'visible';
}
