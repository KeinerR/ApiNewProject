using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Models;
using VistaNewProject.Services;
using X.PagedList;

namespace VistaNewProject.Controllers
{
    public class CategoriasController : Controller
    {

        private readonly IApiClient _client;
        public CategoriasController(IApiClient client)
        {
            _client = client;
        }
        public async Task<IActionResult> Index(int? page)
        {
            int pageSize = 5; // Número máximo de elementos por página
            int pageNumber = page ?? 1;

            var categorias = await _client.GetCategoriaAsync();

            if (categorias == null)
            {
                return NotFound("error");
            }

            var pagedCategorias = await categorias.ToPagedListAsync(pageNumber, pageSize);

            // Verifica si la página actual está vacía y redirige a la última página que contiene registros
            if (!pagedCategorias.Any() && pagedCategorias.PageNumber > 1)
            {
                pagedCategorias = await categorias.ToPagedListAsync(pagedCategorias.PageCount, pageSize);
            }
            // Inicializar el contador en 1 si es la primera página
            int contador = 1;
            if (page.HasValue && page > 1)
            {
                // Obtener el valor actual del contador de la sesión si estamos en una página diferente a la primera
                contador = HttpContext.Session.GetInt32("Contador") ?? 1;
            }

            // Establecer el valor del contador en la sesión para su uso en la siguiente página
            HttpContext.Session.SetInt32("Contador", contador + pagedCategorias.Count);

            ViewBag.Contador = contador;
            return View(pagedCategorias);
        }
        public async Task<IActionResult> Details(int? id, int? page)
        {
            if (id == null)
            {
                return NotFound();
            }

            var categorias = await _client.GetCategoriaAsync();
            var categoria = categorias.FirstOrDefault(u => u.CategoriaId == id);
            if (categoria == null)
            {
                return NotFound();
            }

            ViewBag.Categoria = categoria;

            var productos = await _client.GetProductoAsync();
            var productosDeCategoria = productos.Where(p => p.CategoriaId == id);

            int pageSize = 1; // Número máximo de elementos por página
            int pageNumber = page ?? 1;

            var pagedProductos = productosDeCategoria.ToPagedList(pageNumber, pageSize);

            return View(pagedProductos);
        }

        [HttpPost]

        public async Task<IActionResult> Create([FromForm] string nombreCategoria)
        {
            if (ModelState.IsValid)
            {
                var marcaexist = await _client.FindnombreCategoriaAsync(nombreCategoria);
                if (marcaexist != null)
                {
                    TempData["SweetAlertIcon"] = "error";
                    TempData["SweetAlertTitle"] = "Error";
                    TempData["SweetAlertMessage"] = "Ya hay una categoria registrada con ese nombre.";
                    return RedirectToAction("Index");
                }

                // Resto del código para crear la nueva marca
                var categoria = new Categoria
                {
                    NombreCategoria = nombreCategoria
                };

                var response = await _client.CreateCategoriaAsync(categoria);

                if (response.IsSuccessStatusCode)
                {
                   
                    return RedirectToAction("Index");
                }
                else
                {
                    ViewBag.MensajeError = "No se pudieron guardar los datos.";
                    return View("Index");
                }
            }


            ViewBag.Mensaje = TempData["Mensaje"]; ViewBag.Mensaje = TempData["Mensaje"];
            return View("Index");
        }
    }
}
