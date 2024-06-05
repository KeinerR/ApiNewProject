using Microsoft.AspNetCore.Mvc;
using System.Net;
using VistaNewProject.Models;
using VistaNewProject.Services;
using X.PagedList;

namespace VistaNewProject.Controllers
{
    public class PresentacionesController : Controller
    {
        private readonly IApiClient _client;


        public PresentacionesController(IApiClient client)
        {
            _client = client;
        }

        public async Task<IActionResult> Index(int? page, string order = "default")
        {
            int pageSize = 5;
            int pageNumber = page ?? 1;

            var presentaciones = await _client.GetPresentacionAsync(); // Obtener todas las marcas
            presentaciones = presentaciones.Reverse().ToList();                                    // Ordenar por estado primero (activas primero, inactivas al final)
            presentaciones = presentaciones
                .OrderByDescending(p => p.EstadoPresentacion == 1)
                .ToList(); 
            // Modificación en la ordenación de las presentaciones
           
            foreach (var presentacion in presentaciones)
            {
                var nombrePresentacion = presentacion.NombrePresentacion;
                var contenido = presentacion.Contenido;
                var cantidad = presentacion.CantidadPorPresentacion ?? 1;

                presentacion.NombreCompleto = cantidad > 1 ?
                    $"{nombrePresentacion} x {cantidad} unidades de {contenido}" :
                    $"{nombrePresentacion} de {contenido}";
            }

            order = order?.ToLower() ?? "default";
            switch (order)
            {
                case "first":
                    presentaciones = presentaciones.Reverse(); // Se invierte el orden de las presentaciones
                    presentaciones = presentaciones
                   .OrderByDescending(p => p.EstadoPresentacion == 1)
                   .ToList();
                    break;
                case "reverse":
                    break;
                case "alfabetico":
                    presentaciones = presentaciones.OrderBy(p => p.NombreCompleto).ToList(); // Se ordenan alfabéticamente por el nombre de la presentación
                    presentaciones = presentaciones
                    .OrderByDescending(p => p.EstadoPresentacion == 1)
                    .ToList();
                    break;
                case "name_desc":
                    presentaciones = presentaciones.OrderByDescending(p => p.NombreCompleto).ToList(); // Se ordenan alfabéticamente descendente por el nombre de la presentación
                    presentaciones = presentaciones
                   .OrderByDescending(p => p.EstadoPresentacion == 1)
                   .ToList();
                    break;
                default:
                    break;
            }

           
            var pagePresentacion = await presentaciones.ToPagedListAsync(pageNumber, pageSize);

            // Verificación si la página no tiene elementos y se encuentra en una página mayor a 1
            if (!pagePresentacion.Any() && pagePresentacion.PageNumber > 1)
            {
                pagePresentacion = await presentaciones.ToPagedListAsync(pagePresentacion.PageCount, pageSize);
            }

            int contador = (pageNumber - 1) * pageSize + 1; // Calcular el valor inicial del contador

            ViewBag.Contador = contador;
            ViewBag.Order = order; // Pasar el criterio de orden a la vista
            ViewData["Presentaciones"] = presentaciones;
            return View(pagePresentacion);
        }

        [HttpPost]
        public async Task<JsonResult> FindPresentacion(int presentacionId)
        {
            var presentacion = await _client.FindPresentacionAsync(presentacionId);
            return Json(presentacion);
        }

        [HttpPost]
        public async Task<JsonResult> FindPresentaciones()
        {
            var presentaciones = await _client.GetPresentacionAsync();
            return Json(presentaciones);
        }

