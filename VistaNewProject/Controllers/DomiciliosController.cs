using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
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
            int pageSize = 5; // Tamaño de página
            int pageNumber = page ?? 1; // Número de página actual (por defecto es 1)

            try
            {
                // Obtener todos los domicilios
                var domicilios = await _client.GetDomicilioAsync();

                // Obtener domicilios pendientes
                var domiciliosPendientes = domicilios.Where(d => d.EstadoDomicilio == "Pendiente").ToList();

                // Configurar paginación para los domicilios pendientes
                var pageDomicilio = await domiciliosPendientes.ToPagedListAsync(pageNumber, pageSize);

                // Si no hay domicilios pendientes, mostrar la vista Index con una lista vacía
                if (!domiciliosPendientes.Any())
                {
                    pageDomicilio = new PagedList<Domicilio>(new List<Domicilio>(), pageNumber, pageSize);
                }
                else
                {
                    // Ajustar el paginado si es necesario
                    if (!pageDomicilio.Any() && pageDomicilio.PageNumber > 1)
                    {
                        pageDomicilio = await domiciliosPendientes.ToPagedListAsync(pageDomicilio.PageCount, pageSize);
                    }
                }

                int contador = (pageNumber - 1) * pageSize + 1; // Calcular el valor inicial del contador

                ViewBag.Contador = contador;

                // Código del método Index que querías integrar
                string mensaje = HttpContext.Session.GetString("Message");
                TempData["Message"] = mensaje;

                ViewData["Domicilios"] = domiciliosPendientes;

                // Obtener domicilios realizados y pasarlos a ViewData
                var domiciliosRealizados = domicilios.Where(d => d.EstadoDomicilio == "Realizado").ToList();
                ViewData["DomiciliosRealizados"] = domiciliosRealizados;

                return View(pageDomicilio);
            }
            catch (HttpRequestException ex) when ((int)ex.StatusCode == 404)
            {
                HttpContext.Session.SetString("Message", "No se encontró la página solicitada");
                return RedirectToAction("Index", "Home");
            }
            catch (Exception ex)
            {
                HttpContext.Session.SetString("Message", "Error en el aplicativo: " + ex.Message);
                return RedirectToAction("LogOut", "Accesos");
            }
        }




        public async Task<IActionResult> DomiciliosRealizados(int? page)
        {
            int pageSize = 5; // Tamaño de página
            int pageNumber = page ?? 1; // Número de página actual (por defecto es 1)

            try
            {
                // Obtener todos los domicilios con estado realizado
                var domicilios = await _client.GetDomicilioAsync();
                var domiciliosRealizados = domicilios.Where(d => d.EstadoDomicilio == "Realizado");

                if (!domiciliosRealizados.Any())
                {
                    return NotFound("No se encontraron domicilios realizados.");
                }

                var pageDomicilio = await domiciliosRealizados.ToPagedListAsync(pageNumber, pageSize);

                if (!pageDomicilio.Any() && pageDomicilio.PageNumber > 1)
                {
                    pageDomicilio = await domiciliosRealizados.ToPagedListAsync(pageDomicilio.PageCount, pageSize);
                }

                int contador = (pageNumber - 1) * pageSize + 1; // Calcular el valor inicial del contador

                ViewBag.Contador = contador;

                // Código del método Index que querías integrar
                string mensaje = HttpContext.Session.GetString("Message");
                TempData["Message"] = mensaje;

                ViewData["Domicilios"] = domiciliosRealizados;
                return View(pageDomicilio);
            }
            catch (HttpRequestException ex) when ((int)ex.StatusCode == 404)
            {
                HttpContext.Session.SetString("Message", "No se encontró la página solicitada");
                return RedirectToAction("Index", "Home");
            }
            catch (Exception ex)
            {
                HttpContext.Session.SetString("Message", "Error en el aplicativo: " + ex.Message);
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


        [HttpPost]
        public async Task<JsonResult> FindDomicilio(int domicilioId)
        {
            var domicilio = await _client.FindDomicilioAsync(domicilioId);
            return Json(domicilio);
        }

       

        public async Task<IActionResult>Detail(int id)
        {

            var detalles=await _client.FindDomicilioAsync(id);

             return View(detalles);



        }


      

        public async Task<IActionResult> Update([FromBody] Domicilio domicilio)
        {
            Console.WriteLine(domicilio);
            var update = new Domicilio
            {  DomicilioId=domicilio.DomicilioId,
                PedidoId = domicilio.PedidoId,
                UsuarioId=domicilio.UsuarioId,  
                EstadoDomicilio=domicilio.EstadoDomicilio,
                Observacion=domicilio.Observacion,
                FechaEntrega=domicilio.FechaEntrega,
                DireccionDomiciliario=domicilio.DireccionDomiciliario,

            };

            if (update == null)
            {

                TempData["SweetAlertIcon"] = "error";
                TempData["SweetAlertTitle"] = "Error";
                TempData["SweetAlertMessage"] = "¡No se Pudo Actualizar correctamente el Domicilio!";

                return RedirectToAction("Index", "Pedidos");

            }

            var response = await _client.UpdateDomicilioAsync(update);

            
           

            if (response.IsSuccessStatusCode)
            {
                return Json(new { success = true, message = "Domicilio actualizado correctamente." });
            }
            else
            {
                return Json(new { success = false, message = "No se pudo actualizar el domicilio." });
            }

        }


        public async Task<IActionResult> GetDomicilioById(int id)
        {
            try
            {
                var domicilio = await _client.FindDomicilioAsync(id);

                if (domicilio == null)
                {
                    return NotFound(); // Devolver un resultado NotFound si no se encuentra el domicilio
                }

                return Ok(domicilio); // Devolver el domicilio encontrado como resultado JSON
            }
            catch (Exception ex)
            {
                // Manejar errores y devolver un resultado BadRequest con un mensaje de error si es necesario
                return BadRequest(new { message = $"Error al obtener el domicilio: {ex.Message}" });
            }
        }


     

    }
}
