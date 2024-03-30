using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Services;

namespace VistaNewProject.Controllers
{
    public class PedidosController : Controller
    {
        private readonly IApiClient _client;


        public PedidosController(IApiClient client)
        {
            _client = client;
        }

        public async Task<ActionResult> Index()
        {
            var pedidos = await _client.GetPedidoAsync();
            var clientes = await _client.GetClientesAsync();

            if (pedidos == null || clientes == null)
            {
                return View("Error");
            }

            ViewBag.Clientes = clientes; // Pasar los clientes a través de ViewBag

            return View(pedidos);
        }

    }
}
