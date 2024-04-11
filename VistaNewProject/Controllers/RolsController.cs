using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Services;
using X.PagedList;

namespace VistaNewProject.Controllers
{
    public class RolsController : Controller
    {
        private readonly IApiClient _client;


        public RolsController(IApiClient client)
        {
            _client = client;
        }


        public async Task<IActionResult> Index(int? page)
        {
            int pageSize = 5; // Número máximo de elementos por página
            int pageNumber = page ?? 1;

            var rols = await _client.GetRolAsync();

            if (rols == null)
            {
                return NotFound("error");
            }

            var pagedRols = await rols.ToPagedListAsync(pageNumber, pageSize);

            // Verifica si la página actual está vacía y redirige a la última página que contiene registros
            if (!pagedRols.Any() && pagedRols.PageNumber > 1)
            {
                pagedRols = await rols.ToPagedListAsync(pagedRols.PageCount, pageSize);
            }

            return View(pagedRols);
        }

    }
}
