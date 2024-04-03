using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using VistaNewProject.Services;

namespace VistaNewProject.Controllers
{
    public class LoginController : Controller
    {
        private readonly IApiClient _client;


        public LoginController(IApiClient client)
        {
            _client = client;
        }

        [AllowAnonymous]
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Login(Usuario model)
        {
            // Validación para evitar inicio de sesión con campos vacíos
            if (string.IsNullOrEmpty(model.Usuario1) || string.IsNullOrEmpty(model.Contraseña))
            {
                ViewData["MostrarAlerta"] = "Por favor, completa todos los campos.";
                return View("Index", model);
            }

            var usuarios = await _client.GetUsuarioAsync(); // Obtener todos los usuarios

            var usuarioValido = usuarios.FirstOrDefault(u =>
                u.Usuario1 == model.Usuario1 && u.Contraseña == model.Contraseña);

            if (usuarioValido == null)
            {
                ViewData["MostrarAlerta"] = "El usuario o contraseña son incorrectos sigue intentando";
                return View("Index", model);
            }
            else
            {
                // Crear identidad del usuario
                var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, model.Usuario1),
            new Claim("RolId", usuarioValido.RolId.ToString())
            // Otros claims según la lógica de tu aplicación
            // Agrega más claims según tus necesidades (roles, etc.)
        };

                var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

                // Crear las propiedades de autenticación
                var authProperties = new AuthenticationProperties
                {
                    IsPersistent = true, // Opcional: para mantener la cookie persistente entre sesiones
                };

                // Iniciar sesión con la cookie de autenticación
                await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity), authProperties);

                // Redirigir al controlador "Home" después del inicio de sesión
                return RedirectToAction("Index", "Home");
            }
        }



    }
}
