using Microsoft.AspNetCore.Mvc;
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

            int CantidadTotal = 0;
            foreach (var producto in registroProductos)
            {
                // Verificar si ProductoId es nulo y asignar un valor predeterminado en ese caso
                int unidad = producto.ProductoId != null ? producto.ProductoId : 0;
                CantidadTotal += unidad;
            }
            TempData["TotalProductos"] = CantidadTotal.ToString();

            // ----------------------- REPORTE COMPRAS -----------------------

            var comprasApi = await _api.GetCompraAsync();

            var fechaInicioCompras = DateTime.Now.AddDays(-30);
            var fechaFinCompras = DateTime.Now;

            var registroCompras = comprasApi.Where(r => r.FechaCompra >= fechaInicioCompras && r.FechaCompra < fechaFinCompras && r.EstadoCompra != 0)
                .OrderByDescending(r => r.ValorTotalCompra)
                .Take(7).ToList();

            decimal totalCompras = 0;
            foreach (var compra in registroCompras)
            {
                // Verificar si el ValorTotal de la compra es nulo y asignar un valor predeterminado en ese caso
                decimal valorTotal = compra.ValorTotalCompra ?? 1;
                totalCompras += valorTotal;
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
                Pedidos = registroPedidos
            };


            return View(viewDashboard);
        }

    }
}