using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Services;
using VistaNewProject.Models;
using X.PagedList;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace VistaNewProject.Controllers
{
    public class MarcasController : Controller
    {
        private readonly IApiClient _client;


        public MarcasController(IApiClient client)
        {
            _client = client;
        }

        public async Task<IActionResult> Index(int? page)
        {
            int pageSize = 5; // Número máximo de elementos por página
            int pageNumber = page ?? 1;

            var marcas = await _client.GetMarcaAsync();

            if (marcas == null)
            {
                return NotFound("error");
            }

            var pagedMarcas = await marcas.ToPagedListAsync(pageNumber, pageSize);

            // Verifica si la página actual está vacía y redirige a la última página que contiene registros
            if (!pagedMarcas.Any() && pagedMarcas.PageNumber > 1)
            {
                pagedMarcas = await marcas.ToPagedListAsync(pagedMarcas.PageCount, pageSize);
            }

            return View(pagedMarcas);
        }


     
        public async Task<IActionResult> Details(int? id, int? page)
        {
            var marcas = await _client.GetMarcaAsync();
            var products = await _client.GetProductoAsync();
            
           
            if (id == null)
            {
                return NotFound();
            }

            var marca = marcas.FirstOrDefault(u => u.MarcaId == id);

            if (marca == null)
            {
                return NotFound();
            }

            int pageSize = 1; // Número máximo de elementos por página
            int pageNumber = page ?? 1;

            var productos = products.Where(p => p.MarcaId == id.Value).ToList();
            var pagedProductos = await productos.ToPagedListAsync(pageNumber, pageSize);

            ViewBag.Marca = marca; // Pasar la marca a la vista para la paginación

            return View(pagedProductos);
        }


    }
}