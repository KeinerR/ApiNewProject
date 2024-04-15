using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Models;
using VistaNewProject.Services;
using X.PagedList;


namespace VistaNewProject.Controllers
{
    public class MarcasController : Controller
    {
        private readonly IApiClient _client;


        public MarcasController(IApiClient client)
        {
            _client = client;
        }

        public async Task<IActionResult> Index(int? page)
        {
            int pageSize = 5; // Número máximo de elementos por página
            int pageNumber = page ?? 1;

            var marcas = await _client.GetMarcaAsync();

            if (marcas == null)
            {
                return NotFound("error");
            }

            var pagedMarcas = await marcas.ToPagedListAsync(pageNumber, pageSize);

            // Verifica si la página actual está vacía y redirige a la última página que contiene registros
            if (!pagedMarcas.Any() && pagedMarcas.PageNumber > 1)
            {
                pagedMarcas = await marcas.ToPagedListAsync(pagedMarcas.PageCount, pageSize);
            }

            return View(pagedMarcas);
        }



        public async Task<IActionResult> Details(int? id, int? page)
        {
            var proveedores = await _client.GetProveedorAsync();
            var proveedor = proveedores.FirstOrDefault(u => u.ProveedorId == id);
            if (proveedor == null)
            {
                return NotFound();
            }

            // Obtener las compras del proveedor específico
            var comprasProveedor = await _client.GetCompraAsync();
            var comprasProveedorFiltradas = comprasProveedor.Where(c => c.ProveedorId == proveedor.ProveedorId);

            // Obtener los detalles de compra de las compras del proveedor específico
            var detallesCompras = new List<Detallecompra>();
            foreach (var compra in comprasProveedorFiltradas)
            {
                var detalles = await _client.GetDetallecompraAsync();
                var detalle = detalles.FirstOrDefault(u => u.CompraId == compra.CompraId);
                if (detalle != null)
                {
                    detallesCompras.Add(detalle);
                }
            }

            // Calcular la cantidad total de productos comprados por el proveedor
            var cantidadTotalProductos = detallesCompras.Sum(d => d.Cantidad); // Suponiendo que la cantidad está en la propiedad "Cantidad" de Detallecompra

            // Obtener los productos de cada detalle de compra
            var productos = new List<Producto>();
            foreach (var detalleCompra in detallesCompras)
            {
                var producto = await _client.GetProductoAsync();
                var productoDetalle = producto.FirstOrDefault(u => u.ProductoId == detalleCompra.ProductoId);
                if (productoDetalle != null)
                {
                    productos.Add(productoDetalle);
                }
            }

            // Actualizar la cantidad total de productos comprados en el proveedor
            ViewBag.CantidadTotalProductos = cantidadTotalProductos;

            // Convertir la lista de productos a IPagedList
            var pageNumber = page ?? 1;
            var pageSize = 10;
            var pagedProductos = productos.ToPagedList(pageNumber, pageSize);

            ViewBag.Proveedor = proveedor;
            return View(pagedProductos);
        }


    }
}