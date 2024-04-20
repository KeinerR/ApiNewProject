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
            ViewBag.Mensaje = TempData["Mensaje"];
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] string nombreMarca)
        {
            if (ModelState.IsValid)
            {
                var marcaexist = await _client.FindnombreMarcasAsync(nombreMarca);
                if (marcaexist != null)
                {
                    TempData["SweetAlertIcon"] = "error";
                    TempData["SweetAlertTitle"] = "Error";
                    TempData["SweetAlertMessage"] = "Ya hay una marca registrada con ese nombre.";
                    return RedirectToAction("Index");
                }

                // Resto del código para crear la nueva marca
                var marca = new Marca
                {
                    NombreMarca = nombreMarca
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
                    ViewBag.MensajeError = "No se pudieron guardar los datos.";
                    return View("Index");
                }
            }
            return View("Index");
        }


        public async Task<IActionResult> Delete(int id)
        {
            var marca = await _client.DeleteClienteAsync(id);
            if (marca == null)
            {
                TempData["SweetAlertIcon"] = "error";
                TempData["SweetAlertTitle"] = "Error";
                TempData["SweetAlertMessage"] = "Error al eliminar la marca.";
            }
            else
            {
                TempData["SweetAlertIcon"] = "success";
                TempData["SweetAlertTitle"] = "Éxito";
                TempData["SweetAlertMessage"] = "Marca eliminada correctamente.";
            }
            return RedirectToAction("Index");
        }




    }


}
