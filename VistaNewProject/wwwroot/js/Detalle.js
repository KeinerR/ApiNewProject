
/*Funcion para enviar ala vista de detalle*/
function redireccionarYEditar(id, vista,nombreid) {
    place = vista.toLowerCase().trim();
    // Redirigir a la p�gina especificada y agregar un par�metro a la URL para indicar que se debe mostrar la alerta
    window.location.href = `/${vista}/Index?mostrarAlerta=true&${nombreid}Id=${id}`;
}