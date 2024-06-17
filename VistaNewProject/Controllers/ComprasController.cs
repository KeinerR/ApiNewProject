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
        public async Task<IActionResult> Index(int? page)
        {
            int pageSize = 5;
            int pageNumber = page ?? 1;

            var compras = await _client.GetCompraAsync();
            var proveedores = await _client.GetProveedorAsync();
            var unidades = await _client.GetUnidadAsync();
            var marcas = await _client.GetMarcaAsync();
            var productos = await _client.GetProductoAsync();
            var presentaciones = await _client.GetPresentacionAsync();

            if (compras == null)
            {
                return NotFound("error");
            }

            // Concatenar nombre DEL PRODUCTO controlador
            foreach (var producto in productos)
            {
                var presentacionEncontrada = presentaciones.FirstOrDefault(p => p.PresentacionId == producto.PresentacionId);
                var nombrePresentacion = presentacionEncontrada != null ? presentacionEncontrada.NombrePresentacion : "Sin presentación";
                var contenido = presentacionEncontrada != null ? presentacionEncontrada.Contenido : "";
                int cantidad = presentacionEncontrada != null ? presentacionEncontrada.CantidadPorPresentacion ?? 0 : 0;

                var marcaEncontrada = marcas.FirstOrDefault(m => m.MarcaId == producto.MarcaId);
                var nombreMarca = marcaEncontrada != null ? marcaEncontrada.NombreMarca : "Sin marca";

                producto.NombreCompletoProducto = $"{producto.NombreProducto} {nombreMarca} {nombrePresentacion} de {contenido}";

                if (cantidad > 1)
                {
                    producto.NombreCompletoProducto += $" {cantidad} x unidades";
                }
                producto.CantidadPorPresentacion = cantidad;
            }
           
           

            var pageCompra = await compras.ToPagedListAsync(pageNumber, pageSize);
            if (!pageCompra.Any() && pageCompra.PageNumber > 1)
            {
                pageCompra = await compras.ToPagedListAsync(pageCompra.PageCount, pageSize);
            }

            int contador = (pageNumber - 1) * pageSize + 1;
            ViewBag.Contador = contador;
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
