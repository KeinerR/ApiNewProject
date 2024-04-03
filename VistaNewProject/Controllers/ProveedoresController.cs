using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Services;

namespace VistaNewProject.Controllers
{
    public class ProveedoresController : Controller
    {
        private readonly IApiClient _client;
        public ProveedoresController(IApiClient client)
        {
            _client = client;
        }

        public async Task<ActionResult> Index()
        {
            var cliente = await _client.GetProveedorAsync();

            if (cliente == null)
            {
                return View("Error");
            }

            return View(cliente);
        }









    }
}
