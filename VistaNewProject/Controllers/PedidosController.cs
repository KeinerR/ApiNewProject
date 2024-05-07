using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using VistaNewProject.Services;
using X.PagedList;

namespace VistaNewProject.Controllers
{
    public class PedidosController : Controller
    {
        private readonly IApiClient _client;


        public PedidosController(IApiClient client)
        {
            _client = client;
        }

        public async Task<ActionResult> Index( int ? page)
        {

            int pagenSize = 5;
            int pageNumber = page ?? 1;

            var pedidos = await _client.GetPedidoAsync();
            var clientes = await _client.GetClientesAsync();
            var producto = await _client.GetProductoAsync();
            var unidad=await _client.GetUnidadAsync();
            var usuario=await _client.GetUsuarioAsync();

            if (pedidos == null || clientes == null || producto== null)
            {
                return View("Error");
            }
            var pagesPedidos= await pedidos.ToPagedListAsync(pageNumber, pagenSize);
            if(!pagesPedidos.Any() && pagesPedidos.PageNumber > 1)
            {
                pagesPedidos=await pedidos.ToPagedListAsync(pagesPedidos.PageCount, pagenSize);
            }
            ViewBag.Clientes = clientes;
            ViewBag.Productos = producto;
            ViewBag.Unidad = unidad;
            ViewBag.Usuario = usuario;

            return View(pagesPedidos);
        }

    }
}
