using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Models;
using VistaNewProject.Services;
using X.PagedList;

namespace VistaNewProject.Controllers
{
    public class ProveedoresController : Controller
    {
        private readonly IApiClient _client;
        public ProveedoresController(IApiClient client)
        {
            _client = client;
        }

        public async Task<IActionResult> Index(int? page)
        {
            int pageSize = 5; // Número máximo de elementos por página
            int pageNumber = page ?? 1;

            var proveedores = await _client.GetProveedorAsync();

            if (proveedores == null)
            {
                return NotFound("error");
            }

            var pagedProveedores = await proveedores.ToPagedListAsync(pageNumber, pageSize);

            // Verifica si la página actual está vacía y redirige a la última página que contiene registros
            if (!pagedProveedores.Any() && pagedProveedores.PageNumber > 1)
            {
                pagedProveedores = await proveedores.ToPagedListAsync(pagedProveedores.PageCount, pageSize);
            }
            int contador = 1;
            if (page.HasValue && page > 1)
            {
                // Obtener el valor actual del contador de la sesión si estamos en una página diferente a la primera
                contador = HttpContext.Session.GetInt32("Contador") ?? 1;
            }

            // Establecer el valor del contador en la sesión para su uso en la siguiente página
            HttpContext.Session.SetInt32("Contador", contador + pagedProveedores.Count);

            ViewBag.Contador = contador;

            return View(pagedProveedores);
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
                var detallesCompraPorCompra = detalles.Where(u => u.CompraId == compra.CompraId);
                detallesCompras.AddRange(detallesCompraPorCompra);
            }

            var cantidadTotalProductosDict = new Dictionary<int, int>(); // Clave: ID del producto, Valor: Cantidad total
            foreach (var detalleCompra in detallesCompras)
            {
                if (!cantidadTotalProductosDict.ContainsKey(detalleCompra.ProductoId ?? 0)) // Utiliza el valor predeterminado 0 si detalleCompra.ProductoId es nulo
                {
                    cantidadTotalProductosDict[detalleCompra.ProductoId ?? 0] = detalleCompra.Cantidad ?? 0; // Utiliza el valor predeterminado 0 si detalleCompra.Cantidad es nulo
                }
                else
                {
                    cantidadTotalProductosDict[detalleCompra.ProductoId ?? 0] += detalleCompra.Cantidad ?? 0; // Utiliza el valor predeterminado 0 si detalleCompra.Cantidad es nulo
                }

            }



            var productos = await _client.GetProductoAsync(); // Obtener todos los productos

            var productosConCantidad = new List<ProductoConCantidad>();
            foreach (var kvp in cantidadTotalProductosDict)
            {
                // Buscar el producto correspondiente en la lista de todos los productos
                var producto = productos.FirstOrDefault(p => p.ProductoId == kvp.Key);
                if (producto != null)
                {
                    productosConCantidad.Add(new ProductoConCantidad
                    {
                        ProductoId = kvp.Key,
                        NombreProducto = producto,
                        Cantidad = kvp.Value
                    });
                }
            }

            // Convertir la lista de productos con cantidad a IPagedList
            var pageNumber = page ?? 1;
            var pageSize = 10;
            var pagedProductos = productosConCantidad.ToPagedList(pageNumber, pageSize);

            // Actualizar la cantidad total de productos comprados en el proveedor
            ViewBag.CantidadTotalProductos = productosConCantidad.Sum(p => p.Cantidad);

            ViewBag.Proveedor = proveedor;
            return View(pagedProductos);
        }

        public class ProductoConCantidad
        {
            public int ? ProductoId { get; set; }
            public Producto ? NombreProducto { get; set; }
            public int ? Cantidad { get; set; }
        }








    }
}
