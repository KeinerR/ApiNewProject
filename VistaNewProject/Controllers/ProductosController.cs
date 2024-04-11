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

            if (productos == null)
            {
                return NotFound("error");
            }

            var pagedProductos = await productos.ToPagedListAsync(pageNumber, pageSize);

            // Verifica si la página actual está vacía y redirige a la última página que contiene registros
            if (!pagedProductos.Any() && pagedProductos.PageNumber > 1)
            {
                pagedProductos = await productos.ToPagedListAsync(pagedProductos.PageCount, pageSize);
            }

            return View(pagedProductos);
        }


    }
}
