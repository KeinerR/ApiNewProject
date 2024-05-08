using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Models;
using VistaNewProject.Services;

namespace VistaNewProject.Controllers
{
    public class DetallePedidosController : Controller
    {
        private readonly IApiClient _client;


        public DetallePedidosController(IApiClient client)
        {
            _client = client;
        }


        public async Task<ActionResult> Index()
        {
            var detallepedido = await _client.GetDetallepedidoAsync();

            if (detallepedido == null)
            {
                return View("Error");
            }

            return View(detallepedido);
        }

        public async Task<IActionResult> Create()
        {
            var producto = await _client.GetProductoAsync();

            ViewBag.Producto = producto;    

            return View();
        }


    
        [HttpPost]
        public IActionResult Create(List<Detallepedido> detallesPedido)
        {
            // Guarda la lista de detalles en la base de datos o realiza cualquier otra lógica necesaria
            // ...

            return RedirectToAction("Index");
        }


    }
}
