using Microsoft.AspNetCore.Mvc;
using System.Net;
using VistaNewProject.Models;
using VistaNewProject.Services;
using X.PagedList;

namespace VistaNewProject.Controllers
{
    public class CategoriasController : Controller
    {

        private readonly IApiClient _client;
        private readonly ProductoService _productoService;

        public CategoriasController(IApiClient client, ProductoService productoService) // Añade ProductoService al constructor
        {
            _client = client;
            _productoService = productoService; // Inicializa ProductoService
        }

        public async Task<IActionResult> Index(int? page, string order = "default")
        {
            int pageSize = 5;
            int pageNumber = page ?? 1; 

            var categorias = await _client.GetCategoriaAsync(); // Obtener todas las categorias
                                                             
            categorias = categorias.Reverse().ToList();
            categorias = categorias.OrderByDescending(c => c.EstadoCategoria == 1).ToList();
            order = order?.ToLower() ?? "default";

            switch (order)
            {
                case "first":
                    categorias = categorias.Reverse(); // Se invierte el orden de las categorias
                    categorias = categorias
                   .OrderByDescending(p => p.EstadoCategoria == 1)
                   .ToList();
                    break;
                case "reverse":
                    break;
                case "alfabetico":
                    categorias = categorias.OrderBy(p => p.NombreCategoria).ToList(); // Se ordenan alfabéticamente por el nombre de la presentación
                    categorias = categorias
                    .OrderByDescending(p => p.EstadoCategoria == 1)
                    .ToList();
                    break;
                case "name_desc":
                    categorias = categorias.OrderByDescending(p => p.EstadoCategoria).ToList(); // Se ordenan alfabéticamente descendente por el nombre de la presentación
                    categorias = categorias
                    .OrderByDescending(p => p.EstadoCategoria == 1)
                    .ToList();
                    break;
                default:
                    break;
            }

            if (categorias == null)
            {
                return NotFound("error");
            }

            var pageCategoria = await categorias.ToPagedListAsync(pageNumber, pageSize);

            if (!pageCategoria.Any() && pageCategoria.PageNumber > 1)
            {
                pageCategoria = await categorias.ToPagedListAsync(pageCategoria.PageCount, pageSize);
            }

            int contador = (pageNumber - 1) * pageSize + 1; // Calcular el valor inicial del contador

            ViewBag.Contador = contador;
            ViewBag.Order = order; // Pasar el criterio de orden a la vistav
            ViewData["Categorias"] = categorias;
            return View(pageCategoria);
           
        }

