using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

using Microsoft.EntityFrameworkCore.Metadata.Internal;
using VistaNewProject.Models;
using VistaNewProject.Services;
using X.PagedList;

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

            var pedido= await _client.GetPedidoAsync();
            return View(pedido);
        }


        [HttpGet]
        public async Task<IActionResult> Create()
        {
            var clientes = await _client.GetClientesAsync();

            if (clientes==null)
            {
                return View("Error");
            }

            
            ViewBag.Clientes = clientes;
            return View();
        }



        [HttpPost]
        public async Task<IActionResult> Create( int ClienteId, string TipoServicio,DateTime FechaPedido, string EstadoPedido )
        {
            Console.WriteLine(EstadoPedido);
            Console.WriteLine(ClienteId);
            Console.WriteLine(FechaPedido);
            Console.WriteLine(TipoServicio);

                var pedidosnuevos = new Pedido
                {
                    ClienteId = ClienteId,
                    TipoServicio=TipoServicio,
                    FechaPedido=FechaPedido,
                    ValorTotalPedido=0,
                    EstadoPedido=EstadoPedido,


                };

                var response= await _client.CreatePedidoAsync(pedidosnuevos);
                if (response.IsSuccessStatusCode)
                {


                var pedidoIdAgregado = await response.Content.ReadAsStringAsync();
                Console.WriteLine(pedidoIdAgregado);

                // Redirigir al usuario a la vista "Create" del controlador "DetallesPedido" con el último PedidoId agregado
                return RedirectToAction("Create", "DetallePedidos", new { pedidoId = pedidoIdAgregado });
            }
            else
                {
                    ModelState.AddModelError(string.Empty, "error");
                }

           

            return View();
        }


        //public async Task<IActionResult> DescontardeInventario(int pedidoId)
        //{
        //    Console.WriteLine(pedidoId);
        //    try
        //    {
        //        var pedidostraidos = await _client.FindPedidosAsync(pedidoId);
        //        var domicilios = await _client.GetDomicilioAsync();
        //        var domicilioDetalle = domicilios.FirstOrDefault(d => d.PedidoId == pedidoId);

        //        if ((pedidostraidos != null && pedidostraidos.EstadoPedido == "Realizado") || (domicilioDetalle != null && domicilioDetalle.EstadoDomicilio == "Realizado"))
        //        {
        //            var detalles = await _client.GetDetallepedidoAsync();
        //            var detallesPedido = detalles.Where(d => d.PedidoId == pedidoId).ToList();
        //            if (detallesPedido != null)
        //            {

        //                foreach (var detallePedido in detallesPedido)
        //                {
        //                    var productoId = detallePedido.ProductoId.Value;
        //                    var producto = await _client.FindProductoAsync(productoId);

        //                    if (producto != null)
        //                    {
        //                        producto.CantidadTotal -= detallePedido.Cantidad;
        //                        var updateProducto = await _client.UpdateProductoAsync(producto);
        //                        if (updateProducto.IsSuccessStatusCode)
        //                        {
        //                            Console.WriteLine("Producto actualizado correctamente");
        //                        }
        //                    }

        //                    var lotes = await _client.GetLoteAsync();
        //                    var lotesFiltrados = lotes.Where(l => l.ProductoId == productoId);

        //                    if (lotesFiltrados.Any())
        //                    {
        //                        // Encontrar el lote con la fecha de vencimiento más próxima
        //                        var loteProximoVencimiento = lotesFiltrados.OrderBy(l => l.FechaVencimiento).First();
        //                        loteProximoVencimiento.Cantidad -= detallePedido.Cantidad;
        //                        var updateLote = await _client.UpdateLotesAsync(loteProximoVencimiento);

        //                        if (updateLote.IsSuccessStatusCode)
        //                        {
        //                            Console.WriteLine("Lote actualizado correctamente");
        //                        }
        //                    }
        //                }








        //            }
        //        }
        //        else if (pedidostraidos != null && pedidostraidos.EstadoPedido == "Cancelado")
        //        {
        //            var detallescancelados = await _client.GetDetallepedidoAsync();

        //            var detallesPedidoAgreagos = detallescancelados.Where(d => d.PedidoId == pedidoId).ToList();
        //            if (detallesPedidoAgreagos != null)
        //            {
        //                foreach (var detallePedido in detallesPedidoAgreagos)
        //                {
        //                    var productoId = detallePedido.ProductoId.Value;
        //                    var producto = await _client.FindProductoAsync(productoId);

        //                    if (producto != null)
        //                    {
        //                        producto.CantidadTotal += detallePedido.Cantidad;
        //                        var updateProducto = await _client.UpdateProductoAsync(producto);
        //                        if (updateProducto.IsSuccessStatusCode)
        //                        {
        //                            Console.WriteLine("Producto actualizado correctamente");
        //                        }
        //                    }

        //                    var lotes = await _client.GetLoteAsync();
        //                    var lotesFiltrados = lotes.Where(l => l.ProductoId == productoId);

        //                    if (lotesFiltrados.Any())
        //                    {
        //                        // Encontrar el lote con la fecha de vencimiento más próxima
        //                        var loteProximoVencimiento = lotesFiltrados.OrderBy(l => l.FechaVencimiento).First();
        //                        loteProximoVencimiento.Cantidad += detallePedido.Cantidad;
        //                        var updateLote = await _client.UpdateLotesAsync(loteProximoVencimiento);

        //                        if (updateLote.IsSuccessStatusCode)
        //                        {
        //                            Console.WriteLine("Lote actualizado correctamente");
        //                        }
        //                    }
        //                }
        //            }
        //        }



        //        // Retorna una respuesta exitosa si el proceso se realizó correctamente
        //        return Ok("Inventario descontado correctamente.");
        //    }
        //    catch (Exception ex)
        //    {
        //        // En caso de que ocurra algún error, puedes manejarlo y devolver un error al cliente
        //        return StatusCode(500, $"Error al descontar el inventario: {ex.Message}");
        //    }
        //}


        public async Task<IActionResult> DescontardeInventario(int id, string tipo)
        {
            Console.WriteLine(id);
            try
            {
                if (tipo == "Pedido")
                {
                    var pedidostraidos = await _client.FindPedidosAsync(id);
                    var domicilios = await _client.GetDomicilioAsync();
                    var domicilioDetalle = domicilios.FirstOrDefault(d => d.PedidoId == id);

                    if (pedidostraidos != null && pedidostraidos.EstadoPedido == "Realizado")
                    {
                        var detalles = await _client.GetDetallepedidoAsync();
                        var detallesPedido = detalles.Where(d => d.PedidoId == id).ToList();
                        if (detallesPedido != null)
                        {
                            foreach (var detallePedido in detallesPedido)
                            {
                                var productoId = detallePedido.ProductoId.Value;
                                var producto = await _client.FindProductoAsync(productoId);

                                if (producto != null)
                                {
                                    producto.CantidadTotal -= detallePedido.Cantidad;
                                    var updateProducto = await _client.UpdateProductoAsync(producto);
                                    if (updateProducto.IsSuccessStatusCode)
                                    {
                                        Console.WriteLine("Producto actualizado correctamente");
                                    }
                                }
                                var lotes = await _client.GetLoteAsync();
                                var lotesFiltrados = lotes
     .Where(l => l.ProductoId == productoId && l.Cantidad > 0)
     .OrderBy(l => l.FechaVencimiento)
     .ThenByDescending(l => l.Cantidad);

                                if (lotesFiltrados.Any())
                                {
                                    int cantidadRestante = detallePedido.Cantidad.Value;

                                    foreach (var lote in lotesFiltrados)
                                    {
                                        if (cantidadRestante <= 0)
                                            break;

                                        int cantidadDescontar = Math.Min(cantidadRestante, lote.Cantidad.Value);

                                        lote.Cantidad -= cantidadDescontar;
                                        cantidadRestante -= cantidadDescontar;

                                        var updateLotees = await _client.UpdateLotesAsync(lote);

                                        if (updateLotees.IsSuccessStatusCode)
                                        {
                                            Console.WriteLine($"Se descontaron {cantidadDescontar} del lote con ID {lote.LoteId}");
                                        }
                                    }
                                }

                            }
                        }
                        else if (pedidostraidos != null && pedidostraidos.EstadoPedido == "Cancelado")
                        {
                            var detallescancelados = await _client.GetDetallepedidoAsync();

                            // Agrupar los detalles cancelados por producto
                            var detallesAgrupadosPorProducto = detallescancelados
                                .Where(d => d.PedidoId == id)
                                .GroupBy(d => d.ProductoId);

                            foreach (var grupo in detallesAgrupadosPorProducto)
                            {
                                var productoId = grupo.Key;
                                var producto = await _client.FindProductoAsync(productoId.Value);

                                if (producto != null)
                                {
                                    // Sumar la cantidad cancelada al producto
                                    producto.CantidadTotal += grupo.Sum(d => d.Cantidad);
                                    var updateProducto = await _client.UpdateProductoAsync(producto);

                                    if (updateProducto.IsSuccessStatusCode)
                                    {
                                        Console.WriteLine("Producto actualizado correctamente");
                                    }
                                }

                                var lotes = await _client.GetLoteAsync();
                                var lotesFiltrados = lotes.Where(l => l.ProductoId == productoId);

                                if (lotesFiltrados.Any())
                                {
                                    // Encontrar el lote con la fecha de vencimiento más próxima
                                    var loteProximoVencimiento = lotesFiltrados.OrderBy(l => l.FechaVencimiento).First();
                                    loteProximoVencimiento.Cantidad += grupo.Sum(d => d.Cantidad);
                                    var updateLote = await _client.UpdateLotesAsync(loteProximoVencimiento);

                                    if (updateLote.IsSuccessStatusCode)
                                    {
                                        Console.WriteLine("Lote actualizado correctamente");
                                    }
                                }
                            }
                        }




                        // Retorna una respuesta exitosa si el proceso se realizó correctamente
                        return Ok("Inventario descontado correctamente.");
                    }
                    else if (tipo == "Domicilio")
                    {
                        var domicilioses = await _client.GetDomicilioAsync();
                        var domicilioDetalleAgre = domicilios.FirstOrDefault(d => d.DomicilioId == id);
                        int pedidoIdSeleccionado = 0; // Valor predeterminado en caso de que no se encuentre el domicilio

                        if (domicilioDetalle != null)
                        {
                            pedidoIdSeleccionado = domicilioDetalleAgre.PedidoId.Value;
                        }


                        if (domicilioDetalleAgre != null && domicilioDetalleAgre.EstadoDomicilio == "Realizado")
                        {

                            var detalles = await _client.GetDetallepedidoAsync();

                            var detallesPedido = detalles.Where(d => d.PedidoId == pedidoIdSeleccionado).ToList();
                            if (detallesPedido != null)
                            {
                                foreach (var detallePedido in detallesPedido)
                                {
                                    var productoId = detallePedido.ProductoId.Value;
                                    var producto = await _client.FindProductoAsync(productoId);

                                    if (producto != null)
                                    {
                                        producto.CantidadTotal -= detallePedido.Cantidad;
                                        var updateProducto = await _client.UpdateProductoAsync(producto);
                                        if (updateProducto.IsSuccessStatusCode)
                                        {
                                            Console.WriteLine("Producto actualizado correctamente");
                                        }
                                    }

                                    var lotes = await _client.GetLoteAsync();
                                    var lotesFiltrados = lotes.Where(l => l.ProductoId == productoId);

                                    if (lotesFiltrados.Any())
                                    {
                                        var loteProximoVencimiento = lotesFiltrados.OrderBy(l => l.FechaVencimiento).First();
                                        loteProximoVencimiento.Cantidad -= detallePedido.Cantidad;
                                        var updateLote = await _client.UpdateLotesAsync(loteProximoVencimiento);

                                        if (updateLote.IsSuccessStatusCode)
                                        {
                                            Console.WriteLine("Lote actualizado correctamente");
                                        }
                                    }
                                }
                            }
                        }

                        else if (domicilioDetalle != null && domicilioDetalle.EstadoDomicilio == "Cancelado")
                        {
                            var detallescancelados = await _client.GetDetallepedidoAsync();

                            var detallesPedidoAgreagos = detallescancelados.Where(d => d.PedidoId == pedidoIdSeleccionado).ToList();
                            if (detallesPedidoAgreagos != null)
                            {
                                foreach (var detallePedido in detallesPedidoAgreagos)
                                {
                                    var productoId = detallePedido.ProductoId.Value;
                                    var producto = await _client.FindProductoAsync(productoId);

                                    if (producto != null)
                                    {
                                        producto.CantidadTotal += detallePedido.Cantidad;
                                        var updateProducto = await _client.UpdateProductoAsync(producto);
                                        if (updateProducto.IsSuccessStatusCode)
                                        {
                                            Console.WriteLine("Producto actualizado correctamente");
                                        }
                                    }

                                    var lotes = await _client.GetLoteAsync();
                                    var lotesFiltrados = lotes.Where(l => l.ProductoId == productoId);

                                    if (lotesFiltrados.Any())
                                    {
                                        // Encontrar el lote con la fecha de vencimiento más próxima
                                        var loteProximoVencimiento = lotesFiltrados.OrderBy(l => l.FechaVencimiento).First();
                                        loteProximoVencimiento.Cantidad += detallePedido.Cantidad;
                                        var updateLote = await _client.UpdateLotesAsync(loteProximoVencimiento);

                                        if (updateLote.IsSuccessStatusCode)
                                        {
                                            Console.WriteLine("Lote actualizado correctamente");
                                        }
                                    }
                                }
                            }
                        }



                        // Retorna una respuesta exitosa si el proceso se realizó correctamente
                    }

                  
                }
                  return Ok("Inventario descontado correctamente");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al descontar el inventario: " + ex.Message);
            }
        }



    }
}



