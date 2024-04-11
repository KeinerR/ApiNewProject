using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Services;
using X.PagedList;

namespace VistaNewProject.Controllers
{
    public class DomiciliosController : Controller
    {
        private readonly IApiClient _client;


        public DomiciliosController(IApiClient client)
        {
            _client = client;
        }


        public async Task<IActionResult> Index(int? page)
        {
            int pageSize = 5; // Número máximo de elementos por página
            int pageNumber = page ?? 1;

            var domicilios = await _client.GetDomicilioAsync();

            if (domicilios == null)
            {
                return NotFound("error");
            }

            var pagedDomicilios = await domicilios.ToPagedListAsync(pageNumber, pageSize);

            // Verifica si la página actual está vacía y redirige a la última página que contiene registros
            if (!pagedDomicilios.Any() && pagedDomicilios.PageNumber > 1)
            {
                pagedDomicilios = await domicilios.ToPagedListAsync(pagedDomicilios.PageCount, pageSize);
            }

            return View(pagedDomicilios);
        }
    }
}
