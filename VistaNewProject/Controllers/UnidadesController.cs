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

            return View(pagedUnidades);
        }
    }
}