        [HttpGet]
        public async Task<JsonResult> FindCategoria(int categoriaId)
        {
            var categoria = await _client.FindCategoriaAsync(categoriaId);


            return Json(categoria); // Devuelve la categoría encontrada en formato JSON
        }
        [HttpGet]
        public async Task<JsonResult> FindCategorias()
        {
            var categorias = await _client.GetCategoriaAsync();
            return Json(categorias);
        }
        public async Task<IActionResult> Details(int? id, int? page)
        {
            int pageNumber = page ?? 1;
            if (id == null)
            {
                return NotFound();
            }

            var categoria = await _client.FindCategoriaAsync(id.Value);
            if (categoria == null)
            {
                return NotFound();
            }

            int pageSize = pageNumber > 2 ? 6 : 5; // Page size after page 2 is 10, otherwise 5

            var productos = await _client.GetProductoAsync();
            var productosDeCategoria = productos.Where(p => p.CategoriaId == id).ToList();
            ViewBag.Categoria = categoria;
            ViewBag.CantidadProductosAsociados = productosDeCategoria.Count;

            if (!productosDeCategoria.Any())
            {
                ViewBag.Message = "No se encontraron productos asociados a esta categoría.";
                ViewBag.PaginaActual = 1; // Página actual cuando no hay productos
                return View(productosDeCategoria.ToPagedList(1, 1)); // Devuelve un modelo paginado vacío
            }

            ViewBag.PaginaActual = pageNumber; // Página actual

            var pagedProductosPagedList = productosDeCategoria.ToPagedList(pageNumber, pageSize);
            return View(pagedProductosPagedList);
        }
        public async Task<IActionResult> Create([FromForm] Categoria categoria)
        {
            if (ModelState.IsValid)
            {
                var categorias = await _client.GetCategoriaAsync();
                var categoriaExistente = categorias.FirstOrDefault(c => string.Equals(c.NombreCategoria, categoria.NombreCategoria, StringComparison.OrdinalIgnoreCase));

                // Si ya existe una categoría con el mismo nombre, mostrar un mensaje de error
                if (categoriaExistente != null)
                {
                    MensajeSweetAlert("error", "Error", "Ya hay una categoría registrada con ese nombre.", "true", null);
                    return RedirectToAction("Index");
                }

                var response = await _client.CreateCategoriaAsync(categoria);

                if (response.IsSuccessStatusCode)
                {
                    MensajeSweetAlert("success", "Éxito", "¡Categoría registrada correctamente!", "false", null);
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
        public async Task<IActionResult> Update([FromForm] CategoriaUpdate categoria)
        {
            if (ModelState.IsValid)
            {
                var categorias = await _client.GetCategoriaAsync();
                List<int> categoriasIgualesIds = new List<int>();

                foreach (var categoriaC in categorias)
                {
                    if (categoriaC.CategoriaId != categoria.CategoriaId &&
                        string.Equals(categoriaC.NombreCategoria, categoria.NombreCategoria, StringComparison.OrdinalIgnoreCase))
                    {
                        categoriasIgualesIds.Add(categoriaC.CategoriaId);
                    }
                }

                if (categoriasIgualesIds.Count > 0)
                {
                    string categoriasIdsStr = string.Join(", ", categoriasIgualesIds);
                    MensajeSweetAlert("error", "Error", $"Ya hay una categoría registrada con ese nombre. Categoria ID: {categoriasIdsStr}", "true", null);
                    return RedirectToAction("Index");
                }

                var response = await _client.UpdateCategoriaAsync(categoria);

                if (response != null)
                {
                    if (response.IsSuccessStatusCode)
                    {
                        MensajeSweetAlert("success", "Éxito", "Categoría actualizada correctamente.", "false", null);
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
        public async Task<IActionResult> Delete(int categoriaId)
        {
            var productos = await _client.GetProductoAsync();
            var productosDeCategoria = productos.Where(p => p.CategoriaId == categoriaId);

            if (productosDeCategoria.Any())
            {
                MensajeSweetAlert("error", "Error", "No se puede eliminar la Categoría porque tiene productos asociados.", "true", null);

            }
            else
            {
                var response = await _client.DeleteCategoriaAsync(categoriaId);
                if (response.IsSuccessStatusCode)
                {
                    MensajeSweetAlert("success", "Éxito", "Categoría eliminada correctamente.", "true", 3000);

                }
                else if (response.StatusCode == HttpStatusCode.NotFound)
                {
                    MensajeSweetAlert("error", "Error", "La Categoría no se encontró en el servidor.", "true", null);

                }
                else
                {
                    MensajeSweetAlert("error", "Error", "Error desconocido al eliminar la Categoría.", "true", null);

                }
            }

            return RedirectToAction("Index");
        }
        public async Task<IActionResult> MarcasAsociadasxCategoria(int? id, int? page)
        {
            if (id == null)
            {
                return NotFound();
            }

            var categoriaExiste = await _client.FindCategoriaAsync(id.Value);
            if (categoriaExiste == null)
            {
                return NotFound();
            }
            var categoria = await _client.FindCategoriaAsync(id.Value); // Obtener la unidad directamente como int
            var marcas = await _client.GetMarcaAsync();
            var categoriasxmarcas = await _client.GetCategoriaxMarcasByIdAsync(id.Value);
            // Filtrar categorías asociadas a la unidad específica
            var categoriasAsociadasIds = categoriasxmarcas
                .Select(cu => cu.MarcaId)
                .ToList();

            var marcasAsociadas = marcas.Where(c => categoriasAsociadasIds.Contains(c.MarcaId)).ToList();
            // Concatenar el nombre de la unidad con su cantidad si está disponible

            ViewBag.Categoria = categoria;
            if (!marcasAsociadas.Any())
            {
                return View(marcasAsociadas.ToPagedList(1, 1)); // Devuelve un modelo paginado vacío
            }

            int pageSize = 5; // Número máximo de elementos por página
            int pageNumber = page ?? 1;

            var pagedMarcas = marcasAsociadas.ToPagedList(pageNumber, pageSize);

            return View(pagedMarcas);
        }
        public async Task<IActionResult> CategoriaxMarcasAsociadas(int? id, int? page, string order = "default")
        {
            if (id == null)
            {
                return BadRequest();
            }
           
            var categoria = await _client.FindCategoriaAsync(id.Value);
            if (categoria == null)
            {
                return NotFound();
            }

            var marcas = await _client.GetMarcaAsync();
            var categoriasxmarcas = await _client.GetCategoriaxMarcasByIdAsync(id.Value);

            var categoriasAsociadas = marcas
                .Select(c => new CategoriaxMarca
                {
                    MarcaId = c.MarcaId,
                    NombreMarca = c.NombreMarca,
                    CategoriaId = id.Value,
                    EstaAsociada = categoriasxmarcas.Any(cm => cm.MarcaId == c.MarcaId)
                })
                .ToList();

            order = order?.ToLower() ?? "default";

            switch (order)
            {
                case "alfabetico":
                    categoriasAsociadas = categoriasAsociadas.OrderBy(c => c.NombreMarca).ToList();
                    break;
                case "name_desc":
                    categoriasAsociadas = categoriasAsociadas.OrderByDescending(c => c.NombreMarca).ToList();
                    break;
                case "first":
                    categoriasAsociadas = categoriasAsociadas.OrderBy(c => c.MarcaId).ToList(); // assuming CategoriaId represents the order of creation
                    break;
                case "reverse":
                    categoriasAsociadas = categoriasAsociadas.OrderByDescending(c => c.MarcaId).ToList(); // assuming CategoriaId represents the order of creation
                    break;
                default:
                    break;
            }

            int pageNumber = page ?? 1;
            int pageSize = 6;
            var pagedCategorias = categoriasAsociadas.ToPagedList(pageNumber, pageSize);

            ViewBag.Categoria = categoria;
            ViewBag.CurrentOrder = order;

            return View(pagedCategorias);
        }

        public async Task<IActionResult> PresentacionesAsociadasxCategoria(int? id, int? page)
        {
            if (id == null)
            {
                return NotFound();
            }

            var categoriaExiste = await _client.FindCategoriaAsync(id.Value);
            if (categoriaExiste == null)
            {
                return NotFound();
            }
            var categoria = await _client.FindCategoriaAsync(id.Value); // Obtener la unidad directamente como int
            var unidades = await _client.GetPresentacionAsync();
            var categoriasxunidades = await _client.GetCategoriaxPresentacionesByIdAsync(id.Value);
            // Filtrar categorías asociadas a la unidad específica
            var categoriasAsociadasIds = categoriasxunidades
                .Select(cu => cu.PresentacionId)
                .ToList();

            var unidadesAsociadas = unidades.Where(c => categoriasAsociadasIds.Contains(c.PresentacionId)).ToList();
            // Concatenar el nombre de la unidad con su cantidad si está disponible

            ViewBag.Categoria = categoria;
            if (!unidadesAsociadas.Any())
            {
                return View(unidadesAsociadas.ToPagedList(1, 1)); // Devuelve un modelo paginado vacío
            }

            int pageSize = 5; // Número máximo de elementos por página
            int pageNumber = page ?? 1;

            var pagedPresentaciones = unidadesAsociadas.ToPagedList(pageNumber, pageSize);

            return View(pagedPresentaciones);
        }
        public async Task<IActionResult> CategoriaxPresentacionesAsociadas(int? id, int? page, string order = "default")
        {
            if (id == null)
            {
                return BadRequest();
            }

            var categoria = await _client.FindCategoriaAsync(id.Value);
            if (categoria == null)
            {
                return NotFound();
            }

            var presentaciones = await _client.GetPresentacionAsync();
            var categoriasxpresentaciones = await _client.GetCategoriaxPresentacionesByIdAsync(id.Value);

            var categoriasAsociadas = presentaciones
                .Select(c => new CategoriaxPresentacion
                {
                    PresentacionId = c.PresentacionId,
                    NombreCompletoPresentacion = c.NombreCompletoPresentacion,
                    CategoriaId = id.Value,
                    EstaAsociada = categoriasxpresentaciones.Any(cm => cm.PresentacionId== c.PresentacionId)
                })
                .ToList();

            order = order?.ToLower() ?? "default";

            switch (order)
            {
                case "alfabetico":
                    categoriasAsociadas = categoriasAsociadas.OrderBy(c => c.NombreCompletoPresentacion).ToList();
                    break;
                case "name_desc":
                    categoriasAsociadas = categoriasAsociadas.OrderByDescending(c => c.NombreCompletoPresentacion).ToList();
                    break;
                case "first":
                    categoriasAsociadas = categoriasAsociadas.OrderBy(c => c.PresentacionId).ToList(); // assuming CategoriaId represents the order of creation
                    break;
                case "reverse":
                    categoriasAsociadas = categoriasAsociadas.OrderByDescending(c => c.PresentacionId).ToList(); // assuming CategoriaId represents the order of creation
                    break;
                default:
                    break;
            }

            int pageNumber = page ?? 1;
            int pageSize = 6;
            var pagedCategorias = categoriasAsociadas.ToPagedList(pageNumber, pageSize);

            ViewBag.Categoria = categoria;
            ViewBag.CurrentOrder = order;

            return View(pagedCategorias);
        }

        public async Task<IActionResult> UnidadesAsociadasxCategoria(int? id, int? page)
        {
            if (id == null)
            {
                return NotFound();
            }

            var categoriaExiste = await _client.FindCategoriaAsync(id.Value);
            if (categoriaExiste == null)
            {
                return NotFound();
            }
            var categoria = await _client.FindCategoriaAsync(id.Value); // Obtener la unidad directamente como int
            var unidades = await _client.GetUnidadAsync();
            var categoriasxunidades = await _client.GetCategoriaxUnidadesByIdAsync(id.Value);
            // Filtrar categorías asociadas a la unidad específica
            var categoriasAsociadasIds = categoriasxunidades
                .Select(cu => cu.UnidadId)
                .ToList();

            var unidadesAsociadas = unidades.Where(c => categoriasAsociadasIds.Contains(c.UnidadId)).ToList();
            // Concatenar el nombre de la unidad con su cantidad si está disponible

            ViewBag.Categoria = categoria;
            if (!unidadesAsociadas.Any())
            {
                return View(unidadesAsociadas.ToPagedList(1, 1)); // Devuelve un modelo paginado vacío
            }

            int pageSize = 5; // Número máximo de elementos por página
            int pageNumber = page ?? 1;

            var pagedUnidades = unidadesAsociadas.ToPagedList(pageNumber, pageSize);

            return View(pagedUnidades);
        }
        public async Task<IActionResult> CategoriaxUnidadesAsociadas(int? id, int? page, string order = "default")
        {
            if (id == null)
            {
                return BadRequest();
            }

            var categoria = await _client.FindCategoriaAsync(id.Value);
            if (categoria == null)
            {
                return NotFound();
            }

            var unidades = await _client.GetUnidadAsync();
            var categoriasxunidades = await _client.GetCategoriaxUnidadesByIdAsync(id.Value);

            var categoriasAsociadas = unidades
                .Select(c => new CategoriaxUnidad
                {
                    UnidadId = c.UnidadId,
                    NombreCompletoUnidad = c.NombreCompletoUnidad,
                    CategoriaId = id.Value,
                    EstaAsociada = categoriasxunidades.Any(cm => cm.UnidadId == c.UnidadId)
                })
                .ToList();

            order = order?.ToLower() ?? "default";

            switch (order)
            {
                case "alfabetico":
                    categoriasAsociadas = categoriasAsociadas.OrderBy(c => c.NombreCompletoUnidad).ToList();
                    break;
                case "name_desc":
                    categoriasAsociadas = categoriasAsociadas.OrderByDescending(c => c.NombreCompletoUnidad).ToList();
                    break;
                case "first":
                    categoriasAsociadas = categoriasAsociadas.OrderBy(c => c.UnidadId).ToList(); // assuming CategoriaId represents the order of creation
                    break;
                case "reverse":
                    categoriasAsociadas = categoriasAsociadas.OrderByDescending(c => c.UnidadId).ToList(); // assuming CategoriaId represents the order of creation
                    break;
                default:
                    break;
            }

            int pageNumber = page ?? 1;
            int pageSize = 6;
            var pagedCategorias = categoriasAsociadas.ToPagedList(pageNumber, pageSize);

            ViewBag.Categoria = categoria;
            ViewBag.CurrentOrder = order;

            return View(pagedCategorias);
        }

        [HttpPatch("Categorias/UpdateEstadoCategoria/{id}")]
        public async Task<IActionResult> CambiarEstadoCategoria(int id)
        {
            // Llama al método del servicio para cambiar el estado del usuario
            var response = await _client.CambiarEstadoCategoriaAsync(id);

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
