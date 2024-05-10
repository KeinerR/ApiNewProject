using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
<<<<<<< Updated upstream
=======
using Microsoft.EntityFrameworkCore.Metadata.Internal;
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
            var pedido= await _client.GetPedidoAsync();
            return View(pedido);
        }

        [HttpGet]
        public async Task<IActionResult> Create()
        {
            var cliente= await _client.GetClientesAsync();

            ViewBag.Cliente = cliente;  

=======
            int pagenSize = 5;
            int pageNumber = page ?? 1;

            var pedidos = await _client.GetPedidoAsync();
            var producto =await _client.GetProductoAsync();
            var usuario=await _client.GetUsuarioAsync();

            var clientes = await _client.GetClientesAsync();
            var unidad =await _client.GetUnidadAsync();

            if (pedidos == null  || producto== null || usuario == null)
            {
                return View("Error");
            }
            var pagesPedidos= await pedidos.ToPagedListAsync(pageNumber, pagenSize);
            if(!pagesPedidos.Any() && pagesPedidos.PageNumber > 1)
            {
                pagesPedidos=await pedidos.ToPagedListAsync(pagesPedidos.PageCount, pagenSize);
            }

           
            ViewBag.Productos = producto;
            ViewBag.Usuario = usuario;
            ViewBag.Clientes = clientes;


            ViewBag.Unidad = unidad;
            // Pasar los clientes a través de ViewBag

            return View(pagesPedidos);
        }


        public async Task<IActionResult> Create()
        {
            var clientes = await _client.GetClientesAsync();

            if (clientes==null)
            {
                return View("Error");
            }

            
            ViewBag.Clientes = clientes;
>>>>>>> Stashed changes
            return View();
        }


<<<<<<< Updated upstream

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

       
=======
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] int ClienteId, DateTime FechaPedido,string EstadoPedido, string TipoServicio, decimal ValorTotalPedido, Pedido pedido )

        {

            Console.WriteLine( ClienteId );
            Console.WriteLine(FechaPedido);
            Console.WriteLine(EstadoPedido);
            Console.WriteLine(ValorTotalPedido);
            Console.WriteLine(TipoServicio);


            if (ModelState.IsValid)
            {
               
                var pedidos = new Pedido{

                   ClienteId= ClienteId,
                  TipoServicio= TipoServicio,
                  FechaPedido=FechaPedido,
                  ValorTotalPedido=ValorTotalPedido,
                  EstadoPedido= EstadoPedido

               };

                Console.WriteLine(pedidos);


                // Crear el nuevo pedido y obtener el objeto Pedido devuelto
                var response = await _client.CreatePediiosAsync(pedidos);

                if (response==null)
                {
                    // Manejar el caso en el que no se puede obtener el último pedido registrado
                    return View("Error");
                }




            }

            // En caso de que el modelo no sea válido, regresar a la vista de creación
            return View("Index");
        }

>>>>>>> Stashed changes
    }
}
