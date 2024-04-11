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

            return View(pagedPresentaciones);
        }
    }

}
