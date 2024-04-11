using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Services;

namespace VistaNewProject.Controllers
{
    public class ComprasController : Controller
    {
        private readonly IApiClient _client;
        public ComprasController(IApiClient client)
        {
            _client = client;
        }
        public async Task<IActionResult> Index()
        {
            var compras = await _client.GetCompraAsync();
            var compra = await _client.GetProveedorAsync();


            if (compras == null)
            {
                return NotFound("error");
            }
            ViewBag.Compras = compra;
            return View(compras);
        }
    }
}
