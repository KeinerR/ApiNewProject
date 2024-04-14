function redireccionarYEditar(usuarioId) {
    // Redirigir a la página "Index" y agregar un parámetro a la URL para indicar que se debe mostrar la alerta
    window.location.href = `/Usuarios/Index?mostrarAlerta=true&usuarioId=${usuarioId}`;
}
