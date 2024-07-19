using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Net;
using System.Security.Claims;
using VistaNewProject.Models;
using VistaNewProject.Services;
using X.PagedList;

namespace VistaNewProject.Controllers
{
    [Authorize(Policy = "CualquierRol" )]
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
                var marcaApi = await _api.FindMarcaAsync(marcaId.Value);

                marcasNombre.Add(new NombresMarca() { Nombre = marcaApi.NombreMarca });

                int unidad = producto.ProductoId != null ? producto.ProductoId : 0;
                CantidadTotal += unidad;
            }

            TempData["TotalProductos"] = CantidadTotal.ToString();

            // ----------------------- REPORTE COMPRAS -----------------------
            var comprasApi = await _api.GetCompraAsync();
            var fechaInicioCompras = DateTime.Now.AddDays(-30);
            var fechaFinCompras = DateTime.Now;

            var registroCompras = comprasApi
                .Where(r => r.FechaCompra >= fechaInicioCompras && r.FechaCompra < fechaFinCompras && r.EstadoCompra != 0)
                .OrderByDescending(r => r.ValorTotalCompra)
                .Take(7)
                .ToList();

            var detalleCompraApi = await _api.GetDetallecompraAsync();
            var lotesCompraApi = await _api.GetLoteAsync();
            var proveedorApi = await _api.GetProveedorAsync();

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
                        totalCompras += lotePrecio.PrecioCompra ?? 0;
                    }
                }
            }

            TempData["TotalCompras"] = totalCompras.ToString("$ #,##0");

            // ----------------------- REPORTE PEDIDOS -----------------------
            var pedidosApi = await _api.GetPedidoAsync();
            var fechaInicioPedidos = DateTime.Now.AddDays(-30);
            var fechaFinPedidos = DateTime.Now;

            var registroPedidos = pedidosApi
                .Where(r => r.FechaPedido >= fechaInicioPedidos && r.FechaPedido < fechaFinPedidos && r.EstadoPedido != null)
                .OrderByDescending(r => r.ValorTotalPedido)
                .Take(7)
                .ToList();

            decimal totalPedidosRealizados = 0;
            foreach (var pedido in registroPedidos)
            {
                if (pedido.EstadoPedido == "Realizado")
                {
                    decimal precioTotal = pedido.ValorTotalPedido ?? 0; // Usa 0 como valor por defecto en lugar de 1
                    totalPedidosRealizados += precioTotal;
                }
            }

            TempData["TotalPedidos"] = totalPedidosRealizados.ToString("$ #,##0");
            TempData["Mensaje"] = fechaInicioPedidos.ToString("dd/MM/yyyy");

            // Calcular la diferencia entre totalPedidos y totalCompras
            decimal diferencia = totalPedidosRealizados - totalCompras;
            TempData["Diferencia"] = diferencia;

            // ----------------------- REPORTE CLIENTES -----------------------
            var clientesApi = await _api.GetClientesAsync();
            var registroClientes = clientesApi.Where(r => r.EstadoCliente != 0).OrderByDescending(r => r.TipoCliente)
                .Take(7).ToList();

            int totalClientes = registroClientes.Count();
            TempData["TotalClientes"] = totalClientes.ToString();

            // ----------------------- REPORTE PROVEEDORES -----------------------
            var proveedoresApi = await _api.GetProveedorAsync();
            var registroProveedores = proveedoresApi.Where(r => r.EstadoProveedor != 0).ToList();

            int totalProveedores = registroProveedores.Count();
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
