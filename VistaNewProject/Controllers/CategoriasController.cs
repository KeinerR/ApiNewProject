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
                var categorias = await _client.GetCategoriaAsync();
                var categoriasexis = categorias.FirstOrDefault(c => string.Equals(c.NombreCategoria, nombreCategoria, StringComparison.OrdinalIgnoreCase));

                // Si ya existe una categoría con el mismo nombre, mostrar un mensaje de error
                if (categoriasexis != null)
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

                if (string.IsNullOrWhiteSpace(nombreCategoria))
                {
                    TempData["SweetAlertIcon"] = "error";
                    TempData["SweetAlertTitle"] = "Error";
                    TempData["SweetAlertMessage"] = "Por favor, ingrese un nombre válido para la categoría.";
                    return RedirectToAction("Index");
                }
                var response = await _client.CreateCategoriaAsync(categoria);

                if (response.IsSuccessStatusCode)
                {
                    TempData["Mensaje"] = "¡Registro guardado correctamente!";
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



        public async Task<IActionResult> Update([FromForm] int categoriaIdAct, [FromForm] string nombreCategoriaAct, [FromForm] int estadoCategoriaAct)
        {
            try
            {
                var categorias = await _client.GetCategoriaAsync();
                var categoriaExis = categorias.FirstOrDefault(c =>
                                         string.Equals(c.NombreCategoria, nombreCategoriaAct, StringComparison.OrdinalIgnoreCase)
                                         && c.CategoriaId != categoriaIdAct);
                // Si ya existe una categoría con el mismo nombre, mostrar un mensaje de error
                if (categoriaExis != null)
                {
                    TempData["SweetAlertIcon"] = "error";
                    TempData["SweetAlertTitle"] = "Error";
                    TempData["SweetAlertMessage"] = "Ya hay una categoría registrada con ese nombre.";
                    return RedirectToAction("Index");
                }
                // Continuar con la lógica de actualización de la marca si no hay una marca con el mismo nombre

                // Crear un objeto Marca con los datos recibidos del formulario
                var categoria = new Categoria
                {
                    CategoriaId = categoriaIdAct,
                    NombreCategoria = nombreCategoriaAct,
                    EstadoCategoria = estadoCategoriaAct == 1 ? 1ul : 0ul
                };

                // Llamar al método en el cliente para actualizar la marca
                var response = await _client.UpdateCategoriaAsync(categoria);

                if (response != null)
                {
                    if (response.IsSuccessStatusCode)
                    {
                        TempData["SweetAlertIcon"] = "success";
                        TempData["SweetAlertTitle"] = "Éxito";
                        TempData["SweetAlertMessage"] = "Categoria actualizada correctamente.";
                        return RedirectToAction("Index");
                    }
                    else if (response.StatusCode == HttpStatusCode.NotFound)
                    {
                        TempData["SweetAlertIcon"] = "error";
                        TempData["SweetAlertTitle"] = "Error";
                        TempData["SweetAlertMessage"] = "La categoria no se encontró en el servidor.";
                        return RedirectToAction("Index");
                    }
                    else if (response.StatusCode == HttpStatusCode.BadRequest)
                    {
                        TempData["SweetAlertIcon"] = "error";
                        TempData["SweetAlertTitle"] = "Error";
                        TempData["SweetAlertMessage"] = "Nombre de categoria duplicado.";
                        return RedirectToAction("Index");
                    }
                    else
                    {
                        TempData["SweetAlertIcon"] = "error";
                        TempData["SweetAlertTitle"] = "Error";
                        TempData["SweetAlertMessage"] = "Error al actualizar la categoria.";
                        return RedirectToAction("Index");
                    }
                }
                else
                {
                    TempData["SweetAlertIcon"] = "error";
                    TempData["SweetAlertTitle"] = "Error";
                    TempData["SweetAlertMessage"] = "Error al realizar la solicitud de actualización.";
                    return RedirectToAction("Index");
                }
            }
            catch (Exception ex)
            {
                // Manejar cualquier excepción que pueda ocurrir durante la actualización
                TempData["SweetAlertIcon"] = "error";
                TempData["SweetAlertTitle"] = "Error";
                TempData["SweetAlertMessage"] = "Error al actualizar la marca: " + ex.Message;
                return RedirectToAction("Index");
            }
        }
        public async Task<IActionResult> Delete(int id)
        {
            var productos = await _client.GetProductoAsync();
            var productosDeCategoria = productos.Where(p => p.CategoriaId == id);

            if (productosDeCategoria.Any())
            {
                TempData["SweetAlertIcon"] = "error";
                TempData["SweetAlertTitle"] = "Error";
                TempData["SweetAlertMessage"] = "No se puede eliminar la Categoría porque tiene productos asociados.";
                return RedirectToAction("Index");
            }

            var response = await _client.DeleteCategoriaAsync(id);
            if (response == null)
            {
                TempData["SweetAlertIcon"] = "error";
                TempData["SweetAlertTitle"] = "Error";
                TempData["SweetAlertMessage"] = "Error al eliminar la Categoría.";
            }
            else if (response.IsSuccessStatusCode)
            {
                TempData["SweetAlertIcon"] = "success";
                TempData["SweetAlertTitle"] = "Éxito";
                TempData["SweetAlertMessage"] = "Categoría eliminada correctamente.";
            }
            else if (response.StatusCode == HttpStatusCode.NotFound)
            {
                TempData["SweetAlertIcon"] = "error";
                TempData["SweetAlertTitle"] = "Error";
                TempData["SweetAlertMessage"] = "La Categoría no se encontró en el servidor.";
            }
            else
            {
                TempData["SweetAlertIcon"] = "error";
                TempData["SweetAlertTitle"] = "Error";
                TempData["SweetAlertMessage"] = "Error desconocido al eliminar la Categoría.";
            }

            return RedirectToAction("Index");
        }

    }
}
