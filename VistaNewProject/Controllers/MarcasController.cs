using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Models;
using VistaNewProject.Services;
using X.PagedList;
using Microsoft.AspNetCore.Http;

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
            int pageSize = 5; // Cambiado a 5 para que la paginación se haga cada 5 registros
            int pageNumber = page ?? 1; // Número de página actual (si no se especifica, es 1)

            var marcas = await _client.GetMarcaAsync(); // Obtener todas las marcas

            if (marcas == null)
            {
                return NotFound("error");
            }

            var pageMarca = await marcas.ToPagedListAsync(pageNumber, pageSize);
            if (!pageMarca.Any() && pageMarca.PageNumber > 1)
            {
                pageMarca = await marcas.ToPagedListAsync(pageMarca.PageCount, pageSize);
            }

            int contador = (pageNumber - 1) * pageSize + 1; // Calcular el valor inicial del contador

            ViewBag.Contador = contador;

            return View(pageMarca); // Pasar la lista de marcas paginada a la vista
           
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] string nombreMarca, [FromForm] ulong EstadoMarca)
        {
            if (ModelState.IsValid)
            {
                var marca = new Marca
                {
                    NombreMarca = nombreMarca,
                    EstadoMarca = EstadoMarca
                };

                var response = await _client.CreateMarcaAsync(marca);
                if (response.IsSuccessStatusCode)
                {
                    // Guardar un mensaje en TempData para mostrar en el Index
                    TempData["Mensaje"] = "¡Registro guardado correctamente!";
                    return RedirectToAction("Index");
                }
                else
                {
                    // La solicitud POST falló, maneja el error según sea necesario
                    ModelState.AddModelError(string.Empty, "No se pudieron guardar los datos.");
                    return View("Index");
                }
            }


            ViewBag.Mensaje = TempData["Mensaje"]; ViewBag.Mensaje = TempData["Mensaje"];
            return View("Index");
        }



    }


}
