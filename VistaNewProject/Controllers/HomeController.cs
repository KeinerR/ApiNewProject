using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Net;
using VistaNewProject.Models;
using VistaNewProject.Services;
using X.PagedList;


namespace VistaNewProject.Controllers
{
    public class HomeController : Controller
    {
        private readonly IApiClient _api;

        public HomeController(IApiClient api)
        {
            _api = api;
        }
        public async Task<IActionResult> Index()
        {
            // ------------- REPORTE PRODUCTOS -------------

            var productosApi = await _api.GetProductoAsync();

            var registroProductos = productosApi.Where(r => r.Estado != 0).OrderByDescending(r => r.CantidadTotal)
                .Take(7).ToList();

            List<NombresMarca> marcasNombre = new List<NombresMarca>();

            int CantidadTotal = 0;
            foreach (var producto in registroProductos)
            {
                var marcaId = producto.MarcaId;
                var marcaApi = await _api.FindMarcaAsync(marcaId.Value );

                marcasNombre.Add(
                    new NombresMarca()
                    {
                        Nombre = marcaApi.NombreMarca
                    });

                Console.WriteLine($"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA---------------{marcaApi.NombreMarca}");

                // Verificar si ProductoId es nulo y asignar un valor predeterminado en ese caso
                int unidad = producto.ProductoId != null ? producto.ProductoId : 0;
                CantidadTotal += unidad;
            }
            TempData["TotalProductos"] = CantidadTotal.ToString();

            // ----------------------- REPORTE COMPRAS -----------------------

            // Obtener los datos de compras, detalles de compra, lotes y proveedores desde la API
            var comprasApi = await _api.GetCompraAsync();
            var fechaInicioCompras = DateTime.Now.AddDays(-30);
            var fechaFinCompras = DateTime.Now;

            // Filtrar y ordenar las compras de los últimos 30 días
            var registroCompras = comprasApi
                .Where(r => r.FechaCompra >= fechaInicioCompras && r.FechaCompra < fechaFinCompras && r.EstadoCompra != 0)
                .OrderByDescending(r => r.ValorTotalCompra)
                .Take(7)
                .ToList();

            var detalleCompraApi = await _api.GetDetallecompraAsync();
            var lotesCompraApi = await _api.GetLoteAsync();
            var proveedorApi = await _api.GetProveedorAsync();

            // Listas para almacenar los detalles de las compras
            List<Detallecompra> ArrayDetalle = new List<Detallecompra>();
            List<NombreProveedor> ArrayProveedores = new List<NombreProveedor>();
            List<CompraID> ArrayCompras = new List<CompraID>();
            List<TotalCompras> ArrayTotalCompras = new List<TotalCompras>();

            decimal totalCompras = 0;

            foreach (var compra in registroCompras)
            {
                var proveedorId = compra.ProveedorId;
                var proveedorNombre = await _api.FindProveedorAsync(proveedorId);

                ArrayCompras.Add(new CompraID() { IdCompra = compra.CompraId });

                ArrayProveedores.Add(new NombreProveedor() { NombrePro = proveedorNombre.NombreContacto });

                var newDetalle = detalleCompraApi.Where(d => d.CompraId == compra.CompraId).FirstOrDefault();
                if (newDetalle != null)
                {
                    var idDetalle = newDetalle.DetalleCompraId;
                    var newLote = lotesCompraApi.Where(d => d.DetalleCompraId == idDetalle).FirstOrDefault();
                    if (newLote != null)
                    {
                        var idLote = newLote.LoteId;
                        var lotePrecio = await _api.FindLoteAsync(idLote);

                        ArrayTotalCompras.Add(new TotalCompras() { TotalCompra = lotePrecio.PrecioCompra });

                        // Sumar el precio de compra del lote al total de compras
                        totalCompras += lotePrecio.PrecioCompra ?? 0;

                        Console.WriteLine($"Proveedor: {proveedorNombre.NombreContacto}");
                        Console.WriteLine($"Compra ID: {compra.CompraId}");
                        Console.WriteLine($"Precio Lote: {lotePrecio.PrecioCompra}");
                    }
                }
            }

            TempData["TotalCompras"] = totalCompras.ToString("$ #,##0");


            // ----------------------- REPORTE PEDIDOS -----------------------
            var pedidosApi = await _api.GetPedidoAsync();

            var fechaInicioPedidos = DateTime.Now.AddDays(-30);
            var fechaFinPedidos = DateTime.Now;

            var registroPedidos = pedidosApi.Where(r => r.FechaPedido >= fechaInicioPedidos && r.FechaPedido < fechaFinPedidos && r.EstadoPedido != null)
                .OrderByDescending(r => r.ValorTotalPedido) // Modifica aquí el ordenamiento según tus necesidades
                .Take(7).ToList();

            decimal totalPedidos = 0;
            foreach (var pedido in registroPedidos)
            {
                // Verificar si el PrecioTotalPedido del pedido es nulo y asignar un valor predeterminado en ese caso
                decimal precioTotal = pedido.ValorTotalPedido ?? 1;
                totalPedidos += precioTotal;
            }
            TempData["TotalPedidos"] = totalPedidos.ToString("$ #,##0");
            TempData["Mensaje"] = fechaInicioPedidos.ToString("dd/MM/yyyy");

            // ----------------------- REPORTE CLIENTES -----------------------

            var clientesApi = await _api.GetClientesAsync();

            var registroClientes = clientesApi.Where(r => r.EstadoCliente != 0).OrderByDescending(r => r.TipoCliente)
                .Take(7).ToList();

            int totalClientes = registroClientes.Count();
            TempData["TotalClientes"] = totalClientes.ToString();

            // ----------------------- REPORTE PROVEEDORES -----------------------

            var proveedoresApi = await _api.GetProveedorAsync();

            var registroProveedores = proveedoresApi.Where(r => r.EstadoProveedor != 0).ToList();

            //var conteoProveedores = registroProveedores.Select(Proveedor => new
            //{
            //     proveedorID = Proveedor.IdProveedor,
            //     CantidadCompras = comprasApi.Count(c => c.IdProveedor == Proveedor.IdProveedor)
            //}).ToList();

            int totalProveedores = proveedoresApi.Count();

            TempData["TotalProveedores"] = totalProveedores.ToString();

            var viewDashboard = new Home
            {
                Productos = registroProductos,
                Compras = registroCompras,
                Proveedores = registroProveedores,
                Clientes = registroClientes,
                Pedidos = registroPedidos,
                NombreMarcas = marcasNombre,
                NombreProveedores = ArrayProveedores,
                CompraIDs = ArrayCompras,
                ValorTotalCompras = ArrayTotalCompras,

            };


            return View(viewDashboard);
        }

    }
}