using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Models;
using VistaNewProject.Services;
using AutoMapper.QueryableExtensions;

using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using Microsoft.EntityFrameworkCore;

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
        public async Task<IActionResult> FiltrarProductos(string busqueda)
        {
            try
            {
                // Obtener los productos filtrados
                var productos = await _client.GetProductoAsync(busqueda);

                return Json(productos); // Devolver productos filtrados como JSON
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al filtrar productos: {ex.Message}");
            }
        }




        [HttpGet]
        public async Task<IActionResult> Create(int? pedidoId)
        {
            var producto = await _client.GetProductoAsync();
            var pedidos = await _client.GetPedidoAsync();
            var unidades=await _client.GetUnidadAsync();

            var ultimoPedido = pedidos.OrderByDescending(p => p.PedidoId).FirstOrDefault();

            ViewBag.PedidoId = pedidoId ?? ultimoPedido?.PedidoId ?? 0;
            ViewBag.UltimoPedidoId = ultimoPedido?.PedidoId ?? 0;

            ViewBag.Producto = producto;
            ViewBag.Unidades = unidades;


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
                    .FirstOrDefault(d => d.ProductoId == detallePedido.ProductoId && d.PedidoId == detallePedido.PedidoId && d.UnidadId==detallePedido.UnidadId);

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

                var unidadid = detallePedido.UnidadId;

                if (producto == null)
                {
                    return NotFound(new { message = "Producto no encontrado" });
                }

                var id = producto.ProductoId;
                var cantidad= detallePedido.Cantidad;
                if (unidadid != null )
                {

                    if (unidadid == 1)
                    {
                        var updateProductoUnidad = await _client.AddCantidadReservadaAsync(id, cantidad);
                        if (updateProductoUnidad.IsSuccessStatusCode)
                        {
                            Console.WriteLine("Cantidad reservada actualizada en el producto.");
                        }
                        else
                        {
                            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error al actualizar el producto en la base de datos" });
                        }
                    }
                    else if (unidadid == 2) 
                    {
                        var updateProductoUnidadindividual = await _client.AddCantidadPorUnidadReservadaAsync(id, cantidad);
                        if (updateProductoUnidadindividual.IsSuccessStatusCode)
                        {
                            Console.WriteLine("Cantidad reservada actualizada en el producto.");
                        }
                        else
                        {
                            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error al actualizar el producto en la base de datos" });
                        }
                    }
                   

                }

                // Actualizar el producto en la base de datos
              
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

                            var uniddaId=detalle.UnidadId;
                            var productoId = detalle.ProductoId.Value;
                            var producto = await _client.FindProductoAsync(productoId);


                            if (producto != null)
                            {
                                int id = producto.ProductoId;
                                int? cantidad = detalle.Cantidad;

                                if (uniddaId == 1)
                                {
                                    var actualizarCantidadReservada = await _client.SustraerCantidadReservadaAsync(id, cantidad);

                                    if (!actualizarCantidadReservada.IsSuccessStatusCode)
                                    {
                                        TempData["ErrorMessage"] = $"Error al actualizar el producto: {actualizarCantidadReservada.ReasonPhrase}";
                                        return RedirectToAction("Index", "Pedidos");
                                    }
                                }
                                if (uniddaId == 2)
                                {

                                    var actualizarCantidadUniddaReservada = await _client.SustraerCantidadPorUnidadReservadaAsync(id, cantidad);
                                    if (!actualizarCantidadUniddaReservada.IsSuccessStatusCode)
                                    {
                                        TempData["ErrorMessage"] = $"Error al actualizar el producto: {actualizarCantidadUniddaReservada.ReasonPhrase}";
                                        return RedirectToAction("Index", "Pedidos");
                                    }

                                }



                            }

                            // Obtener los lotes disponibles para el producto actual
                            var lotes = await _client.GetLoteAsync();
                            var lotesFiltrados = lotes
                                .Where(l => l.ProductoId == productoId && l.Cantidad > 0 && l.EstadoLote != 0)
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

                                    if (uniddaId == 1)
                                    {
                                        lote.Cantidad -= cantidadDescontar;
                                    }
                                    else if (uniddaId == 2)
                                    {
                                        lote.CantidadPorUnidad -= cantidadDescontar;
                                    }

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

                    var unidadId = detalle.UnidadId;
                    var producto = await _client.FindProductoAsync(detalle.ProductoId.Value);
                    if (producto != null)
                    {
                        var Id = producto.ProductoId;
                        int? cantidad = detalle.Cantidad;
                        if (unidadId == 1)
                        {


                        
                            await _client.QuitarCantidadReservada(Id, cantidad);
                        }
                        if (unidadId == 2)
                        {

                            await _client.QuitarCantidadReservadaUnidad(Id, cantidad);
                        }


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

                int id = producto.ProductoId;
                int? cantidad = detalleAEliminar.Cantidad;

                // Actualizar la cantidad reservada del producto
                var unidadId = detalleAEliminar.UnidadId;
                if (unidadId == 1)
                {
                    await _client.QuitarCantidadReservada(id, cantidad);
                }
                else if (unidadId == 2)
                {
                    await _client.QuitarCantidadReservadaUnidad(id, cantidad);
                }

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
                    .FirstOrDefault(d => d.ProductoId == detallePedido.ProductoId && d.PedidoId == detallePedido.PedidoId && d.UnidadId == detallePedido.UnidadId);

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

                var unidadid = detallePedido.UnidadId;

                if (producto == null)
                {
                    return NotFound(new { message = "Producto no encontrado" });
                }

                var id = producto.ProductoId;
                var cantidad = detallePedido.Cantidad;
                if (unidadid != null)
                {

                    if (unidadid == 1)
                    {
                        var updateProductoUnidad = await _client.AddCantidadReservadaAsync(id, cantidad);
                        if (updateProductoUnidad.IsSuccessStatusCode)
                        {
                            Console.WriteLine("Cantidad reservada actualizada en el producto.");
                        }
                        else
                        {
                            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error al actualizar el producto en la base de datos" });
                        }
                    }
                    else if (unidadid == 2)
                    {
                        var updateProductoUnidadindividual = await _client.AddCantidadPorUnidadReservadaAsync(id, cantidad);
                        if (updateProductoUnidadindividual.IsSuccessStatusCode)
                        {
                            Console.WriteLine("Cantidad reservada actualizada en el producto.");
                        }
                        else
                        {
                            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error al actualizar el producto en la base de datos" });
                        }
                    }


                }

                // Actualizar el producto en la base de datos

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



        public async Task<IActionResult> AgregarMaxDetallesPost(int? pedidoId)
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
            return RedirectToAction("Index", "Pedidos");

        }

        public async Task<JsonResult> GetDetalles(int detallePedidoId)
        {
            var detalle = await _client.GetDetallepedidoAsync();

            var detallesid = detalle.FirstOrDefault(c => c.DetallePedidoId == detallePedidoId);
            return Json(detallesid);
        }





        [HttpPost]
        [Route("DetallePedidos/Update")]
        public async Task<IActionResult> Update([FromBody] Detallepedido detallepedido, [FromQuery] string tipomovimineto)
        {
            if (string.IsNullOrEmpty(tipomovimineto))
            {
                return Json(new { success = false, message = "Tipo de movimiento no proporcionado." });
            }

            Console.WriteLine(detallepedido);
            if (tipomovimineto == "Entrada")
            {
                Console.WriteLine(detallepedido);

                var detalleantes = await _client.FindDetallesPedidoAsync(detallepedido.DetallePedidoId);
                var subtotaloriginal = detalleantes.Subtotal;



                var cantidadOriginalDetalle = detalleantes.Cantidad;
                var productoId=detalleantes.ProductoId;
                var productooriginal = await _client.FindProductoAsync(productoId.Value);
                detalleantes.Subtotal -= subtotaloriginal;
                detalleantes.Cantidad += detallepedido.Cantidad;

                var cantidaddisponible = productooriginal.CantidadTotal - productooriginal.CantidadReservada;

                if (cantidaddisponible < detallepedido.Cantidad)
                {

                    TempData["SuccessMessage"] = "No  hay suficientes  productos para agregarlos a la venta.";


                    RedirectToAction("Details", "Movimientos");

                }
             
                var response = await _client.UpdateDetallepedidosAsync(detalleantes);

                detalleantes.Subtotal += detallepedido.Subtotal;
                var responses = await _client.UpdateDetallepedidosAsync(detalleantes);

                if (response.IsSuccessStatusCode)
                {
                    Console.WriteLine("Actualizacion Correcta");
                }

                int cantidadRestante = detallepedido.Cantidad.Value;
                var loteIdDetalle = detallepedido.LoteId;

                var lote = await _client.FindLoteAsync(loteIdDetalle.Value);
                var cantidadOriginalLote = lote.Cantidad;

                if (lote.Cantidad >= cantidadRestante)
                {
                    lote.Cantidad -= cantidadRestante;
                    cantidadRestante = 0;
                    var updatelotes = await _client.UpdateLoteAsync(lote);
                }
                else
                {
                    cantidadRestante -= lote.Cantidad.Value;
                    lote.Cantidad = 0;
                    var updatelotes = await _client.UpdateLoteAsync(lote);

                    var lotes = await _client.GetLoteAsync();
                    var lotesFiltrados = lotes
                        .Where(l => l.ProductoId == productoId && l.Cantidad > 0 && l.EstadoLote != 0 && l.LoteId != loteIdDetalle)
                        .OrderBy(l => l.FechaVencimiento)
                        .ThenByDescending(l => l.Cantidad)
                        .ToList();

                    if (lotesFiltrados.Any())
                    {
                        foreach (var loteAdicional in lotesFiltrados)
                        {
                            if (cantidadRestante <= 0)
                                break;

                            int cantidadDescontar = Math.Min(cantidadRestante, loteAdicional.Cantidad.Value);
                            loteAdicional.Cantidad -= cantidadDescontar;
                            cantidadRestante -= cantidadDescontar;

                            var updateLoteAdicional = await _client.UpdateLoteAsync(loteAdicional);
                        }
                        if (cantidadRestante > 0)
                        {
                            detalleantes.Cantidad = cantidadOriginalDetalle;
                            await _client.UpdateDetallepedidosAsync(detalleantes);

                            lote.Cantidad = cantidadOriginalLote;
                            await _client.UpdateLoteAsync(lote);

                            return Json(new { success = true, message = "No hay suficiente cantidad para hacer el movimiento." });
                        }
                    }
                }


                if (response.IsSuccessStatusCode)
                {
                    Console.WriteLine("Actualización Correcta");
                }
                var pedidoId = detallepedido.PedidoId;

                var pedido = await _client.FindPedidosAsync(pedidoId.Value);
                if (pedido != null && lote != null)
                {


                    var detallesPedido = await _client.GetDetallepedidoAsync();

                    // Calcular el nuevo valor total del pedido sumando los subtotales de los detalles asociados
                    pedido.ValorTotalPedido = detallesPedido.Where(d => d.PedidoId == pedidoId.Value).Sum(d => d.Subtotal);


                    var updatetotal = await _client.UpdatePedidoAsync(pedido);

                }

                if (response.IsSuccessStatusCode)
                {
                    return Json(new { success = true, message = "Movimiento de Entrada Realizado Correctamente." });
                }
                else
                {
                    return Json(new { success = false, message = "No se pudo Realizar el Movimiento." });
                }
            }
            else if (tipomovimineto == "Salida")
            {
                Console.WriteLine(detallepedido);

                var detalleantes = await _client.FindDetallesPedidoAsync(detallepedido.DetallePedidoId);


                var productoId = detalleantes.ProductoId;

              
                var cantidadOriginalDetalle = detalleantes.Cantidad;
                var subtotaloriginal = detalleantes.Subtotal;



                detalleantes.Subtotal -= subtotaloriginal;
                detalleantes.Cantidad -= detallepedido.Cantidad;
                var response = await _client.UpdateDetallepedidosAsync(detalleantes);
                detalleantes.Subtotal += detallepedido.Subtotal;
                var responses = await _client.UpdateDetallepedidosAsync(detalleantes);

                if (response.IsSuccessStatusCode)
                {
                    Console.WriteLine("Actualizacion Correcta");
                }

                var loteIdDetalle = detallepedido.LoteId;


                var lote = await _client.FindLoteAsync(loteIdDetalle.Value);
                int cantidadRestante = detallepedido.Cantidad.Value;
                lote.Cantidad += cantidadRestante;


                var updatelotes = await _client.UpdateLoteAsync(lote);


                if (response.IsSuccessStatusCode)
                {
                    Console.WriteLine("Actualización Correcta");
                }
                var pedidoId = detallepedido.PedidoId;

                var pedido = await _client.FindPedidosAsync(pedidoId.Value);
                if (pedido != null && lote != null)
                {


                    var detallesPedido = await _client.GetDetallepedidoAsync();

                    // Calcular el nuevo valor total del pedido sumando los subtotales de los detalles asociados
                    pedido.ValorTotalPedido = detallesPedido.Where(d => d.PedidoId == pedidoId.Value).Sum(d => d.Subtotal);


                    var updatetotal = await _client.UpdatePedidoAsync(pedido);

                }

                if (response.IsSuccessStatusCode)
                {
                    return Json(new { success = true, message = "Movimiento de Salida Realizado Correctamente." });
                }
                else
                {
                    return Json(new { success = false, message = "No se pudo Realizar el Movimiento." });
                }
            }

            return Ok();
        }


    }
}

