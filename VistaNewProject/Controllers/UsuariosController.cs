using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using VistaNewProject.Models;
using VistaNewProject.Services;
using X.PagedList;

namespace VistaNewProject.Controllers
{
    
    public class UsuariosController : Controller
    {
        private readonly IApiClient _client;


        public UsuariosController(IApiClient client)
        {
            _client = client;
        }


        public async Task<ActionResult> Index(int ? page)
        {
            int pageSize = 5; // Número máximo de elementos por página
            int pageNumber = page ?? 1;
            var roles = await _client.GetRolAsync();

            var usuarios = await _client.GetUsuarioAsync();

            if (usuarios == null)
            {
                return NotFound("error");
            }
            var pageUsuarios = await usuarios.ToPagedListAsync(pageNumber, pageSize);

            // Verifica si la página actual está vacía y redirige a la última página que contiene registros
            if (!pageUsuarios.Any() && pageUsuarios.PageNumber > 1)
            {
                pageUsuarios = await usuarios.ToPagedListAsync(pageUsuarios.PageCount, pageSize);
            }
            int contador = 1;
            if (page.HasValue && page > 1)
            {
                // Obtener el valor actual del contador de la sesión si estamos en una página diferente a la primera
                contador = HttpContext.Session.GetInt32("Contador") ?? 1;
            }

            // Establecer el valor del contador en la sesión para su uso en la siguiente página
            HttpContext.Session.SetInt32("Contador", contador + pageUsuarios.Count);

            ViewBag.Contador = contador;
            ViewBag.roles = roles;
            return View(pageUsuarios);
           
        }
        public async Task<IActionResult> Details(int? id)
        {
            var usuarios = await _client.GetUsuarioAsync();
            var roles = await _client.GetRolAsync();
            if (id == null || usuarios == null)
            {
                return NotFound();
            }

            var usuario = usuarios.FirstOrDefault(u => u.UsuarioId == id);

            if (usuario == null)
            {
                return NotFound();
            }
            ViewBag.roles = roles;
            return View(usuario);
        }



    }
}

