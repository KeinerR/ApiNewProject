using Microsoft.AspNetCore.Mvc;
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
        public async Task<IActionResult> Index(int? page , string order = "default")
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
    }
}
