using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Services;
using X.PagedList;

namespace VistaNewProject.Controllers
{
    public class MovimientosController : Controller
    {
        private readonly IApiClient _client;
        public MovimientosController(IApiClient client)
        {
            _client = client;
        }

        public async Task<IActionResult> Index(int? page)
        {
            int pageSize = 5; // Cambiado a 5 para que la paginación se haga cada 5 registros
            int pageNumber = page ?? 1; // Número de página actual (si no se especifica, es 1)

            var movimientos = await _client.GetMovimientoAsync(); // Obtener todas las marcas

            if (movimientos == null)
            {
                return NotFound("error");
            }

            var pageMovimiento = await movimientos.ToPagedListAsync(pageNumber, pageSize);
            if (!pageMovimiento.Any() && pageMovimiento.PageNumber > 1)
            {
                pageMovimiento = await movimientos.ToPagedListAsync(pageMovimiento.PageCount, pageSize);
            }

            int contador = (pageNumber - 1) * pageSize + 1; // Calcular el valor inicial del contador

            ViewBag.Contador = contador;

            // Código del método Index que querías integrar
            string mensaje = HttpContext.Session.GetString("Message");
            TempData["Message"] = mensaje;

            try
            {
                ViewData["Movimientos"] = movimientos;
                return View(pageMovimiento);
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

    }
}