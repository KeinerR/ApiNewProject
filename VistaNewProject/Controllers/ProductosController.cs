using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Services;
using X.PagedList;

namespace VistaNewProject.Controllers
{
    public class ProductosController : Controller
    {

        private readonly IApiClient _client;
        public ProductosController(IApiClient client)
        {
            _client = client;
        }

        public async Task<IActionResult> Index(int? page)
        {
            int pageSize = 5; // Número máximo de elementos por página
            int pageNumber = page ?? 1;

            var productos = await _client.GetProductoAsync();

            var presentacion = await _client.GetPresentacionAsync();
            var marca = await _client.GetMarcaAsync();
            var unidad = await _client.GetUnidadAsync();
            var categoria = await _client.GetCategoriaAsync();

            if (productos == null)
            {
                return NotFound("error");
            }

            var pageProducto = await productos.ToPagedListAsync(pageNumber, pageSize);
            if (!pageProducto.Any() && pageProducto.PageNumber > 1)
            {
                pageProducto = await productos.ToPagedListAsync(pageProducto.PageCount, pageSize);
            }

            int contador = (pageNumber - 1) * pageSize + 1; // Calcular el valor inicial del contador



            ViewBag.Presentaciones = presentacion;
            ViewBag.Categorias = categoria;
            ViewBag.Unidades = unidad;
            ViewBag.Marcas = marca;

            // Código del método Index que querías integrar
            string mensaje = HttpContext.Session.GetString("Message");
            TempData["Message"] = mensaje;

            try
            {
                ViewData["Productos"] = productos;
                return View(pageProducto);
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