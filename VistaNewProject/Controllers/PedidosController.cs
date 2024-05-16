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
            Console.WriteLine(ClienteId);

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


        public async Task<IActionResult> DescontardeInventario(int pedidoId)
        {
            Console.WriteLine(pedidoId);
            try
            {
                var pedidostraidos = await _client.FindPedidosAsync(pedidoId);

                if (pedidostraidos != null && pedidostraidos.EstadoPedido == "Realizado")
                {
                    var detalles = await _client.GetDetallepedidoAsync();
                    var detallesPedido = detalles.Where(d => d.PedidoId == pedidoId).ToList();
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
                                // Encontrar el lote con la fecha de vencimiento más próxima
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
                else if (pedidostraidos != null && pedidostraidos.EstadoPedido == "Cancelado")
                {
                    var detallescancelados = await _client.GetDetallepedidoAsync();

                    var detallesPedidoAgreagos = detallescancelados.Where(d => d.PedidoId == pedidoId).ToList();
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
                return Ok("Inventario descontado correctamente.");
            }
            catch (Exception ex)
            {
                // En caso de que ocurra algún error, puedes manejarlo y devolver un error al cliente
                return StatusCode(500, $"Error al descontar el inventario: {ex.Message}");
            }
        }



    }
}
