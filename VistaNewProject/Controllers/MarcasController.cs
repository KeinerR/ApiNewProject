using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Models;
using VistaNewProject.Services;
using X.PagedList;
using Microsoft.AspNetCore.Http;
using System.Net;

namespace VistaNewProject.Controllers
{
    public class MarcasController : Controller
    {
        private readonly IApiClient _client;
        public MarcasController(IApiClient client)
        {
            _client = client;
        }
        public async Task<IActionResult> Index(int? page, string order = "default")
        {
            int pageSize = 5;
            int pageNumber = page ?? 1;

            var marcas = await _client.GetMarcaAsync(); // Obtener todas las marcas

            marcas = marcas.Reverse().ToList();
            marcas = marcas.OrderByDescending(c => c.EstadoMarca == 1).ToList();
            order = order?.ToLower() ?? "default";

            switch (order)
            {
                case "first":
                    marcas = marcas.Reverse(); // Se invierte el orden de las marcas
                    marcas = marcas
                   .OrderByDescending(p => p.EstadoMarca == 1)
                   .ToList();
                    break;
                case "reverse":
                    break;
                case "alfabetico":
                    marcas = marcas.OrderBy(p => p.NombreMarca).ToList(); // Se ordenan alfabéticamente por el nombre de la presentación
                    marcas = marcas
                    .OrderByDescending(p => p.EstadoMarca == 1)
                    .ToList();
                    break;
                case "name_desc":
                    marcas = marcas.OrderByDescending(p => p.EstadoMarca).ToList(); // Se ordenan alfabéticamente descendente por el nombre de la presentación
                    marcas = marcas
                    .OrderByDescending(p => p.EstadoMarca == 1)
                    .ToList();
                    break;
                default:
                    break;
            }

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
            ViewBag.Order = order; // Pasar el criterio de orden a la vistav
            ViewData["Marcas"] = marcas;
            return View(pageMarca);

        }
        [HttpPost]
        public async Task<JsonResult> FindMarca(int marcaId)
        {
            var marca = await _client.FindMarcaAsync(marcaId);
            return Json(marca);
        }
        [HttpPost]
        public async Task<JsonResult> FindMarcas()
        {
            var marcas = await _client.GetMarcaAsync();
            return Json(marcas);
        }
        public async Task<IActionResult> Details(int? id, int? page)
        {
            if (id == null)
            {
                return NotFound();
            }
            var marcas = await _client.GetMarcaAsync();
            var marcaExiste = marcas.FirstOrDefault(m => m.MarcaId == id);
            if (marcaExiste == null) {
                return NotFound();

            }
            var marca = await _client.FindMarcaAsync(id.Value);
            if (marca == null)
            {
                return NotFound();
            }

            ViewBag.Marca = marca;

            var productos = await _client.GetProductoAsync();
            var productosDeMarca = productos.Where(p => p.MarcaId == id).ToList();

            ViewBag.CantidadProductosAsociados = productosDeMarca.Count;

            if (!productosDeMarca.Any())
            {
                ViewBag.Message = "No se encontraron productos asociados a esta marca.";
                return View(productosDeMarca.ToPagedList(1, 1)); // Devuelve un modelo paginado vacío
            }

            int pageSize = 5; // registros por página
            int pageNumber = page ?? 1;

            var pagedProductos = new List<Producto>();

            foreach (var producto in productosDeMarca)
            {
                var productoConNombreCompleto = await ConcatenarNombreCompletoProducto(producto.ProductoId);
                pagedProductos.Add(productoConNombreCompleto);
            }

            var pagedProductosPagedList = pagedProductos.ToPagedList(pageNumber, pageSize);

            return View(pagedProductosPagedList);
        }

