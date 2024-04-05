using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Services;

namespace VistaNewProject.Controllers
{
    public class PresentacionesController : Controller
    {
        private readonly IApiClient _client;


        public PresentacionesController(IApiClient client)
        {
            _client = client;
        }


        public async Task<ActionResult> Index()
        {
            var presentacion = await _client.GetPresentacionAsync();

            if (presentacion == null)
            {
                return View("Error");
            }

            return View(presentacion);
        }
    }
    
}
