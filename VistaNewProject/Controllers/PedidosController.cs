using Microsoft.AspNetCore.Mvc;

namespace VistaNewProject.Controllers
{
    public class PedidosController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
