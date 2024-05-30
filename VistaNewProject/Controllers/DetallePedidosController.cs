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
        private static List<Detallepedido> listaGlobalDetalles = new List<Detallepedido>();




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
        public async Task<IActionResult> ObtenerLotesDisponibles(int productoId)
        {
            var lotes = await _client.GetLoteAsync();
            var lotesDisponibles = lotes.Where(l => l.ProductoId == productoId && l.Cantidad > 0)
                                        .OrderBy(l => l.FechaVencimiento)
                                        .ToList();
            return Json(lotesDisponibles);
        }


        [HttpGet]
        public async Task<IActionResult> Create()
        {
            var producto = await _client.GetProductoAsync();
            var unidad = await _client.GetUnidadAsync();
            var pedidos = await _client.GetPedidoAsync();

            var ultimoPedido = pedidos.OrderByDescending(p => p.PedidoId).FirstOrDefault();
            ViewBag.UltimoPedidoId = ultimoPedido?.PedidoId ?? 0;

            ViewBag.Producto = producto;
            ViewBag.Unidad = unidad;

            return View();
        }






        public async Task<IActionResult> CrearDetalles([FromBody] Detallepedido detallePedido)
        {
            // Agrega el detalle recibido a la lista global

            // Buscar si ya existe un detalle con el mismo ProductoId en la lista
            var detalleExistente = listaGlobalDetalles
                .FirstOrDefault(d => d.ProductoId == detallePedido.ProductoId && d.PedidoId == detallePedido.PedidoId);
            if (detalleExistente != null)
            {
                // Si existe, solo actualiza la cantidad
                detalleExistente.Cantidad += detallePedido.Cantidad;
                detalleExistente.Subtotal += detallePedido.Cantidad * detallePedido.PrecioUnitario;  // Asumiendo que el subtotal se calcula así
                Console.WriteLine("Producto actualizado en la lista. Nueva cantidad: " + detalleExistente.Cantidad);
            }else {
                // Si no existe, agrega el detalle recibido a la lista global
                listaGlobalDetalles.Add(detallePedido);
                Console.WriteLine("Nuevo producto agregado a la lista.");
            }

            Console.WriteLine("Tamaño de la lista global de detalles: " + listaGlobalDetalles.Count);


            // Imprimir el tamaño actual de la lista global en la consola
            Console.WriteLine("Tamaño de la lista global de detalles: " + listaGlobalDetalles.Count);

            // Imprimir los valores de las propiedades del detalle recibido en la consola
            Console.WriteLine("Detalle recibido:");
            Console.WriteLine("PedidoId: " + detallePedido.PedidoId);
            Console.WriteLine("ProductoId: " + detallePedido.ProductoId);
            Console.WriteLine("Cantidad: " + detallePedido.Cantidad);
            Console.WriteLine("UnidadId: " + detallePedido.UnidadId);
            Console.WriteLine("UnidadId: " + detallePedido.LoteId);
            Console.WriteLine("PrecioUnitario: " + detallePedido.PrecioUnitario);



            // Devuelve un mensaje de confirmación en forma de objeto JSON
            return Ok(new { message = "Detalle del pedido recibido correctamente" });
        }

        [HttpPost]
        public async Task<IActionResult> CreatePost()
        {
            if (listaGlobalDetalles.Count <= 0)
            {
                TempData["ErrorMessage"] = "Por favor agregue los productos para guardar el pedido correctamente.";
                return RedirectToAction("Create", "DetallePedidos");
            }

            try
            {
                decimal sumaSubtotales = listaGlobalDetalles.Sum(detalle => detalle.Subtotal ?? 0);
                foreach (var detalle in listaGlobalDetalles)
                {
                    if (detalle != null)
                    {
                        Console.WriteLine($"ID: {detalle.PedidoId}, Nombre: {detalle.ProductoId}, Cantidad: {detalle.Cantidad}");

                        var response = await _client.CreateDetallesPedidosAsync(detalle);
                        if (!response.IsSuccessStatusCode)
                        {
                            TempData["ErrorMessage"] = $"Error al guardar el detalle del pedido: {response.ReasonPhrase}";
                            return RedirectToAction("Create", "DetallePedidos");
                        }

                    }
                }

                var ultimoPedido = await _client.GetPedidoAsync();
                if (ultimoPedido != null && ultimoPedido.Any())
                {
                    var ultimoPedidoGuardado = ultimoPedido.OrderByDescending(p => p.PedidoId).First();



                    // Actualiza el campo ValorTotalPedido del pedido con la suma de los subtotales
                    ultimoPedidoGuardado.ValorTotalPedido = sumaSubtotales;

                    var total = await _client.UpdatePedidoAsync(ultimoPedidoGuardado);

                    // Si el pedido está pendiente
                    if (ultimoPedidoGuardado.EstadoPedido == "Pendiente")
                    {
                        foreach (var detalle in listaGlobalDetalles)
                        {
                            // Reservar cantidad del producto
                            var producto = await _client.FindProductoAsync(detalle.ProductoId.Value);
                            if (producto != null)
                            {
                                if (detalle.Cantidad > producto.CantidadTotal - producto.CantidadReservada)
                                {
                                    // Configurar el mensaje de error en TempData
                                    TempData["ErrorMessage"] = "No hay suficiente stock disponible para este producto";

                                    // Retornar BadRequest para indicar el error
                                    return RedirectToAction("Index", "Pedidos");
                                }



                                producto.CantidadReservada += detalle.Cantidad.Value;
                                var updateProducto = await _client.UpdateProductoAsync(producto);
                                if (!updateProducto.IsSuccessStatusCode)
                                {
                                    TempData["ErrorMessage"] = $"Error al reservar cantidad del producto: {updateProducto.ReasonPhrase}";
                                    return RedirectToAction("Index", "Pedidos");
                                }
                            }

                        }
                    }

                    // Si el pedido está "Realizado" y es por caja
                    else if (ultimoPedidoGuardado.EstadoPedido == "Realizado" && ultimoPedidoGuardado.TipoServicio == "Caja")
                    {
                        // Iterar sobre los detalles del pedido para descontar el inventario y los lotes


                        foreach (var detalle in listaGlobalDetalles)
                        {
                            var productoId = detalle.ProductoId.Value;
                            var productos = await _client.FindProductoAsync(productoId);

                            if (productos != null)
                            {
                                productos.CantidadTotal -= detalle.Cantidad;
                                var updateProducto = await _client.UpdateProductoAsync(productos);

                                if (!updateProducto.IsSuccessStatusCode)
                                {
                                    TempData["ErrorMessage"] = $"Error al actualizar el producto: {updateProducto.ReasonPhrase}";
                                    return RedirectToAction("Index", "Pedidos");
                                }
                            }

                            // Obtener los lotes disponibles para el producto actual
                            var lotes = await _client.GetLoteAsync();
                            var lotesFiltrados = lotes
                                .Where(l => l.ProductoId == productoId && l.Cantidad > 0)
                                .OrderBy(l => l.FechaVencimiento)
                                .ThenByDescending(l => l.Cantidad);

                            if (lotesFiltrados.Any())
                            {
                                int cantidadRestante = detalle.Cantidad.Value;

                                foreach (var lote in lotesFiltrados)
                                {
                                    if (cantidadRestante <= 0)
                                        break;

                                    int cantidadDescontar = Math.Min(cantidadRestante, lote.Cantidad.Value);

                                    // Actualizar la cantidad del lote
                                    lote.Cantidad -= cantidadDescontar;
                                    cantidadRestante -= cantidadDescontar;

                                    // Actualizar el lote en la base de datos
                                    var updateLoteResponse = await _client.UpdateLoteAsync(lote);

                                    if (!updateLoteResponse.IsSuccessStatusCode)
                                    {
                                        TempData["ErrorMessage"] = $"Error al actualizar el lote: {updateLoteResponse.ReasonPhrase}";
                                        return RedirectToAction("Index", "Pedidos");
                                    }
                                }
                            }
                        }

                        // Limpiar la lista de detalles globales después de descontar el inventario y los lotes
                        listaGlobalDetalles.Clear();
                        TempData["SuccessMessage"] = "Pedido realizado con éxito.";

                        return RedirectToAction("Index", "Pedidos");
                    }

                        // Verifica el tipo de servicio para redireccionar apropiadamente
                        if (ultimoPedidoGuardado.TipoServicio == "Domicilio")
                        {
                            listaGlobalDetalles.Clear();
                            return RedirectToAction("Create", "Domicilios");
                        }
                    }
                
                // Limpiar la lista de detalles globales después de procesar el pedido
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
            if (listaGlobalDetalles.Count > 0 )
            {
                listaGlobalDetalles.Clear();
            }
                // Verificar si hay detalles en la lista global
            

            // Obtener la lista de pedidos
            var pedidos = await _client.GetPedidoAsync();

            // Obtener el PedidoId más alto de la lista de pedidos
            var pedidosApi = pedidos.Max(p => p.PedidoId);

            Console.WriteLine(pedidosApi);
            var response = await _client.DeletePedidoAsync(pedidosApi);

            if (!response.IsSuccessStatusCode)
            {
                return NotFound("Error en la eliminación");
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



        [HttpPost]
        public async Task<JsonResult> GetProductos([FromBody] string busqueda = null)
        {
            var productos = await _client.GetProductoAsync(busqueda);
            return Json(productos);
        }





    }
}

