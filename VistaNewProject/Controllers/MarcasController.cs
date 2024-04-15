using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Models;
using VistaNewProject.Services;
using X.PagedList;
using Microsoft.AspNetCore.Http;

namespace VistaNewProject.Controllers
{
    public class MarcasController : Controller
    {
        private readonly IApiClient _client;


        public MarcasController(IApiClient client)
        {
            _client = client;
        }

        public async Task<IActionResult> Index(int? page)
        {
            int pageSize = 5; // Número máximo de elementos por página
            int pageNumber = page ?? 1;

            var marcas = await _client.GetMarcaAsync();

            if (marcas == null)
            {
                return NotFound("error");
            }

            var pagedMarcas = await marcas.ToPagedListAsync(pageNumber, pageSize);

            // Verifica si la página actual está vacía y redirige a la última página que contiene registros
            if (!pagedMarcas.Any() && pagedMarcas.PageNumber > 1)
            {
                pagedMarcas = await marcas.ToPagedListAsync(pagedMarcas.PageCount, pageSize);
            }
            // Inicializar el contador en 1 si es la primera página
            int contador = 1;
            if (page.HasValue && page > 1)
            {
                // Obtener el valor actual del contador de la sesión si estamos en una página diferente a la primera
                contador = HttpContext.Session.GetInt32("Contador") ?? 1;
            }

            // Establecer el valor del contador en la sesión para su uso en la siguiente página
            HttpContext.Session.SetInt32("Contador", contador + pagedMarcas.Count);

            ViewBag.Contador = contador;
            return View(pagedMarcas);
        }



        public async Task<IActionResult> Details(int? id, int? page)
        {
            if (id == null)
            {
                return NotFound();
            }

            var marcas = await _client.GetMarcaAsync();
            var marca = marcas.FirstOrDefault(u => u.MarcaId == id);
            if (marca == null)
            {
                return NotFound();
            }

            ViewBag.Marca = marca;

            var productos = await _client.GetProductoAsync();
            var productosDeMarca = productos.Where(p => p.MarcaId == id);

            int pageSize = 1; // Número máximo de elementos por página
            int pageNumber = page ?? 1;

            var pagedProductos = productosDeMarca.ToPagedList(pageNumber, pageSize);

            return View(pagedProductos);
        }

    }


}
