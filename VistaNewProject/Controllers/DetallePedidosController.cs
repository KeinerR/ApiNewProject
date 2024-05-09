using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Models;
using VistaNewProject.Services;

namespace VistaNewProject.Controllers
{
    public class DetallePedidosController : Controller
    {
        private readonly IApiClient _client;
        private static List<Detallepedido> listaGlobalDetalles = new List<Detallepedido>();


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

        [HttpGet]
        public async Task<IActionResult> Create()
        {
            var producto = await _client.GetProductoAsync();
            var pedidos = await _client.GetPedidoAsync();
            var ultimoPedido = pedidos.OrderByDescending(p => p.PedidoId).FirstOrDefault();

            ViewBag.UltimoPedidoId = ultimoPedido?.PedidoId ?? 0;


           
            
                var lotes = await _client.GetLoteAsync();

            
                
            

            ViewBag.Producto = producto;

            return View();
        }







    

        public async Task<IActionResult> CrearDetalles([FromBody] Detallepedido detallePedido)
        {
            // Agrega el detalle recibido a la lista global
            Console.WriteLine(detallePedido);

            listaGlobalDetalles.Add(detallePedido);

            // Imprimir los valores de las propiedades del detalle recibido en la consola
            Console.WriteLine("Detalle recibido:");
            Console.WriteLine("PedidoId: " + detallePedido.PedidoId);
            Console.WriteLine("ProductoId: " + detallePedido.ProductoId);
            Console.WriteLine("Cantidad: " + detallePedido.Cantidad);

            Console.WriteLine("PrecioUnitario: " + detallePedido.PrecioUnitario);


            Console.WriteLine("sI SE AEOGO " + listaGlobalDetalles[0].PedidoId);

            // Devuelve un mensaje de confirmación en forma de objeto JSON
            return Ok(new { message = "Detalle del pedido recibido correctamente" });
        }

        [HttpPost]
        public async Task<IActionResult> CreatePost()
        {
            // Verificar si hay detalles en la lista global
            if (listaGlobalDetalles.Count == 0)
            {
                // No hay detalles para guardar
                TempData["ErrorMessage"] = "Por favor agregue los productos para guardar el pedido correctamente.";

                // Devolver un mensaje de éxito
                return RedirectToAction("Create", "DetallePedidos");
            }

            // Iterar sobre cada detalle en la lista global y guardarlos
            foreach (var detalle in listaGlobalDetalles)
            {
                var response = await _client.CreateDetallesPedidosAsync(detalle);
                if (!response.IsSuccessStatusCode)
                {
                    // Manejar errores si la creación del detalle de pedido falla
                    Console.WriteLine($"Error al guardar el detalle del pedido: {response.ReasonPhrase}");
                    return View("Error");
                }
            }

            // Limpiar la lista global después de guardar los detalles
            TempData["Validacion"] = "Pedido Guardado Correctamente.";
            listaGlobalDetalles.Clear();

            // Devolver un mensaje de éxito
            return RedirectToAction("Index", "Pedidos");
        }



        public async Task<IActionResult> Cancelar()
        {
            // Verificar si hay detalles en la lista global
            if (listaGlobalDetalles.Count > 0)
            {
                // Limpiar la lista global de detalles agregados
                listaGlobalDetalles.Clear();
            }

            // Obtener la lista de pedidos
            var pedidos = await _client.GetPedidoAsync();

            // Imprimir la lista de pedidos en la consola
            
            // Obtener el PedidoId más alto de la lista de pedidos
            var pedidosApi = pedidos.Max(p => p.PedidoId);

            Console.WriteLine(pedidosApi);
            var response= await _client.DeletePedidoAsync(pedidosApi);

      
            if (!response.IsSuccessStatusCode)
            {
                return NotFound("Error  en ela eliminacion");

            }

            // Resto del código para cancelar el último pedido...

            return RedirectToAction("Index", "Pedidos");
        }









    }
}
