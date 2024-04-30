using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Models;
using VistaNewProject.Services;
using X.PagedList;


namespace VistaNewProject.Controllers
{
    public class ClientesController : Controller
    {


        private readonly IApiClient _client;


        public ClientesController(IApiClient client)
        {
            _client = client;
        }


        public async Task<IActionResult> Index(int? page)
        {
            int pageSize = 5; // Número máximo de elementos por página
            int pageNumber = page ?? 1;

            var clientes = await _client.GetClientesAsync();

            if (clientes == null)
            {
                return NotFound("error");
            }

            var pagedClientes = await clientes.ToPagedListAsync(pageNumber, pageSize);

            // Verifica si la página actual está vacía y redirige a la última página que contiene registros
            if (!pagedClientes.Any() && pagedClientes.PageNumber > 1)
            {
                pagedClientes = await clientes.ToPagedListAsync(pagedClientes.PageCount, pageSize);
            }

            return View(pagedClientes);
        }

    }
}








