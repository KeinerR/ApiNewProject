using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Services;
using X.PagedList;

namespace VistaNewProject.Controllers
{
    public class PresentacionesController : Controller
    {
        private readonly IApiClient _client;


        public PresentacionesController(IApiClient client)
        {
            _client = client;
        }

        public async Task<IActionResult> Index(int? page)
        {
            int pageSize = 5; // Número máximo de elementos por página
            int pageNumber = page ?? 1;

            var presentaciones = await _client.GetPresentacionAsync();

            if (presentaciones == null)
            {
                return NotFound("error");
            }

            var pagedPresentaciones = await presentaciones.ToPagedListAsync(pageNumber, pageSize);

            // Verifica si la página actual está vacía y redirige a la última página que contiene registros
            if (!pagedPresentaciones.Any() && pagedPresentaciones.PageNumber > 1)
            {
                pagedPresentaciones = await presentaciones.ToPagedListAsync(pagedPresentaciones.PageCount, pageSize);
            }
            int contador = 1;
            if (page.HasValue && page > 1)
            {
                // Obtener el valor actual del contador de la sesión si estamos en una página diferente a la primera
                contador = HttpContext.Session.GetInt32("Contador") ?? 1;
            }

            // Establecer el valor del contador en la sesión para su uso en la siguiente página
            HttpContext.Session.SetInt32("Contador", contador + pagedPresentaciones.Count);

            ViewBag.Contador = contador;
            return View(pagedPresentaciones);
        }
        public async Task<IActionResult> Details(int? id, int? page)
        {
            if (id == null)
            {
                return NotFound();
            }

            var presentaciones = await _client.GetPresentacionAsync();
            var presentacion = presentaciones.FirstOrDefault(u => u.PresentacionId == id);
            if (presentacion == null)
            {
                return NotFound();
            }

            ViewBag.Presentacion = presentacion;

            var productos = await _client.GetProductoAsync();
            var productosDeMarca = productos.Where(p => p.MarcaId == id);

            int pageSize = 1; // Número máximo de elementos por página
            int pageNumber = page ?? 1;

            var pagedProductos = productosDeMarca.ToPagedList(pageNumber, pageSize);

            return View(pagedProductos);
        }
    }

}
