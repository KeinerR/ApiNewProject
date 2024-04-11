using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Services;
using X.PagedList;

namespace VistaNewProject.Controllers
{
    public class ProveedoresController : Controller
    {
        private readonly IApiClient _client;
        public ProveedoresController(IApiClient client)
        {
            _client = client;
        }

        public async Task<IActionResult> Index(int? page)
        {
            int pageSize = 5; // Número máximo de elementos por página
            int pageNumber = page ?? 1;

            var proveedores = await _client.GetProveedorAsync();

            if (proveedores == null)
            {
                return NotFound("error");
            }

            var pagedProveedores = await proveedores.ToPagedListAsync(pageNumber, pageSize);

            // Verifica si la página actual está vacía y redirige a la última página que contiene registros
            if (!pagedProveedores.Any() && pagedProveedores.PageNumber > 1)
            {
                pagedProveedores = await proveedores.ToPagedListAsync(pagedProveedores.PageCount, pageSize);
            }

            return View(pagedProveedores);
        }

    }
}
