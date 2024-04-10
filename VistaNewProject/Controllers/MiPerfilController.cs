using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using VistaNewProject.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.Rendering;
using VistaNewProject.Models;

namespace VistaNewProject.Controllers
{
    public class MiPerfilController : Controller
    {

        private readonly IApiClient _client;


        public MiPerfilController(IApiClient client)
        {
            _client = client;
        }
        public async Task<IActionResult> Index()
        {
            var username = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            // Obtener la lista de usuarios desde el cliente de la API
            var users = await _client.GetUsuarioAsync();

            // Buscar el usuario válido por el NameIdentifier
            var usuarioValido = users.FirstOrDefault(u => u.UsuarioId == int.Parse(username));
            if (usuarioValido == null)
            {
                // Manejar el caso en que el usuario válido no se encuentre
                return RedirectToAction("Error");
            }

            return View(usuarioValido);
        }
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return RedirectToAction("Error");
            }
            var users = await _client.GetUsuarioAsync();

            var usuario = users.FirstOrDefault(u => u.UsuarioId == id);
            if (usuario == null)
            {
                return RedirectToAction("Error");
            }
            return View(usuario);
        }
        


    }
}
