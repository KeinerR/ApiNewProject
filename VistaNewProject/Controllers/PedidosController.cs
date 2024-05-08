using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using VistaNewProject.Models;
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

        public async Task<ActionResult> Index()
        {

            var pedido= await _client.GetPedidoAsync();
            return View(pedido);
        }

        [HttpGet]
        public async Task<IActionResult> Create()
        {
            var cliente= await _client.GetClientesAsync();

            ViewBag.Cliente = cliente;  

            return View();
        }



        [HttpPost]
        public async Task<IActionResult> Create( int ClienteId, string TipoServicio,DateTime FechaPedido, string EstadoPedido )
        {
            Console.WriteLine(EstadoPedido);
            Console.WriteLine(ClienteId);
            Console.WriteLine(FechaPedido);
            Console.WriteLine(ClienteId);

            Console.WriteLine(TipoServicio);
                var pedidosnuevos = new Pedido
                {
                    ClienteId = ClienteId,
                    TipoServicio=TipoServicio,
                    FechaPedido=FechaPedido,
                    ValorTotalPedido=0,
                    EstadoPedido=EstadoPedido,


                };

                var response= await _client.CreatePedidoAsync(pedidosnuevos);
                if (response.IsSuccessStatusCode)
                {


                var pedidoIdAgregado = await response.Content.ReadAsStringAsync();
                Console.WriteLine(pedidoIdAgregado);

                // Redirigir al usuario a la vista "Create" del controlador "DetallesPedido" con el último PedidoId agregado
                return RedirectToAction("Create", "DetallePedidos", new { pedidoId = pedidoIdAgregado });
            }
            else
                {
                    ModelState.AddModelError(string.Empty, "error");
                }

           

            return View();
        }

       
    }
}
