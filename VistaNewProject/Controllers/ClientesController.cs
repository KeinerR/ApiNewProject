using Microsoft.AspNetCore.Mvc;

namespace VistaNewProject.Controllers
{
    public class ClientesController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
