using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Services;

namespace VistaNewProject.Controllers
{
    public class DomiciliosController : Controller
    {
        private readonly IApiClient _client;


        public DomiciliosController(IApiClient client)
        {
            _client = client;
        }


        public async Task<ActionResult> Index()
        {
            var domicilio = await _client.GetDomicilioAsync();

            if (domicilio == null)
            {
                return View("Error");
            }

            return View(domicilio);
        }
    }
}
