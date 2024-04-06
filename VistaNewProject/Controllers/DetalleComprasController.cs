using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Services;

namespace VistaNewProject.Controllers
{
    public class DetalleComprasController : Controller
    {
        private readonly IApiClient _client;


        public DetalleComprasController(IApiClient client)
        {
            _client = client;
        }


        public async Task<ActionResult> Index()
        {
            var detallecompra = await _client.GetDetallecompraAsync();

            if (detallecompra == null)
            {
                return View("Error");
            }

            return View(detallecompra);
        }
    }
}
