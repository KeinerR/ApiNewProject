using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Models;
using VistaNewProject.Services;
using X.PagedList;

namespace VistaNewProject.Controllers
{
    public class DomiciliosController : Controller
    {
        private readonly IApiClient _client;


        public DomiciliosController(IApiClient client)
        {
            _client = client;
        }


        public async Task<IActionResult> Index(int? page)
        {
            int pageSize = 5; // Cambiado a 5 para que la paginación se haga cada 5 registros
            int pageNumber = page ?? 1; // Número de página actual (si no se especifica, es 1)

            var domicilios = await _client.GetDomicilioAsync(); // Obtener todas las marcas

            if (domicilios == null)
            {
                return NotFound("error");
            }

            var pageDomicilio = await domicilios.ToPagedListAsync(pageNumber, pageSize);
            if (!pageDomicilio.Any() && pageDomicilio.PageNumber > 1)
            {
                pageDomicilio = await domicilios.ToPagedListAsync(pageDomicilio.PageCount, pageSize);
            }

            int contador = (pageNumber - 1) * pageSize + 1; // Calcular el valor inicial del contador

            ViewBag.Contador = contador;

            // Código del método Index que querías integrar
            string mensaje = HttpContext.Session.GetString("Message");
            TempData["Message"] = mensaje;

            try
            {
                ViewData["Domicilios"] = domicilios;
                return View(pageDomicilio);
            }
            catch (HttpRequestException ex) when ((int)ex.StatusCode == 404)
            {
                HttpContext.Session.SetString("Message", "No se encontró la página solicitada");
                return RedirectToAction("Index", "Home");
            }
            catch
            {
                HttpContext.Session.SetString("Message", "Error en el aplicativo");
                return RedirectToAction("LogOut", "Accesos");
            }


        }

        public async Task<IActionResult> Create()
        {
            var Roles = await _client.GetRolAsync();
            var usuario = await _client.GetUsuarioAsync();
            var pedido = await _client.GetPedidoAsync();

            var ultimoPedidoGuardado = pedido.OrderByDescending(p => p.PedidoId).FirstOrDefault();


            ViewBag.UltimoPedidoId = ultimoPedidoGuardado?.PedidoId ?? 0;
            var estadoUltimoPedido = ultimoPedidoGuardado?.EstadoPedido ?? "Pendiente"; // Ajusta el valor por defecto si es necesario
            const int DOMICILIARIO_ROLE_ID = 3; // Id del rol de domiciliario

            var usuariosDomiciliarios = usuario.Where(u => u.RolId == DOMICILIARIO_ROLE_ID).ToList();



            Console.WriteLine(usuariosDomiciliarios);



            var domicilio = new Domicilio
            {
                EstadoDomicilio = estadoUltimoPedido
            };

            ViewBag.Usuarios = usuariosDomiciliarios;
            Console.WriteLine(ViewBag.Usuarios);

            return View(domicilio);
        }


        [HttpPost]
        public async Task<IActionResult> Create([FromForm] Domicilio domicilio)
        {
            var domicilios = new Domicilio
                {
                    PedidoId = domicilio.PedidoId,
                    UsuarioId = domicilio.UsuarioId,
                    Observacion = domicilio.Observacion,
                    FechaEntrega = domicilio.FechaEntrega,
                    DireccionDomiciliario = domicilio.DireccionDomiciliario,
                    EstadoDomicilio = domicilio.EstadoDomicilio,
                };

                var response = await _client.CreateDomicilioAsync(domicilio);

            TempData["ValidarPedido"] = "Pedido Guardado Correctamente.";
            return RedirectToAction("Index", "Pedidos");

        }
          
        

    }
}
