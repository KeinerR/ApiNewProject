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
            int pageSize = 5; // Cambiado a 5 para que la paginación se haga cada 5 registros
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
                if (movimiento.TipoAccion == "Pedido"  && movimiento.TipoMovimiento=="Entrada" || movimiento.TipoAccion == "Compra" && movimiento.TipoMovimiento == "Salida")
                {
                    var pedidoId = movimiento.BuscarId.Value;
                    return RedirectToAction("Detalles", "Movimientos", new { pedidoId  , tipoMovimiento = movimiento.TipoMovimiento });
                }
            }

            return Ok();
        }

        public async Task<IActionResult> Detalles(int pedidoId , int? page , string tipoMovimiento)
        {
            var pedido = await _client.FindPedidosAsync(pedidoId);

            ViewBag.pedidos = pedido;
            if (pedido == null)
            {
                return NotFound();
            }

               
              ViewBag.movimiento= tipoMovimiento;
            

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


     
        

    }
}