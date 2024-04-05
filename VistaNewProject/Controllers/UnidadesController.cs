using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Services;

namespace VistaNewProject.Controllers
{
    public class UnidadesController : Controller
    {
        private readonly IApiClient _client;


        public UnidadesController(IApiClient client)
        {
            _client = client;
        }
        public async Task<IActionResult> Index()
        {
            var marcas = await _client.GetUnidadAsync();

            if (marcas == null)
            {
                return NotFound("error");
            }
            return View(marcas);
        }
    }
}
