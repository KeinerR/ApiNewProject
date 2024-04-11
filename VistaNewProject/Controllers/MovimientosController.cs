using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Services;
using X.PagedList;

namespace VistaNewProject.Controllers
{
    public class MovimientosController : Controller
    {
        private readonly IApiClient _client;
         public MovimientosController(IApiClient client)
         {
            _client = client;
         }
        public async Task<IActionResult> Index(int? page)
        {
            int pageSize = 5; // Número máximo de elementos por página
            int pageNumber = page ?? 1;

            var movimientos = await _client.GetMovimientoAsync();

            if (movimientos == null)
            {
                return NotFound("error");
            }

            var pagedMovimientos = await movimientos.ToPagedListAsync(pageNumber, pageSize);

            // Verifica si la página actual está vacía y redirige a la última página que contiene registros
            if (!pagedMovimientos.Any() && pagedMovimientos.PageNumber > 1)
            {
                pagedMovimientos = await movimientos.ToPagedListAsync(pagedMovimientos.PageCount, pageSize);
            }

            return View(pagedMovimientos);
        }






    } 
    
}
