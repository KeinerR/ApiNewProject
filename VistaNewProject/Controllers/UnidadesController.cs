using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Services;
using X.PagedList;

namespace VistaNewProject.Controllers
{
    public class UnidadesController : Controller
    {
        private readonly IApiClient _client;


        public UnidadesController(IApiClient client)
        {
            _client = client;
        }
        public async Task<IActionResult> Index(int? page)
        {
            int pageSize = 5; // Número máximo de elementos por página
            int pageNumber = page ?? 1;

            var unidades = await _client.GetUnidadAsync();

            if (unidades == null)
            {
                return NotFound("error");
            }

            var pagedUnidades = await unidades.ToPagedListAsync(pageNumber, pageSize);

            // Verifica si la página actual está vacía y redirige a la última página que contiene registros
            if (!pagedUnidades.Any() && pagedUnidades.PageNumber > 1)
            {
                pagedUnidades = await unidades.ToPagedListAsync(pagedUnidades.PageCount, pageSize);
            }
            int contador = 1;
            if (page.HasValue && page > 1)
            {
                // Obtener el valor actual del contador de la sesión si estamos en una página diferente a la primera
                contador = HttpContext.Session.GetInt32("Contador") ?? 1;
            }

            // Establecer el valor del contador en la sesión para su uso en la siguiente página
            HttpContext.Session.SetInt32("Contador", contador + pagedUnidades.Count);

            ViewBag.Contador = contador;

            return View(pagedUnidades);
        }


        public async Task<IActionResult> Details(int? id, int? page)
        {
            if (id == null)
            {
                return NotFound();
            }

            var unidades = await _client.GetUnidadAsync();
            var unidad = unidades.FirstOrDefault(u => u.UnidadId == id);
            if (unidad == null)
            {
                return NotFound();
            }

            ViewBag.Unidad = unidad;

            var productos = await _client.GetProductoAsync();
            var productosDeMarca = productos.Where(p => p.MarcaId == id);

            int pageSize = 1; // Número máximo de elementos por página
            int pageNumber = page ?? 1;

            var pagedProductos = productosDeMarca.ToPagedList(pageNumber, pageSize);

            return View(pagedProductos);
        }

    }
}