        public async Task<IActionResult> MarcaxCategoriasAsociadas(int? id, int? page, string order = "default")
        {
            if (id == null)
            {
                return BadRequest();
            }
            var marcas = await _client.GetMarcaAsync();

            var marcaExiste = marcas.FirstOrDefault(p => p.MarcaId == id);
            if (marcaExiste == null)
            {
                return NotFound();
            }
            var unidad = await _client.FindMarcaAsync(id.Value);
            if (unidad == null)
            {
                return NotFound();
            }

            var categorias = await _client.GetCategoriaAsync();
            var categoriasxmarcas = await _client.GetCategoriaxMarcasAsync();

            var categoriasAsociadasIds = categoriasxmarcas
                .Where(cu => cu.MarcaId == id.Value)
                .Select(cu => cu.CategoriaId)
                .ToList();

            var categoriasAsociadas = categorias
                .Select(c => new CategoriaxMarca
                {
                    CategoriaId = c.CategoriaId,
                    NombreCategoria = c.NombreCategoria,
                    MarcaId = id.Value,
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

            ViewBag.Marca = unidad;
            ViewBag.CurrentOrder = order;

            return View(pagedCategorias);
        }

        public async Task<IActionResult> CategoriasAsociadasxMarca(int? id, int? page)
        {
            if (id == null)
            {
                return NotFound();
            }
            var marcas = await _client.GetMarcaAsync();

            var marcaExiste = marcas.FirstOrDefault(p => p.MarcaId == id);
            if (marcaExiste == null)
            {
                return NotFound();
            }
            var marca = await _client.FindMarcaAsync(id.Value); // Obtener la unidad directamente como int

            var categorias = await _client.GetCategoriaAsync();
            var categoriasxmarcas = await _client.GetCategoriaxMarcasAsync();

            // Filtrar categorías asociadas a la unidad específica
            var categoriasAsociadasIds = categoriasxmarcas
                .Where(cu => cu.MarcaId == id.Value) // Utilizar id.Value directamente
                .Select(cu => cu.CategoriaId)
                .ToList();

            var categoriasAsociadas = categorias.Where(c => categoriasAsociadasIds.Contains(c.CategoriaId)).ToList();
            // Concatenar el nombre de la unidad con su cantidad si está disponible

            ViewBag.Marca = marca;
            if (!categoriasAsociadas.Any())
            {
                return View(categoriasAsociadas.ToPagedList(1, 1)); // Devuelve un modelo paginado vacío
            }

            int pageSize = 4; // Número máximo de elementos por página
            int pageNumber = page ?? 1;

            var pagedCategorias = categoriasAsociadas.ToPagedList(pageNumber, pageSize);

            return View(pagedCategorias);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] Marca marca)
        {
            if (ModelState.IsValid)
            {
                var marcas = await _client.GetMarcaAsync();
                var marcaExistente = marcas.FirstOrDefault(c => string.Equals(c.NombreMarca, marca.NombreMarca, StringComparison.OrdinalIgnoreCase));

                // Si ya existe una categoría con el mismo nombre, mostrar un mensaje de error
                if (marcaExistente != null)
                {
                    MensajeSweetAlert("error", "Error", "Ya hay una categoría registrada con ese nombre.", "true", null);
                    return RedirectToAction("Index");
                }

                var response = await _client.CreateMarcaAsync(marca);

                if (response.IsSuccessStatusCode)
                {
                    MensajeSweetAlert("success", "Éxito", "¡Marca registrada correctamente!", "false", null);
                    return RedirectToAction("Index");
                }
                else
                {
                    MensajeSweetAlert("error", "Error", "¡Problemas al registrar la categoría!", "true", null);
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
        public async Task<IActionResult> Update([FromForm] MarcaUpdate marca)
        {
            if (ModelState.IsValid)
            {

                var marcas = await _client.GetMarcaAsync();
                int contadorMarcasIguales = 0;

                foreach (var marcaC in marcas)
                {
                    if (marcaC.MarcaId != marcaC.MarcaId &&
                        string.Equals(marcaC.NombreMarca, marcaC.NombreMarca, StringComparison.OrdinalIgnoreCase))
                    {
                        contadorMarcasIguales++;
                    }
                }

                if (contadorMarcasIguales > 0)
                {
                    MensajeSweetAlert("error", "Error", $"Ya hay {contadorMarcasIguales} categorías registradas con ese nombre.", "true", null);
                    return RedirectToAction("Index");
                }
                var response = await _client.UpdateMarcaAsync(marca);

                if (response != null)
                {
                    if (response.IsSuccessStatusCode)
                    {
                        MensajeSweetAlert("success", "Éxito", "Marca actualizada correctamente.", "false", null);
                        return RedirectToAction("Index");
                    }
                    else if (response.StatusCode == HttpStatusCode.NotFound)
                    {
                        MensajeSweetAlert("error", "Error", "La categoría no se encontró en el servidor.", "true", null);
                        return RedirectToAction("Index");
                    }
                    else if (response.StatusCode == HttpStatusCode.BadRequest)
                    {
                        MensajeSweetAlert("error", "Error", "Nombre de categoría duplicado.", "true", null);
                        return RedirectToAction("Index");
                    }
                    else
                    {
                        MensajeSweetAlert("error", "Error", "Error al actualizar la categoría.", "true", null);
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

        public async Task<IActionResult> Delete(int marcaId)
        {
            var productos = await _client.GetProductoAsync();
            var productosDeMarca = productos.Where(p => p.MarcaId == marcaId);

            if (productosDeMarca.Any())
            {
                MensajeSweetAlert("error", "Error", "No se puede eliminar la Marca porque tiene productos asociados.", "true", null);

            }
            else
            {
                var response = await _client.DeleteMarcaAsync(marcaId);
                if (response.IsSuccessStatusCode)
                {
                    MensajeSweetAlert("success", "Éxito", "Marca eliminada correctamente.", "true", 3000);

                }
                else if (response.StatusCode == HttpStatusCode.NotFound)
                {
                    MensajeSweetAlert("error", "Error", "La Marca no se encontró en el servidor.", "true", null);

                }
                else
                {
                    MensajeSweetAlert("error", "Error", "Error desconocido al eliminar la Marca.", "true", null);

                }
            }

            return RedirectToAction("Index");
        }
        [HttpPatch("Marcas/UpdateEstadoMarca/{id}")]
        public async Task<IActionResult> CambiarEstadoMarca(int id)
        {
            // Llama al método del servicio para cambiar el estado del usuario
            var response = await _client.CambiarEstadoMarcaAsync(id);

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

        private async Task<Producto> ConcatenarNombreCompletoProducto(int productoId)
        {
            var producto = (await _client.GetProductoAsync()).FirstOrDefault(p => p.ProductoId == productoId);
            var presentaciones = await _client.GetPresentacionAsync();
            var lotes = await _client.GetLoteAsync();
            var marcas = await _client.GetMarcaAsync();

            // Calcular cantidad total de lotes por ProductoId y estado activo
            var cantidadTotalPorProducto = lotes
                .Where(l => l.EstadoLote == 1 && l.ProductoId == productoId)
                .Sum(l => l.Cantidad);

            producto.CantidadTotal = cantidadTotalPorProducto ?? 0;

            // Concatenar nombre completo de presentaciones
            var presentacionEncontrada = presentaciones.FirstOrDefault(p => p.PresentacionId == producto.PresentacionId);
            var nombrePresentacion = presentacionEncontrada?.NombrePresentacion ?? "Sin presentación";
            var contenido = presentacionEncontrada?.Contenido ?? "";
            var cantidad = presentacionEncontrada?.CantidadPorPresentacion ?? 1;
            var marcaEncontrada = marcas.FirstOrDefault(m => m.MarcaId == producto.MarcaId);
            var nombreMarca = marcaEncontrada?.NombreMarca ?? "Sin marca";

            producto.NombreCompletoProducto = cantidad > 1 ?
                $"{nombrePresentacion} de {producto.NombreProducto} x {cantidad} unidades de {contenido}" :
                $"{nombrePresentacion} de {producto.NombreProducto} {nombreMarca} de {contenido}";

            return producto;
        }


    }


}
