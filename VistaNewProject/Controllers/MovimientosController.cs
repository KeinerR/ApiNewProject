using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Services;

namespace VistaNewProject.Controllers
{
    public class MovimientosController : Controller
    {
        private readonly IApiClient _client;
         public MovimientosController(IApiClient client)
         {
            _client = client;
         }
        public async Task<IActionResult> Index()
        {
            var movimientos = await _client.GetMovimientoAsync();

            if (movimientos == null)
            {
                return NotFound("error");
            }
            return View(movimientos);
        }






    } 
    
}
