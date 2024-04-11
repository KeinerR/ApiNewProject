using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Services;
using X.PagedList;

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

            return View(pagedMarcas);
        }
    }
}