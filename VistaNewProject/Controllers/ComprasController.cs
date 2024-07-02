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
            var categorias = await _client.GetCategoriaAsync();
            var productos = await _client.GetAllDatosProductosAsync();


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
            ViewBag.Unidades = unidades;
            ViewBag.Productos = productos;
            ViewBag.Categorias = categorias;

            return View(pageCompra);
        }

        public async Task<IActionResult> Details(int? id, int? page)
        {
            int pageSize = 5; // Número máximo de elementos por página
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
            var productos = await _client.GetAllDatosProductosAsync(); 
            var detallescompra = await _client.GetDetallecompraAsync();
            var proveedores = await _client.GetProveedorAsync();
            var lotes = await _client.GetLoteAsync();
            var unidades = await _client.GetUnidadAsync();

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
                    var producto = await _client.FindProductoAsync(lote.ProductoId.Value);
                    var presentacion = await _client.FindPresentacionAsync(producto.PresentacionId.Value);
                    var unidad = await _client.FindUnidadAsync(detalle.UnidadId.Value);
                    if (unidad.UnidadId == 2)
                    {
                        // Calcular la cantidad por presentación y el resto
                        var cantidadPorPresentacion = presentacion.CantidadPorPresentacion;
                        var nuevaCantidadPorUnidad = lote.Cantidad;
                        int? productoCantidadTotal = 0;
                        var numeroPar = nuevaCantidadPorUnidad % 2;
                        var restar = nuevaCantidadPorUnidad % cantidadPorPresentacion;
                        if (numeroPar == 0)
                        {
                            var cantidadLotes = nuevaCantidadPorUnidad / cantidadPorPresentacion;
                            lote.Cantidad = cantidadLotes;
                            lote.CantidadCompra = cantidadLotes;
                        }
                        else
                        {
                            productoCantidadTotal = (nuevaCantidadPorUnidad - restar) / cantidadPorPresentacion;
                            lote.Cantidad = productoCantidadTotal;
                            lote.CantidadCompra = productoCantidadTotal;
                        }

                        lote.CantidadPorUnidad = nuevaCantidadPorUnidad;
                        lote.CantidadPorUnidadCompra = nuevaCantidadPorUnidad;
                    }
                    else {
                        if (presentacion.CantidadPorPresentacion > 2)
                        {
                            lote.CantidadPorUnidad = lote.Cantidad * presentacion.CantidadPorPresentacion;
                            lote.CantidadPorUnidadCompra = lote.Cantidad * presentacion.CantidadPorPresentacion;
                        }
                    }
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
                        CantidadCompra = lote.Cantidad,
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

        [HttpGet]
        public async Task<ActionResult> CompararNumerosDeFactura(string NumeroFactura)
        {
            // Llama al método VerificarDuplicadosFacturas del cliente _client
            var response = await _client.VerificarDuplicadosFacturas(NumeroFactura);
            // Retorna la respuesta obtenida
            return Ok(response); // Puedes ajustar el tipo de ActionResult según lo que devuelva VerificarDuplicadosFacturas
        }
        [HttpGet]
        public async Task<ActionResult> CompararNumerosDeLote(string NumeroLote)
        {
            // Llama al método VerificarDuplicadosFacturas del cliente _client
            var response = await _client.VerificarDuplicadosLotes(NumeroLote);
            // Retorna la respuesta obtenida
            return Ok(response); // Puedes ajustar el tipo de ActionResult según lo que devuelva VerificarDuplicadosFacturas
        }


        [HttpGet("/Compras/filtrarxCategoria/{filtrar}")]
        public async Task<ActionResult> filtrarxCategoria(int filtrar)
        {
            var productos = await _client.GetAllDatosProductosAsync();
            var unidades = await _client.GetUnidadAsync();
            // Filter associated categories if asociar is 1 and asociarcategoria is provided
            if (filtrar != 0)
            {
                var categoriasxUnidades = await _client.GetCategoriaxUnidadesByIdAsync(filtrar);
                productos = productos.Where(c => c.CategoriaId == filtrar).ToList();
                var unidadesAsociadasIds = categoriasxUnidades
                   .Select(cu => cu.UnidadId)
                   .ToList();
                unidades = unidades.Where(c => unidadesAsociadasIds.Contains(c.UnidadId)).ToList();

            }
            else
            {
                unidades = unidades.Where(c => c.EstadoUnidad == 1).ToList();
            }

            // Return filtered or all records as required
            return Json(new { Producto = productos, Unidad = unidades });
        }

        [HttpGet("/Compras/filtrarUnidadesxProductoDatalist/{filtro}")]
        public async Task<ActionResult> filtrarUnidadesxProductoDatalist(int filtro)
        {
            var unidades = await _client.GetUnidadAsync();
            // Filtrar unidades asociadas si el filtro no es 0
            if (filtro != 0)
            {
                var unidadesxProducto = await _client.GetUnidadesxProductosByIdProductoAsync(filtro);
                var unidadesAsociadasIds = unidadesxProducto
                    .Select(cu => cu.UnidadId)
                    .ToList();
                unidades = unidades.Where(c => unidadesAsociadasIds.Contains(c.UnidadId)).ToList();
            }
            else
            {
                unidades = unidades.Where(c => c.EstadoUnidad == 1).ToList();
            }

            // Retornar las unidades filtradas o todas según corresponda
            return Json(new { Unidad = unidades });
        }

    }
}
