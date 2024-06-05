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
            var lotesDisponibles = lotes.Where(l => l.ProductoId == productoId && l.Cantidad > 0 && l.EstadoLote != 0)
                                         .OrderBy(l => l.FechaVencimiento)
                                         .ToList();
            return Json(lotesDisponibles);
        }


        [HttpGet]
        public async Task<IActionResult> Create(int? pedidoId)
        {
            var producto = await _client.GetProductoAsync();
            var pedidos = await _client.GetPedidoAsync();

            var ultimoPedido = pedidos.OrderByDescending(p => p.PedidoId).FirstOrDefault();

            ViewBag.PedidoId = pedidoId ?? ultimoPedido?.PedidoId ?? 0;
            ViewBag.UltimoPedidoId = ultimoPedido?.PedidoId ?? 0;

            ViewBag.Producto = producto;

            return View();
        }






        public async Task<IActionResult> CrearDetalles([FromBody] Detallepedido detallePedido)
        {
            if (detallePedido == null)
            {
                return BadRequest(new { message = "El detalle del pedido no puede ser nulo" });
            }

            try
            {
                // Buscar si ya existe un detalle con el mismo ProductoId en la lista
                var detalleExistente = listaGlobalDetalles
                    .FirstOrDefault(d => d.ProductoId == detallePedido.ProductoId && d.PedidoId == detallePedido.PedidoId);

                if (detalleExistente != null)
                {
                    // Si existe, solo actualiza la cantidad
                    detalleExistente.Cantidad += detallePedido.Cantidad;
                    detalleExistente.Subtotal += detallePedido.Cantidad * detallePedido.PrecioUnitario;  // Asumiendo que el subtotal se calcula así
                    Console.WriteLine("Producto actualizado en la lista. Nueva cantidad: " + detalleExistente.Cantidad);
                }
                else
                {
                    // Si no existe, agrega el detalle recibido a la lista global
                    listaGlobalDetalles.Add(detallePedido);
                    Console.WriteLine("Nuevo producto agregado a la lista.");
                }

                Console.WriteLine("Tamaño de la lista global de detalles: " + listaGlobalDetalles.Count);

                var producto = await _client.FindProductoAsync(detallePedido.ProductoId.Value);

                if (producto == null)
                {
                    return NotFound(new { message = "Producto no encontrado" });
                }

                // Actualizar la cantidad reservada
                producto.CantidadReservada += detallePedido.Cantidad;

                // Actualizar el producto en la base de datos
                var updateProductResult = await _client.UpdateProductoAsync(producto);
                if (updateProductResult.IsSuccessStatusCode)
                {
                    Console.WriteLine("Cantidad reservada actualizada en el producto.");
                }
                else
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error al actualizar el producto en la base de datos" });
                }

                // Imprimir los valores de las propiedades del detalle recibido en la consola
                Console.WriteLine("Detalle recibido:");
                Console.WriteLine("PedidoId: " + detallePedido.PedidoId);
                Console.WriteLine("ProductoId: " + detallePedido.ProductoId);
                Console.WriteLine("Cantidad: " + detallePedido.Cantidad);
                Console.WriteLine("UnidadId: " + detallePedido.UnidadId);
                Console.WriteLine("LoteId: " + detallePedido.LoteId);
                Console.WriteLine("PrecioUnitario: " + detallePedido.PrecioUnitario);

                // Llamar al método ObtenerDetalles
                ObtenerDetalles();

                // Devuelve un mensaje de confirmación en forma de objeto JSON
                return Ok(new { message = "Detalle del pedido recibido correctamente" });
            }
            catch (Exception ex)
            {
                // Log the exception (use a proper logging framework in a real application)
                Console.WriteLine("Error: " + ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Ocurrió un error al procesar la solicitud", error = ex.Message });
            }
        }


        [HttpPost]
        public async Task<IActionResult> CreatePost(  )
        {
            if (listaGlobalDetalles.Count <0)
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
                var ultimoPedidoGuardado = ultimoPedido.OrderByDescending(p => p.PedidoId).First();

                if (ultimoPedido != null && ultimoPedido.Any())
                    {

                    ultimoPedidoGuardado.ValorTotalPedido += sumaSubtotales;

                    var updatevalortotal = await _client.UpdatePedidoAsync(ultimoPedidoGuardado);
                    if (updatevalortotal.IsSuccessStatusCode)
                    {
                        Console.WriteLine("Actualizacion Crrecta");
                    }


                    // Si el pedido está "Realizado" y es por caja
                    if (ultimoPedidoGuardado.EstadoPedido == "Realizado" && ultimoPedidoGuardado.TipoServicio == "Caja")
                    {
                        // Iterar sobre los detalles del pedido para descontar el inventario y los lotes


                        foreach (var detalle in listaGlobalDetalles)
                        {
                            var productoId = detalle.ProductoId.Value;
                            var productos = await _client.FindProductoAsync(productoId);

                            if (productos != null)
                            {
                                productos.CantidadReservada -= detalle.Cantidad;
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
                                .Where(l => l.ProductoId == productoId && l.Cantidad > 0 && l.EstadoLote!=0)
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
            // Verificar si hay detalles en la lista global
            if (listaGlobalDetalles.Count > 0)
            {
                // Obtener los detalles del pedido que se desea cancelar
                var ultimoPedidoId = listaGlobalDetalles.Max(d => d.PedidoId);
                var detallesPedidoACancelar = listaGlobalDetalles.Where(d => d.PedidoId == ultimoPedidoId).ToList();

                // Ajustar las cantidades reservadas
                foreach (var detalle in detallesPedidoACancelar)
                {
                    var producto = await _client.FindProductoAsync(detalle.ProductoId.Value);
                    if (producto != null)
                    {
                        producto.CantidadReservada -= detalle.Cantidad;
                        await _client.UpdateProductoAsync(producto);
                    }
                }

                // Limpiar la lista global de detalles
                listaGlobalDetalles.Clear();
            }

            // Obtener la lista de pedidos
            var pedidos = await _client.GetPedidoAsync();

            // Obtener el PedidoId más alto de la lista de pedidos
            var pedidosApi = pedidos.Max(p => p.PedidoId);

            Console.WriteLine(pedidosApi);

            // Eliminar el último pedido
            var response = await _client.DeletePedidoAsync(pedidosApi);

            if (!response.IsSuccessStatusCode)
            {
                return NotFound("Error en la eliminación");
            }

            // Redirigir a la página principal de pedidos
            return RedirectToAction("Index", "Pedidos");
        }


        public async Task<IActionResult> EliminarDetalle(int index)
        {
            Console.WriteLine(index);

            if (index >= 0 && index < listaGlobalDetalles.Count)
            {
                var detalleAEliminar = listaGlobalDetalles[index];

                // Encontrar el producto correspondiente para actualizar la cantidad reservada
                var producto = await _client.FindProductoAsync(detalleAEliminar.ProductoId.Value);

                if (producto == null)
                {
                    return NotFound(new { message = "Producto no encontrado" });
                }

                // Actualizar la cantidad reservada del producto
                producto.CantidadReservada -= detalleAEliminar.Cantidad;

                var updateProductResult = await _client.UpdateProductoAsync(producto);

                
                // Eliminar el detalle de la lista
                listaGlobalDetalles.RemoveAt(index);

                Console.WriteLine("Detalle eliminado correctamente");

                return Ok(new { message = "Detalle eliminado correctamente" });
            }
            else
            {
                return NotFound(new { message = "No se encontró el detalle para eliminar" });
            }
        }


        public IActionResult ObtenerDetalles()
        {
            return Json(listaGlobalDetalles); // Devuelve la lista global de detalles como JSON
        }











        public async Task<IActionResult> AgregarMaxDetalles(int? pedidoId)
        {
            var producto = await _client.GetProductoAsync();
            var unidad = await _client.GetUnidadAsync();
            var pedidos = await _client.GetPedidoAsync();

            var ultimoPedido = pedidos.OrderByDescending(p => p.PedidoId).FirstOrDefault();

            ViewBag.PedidoId = pedidoId ?? ultimoPedido?.PedidoId ?? 0;
            ViewBag.UltimoPedidoId = ultimoPedido?.PedidoId ?? 0;

            ViewBag.Producto = producto;
            ViewBag.Unidad = unidad;

            return View();
        }



        public async Task<IActionResult> CrearDetallesMax([FromBody] Detallepedido detallePedido)
        {
            if (detallePedido == null)
            {
                return BadRequest(new { message = "El detalle del pedido no puede ser nulo" });
            }

            try
            {
                // Buscar si ya existe un detalle con el mismo ProductoId en la lista
                var detalleExistente = listaGlobalDetalles
                    .FirstOrDefault(d => d.ProductoId == detallePedido.ProductoId && d.PedidoId == detallePedido.PedidoId);

                if (detalleExistente != null)
                {
                    // Si existe, solo actualiza la cantidad
                    detalleExistente.Cantidad += detallePedido.Cantidad;
                    detalleExistente.Subtotal += detallePedido.Cantidad * detallePedido.PrecioUnitario;  // Asumiendo que el subtotal se calcula así
                    Console.WriteLine("Producto actualizado en la lista. Nueva cantidad: " + detalleExistente.Cantidad);
                }
                else
                {
                    // Si no existe, agrega el detalle recibido a la lista global
                    listaGlobalDetalles.Add(detallePedido);
                    Console.WriteLine("Nuevo producto agregado a la lista.");
                }

                Console.WriteLine("Tamaño de la lista global de detalles: " + listaGlobalDetalles.Count);

                var producto = await _client.FindProductoAsync(detallePedido.ProductoId.Value);

                if (producto == null)
                {
                    return NotFound(new { message = "Producto no encontrado" });
                }

                // Actualizar la cantidad reservada
                producto.CantidadReservada += detallePedido.Cantidad;

                // Actualizar el producto en la base de datos
                var updateProductResult = await _client.UpdateProductoAsync(producto);
                if (updateProductResult.IsSuccessStatusCode)
                {
                    Console.WriteLine("Cantidad reservada actualizada en el producto.");
                }
                else
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error al actualizar el producto en la base de datos" });
                }

                // Imprimir los valores de las propiedades del detalle recibido en la consola
                Console.WriteLine("Detalle recibido:");
                Console.WriteLine("PedidoId: " + detallePedido.PedidoId);
                Console.WriteLine("ProductoId: " + detallePedido.ProductoId);
                Console.WriteLine("Cantidad: " + detallePedido.Cantidad);
                Console.WriteLine("UnidadId: " + detallePedido.UnidadId);
                Console.WriteLine("LoteId: " + detallePedido.LoteId);
                Console.WriteLine("PrecioUnitario: " + detallePedido.PrecioUnitario);

                // Llamar al método ObtenerDetalles
                ObtenerDetalles();

                // Devuelve un mensaje de confirmación en forma de objeto JSON
                return Ok(new { message = "Detalle del pedido recibido correctamente" });
            }
            catch (Exception ex)
            {
                // Log the exception (use a proper logging framework in a real application)
                Console.WriteLine("Error: " + ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Ocurrió un error al procesar la solicitud", error = ex.Message });
            }
        }



        public async Task<IActionResult> AgregarMaxDetallesPost(int ? pedidoId)
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



            // Actualizar el valor total del pedido utilizando el pedidoIdUtilizar
            var pedidoActualizar = await _client.FindPedidosAsync(pedidoId.Value);

            if (pedidoActualizar != null)
            {
                pedidoActualizar.ValorTotalPedido += sumaSubtotales;
                var updatevalortotal = await _client.UpdatePedidoAsync(pedidoActualizar);
                listaGlobalDetalles.Clear();

                if (updatevalortotal.IsSuccessStatusCode)
                {
                    TempData["SweetAlertIcon"] = "success";
                    TempData["SweetAlertTitle"] = "Éxito";
                    TempData["SweetAlertMessage"] = "Detalles Agregados correctamente.";
                    return RedirectToAction("Index", "Pedidos");

                }


            }
            return RedirectToAction("Index","Pedidos");

        }

        public async Task<IActionResult> Edit(int detalleId)
        {
            var detalles = await _client.FindDetallesPedidoAsync(detalleId);
            if (detalles == null)
            {
                return NotFound();
            }
            return View(detalles);
        }



    }
}

