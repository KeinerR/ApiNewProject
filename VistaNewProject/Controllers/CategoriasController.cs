using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Services;
using X.PagedList;

namespace VistaNewProject.Controllers
{
    public class CategoriasController : Controller
    {

        private readonly IApiClient _client;
        public CategoriasController(IApiClient client)
        {
            _client = client;
        }
        public async Task<IActionResult> Index(int? page)
        {
            int pageSize = 5; // Número máximo de elementos por página
            int pageNumber = page ?? 1;

            var categorias = await _client.GetCategoriaAsync();

            if (categorias == null)
            {
                return NotFound("error");
            }

            var pagedCategorias = await categorias.ToPagedListAsync(pageNumber, pageSize);

            // Verifica si la página actual está vacía y redirige a la última página que contiene registros
            if (!pagedCategorias.Any() && pagedCategorias.PageNumber > 1)
            {
                pagedCategorias = await categorias.ToPagedListAsync(pagedCategorias.PageCount, pageSize);
            }

            return View(pagedCategorias);
        }
    }
}
