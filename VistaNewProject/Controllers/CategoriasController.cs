using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Services;

namespace VistaNewProject.Controllers
{
    public class CategoriasController : Controller
    {

        private readonly IApiClient _client;
        public CategoriasController(IApiClient client)
        {
            _client = client;
        }
        public async Task<IActionResult> Index()
        {
            var categorias = await _client.GetCategoriaAsync();

            if (categorias == null)
            {
                return NotFound("error");
            }
            return View(categorias);
        }
    }
}
