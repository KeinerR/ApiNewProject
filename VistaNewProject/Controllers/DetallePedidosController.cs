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
        public async Task<IActionResult> Create([FromBody] List<Detallepedido> detallesPedido)
        {
            // Verifica si la lista de detalles no está vacía
            if (detallesPedido != null && detallesPedido.Any())
            {
                try
                {
                    // Itera sobre la lista de detalles y guárdalos en la base de datos
                    foreach (var detalle in detallesPedido)
                    {
                        // Guarda cada detalle utilizando el método asincrónico
                        var response = await _client.CreateDetallesPedidosAsync(detalle);
                        if (!response.IsSuccessStatusCode)
                        {
                            // Si no se pudo crear el detalle, manejar el error adecuadamente
                            // Puedes lanzar una excepción, registrar el error, etc.
                            return StatusCode((int)response.StatusCode, "Error al crear el detalle del pedido");
                        }
                    }

                    // Redirigir al usuario a la vista de creación de pedidos
                    return RedirectToAction("Create", "Pedidos");
                }
                catch (Exception ex)
                {
                    // Manejar cualquier excepción que ocurra durante el proceso de guardar en la base de datos
                    // Puedes registrar el error, enviar una respuesta de error específica, etc.
                    return StatusCode(500, $"Error al guardar los detalles del pedido: {ex.Message}");
                }
            }
            else
            {
                // Si la lista de detalles está vacía, retorna un BadRequest indicando que no se proporcionaron detalles válidos
                return BadRequest("La lista de detalles del pedido está vacía o no es válida");
            }
        }


    }
}
