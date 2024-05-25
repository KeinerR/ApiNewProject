using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
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

        public async Task<ActionResult> Index( int ? page)
        {

            int pagenSize = 5;
            int pageNumber = page ?? 1;

            var pedidos = await _client.GetPedidoAsync();
            var clientes = await _client.GetClientesAsync();
            var producto = await _client.GetProductoAsync();
            var unidad=await _client.GetUnidadAsync();
            var usuario=await _client.GetUsuarioAsync();

            if (pedidos == null || clientes == null || producto== null)
            {
                return View("Error");
            }
            var pagesPedidos= await pedidos.ToPagedListAsync(pageNumber, pagenSize);
            if(!pagesPedidos.Any() && pagesPedidos.PageNumber > 1)
            {
                pagesPedidos=await pedidos.ToPagedListAsync(pagesPedidos.PageCount, pagenSize);
            }
            ViewBag.Clientes = clientes;
            ViewBag.Productos = producto;
            ViewBag.Unidad = unidad;
            ViewBag.Usuario = usuario;

            return View(pagesPedidos);
        }


        [HttpGet]
        public async Task<IActionResult> Create()
        {
            var clientes = await _client.GetClientesAsync();

            if (clientes == null)
            {
                return View("Error");
            }


            ViewBag.Clientes = clientes;
            return View();
        }



        [HttpPost]
        public async Task<IActionResult> Create(int ClienteId, string TipoServicio, DateTime FechaPedido, string EstadoPedido)
        {
            Console.WriteLine(EstadoPedido);
            Console.WriteLine(ClienteId);
            Console.WriteLine(FechaPedido);
            Console.WriteLine(TipoServicio);

            var pedidosnuevos = new Pedido
            {
                ClienteId = ClienteId,
                TipoServicio = TipoServicio,
                FechaPedido = FechaPedido,
                ValorTotalPedido = 0,
                EstadoPedido = EstadoPedido,


            };

            var response = await _client.CreatePedidoAsync(pedidosnuevos);
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


        public async Task<IActionResult> DescontardeInventario(int id, string tipo)
        {
            Console.WriteLine(id);
            Console.WriteLine(tipo);
            try
            {
                if (tipo == "Pedido")
                {
                    var pedidostraidos = await _client.FindPedidosAsync(id);
                    var domicilios = await _client.GetDomicilioAsync();
                    var domicilioDetalle = domicilios.FirstOrDefault(d => d.PedidoId == id);

                    if ((pedidostraidos != null && pedidostraidos.EstadoPedido == "Realizado") || (domicilioDetalle != null && domicilioDetalle.EstadoDomicilio == "Realizado"))
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
                                    producto.CantidadReservada -= detallePedido.Cantidad;
                                    var updateProducto = await _client.UpdateProductoAsync(producto);
                                    if (updateProducto.IsSuccessStatusCode)
                                    {
                                        Console.WriteLine("Producto actualizado correctamente");
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
                                    int cantidadRestante = detallePedido.Cantidad.Value;

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
                        }
                    }


                    else if (pedidostraidos != null && pedidostraidos.EstadoPedido == "Anulado")
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
                                    producto.CantidadReservada -= detallePedido.Cantidad;
                                    var updateProducto = await _client.UpdateProductoAsync(producto);
                                    if (updateProducto.IsSuccessStatusCode)
                                    {
                                        Console.WriteLine("Producto actualizado correctamente");
                                    }
                                }
                               
                            }

                        }

                    }
                    else if (pedidostraidos != null && pedidostraidos.EstadoPedido == "Cancelado")
                    {
                        var detalles = await _client.GetDetallepedidoAsync();
                        var detallesPedido = detalles.Where(d => d.PedidoId == id).ToList();

                        if (detallesPedido != null)
                        {
                            foreach (var detalleCancelado in detallesPedido)
                            {
                                var productoId = detalleCancelado.ProductoId.Value;
                                var producto = await _client.FindProductoAsync(productoId);

                                if (producto != null)
                                {
                                    // Devolver la cantidad del detalle cancelado al producto
                                    producto.CantidadTotal += detalleCancelado.Cantidad;
                                    var updateProducto = await _client.UpdateProductoAsync(producto);

                                    if (updateProducto.IsSuccessStatusCode)
                                    {
                                        Console.WriteLine("Cantidad devuelta al producto correctamente");
                                    }
                                }

                                if (detalleCancelado.LoteId != null) // Verificar si hay un lote asociado al detalle
                                {
                                    var loteId = detalleCancelado.LoteId.Value;
                                    var lote = await _client.FindLoteAsync(loteId);

                                    if (lote != null) // Verificar si el lote es válido
                                    {
                                        // Obtener el lote más próximo a vencer disponible para ese producto
                                        var loteProximoVencimiento = await ObtenerLoteProximoVencimientoDisponible(productoId);

                                        if (loteProximoVencimiento != null)
                                        {
                                            // Devolver la cantidad del detalle cancelado al lote más próximo a vencer
                                            loteProximoVencimiento.Cantidad += detalleCancelado.Cantidad;

                                            // Actualizar el lote en la base de datos
                                            var updateLote = await _client.UpdateLoteAsync(loteProximoVencimiento);

                                            if (updateLote.IsSuccessStatusCode)
                                            {
                                                Console.WriteLine("Cantidad devuelta al lote más próximo a vencer correctamente");
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }





                }    // Retorna una respuesta exitosa si el proceso se realizó correctamente
                return Ok("Inventario descontado correctamente.");


            }
            catch (Exception ex)
            {
                // Error durante el proceso
                Console.WriteLine($"Error durante el proceso: {ex.Message}");
                return StatusCode(500, "Error interno del servidor.");
            }
        }



        public async Task<IActionResult> Details(int? id, int? page)
        {
            if (id == null)
            {
                return NotFound();
            }

            var pedidosTask = _client.GetPedidoAsync();
            var detallesTask = _client.GetDetallepedidoAsync();

            await Task.WhenAll(pedidosTask, detallesTask);

            var pedido = pedidosTask.Result.FirstOrDefault(u => u.PedidoId == id);
            if (pedido == null)
            {
                return NotFound();
            }

            ViewBag.Pedidos = pedido;

            // Obtener el nombre del cliente asociado al pedido
            var cliente = await _client.FindClienteAsync(pedido.ClienteId.Value);
            ViewBag.NombreCliente = cliente != null ? cliente.NombreEntidad : "Cliente no encontrado"; // Asignar el nombre del cliente a la ViewBag

            var detallepedidos = detallesTask.Result.Where(p => p.PedidoId == id).ToList();

            // Recuperar los productos y unidades correspondientes de manera asíncrona
            var productosTasks = detallepedidos.Select(async detalle =>
            {
                detalle.Producto = await _client.FindProductoAsync(detalle.ProductoId.Value);
                detalle.Unidad = await _client.FindUnidadAsync(detalle.UnidadId.Value);
            });

            await Task.WhenAll(productosTasks);

            int pageSize = 4; // Tamaño de página deseado
            int pageNumber = page ?? 1;

            var pagedProductos = detallepedidos.ToPagedList(pageNumber, pageSize);

            return View(pagedProductos);
        }



    }
}