        public async Task<IActionResult> Details(int? id, int? page)
        {
            if (id == null)
            {
                return NotFound();
            }

            var productos = await _client.GetProductoAsync();
            var presentaciones = await _client.GetPresentacionAsync();
            var lotes = await _client.GetLoteAsync();
            var categorias = await _client.GetCategoriaAsync();
            var marcas = await _client.GetMarcaAsync();

            // Calcular cantidad total de lotes por ProductoId y estado activo
            var cantidadTotalPorProducto = lotes
                .Where(l => l.EstadoLote == 1) // Filtrar por estado activo
                .GroupBy(l => l.ProductoId ?? 0) // Convertir ProductoId a int no anulable
                .ToDictionary(
                    grp => grp.Key,
                    grp => grp.Sum(l => l.Cantidad) // Sumar la cantidad de cada grupo
                );

            // Concatenar nombre completo de productos
            foreach (var producto in productos)
            {
                // Obtener la cantidad total correspondiente al producto actual
                if (cantidadTotalPorProducto.TryGetValue(producto.ProductoId, out var cantidadTotal))
                {
                    producto.CantidadTotal = cantidadTotal;
                }
                else
                {
                    // Si no hay cantidad total para este producto, asignar cero o un valor predeterminado según sea necesario
                    producto.CantidadTotal = 0;
                }
                var presentacionEncontrada = presentaciones.FirstOrDefault(p => p.PresentacionId == producto.PresentacionId);
                var nombrePresentacion = presentacionEncontrada?.NombrePresentacion ?? "Sin presentación";
                var contenido = presentacionEncontrada?.Contenido ?? "";
                var cantidad = presentacionEncontrada?.CantidadPorPresentacion ?? 1;
                var marcaEncontrada = marcas.FirstOrDefault(m => m.MarcaId == producto.MarcaId);
                var nombreMarca = marcaEncontrada?.NombreMarca ?? "Sin marca";

                producto.NombreCompleto = cantidad > 1 ?
                    $"{nombrePresentacion} de {producto.NombreProducto} {nombreMarca} x {cantidad} {contenido}" :
                    $"{nombrePresentacion} de {producto.NombreProducto} {nombreMarca} de {contenido}";
            }
            var presentacion = presentaciones.FirstOrDefault(p => p.PresentacionId == id);
            if (presentacion == null) {
                return NotFound();
            }
            if (presentacion != null)
            {
                // Concatenación del nombre de la presentación
                string nombreCompleto = presentacion.CantidadPorPresentacion > 1 ?
                 $"{presentacion.NombrePresentacion} x {presentacion.CantidadPorPresentacion} unidades de {presentacion.Contenido}" : $"{presentacion.NombrePresentacion} de {presentacion.Contenido}";
                // Pasar el nombre completo a la vista
                ViewBag.NombreCompletoPresentacion = nombreCompleto;
            }
            ViewBag.Presentacion = presentacion;
            ViewBag.Productos = productos;

            var productosDePresentacion = productos.Where(p => p.PresentacionId == id).ToList();

            ViewBag.CantidadProductosAsociados = productosDePresentacion.Count; // Guardar la cantidad de productos asociados

            if (!productosDePresentacion.Any())
            {
                // Si no hay productos, establecer ViewBag.Message
                ViewBag.Message = "No se encontraron productos asociados a esta presentación.";
                return View(productosDePresentacion.ToPagedList(1, 1)); // Devuelve un modelo paginado vacío
            }

            int pageSize = 5;
            int pageNumber = page ?? 1;

            var pagedProductos = productosDePresentacion.ToPagedList(pageNumber, pageSize);

            return View(pagedProductos);
        }





