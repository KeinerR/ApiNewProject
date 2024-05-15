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
            var unidad = await _client.GetUnidadAsync();
            var pedidos = await _client.GetPedidoAsync();
            var ultimoPedido = pedidos.OrderByDescending(p => p.PedidoId).FirstOrDefault();

            ViewBag.UltimoPedidoId = ultimoPedido?.PedidoId ?? 0;




            var lotes = await _client.GetLoteAsync();





            ViewBag.Producto = producto;
            ViewBag.Unidad = unidad;

            return View();
        }










        public async Task<IActionResult> CrearDetalles([FromBody] Detallepedido detallePedido)
        {
            // Agrega el detalle recibido a la lista global

            var pedidos = await _client.GetPedidoAsync();
            var ultimoPedido = pedidos.OrderByDescending(p => p.PedidoId).FirstOrDefault();
            if (ultimoPedido != null && ultimoPedido.EstadoPedido == "Realizado")
            {
                var productoId = detallePedido.ProductoId.Value; // Obtiene el valor de detallePedido.ProductoId
                Console.WriteLine(productoId);
                var producto = await _client.FindProductoAsync(productoId);
                if (producto != null)
                {
                    producto.CantidadTotal -= detallePedido.Cantidad;
                    var update = await _client.UpdateProductoAsync(producto);
                    if (update.IsSuccessStatusCode)
                    {
                        Console.WriteLine("Correcto");
                    }
                }
                var lotes = await _client.GetLoteAsync();

                var lotesFiltrado = lotes.Where(l => l.ProductoId == productoId);
                if (lotesFiltrado.Any())
                {
                    // Encontrar el lote con la fecha de vencimiento más próxima
                    var loteProximoVencimiento = lotesFiltrado.OrderBy(l => l.FechaVencimiento).First();
                    loteProximoVencimiento.Cantidad -= detallePedido.Cantidad;
                    var UpdateLote = await _client.UpdateLotesAsync(loteProximoVencimiento);

                    if (UpdateLote.IsSuccessStatusCode)
                    {
                        Console.WriteLine("Lotes Correctamente");
                    }

                    // Ahora tienes el lote con la fecha de vencimiento más próxima: loteProximoVencimiento
                }
            }
           
            // Restar la cantidad del detalle del pedido de cada lote asociado
          



            listaGlobalDetalles.Add(detallePedido);

            // Imprimir los valores de las propiedades del detalle recibido en la consola
            Console.WriteLine("Detalle recibido:");
            Console.WriteLine("PedidoId: " + detallePedido.PedidoId);
            Console.WriteLine("ProductoId: " + detallePedido.ProductoId);
            Console.WriteLine("Cantidad: " + detallePedido.Cantidad);
            Console.WriteLine("UnidadId: " + detallePedido.UnidadId);

            Console.WriteLine("PrecioUnitario: " + detallePedido.PrecioUnitario);


            Console.WriteLine("sI SE AEOGO " + listaGlobalDetalles[0].PedidoId);



            // Devuelve un mensaje de confirmación en forma de objeto JSON
            return Ok(new { message = "Detalle del pedido recibido correctamente" });
        }

        [HttpPost]
        public async Task<IActionResult> CreatePost()
        {
            if (listaGlobalDetalles.Count == 0)
            {
                TempData["ErrorMessage"] = "Por favor agregue los productos para guardar el pedido correctamente.";
                return RedirectToAction("Create", "DetallePedidos");
            }

            try
            {
                decimal sumaSubtotales = listaGlobalDetalles.Sum(detalle => detalle.Subtotal ?? 0);

                foreach (var detalle in listaGlobalDetalles)
                {
                    Console.WriteLine($"ID: {detalle.PedidoId}, Nombre: {detalle.ProductoId}, Cantidad: {detalle.Cantidad}");

                    var response = await _client.CreateDetallesPedidosAsync(detalle);
                    if (!response.IsSuccessStatusCode)
                    {
                        TempData["ErrorMessage"] = $"Error al guardar el detalle del pedido: {response.ReasonPhrase}";
                        return RedirectToAction("Create", "DetallePedidos");
                    }
                }

                var ultimoPedido = await _client.GetPedidoAsync();
                if (ultimoPedido != null && ultimoPedido.Any())
                {
                    var ultimoPedidoGuardado = ultimoPedido.OrderByDescending(p => p.PedidoId).First();

                    ultimoPedidoGuardado.ValorTotalPedido = sumaSubtotales;
                    var updateResponse = await _client.UpdatePedidoAsync(ultimoPedidoGuardado);

                    if (!updateResponse.IsSuccessStatusCode)
                    {
                        // Aquí agregamos más detalles para la depuración
                        var errorContent = await updateResponse.Content.ReadAsStringAsync();
                        TempData["ErrorMessage"] = $"Error al actualizar el valor total del pedido: {updateResponse.ReasonPhrase} - {errorContent}";
                        return RedirectToAction("Create", "DetallePedidos");
                    }

                    if (ultimoPedidoGuardado.TipoServicio == "Domicilio")
                    {
                        listaGlobalDetalles.Clear();
                        return RedirectToAction("Create", "Domicilios");
                    }
                    else
                    {
                        listaGlobalDetalles.Clear();
                        TempData["ValidarPedido"] = "Pedido Guardado Correctamente.";
                        return RedirectToAction("Index", "Pedidos");
                    }
                }

                listaGlobalDetalles.Clear();
                return RedirectToAction("Index", "Pedidos");
            }
            catch (Exception ex)
            {
                TempData["ErrorMessage"] = $"Error al procesar el pedido: {ex.Message}";
                return RedirectToAction("Create", "DetallePedidos");
            }
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
            var response = await _client.DeletePedidoAsync(pedidosApi);


            if (!response.IsSuccessStatusCode)
            {
                return NotFound("Error  en ela eliminacion");

            }

            // Resto del código para cancelar el último pedido...

            return RedirectToAction("Index", "Pedidos");
        }



        public IActionResult EliminarDetalle(int index)
        {

            Console.WriteLine(Index);
            if (index >= 0 && index < listaGlobalDetalles.Count)
            {


                listaGlobalDetalles.RemoveAt(index);


                return Ok(new { message = "Detalle eliminado correctamente" });
            }
            else
            {
                return NotFound("No se encontró el detalle para eliminar");
            }
        }


        public IActionResult ObtenerDetalles()
        {
            return Json(listaGlobalDetalles); // Devuelve la lista global de detalles como JSON
        }





    }
}
