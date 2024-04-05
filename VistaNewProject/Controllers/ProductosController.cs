using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Services;

namespace VistaNewProject.Controllers
{
    public class ProductosController : Controller
    {

        private readonly IApiClient _client;
        public ProductosController(IApiClient client)
        {
            _client = client;
        }

        public async Task<ActionResult> Index()
        {
            var productos = await _client.GetProductoAsync();

            if (productos == null)
            {
                return View("Error");
            }

            return View(productos);
        }
    }
}
