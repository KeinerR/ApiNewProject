using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using VistaNewProject.Models;
using VistaNewProject.Services;
using X.PagedList;

namespace VistaNewProject.Controllers
{
    public class ComprasController : Controller
    {
        private readonly IApiClient _client;
        public ComprasController(IApiClient client)
        {
            _client = client;
        }
        public async Task<IActionResult> Index(int? page, string order = "default")
        {
            int pageSize = 5;
            int pageNumber = page ?? 1;

            var compras = await _client.GetCompraAsync();
            var proveedores = await _client.GetProveedorAsync();
            var unidades = await _client.GetUnidadAsync();
            var marcas = await _client.GetMarcaAsync();
            var productos = await _client.GetAllDatosProductosAsync();
            var presentaciones = await _client.GetPresentacionAsync();

            compras = compras.Reverse();
            compras = compras.OrderByDescending(c => c.EstadoCompra == 1).ToList();

            switch (order.ToLower())
            {
                case "first":
                    compras = compras.Reverse();
                    compras = compras.OrderByDescending(c => c.EstadoCompra == 1).ToList();
                    break;
                case "alfabetico":
                    compras = compras.OrderBy(p => p.NumeroFactura).ToList();
                    compras = compras.OrderByDescending(c => c.EstadoCompra == 1).ToList();
                    break;
                case "name_desc":
                    compras = compras.OrderByDescending(p => p.NumeroFactura).ToList();
                    compras = compras.OrderByDescending(c => c.EstadoCompra == 1).ToList();
                    break;
                default:
                    compras = compras.OrderByDescending(c => c.EstadoCompra == 1).ToList();
                    break;
            }
            if (compras == null)
            {
                return NotFound("error");
            }

            var pageCompra = await compras.ToPagedListAsync(pageNumber, pageSize);
            if (!pageCompra.Any() && pageCompra.PageNumber > 1)
            {
                pageCompra = await compras.ToPagedListAsync(pageCompra.PageCount, pageSize);
            }

            int contador = (pageNumber - 1) * pageSize + 1;
            ViewBag.Contador = contador;
            ViewData["Compras"] = compras;
            ViewBag.Order = order; // Pasar el criterio de orden a la vista
            ViewBag.Proveedores = proveedores;
            ViewBag.Marcas = marcas;
            ViewBag.Unidades = unidades;
            ViewBag.Productos = productos;
            ViewBag.Presentaciones = presentaciones;

            return View(pageCompra);
        }

        public async Task<IActionResult> Details(int? id, int? page)
        {
            int pageSize = 1; // Número máximo de elementos por página
            int pageNumber = page ?? 1;
            if (id == null)
            {
                return NotFound();
            }

            var compras = await _client.GetCompraAsync();
            var compra = compras.FirstOrDefault(u => u.CompraId == id);
            if (compra == null)
            {
                return NotFound();
            }
            var productos = await _client.GetProductoAsync();
            var categorias = await _client.GetCategoriaAsync();
            var marcas = await _client.GetMarcaAsync();
            var detallescompra = await _client.GetDetallecompraAsync();
            var proveedores = await _client.GetProveedorAsync();
            var unidades = await _client.GetUnidadAsync();
            var lotes = await _client.GetLoteAsync();
            var presentaciones = await _client.GetPresentacionAsync();

            // Filtrar los productos para este detalle específico
            var detallesXCompra = detallescompra.Where(p => p.CompraId == id).ToList();
            foreach (var detalle in detallesXCompra)
            {
                detalle.Producto = productos.FirstOrDefault(p => p.ProductoId == detalle.ProductoId);
                detalle.Unidad = unidades.FirstOrDefault(u => u.UnidadId == detalle.UnidadId);
                detalle.Lotes = lotes.Where(l => l.DetalleCompraId == detalle.DetalleCompraId).ToList();
            }

            var pagedCompra = detallesXCompra.ToPagedList(pageNumber, pageSize);
            ViewBag.Compra = compra;
            ViewBag.Proveedores = proveedores;
            ViewBag.Unidades = unidades;
            ViewBag.Productos = productos;
            ViewBag.Lotes = lotes;
            ViewBag.Presentaciones = presentaciones;
            ViewBag.Marcas = marcas;
            ViewBag.Categorias = categorias;
            return View(pagedCompra);
        }


        [HttpPost("/Compras/InsertarCompra")]
        public async Task<IActionResult> InsertarCompra([FromBody] CrearCompra compra)
        {
            if (compra == null)
            {
                return BadRequest("La compra no puede ser null");
            }

            var nuevaCompra = new CrearCompra
            {
                CompraId = compra.CompraId,
                ProveedorId = compra.ProveedorId,
                NumeroFactura = compra.NumeroFactura,
                FechaCompra = compra.FechaCompra,
                ValorTotalCompra = compra.ValorTotalCompra,
                EstadoCompra = compra.EstadoCompra,
                Detallecompras = new List<CrearDetallecompra>() // Inicializa la lista como vacía
            };

            // Imprime los detalles de la compra
            foreach (var detalle in compra.Detallecompras)
            {
                var nuevoDetalleCompra = new CrearDetallecompra
                {
                    CompraId = 0,
                    DetalleCompraId = 0,
                    ProductoId = detalle.ProductoId,
                    UnidadId = detalle.UnidadId,
                    Cantidad = detalle.Cantidad,
                    Lotes = new List<LoteCrear>() // Inicialización como colección vacía
                };

                foreach (var lote in detalle.Lotes)
                {
                    var nuevoLote = new LoteCrear
                    {
                        LoteId = 0,
                        DetalleCompraId = 0,
                        ProductoId = lote.ProductoId,
                        NumeroLote = lote.NumeroLote,
                        PrecioCompra = lote.PrecioCompra,
                        PrecioPorUnidad = lote.PrecioPorUnidad,
                        PrecioPorPresentacion = lote.PrecioPorPresentacion,
                        PrecioPorUnidadProducto = lote.PrecioPorUnidadProducto,
                        PrecioPorPresentacionCompra = lote.PrecioPorPresentacionCompra,
                        PrecioPorUnidadProductoCompra = lote.PrecioPorUnidadProductoCompra,
                        PrecioPorUnidadCompra = lote.PrecioPorUnidadCompra,
                        FechaVencimiento = lote.FechaVencimiento,
                        Cantidad = lote.Cantidad,
                        CantidadCompra = lote.CantidadCompra,
                        CantidadPorUnidadCompra = lote.CantidadPorUnidadCompra,
                        CantidadPorUnidad = lote.CantidadPorUnidad,
                        EstadoLote = lote.EstadoLote
                    };

                    nuevoDetalleCompra.Lotes.Add(nuevoLote); // Agrega el lote al detalle
                }

                nuevaCompra.Detallecompras.Add(nuevoDetalleCompra); // Agrega el detalle a la compra
            }

            var respuestaServidor = await _client.CreateComprasAsync(nuevaCompra);

            if (respuestaServidor != null)
            {
                Console.WriteLine("Nueva Compra:");
                Console.WriteLine(JsonConvert.SerializeObject(nuevaCompra, Formatting.Indented)); // Imprime la nuevaCompra por consola con formato indentado
                return Ok(nuevaCompra); // Si la compra se creó correctamente, devuelve una respuesta OK
            }
            else
            {
                return StatusCode(500, "Error al procesar la solicitud"); // Si hubo un error en el servidor, devuelve un código de error 500
            }
        }





    }
}
