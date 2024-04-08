//Funcion para hacer aparecer y desaparecer el div de opciones de perfil y salir
function opcionesDePerfil() {
    var profilePopup = document.getElementById("perfilVentanaEmergente");
    if (profilePopup.style.display === "none") {
        profilePopup.style.display = "block";
    } else {
        profilePopup.style.display = "none";
    }
}

function confirmLogout() {
    var result = confirm("¿Estás seguro de que deseas cerrar sesión?");
    if (result) {
        window.location.href = "/Login/Logout"; // Redirige al usuario a la URL definida
    } else {
        window.location.reload();
    }
}