using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Services;

namespace VistaNewProject.Controllers
{
    public class LotesController : Controller
    {
        private readonly IApiClient _client;


        public LotesController(IApiClient client)
        {
            _client = client;
        }

        public async Task<ActionResult> Index()
        {
            var domicilio = await _client.GetLoteAsync();

            if (domicilio == null)
            {
                return View("Error");
            }

            return View(domicilio);
        }
    }
}
