using Microsoft.AspNetCore.Mvc;
using System.Net;
using VistaNewProject.Models;
using VistaNewProject.Services;
using X.PagedList;

namespace VistaNewProject.Controllers
{
    public class UnidadesController : Controller
    {
        private readonly IApiClient _client;


        public UnidadesController(IApiClient client)
        {
            _client = client;
        }
        public async Task<IActionResult> Index(int? page, string order = "default")
        {
            int pageSize = 5;
            int pageNumber = page ?? 1;

            var unidades = await _client.GetUnidadAsync(); // Obtener todas las unidades

            unidades = unidades.Reverse().ToList();
            unidades = unidades.OrderByDescending(c => c.EstadoUnidad == 1).ToList();
            order = order?.ToLower() ?? "default";

            switch (order)
            {
                case "first":
                    unidades = unidades.Reverse(); // Se invierte el orden de las unidades
                    unidades = unidades
                   .OrderByDescending(p => p.EstadoUnidad == 1)
                   .ToList();
                    break;
                case "reverse":
                    break;
                case "alfabetico":
                    unidades = unidades.OrderBy(p => p.NombreUnidad).ToList(); // Se ordenan alfabéticamente por el nombre de la presentación
                    unidades = unidades
                    .OrderByDescending(p => p.EstadoUnidad == 1)
                    .ToList();
                    break;
                case "name_desc":
                    unidades = unidades.OrderByDescending(p => p.EstadoUnidad).ToList(); // Se ordenan alfabéticamente descendente por el nombre de la presentación
                    unidades = unidades
                    .OrderByDescending(p => p.EstadoUnidad == 1)
                    .ToList();
                    break;
                default:
                    break;
            }

            if (unidades == null)
            {
                return NotFound("error");
            }

            var pageUnidad = await unidades.ToPagedListAsync(pageNumber, pageSize);

            if (!pageUnidad.Any() && pageUnidad.PageNumber > 1)
            {
                pageUnidad = await unidades.ToPagedListAsync(pageUnidad.PageCount, pageSize);
            }

            int contador = (pageNumber - 1) * pageSize + 1; // Calcular el valor inicial del contador

            ViewBag.Contador = contador;
            ViewBag.Order = order; // Pasar el criterio de orden a la vistav
            ViewData["Unidades"] = unidades;
            return View(pageUnidad);

        }

        [HttpPost]
        public async Task<JsonResult> FindUnidad(int unidadId)
        {
            var unidad = await _client.FindUnidadAsync(unidadId);
            return Json(unidad);
        }

        [HttpPost]
        public async Task<JsonResult> FindUnidades()
        {
            var unidades = await _client.GetUnidadAsync();
            return Json(unidades);
        }
        public async Task<IActionResult> Details(int? id, int? page)
        {
            if (id == null)
            {
                return NotFound();
            }

            var unidades = await _client.GetUnidadAsync();
            var unidad = unidades.FirstOrDefault(u => u.UnidadId == id);
            if (unidad == null)
            {
                return NotFound();
            }

            ViewBag.Unidad = unidad;

            var productos = await _client.GetProductoAsync();
            var productosDeMarca = productos.Where(p => p.MarcaId == id);

            int pageSize = 1; // Número máximo de elementos por página
            int pageNumber = page ?? 1;

            var pagedProductos = productosDeMarca.ToPagedList(pageNumber, pageSize);

            return View(pagedProductos);
        }

