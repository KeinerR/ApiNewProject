using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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


        public async Task<IActionResult> Index(int? page)
        {
            int pageSize = 5; // Número máximo de elementos por página
            int pageNumber = page ?? 1;

            var usuarios = await _client.GetUsuarioAsync();

            if (usuarios == null)
            {
                return NotFound("error");
            }

            var pagedUsuarios = await usuarios.ToPagedListAsync(pageNumber, pageSize);

            // Verifica si la página actual está vacía y redirige a la última página que contiene registros
            if (!pagedUsuarios.Any() && pagedUsuarios.PageNumber > 1)
            {
                pagedUsuarios = await usuarios.ToPagedListAsync(pagedUsuarios.PageCount, pageSize);
            }

            return View(pagedUsuarios);
        }

    }
}

