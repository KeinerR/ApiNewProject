using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Models;
using VistaNewProject.Services;
using X.PagedList;

namespace VistaNewProject.Controllers
{
    public class MovimientosController : Controller
    {
        private readonly IApiClient _client;
        public MovimientosController(IApiClient client)
        {
            _client = client;
        }

        public async Task<IActionResult> Index(int? page)
        {
            int pageSize = 4; // Cambiado a 5 para que la paginación se haga cada 5 registros
            int pageNumber = page ?? 1; // Número de página actual (si no se especifica, es 1)

            var movimientos = await _client.GetMovimientoAsync(); // Obtener todas las marcas

            if (movimientos == null)
            {
                return NotFound("error");
            }

            var pageMovimiento = await movimientos.ToPagedListAsync(pageNumber, pageSize);
            if (!pageMovimiento.Any() && pageMovimiento.PageNumber > 1)
            {
                pageMovimiento = await movimientos.ToPagedListAsync(pageMovimiento.PageCount, pageSize);
            }

            int contador = (pageNumber - 1) * pageSize + 1; // Calcular el valor inicial del contador

            ViewBag.Contador = contador;

            // Código del método Index que querías integrar
            string mensaje = HttpContext.Session.GetString("Message");
            TempData["Message"] = mensaje;

            try
            {
                ViewData["Movimientos"] = movimientos;
                return View(pageMovimiento);
            }
            catch (HttpRequestException ex) when ((int)ex.StatusCode == 404)
            {
                HttpContext.Session.SetString("Message", "No se encontró la página solicitada");
                return RedirectToAction("Index", "Home");
            }
            catch
            {
                HttpContext.Session.SetString("Message", "Error en el aplicativo");
                return RedirectToAction("LogOut", "Accesos");
            }

        }

        public async Task<IActionResult> Create()
        {
            


            return View();

        }

        [HttpPost]
        public async Task<IActionResult> CreatePost([FromForm] Movimiento movimiento)
        {
            var movimientos = new Movimiento
            {
                TipoAccion = movimiento.TipoAccion,
                TipoMovimiento = movimiento.TipoMovimiento,
                BuscarId = movimiento.BuscarId,
                FechaMovimiento = movimiento.FechaMovimiento
            };

            var response = await _client.CreateMovimientoAsync(movimientos);

            if (response.IsSuccessStatusCode)
            {

                Console.WriteLine(movimiento.TipoAccion);
                if (movimiento.TipoAccion == "Pedido"   )
                {
                    var pedidoId = movimiento.BuscarId.Value;
                    return RedirectToAction("Details", "Movimientos", new { pedidoId });
                }

                else if (movimiento.TipoAccion == "Compra"  )
                {
                    var CompraId = movimiento.BuscarId.Value;
                    return RedirectToAction("DetallesCompras", "Movimientos", new { CompraId, });
                }
            }

            return Ok();
        }

        public async Task<IActionResult> Details(int pedidoId , int? page )
        {
            var pedido = await _client.FindPedidosAsync(pedidoId);

            ViewBag.pedidos = pedido;
            if (pedido == null)
            {
                return NotFound();
            }

               
            

            var detallesPeidos = await _client.GetDetallepedidoAsync();
            var detallepedidos = detallesPeidos.Where(p => p.PedidoId == pedidoId).ToList();

            var productosTasks = detallepedidos.Select(async detalle =>
            {
                detalle.Producto = await _client.FindProductoAsync(detalle.ProductoId.Value);
                detalle.Unidad = await _client.FindUnidadAsync(detalle.UnidadId.Value);
            });
            await Task.WhenAll(productosTasks);

            var clienetId =pedido.ClienteId;
            var cliente = await _client.FindClienteAsync(clienetId.Value);

            var nombreCliente=cliente.NombreEntidad;
            ViewBag.Cliente = nombreCliente;


            int pageSize = 4; // Tamaño de página deseado
            int pageNumber = page ?? 1;

            var pagedProductos = detallepedidos.ToPagedList(pageNumber, pageSize);

            return View(pagedProductos);
        }
        public async Task<IActionResult> DetallesCompras(int CompraId, int? page)
        {
            // 1. Obtener la compra específica por su ID
            var compra = await _client.FinComprasAsync(CompraId);

            var proveedor = await _client.FindProveedorAsync(compra.CompraId);
              ViewBag.Proveedor = proveedor;

            // 2. Asignar la compra a ViewBag para usar en la vista
            ViewBag.compras = compra;

            // 3. Verificar si la compra es nula
            if (compra == null)
            {
                // Si no se encuentra la compra, retornar un resultado 404 (Not Found)
                return NotFound();
            }

            // 4. Obtener todos los lotes de compras
            var detalles = await _client.GetDetallecompraAsync();

            // 5. Filtrar los lotes para obtener solo los que corresponden a la compra actual
            var detallecompras = detalles.Where(p => p.CompraId == CompraId).ToList();

            // 6. Para cada detalle de compra, obtener el producto y el detalle de la compra asociados
            var productosTasks = detallecompras.Select(async detalle =>
            {
                detalle.Producto = await _client.FindProductoAsync(detalle.ProductoId.Value);
                detalle.Compra = await _client.FinComprasAsync(detalle.CompraId.Value);
                detalle.lote = await _client.FindLoteAsync(detalle.DetalleCompraId);

                detalle.Unidad = await _client.FindUnidadAsync(detalle.UnidadId.Value);
            });

            // 7. Esperar a que todas las tareas asíncronas de obtención de productos y detalles de compras finalicen
            await Task.WhenAll(productosTasks);

            // 8. Configurar la paginación: definir el tamaño de página y el número de página actual
            int pageSize = 3; // Tamaño de página deseado
            int pageNumber = page ?? 1; // Si 'page' es nulo, usar 1 como valor predeterminado

            // 9. Aplicar la paginación a la lista de detalles de compra
            var pagedProductos = detallecompras.ToPagedList(pageNumber, pageSize);

            // 10. Retornar la vista con la lista paginada de detalles de compra
            return View(pagedProductos);
        }




    }
}