        public async Task<IActionResult> Create([FromForm] Unidad unidad)
        {
            if (ModelState.IsValid)
            {
                var unidades = await _client.GetUnidadAsync();
                var unidadExistente = unidades.FirstOrDefault(c => string.Equals(c.NombreUnidad, unidad.NombreUnidad, StringComparison.OrdinalIgnoreCase));

                // Si ya existe una unidad con el mismo nombre, mostrar un mensaje de error
                if (unidadExistente != null)
                {
                    MensajeSweetAlert("error", "Error", "Ya hay una unidad registrada con ese nombre.", "true", null);
                    return RedirectToAction("Index");
                }

                var response = await _client.CreateUnidadAsync(unidad);

                if (response.IsSuccessStatusCode)
                {
                    MensajeSweetAlert("success", "Éxito", "¡Unidad registrada correctamente!", "false", null);
                    return RedirectToAction("Index");
                }
                else
                {
                    MensajeSweetAlert("error", "Error", "¡Problemas al registrar la unidad!", "true", null);
                    return RedirectToAction("Index");
                }
            }
            else
            {
                // Devolver los errores de validación al cliente
                foreach (var modelState in ModelState.Values)
                {
                    foreach (var error in modelState.Errors)
                    {
                        MensajeSweetAlert("error", "Error de validación", error.ErrorMessage, "true", null);
                    }
                }
                return RedirectToAction("Index");
            }
        }
        public async Task<IActionResult> Update([FromForm] UnidadUpdate unidad)
        {
            if (ModelState.IsValid)
            {
                var unidades = await _client.GetUnidadAsync();
                List<int> unidadesIgualesIds = new List<int>();

                foreach (var unidadC in unidades)
                {
                    if (unidadC.UnidadId != unidad.UnidadId &&
                        string.Equals(unidadC.NombreUnidad, unidad.NombreUnidad, StringComparison.OrdinalIgnoreCase))
                    {
                        unidadesIgualesIds.Add(unidadC.UnidadId);
                    }
                }

                if (unidadesIgualesIds.Count > 0)
                {
                    string unidadesIdsStr = string.Join(", ", unidadesIgualesIds);
                    MensajeSweetAlert("error", "Error", $"Ya hay una unidad registrada con ese nombre. Unidad ID: {unidadesIdsStr}", "true", null);
                    return RedirectToAction("Index");
                }

                var response = await _client.UpdateUnidadAsync(unidad);

                if (response != null)
                {
                    if (response.IsSuccessStatusCode)
                    {
                        MensajeSweetAlert("success", "Éxito", "Unidad actualizada correctamente.", "false", null);
                        return RedirectToAction("Index");
                    }
                    else if (response.StatusCode == HttpStatusCode.NotFound)
                    {
                        MensajeSweetAlert("error", "Error", "La unidad no se encontró en el servidor.", "true", null);
                        return RedirectToAction("Index");
                    }
                    else if (response.StatusCode == HttpStatusCode.BadRequest)
                    {
                        MensajeSweetAlert("error", "Error", "Nombre de unidad duplicado.", "true", null);
                        return RedirectToAction("Index");
                    }
                    else
                    {
                        MensajeSweetAlert("error", "Error", "Error al actualizar la unidad.", "true", null);
                        return RedirectToAction("Index");
                    }
                }
                else
                {

                    MensajeSweetAlert("error", "Error", "Error al realizar la solicitud de actualización.", "true", null);
                    return RedirectToAction("Index");
                }
            }
            else
            {
                // Devolver los errores de validación al cliente
                foreach (var modelState in ModelState.Values)
                {
                    foreach (var error in modelState.Errors)
                    {
                        MensajeSweetAlert("error", "Error de validación", error.ErrorMessage, "true", null);
                    }
                }
                return RedirectToAction("Index");
            }
        }
        public async Task<IActionResult> Delete(int unidadId)
        {
            
            var response = await _client.DeleteUnidadAsync(unidadId);
            if (response.IsSuccessStatusCode)
            {
                MensajeSweetAlert("success", "Éxito", "Unidad eliminada correctamente.", "true", 3000);

            }
            else if (response.StatusCode == HttpStatusCode.NotFound)
            {
                MensajeSweetAlert("error", "Error", "La Unidad no se encontró en el servidor.", "true", null);

            }
            else
            {
                MensajeSweetAlert("error", "Error", "Error desconocido al eliminar la Unidad.", "true", null);

            }
            return RedirectToAction("Index");
        }

        [HttpPatch("Unidads/UpdateEstadoUnidad/{id}")]
        public async Task<IActionResult> CambiarEstadoUnidad(int id)
        {
            // Llama al método del servicio para cambiar el estado del usuario
            var response = await _client.CambiarEstadoUnidadAsync(id);

            // Devuelve una respuesta adecuada en función de la respuesta del servicio
            if (response.IsSuccessStatusCode)
            {
                return Ok();
            }
            else
            {
                return StatusCode((int)response.StatusCode, await response.Content.ReadAsStringAsync());
            }
        }
        private void MensajeSweetAlert(string icon, string title, string message, string estado, int? tiempo)
        {
            TempData["SweetAlertIcon"] = icon;
            TempData["SweetAlertTitle"] = title;
            TempData["SweetAlertMessage"] = message;
            TempData["EstadoAlerta"] = estado;
            TempData["Tiempo"] = tiempo.HasValue ? tiempo.Value : 3000;
            TempData["EstadoAlerta"] = "false";

        }
    }
}
