using Microsoft.AspNetCore.Mvc;
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

            var usuario= await _client.GetUsuarioAsync();


            ViewBag.Usuarios = usuario;
            return View();  
        }
    }
}
