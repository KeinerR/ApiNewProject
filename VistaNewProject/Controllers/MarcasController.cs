﻿using Microsoft.AspNetCore.Mvc;
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
            ViewBag.Order = order; // Pasar el criterio de orden a la vista
            ViewData["Marcas"] = marcas;
            return View(pageMarca);
        }
        [HttpPost]
        public async Task<JsonResult> FindMarca(int marcaId)
        {
            var marca = await _client.FindMarcasAsync(marcaId);
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

            var productos = await _client.GetProductoAsync();
            var presentaciones = await _client.GetPresentacionAsync();
            var lotes = await _client.GetLoteAsync();
            var categorias = await _client.GetCategoriaAsync();
            var marcas = await _client.GetMarcaAsync();

            // Calcular cantidad total de lotes por ProductoId y estado activo
            var cantidadTotalPorProducto = lotes
                .Where(l => l.EstadoLote == 1)
                .GroupBy(l => l.ProductoId ?? 0)
                .ToDictionary(
                    grp => grp.Key,
                    grp => grp.Sum(l => l.Cantidad)
                );

            // Concatenar nombre completo de presentaciones
            foreach (var presentacion in presentaciones)
            {
                var nombrePresentacion = presentacion.NombrePresentacion;
                var contenido = presentacion.Contenido;
                var cantidad = presentacion.CantidadPorPresentacion ?? 1;

                presentacion.NombreCompleto = cantidad > 1 ?
                    $"{nombrePresentacion} x {cantidad} {contenido}" :
                    $"{nombrePresentacion} de {contenido}";
            }

            // Concatenar nombre completo de productos
            foreach (var producto in productos)
            {
                if (cantidadTotalPorProducto.TryGetValue(producto.ProductoId, out var cantidadTotal))
                {
                    producto.CantidadTotal = cantidadTotal;
                }
                else
                {
                    producto.CantidadTotal = 0;
                }
                var presentacionEncontrada = presentaciones.FirstOrDefault(p => p.PresentacionId == producto.PresentacionId);
                var nombrePresentacion = presentacionEncontrada?.NombrePresentacion ?? "Sin presentación";
                var contenido = presentacionEncontrada?.Contenido ?? "";
                var cantidad = presentacionEncontrada?.CantidadPorPresentacion ?? 1;
                var marcaEncontrada = marcas.FirstOrDefault(m => m.MarcaId == producto.MarcaId);
                var nombreMarca = marcaEncontrada?.NombreMarca ?? "Sin marca";

                producto.NombreCompleto = cantidad > 1 ?
                    $"{nombrePresentacion} de {producto.NombreProducto} x {cantidad} {contenido}" :
                    $"{nombrePresentacion} de {producto.NombreProducto} {nombreMarca} de {contenido}";
            }

            var marca = marcas.FirstOrDefault(u => u.MarcaId == id);
            if (marca == null)
            {
                return NotFound();
            }

            ViewBag.Marca = marca;
            

            var productosDeMarca = productos.Where(p => p.MarcaId == id).ToList();
            ViewBag.CantidadProductosAsociados = productosDeMarca.Count;

            if (!productosDeMarca.Any())
            {
                ViewBag.Message = "No se encontraron productos asociados a esta marca.";
                return View(productosDeMarca.ToPagedList(1, 1));
            }

            int pageSize = 5; //registros por pagina
            int pageNumber = page ?? 1;

            var pagedProductos = productosDeMarca.ToPagedList(pageNumber, pageSize);

            return View(pagedProductos);
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
                var catehgoriaantesdeenviar = marca;
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


    }


}
