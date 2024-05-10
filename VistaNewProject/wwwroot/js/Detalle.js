
/*Funcion para enviar ala vista de detalle*/
function redireccionarYEditar(id, vista,nombreid) {
    place = vista.toLowerCase().trim();
    // Redirigir a la página especificada y agregar un parámetro a la URL para indicar que se debe mostrar la alerta
    window.location.href = `/${vista}/Index?mostrarAlerta=true&${nombreid}Id=${id}`;
}