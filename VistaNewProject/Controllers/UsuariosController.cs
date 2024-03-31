using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Services;

namespace VistaNewProject.Controllers
{
    public class UsuariosController : Controller
    {
        private readonly IApiClient _client;


        public UsuariosController(IApiClient client)
        {
            _client = client;
        }


        public async Task<ActionResult> Index()
        {
            var cliente = await _client.GetUsuarioAsync();

            if (cliente == null)
            {
                return View("Error");
            }

            return View(cliente);
        }
    }
}
