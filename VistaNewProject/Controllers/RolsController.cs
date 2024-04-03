using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Services;

namespace VistaNewProject.Controllers
{
    public class RolsController : Controller
    {
        private readonly IApiClient _client;


        public RolsController(IApiClient client)
        {
            _client = client;
        }


        public async Task<ActionResult> Index()
        {
            var rol = await _client.GetRolAsync();

            if (rol == null)
            {
                return View("Error");
            }

            return View(rol);
        }
        
    }
}
