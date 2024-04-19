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
            var proveedores = await _client.GetProveedorAsync();
            var unidades = await _client.GetUnidadAsync();
            var productos = await _client.GetProductoAsync();
            var presentaciones = await _client.GetPresentacionAsync();


            if (compras == null)
            {
                return NotFound("error");
            }
            ViewBag.Proveedores = proveedores;
            ViewBag.Unidades = unidades;
            ViewBag.Productos = productos;
            ViewBag.Presentaciones = presentaciones;
            return View(compras);
        }
    }
}
