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
                    unidades = unidades.OrderByDescending(c => c.EstadoUnidad == 1).ToList();
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

            // Concatenar nombre de unidad con cantidad
            foreach (var unidad in unidades)
            {
                unidad.NombreUnidad = $"{unidad.NombreUnidad} x {unidad.CantidadPorUnidad}";
            }

            var pageUnidad = await unidades.ToPagedListAsync(pageNumber, pageSize);

            if (!pageUnidad.Any() && pageUnidad.PageNumber > 1)
            {
                pageUnidad = await unidades.ToPagedListAsync(pageUnidad.PageCount, pageSize);
            }

            int contador = (pageNumber - 1) * pageSize + 1; // Calcular el valor inicial del contador

            ViewBag.Contador = contador;
            ViewBag.Order = order; // Pasar el criterio de orden a la vista
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

            var unidadExiste = unidades.FirstOrDefault(p => p.UnidadId == id);
            if (unidadExiste == null)
            {
                return NotFound();
            }
            var unidad = await _client.FindUnidadAsync(id.Value); // Obtener la unidad directamente como int

            var categorias = await _client.GetCategoriaAsync();
            var categoriasxunidades = await _client.GetCategoriaxUnidadesAsync();

            // Filtrar categorías asociadas a la unidad específica
            var categoriasAsociadasIds = categoriasxunidades
                .Where(cu => cu.UnidadId == id.Value) // Utilizar id.Value directamente
                .Select(cu => cu.CategoriaId)
                .ToList();

            var categoriasAsociadas = categorias.Where(c => categoriasAsociadasIds.Contains(c.CategoriaId)).ToList();
            // Concatenar el nombre de la unidad con su cantidad si está disponible

            ViewBag.Unidad = unidad;
            if (!categoriasAsociadas.Any())
            {
                return View(categoriasAsociadas.ToPagedList(1, 1)); // Devuelve un modelo paginado vacío
            }

            int pageSize = 4; // Número máximo de elementos por página
            int pageNumber = page ?? 1;

            var pagedCategorias = categoriasAsociadas.ToPagedList(pageNumber, pageSize);

            return View(pagedCategorias);
        }

        public async Task<IActionResult> UnidadxCategoriasAsociadas(int? id, int? page, string order = "default")
        {
            if (id == null)
            {
                return BadRequest();
            }
            var unidades = await _client.GetUnidadAsync();

            var unidadExiste = unidades.FirstOrDefault(p => p.UnidadId == id);
            if (unidadExiste == null)
            {
                return NotFound();
            }
            var unidad = await _client.FindUnidadAsync(id.Value);
            if (unidad == null)
            {
                return NotFound();
            }

            var categorias = await _client.GetCategoriaAsync();
            var categoriasxunidades = await _client.GetCategoriaxUnidadesAsync();

            var categoriasAsociadasIds = categoriasxunidades
                .Where(cu => cu.UnidadId == id.Value)
                .Select(cu => cu.CategoriaId)
                .ToList();

            var categoriasAsociadas = categorias
                .Select(c => new CategoriaxUnidad
                {
                    CategoriaId = c.CategoriaId,
                    NombreCategoria = c.NombreCategoria,
                    UnidadId = id.Value,
                    EstaAsociada = categoriasAsociadasIds.Contains(c.CategoriaId)
                })
                .ToList();

            order = order?.ToLower() ?? "default";

            switch (order)
            {
                case "alfabetico":
                    categoriasAsociadas = categoriasAsociadas.OrderBy(c => c.NombreCategoria).ToList();
                    break;
                case "name_desc":
                    categoriasAsociadas = categoriasAsociadas.OrderByDescending(c => c.NombreCategoria).ToList();
                    break;
                case "first":
                    categoriasAsociadas = categoriasAsociadas.OrderBy(c => c.CategoriaId).ToList(); // assuming CategoriaId represents the order of creation
                    break;
                case "reverse":
                    categoriasAsociadas = categoriasAsociadas.OrderByDescending(c => c.CategoriaId).ToList(); // assuming CategoriaId represents the order of creation
                    break;
                default:
                    break;
            }

            int pageNumber = page ?? 1;
            int pageSize = 6;
            var pagedCategorias = categoriasAsociadas.ToPagedList(pageNumber, pageSize);

            ViewBag.Unidad = unidad;
            ViewBag.CurrentOrder = order;

            return View(pagedCategorias);
        }



        public async Task<IActionResult> Create([FromForm] Unidad unidad)
        {
            if (ModelState.IsValid)
            {
                var unidades = await _client.GetUnidadAsync();
                var unidadExistente = unidades.FirstOrDefault(c => string.Equals(c.NombreUnidad, unidad.NombreUnidad, StringComparison.OrdinalIgnoreCase) && c.CantidadPorUnidad == unidad.CantidadPorUnidad);

                // Si ya existe una unidad con el mismo nombre, mostrar un mensaje de error
                if (unidadExistente != null)
                {
                    MensajeSweetAlert("error", "Error", $"Ya hay una unidad registrada con esos datos ID {unidadExistente.UnidadId}.", "true", null);
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
                        string.Equals(unidadC.NombreUnidad, unidad.NombreUnidad, StringComparison.OrdinalIgnoreCase) && unidadC.UnidadId != unidad.UnidadId && unidadC.CantidadPorUnidad == unidad.CantidadPorUnidad)
                    {
                        unidadesIgualesIds.Add(unidadC.UnidadId);
                    }
                }

                if (unidadesIgualesIds.Count > 0)
                {
                    string unidadesIdsStr = string.Join(", ", unidadesIgualesIds);
                    MensajeSweetAlert("error", "Error", $"Ya hay una unidad registrada con esos datos. Unidad ID: {unidadesIdsStr}", "true", null);
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

        [HttpPatch("Unidades/UpdateEstadoUnidad/{id}")]
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
