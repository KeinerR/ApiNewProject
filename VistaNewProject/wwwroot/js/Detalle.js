function redireccionarYEditar(usuarioId) {
    // Redirigir a la p�gina "Index" y agregar un par�metro a la URL para indicar que se debe mostrar la alerta
    window.location.href = `/Usuarios/Index?mostrarAlerta=true&usuarioId=${usuarioId}`;
}
