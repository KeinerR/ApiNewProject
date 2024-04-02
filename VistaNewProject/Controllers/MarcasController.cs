using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Services;

namespace VistaNewProject.Controllers
{
    public class MarcasController : Controller
    {
        private readonly IApiClient _client;


        public MarcasController(IApiClient client)
        {
            _client = client;
        }
        public async Task<IActionResult> Index()
        {
            var marcas = await _client.GetMarcaAsync();

            if (marcas == null)
            {
                return NotFound("error");
            }
            return View(marcas);
        }
    }
}