        [HttpPost]
        public async Task<IActionResult> Create([FromForm] Presentacion presentacion)
        {
            if (ModelState.IsValid)
            {
                var presentaciones = await _client.GetPresentacionAsync();
                var presentacionExistente = presentaciones.FirstOrDefault(c => string.Equals(c.NombrePresentacion, presentacion.NombrePresentacion, StringComparison.OrdinalIgnoreCase) && string.Equals(c.Contenido, presentacion.Contenido, StringComparison.OrdinalIgnoreCase) && c.CantidadPorPresentacion == presentacion.CantidadPorPresentacion);

                // Si ya existe una presentación con el mismo nombre, mostrar un mensaje de error
                if (presentacionExistente != null)
                {
                    MensajeSweetAlert("error", "Error", "Ya hay una presentación registrada con ese nombre.", "true", null);
                    return RedirectToAction("Index");
                }

                var response = await _client.CreatePresentacionAsync(presentacion);

                if (response.IsSuccessStatusCode)
                {
                    MensajeSweetAlert("success", "Éxito", "¡Presentación registrada correctamente!", "false", null);
                    return RedirectToAction("Index");
                }
                else
                {
                    MensajeSweetAlert("error", "Error", "¡Problemas al registrar la presentación!", "true", null);
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

        public async Task<IActionResult> Update([FromForm] PresentacionUpdate presentacion)
        {
            if (ModelState.IsValid)
            {
                var presentaciones = await _client.GetPresentacionAsync();
                int contadorPresentacionesIguales = 0;

                foreach (var presentacionC in presentaciones)
                {
                    if (presentacionC.PresentacionId != presentacionC.PresentacionId &&
                        string.Equals(presentacionC.NombrePresentacion, presentacionC.NombrePresentacion, StringComparison.OrdinalIgnoreCase) &&
                        string.Equals(presentacionC.Contenido, presentacionC.Contenido, StringComparison.OrdinalIgnoreCase) &&
                        presentacionC.CantidadPorPresentacion == presentacionC.CantidadPorPresentacion)
                    {
                        contadorPresentacionesIguales++;
                    }
                }

                if (contadorPresentacionesIguales > 0)
                {
                    MensajeSweetAlert("error", "Error", $"Ya hay {contadorPresentacionesIguales} presentaciónes registradas con ese nombre.", "true", null);
                    return RedirectToAction("Index");
                }
                var catehgoriaantesdeenviar = presentacion;
                var response = await _client.UpdatePresentacionAsync(presentacion);

                if (response != null)
                {
                    if (response.IsSuccessStatusCode)
                    {
                        MensajeSweetAlert("success", "Éxito", "Presentación actualizada correctamente.", "false", null);
                        return RedirectToAction("Index");
                    }
                    else if (response.StatusCode == HttpStatusCode.NotFound)
                    {
                        MensajeSweetAlert("error", "Error", "La presentación no se encontró en el servidor.", "true", null);
                        return RedirectToAction("Index");
                    }
                    else if (response.StatusCode == HttpStatusCode.BadRequest)
                    {
                        MensajeSweetAlert("error", "Error", "Nombre de presentación duplicado.", "true", null);
                        return RedirectToAction("Index");
                    }
                    else
                    {
                        MensajeSweetAlert("error", "Error", "Error al actualizar la presentación.", "true", null);
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

        public async Task<IActionResult> Delete(int presentacionId)
        {
            var productos = await _client.GetProductoAsync();
            var productosDePresentacion = productos.Where(p => p.PresentacionId == presentacionId);

            if (productosDePresentacion.Any())
            {
                MensajeSweetAlert("error", "Error", "No se puede eliminar la Presentación porque tiene productos asociados.", "true", null);

            }
            else
            {
                var response = await _client.DeletePresentacionAsync(presentacionId);
                if (response.IsSuccessStatusCode)
                {
                    MensajeSweetAlert("success", "Éxito", "Presentación eliminada correctamente.", "true", 3000);

                }
                else if (response.StatusCode == HttpStatusCode.NotFound)
                {
                    MensajeSweetAlert("error", "Error", "La Presentación no se encontró en el servidor.", "true", null);

                }
                else
                {
                    MensajeSweetAlert("error", "Error", "Error desconocido al eliminar la Presentación.", "true", null);

                }
            }

            return RedirectToAction("Index");
        }

        [HttpPatch("Presentaciones/UpdateEstadoPresentacion/{id}")]
        public async Task<IActionResult> CambiarEstadoPresentacion(int id)
        {
            // Llama al método del servicio para cambiar el estado del usuario
            var response = await _client.CambiarEstadoPresentacionAsync(id);

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
