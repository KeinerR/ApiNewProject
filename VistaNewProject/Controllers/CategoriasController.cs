﻿using Microsoft.AspNetCore.Mvc;
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

        [HttpPost]
        public async Task<JsonResult> FindCategoria(int categoriaId)
        {
            var categoria = await _client.FindCategoriaAsync(categoriaId);
            return Json(categoria);
        }

        [HttpPost]
        public async Task<JsonResult> FindCategorias()
        {
            var categorias = await _client.GetCategoriaAsync();
            return Json(categorias);
        }
        public async Task<IActionResult> Details(int id, int? page)
        {
            if (id == 0)
            {
                return NotFound();
            }

            var categoria = await _client.FindCategoriaAsync(id);

            if (categoria == null)
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

            if (categoria == null)
            {
                return NotFound();
            }

            ViewBag.Categoria = categoria;
            ViewBag.Productos = productos;

            var productosDeCategoria = productos.Where(p => p.CategoriaId == id).ToList();

            ViewBag.CantidadProductosAsociados = productosDeCategoria.Count; // Guardar la cantidad de productos asociados

            if (!productosDeCategoria.Any())
            {
                // Si no hay productos, establecer ViewBag.Message
                ViewBag.Message = "No se encontraron productos asociados a esta categoría.";
                return View(productosDeCategoria.ToPagedList(1, 1)); // Devuelve un modelo paginado vacío
            }

            int pageSize = 5;
            int pageNumber = page ?? 1;

            var pagedProductos = productosDeCategoria.ToPagedList(pageNumber, pageSize);

            return View(pagedProductos);
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
