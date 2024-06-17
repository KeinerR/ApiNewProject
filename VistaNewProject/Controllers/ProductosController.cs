﻿using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Models;
using VistaNewProject.Services;
using X.PagedList;
using System.Linq;
using System.Net;
using System;
using Microsoft.AspNetCore.Http;


using Microsoft.CodeAnalysis.Operations;
using System.Collections.Immutable;
using System.Net.Http;
using Microsoft.AspNetCore.Authorization;
using System.Drawing.Printing;
using System.Drawing;
using Microsoft.CSharp;
using System.Xml.Linq;
using iTextSharp.text;
using iTextSharp.text.pdf;



namespace VistaNewProject.Controllers
{
    public class ProductosController : Controller
    {
        private readonly IApiClient _client;
        private readonly ProductoService _productoService;

        public ProductosController(IApiClient client, ProductoService productoService) // Añade ProductoService al constructor
        {
            _client = client;
            _productoService = productoService; // Inicializa ProductoService
        }

        public async Task<ActionResult> Index(int? page, string order = "default")
        {

            var categorias = await _client.GetCategoriaAsync();
            var marcas = await _client.GetMarcaAsync();
            var productos = await _productoService.ConcatenarNombreCompletoProductos();
            productos.Reverse();
            productos.OrderByDescending(c => c.Estado == 1).ToList();
            var presentaciones = await _productoService.ConcatenarNombreCompletoPresentaciones();

            switch (order.ToLower())
            {
                case "first":
                    productos.Reverse();
                    productos.OrderByDescending(c => c.Estado == 1).ToList();
                    break;
                case "alfabetico":
                    productos.OrderBy(p => p.NombreCompletoProducto).ToList();
                    productos.OrderByDescending(c => c.Estado == 1).ToList();
                    break;
                case "name_desc":
                    productos.OrderByDescending(p => p.NombreCompletoProducto).ToList();
                    productos.OrderByDescending(c => c.Estado == 1).ToList();
                    break;
                default:
                    break;
            }
            int pageSize = 5; // Número máximo de elementos por página
            int pageNumber = page ?? 1;
            var pageProductos = productos.ToPagedList(pageNumber, pageSize);

            // Si la página solicitada no tiene elementos y no es la primera página, redirigir a la última página
            if (!pageProductos.Any() && pageProductos.PageNumber > 1)
            {
                return RedirectToAction("Index", new { page = pageProductos.PageCount });
            }

            int contador = (pageNumber - 1) * pageSize + 1; // Calcular el valor inicial del contador

            ViewBag.Contador = contador;
            ViewBag.Presentaciones = presentaciones;
            ViewBag.Categorias = categorias;
            ViewBag.Productos = productos; // Pasar la lista paginada y ordenada a la vista
            ViewBag.Marcas = marcas;
            ViewBag.Order = order; // Pasar el criterio de orden a la vista
            ViewData["Productos"] = productos;
            return View(pageProductos);
        }

        [HttpPost("Productos/filtrarDataList/{filtrar}/{asociar}/{asociarcategoria?}")]
        public async Task<ActionResult> filtrarDataList(int? filtrar, int? asociar, int? asociarcategoria = null)
        {
            var categorias = await _client.GetCategoriaAsync();
            var marcas = await _client.GetMarcaAsync();
            var presentaciones = await _client.GetPresentacionAsync();
            var categoriasxpresentaciones = await _client.GetCategoriaxPresentacionesAsync();
            var categoriasxmarcas = await _client.GetCategoriaxMarcasAsync();
            // Verificar si se debe filtrar por elementos activos
            if (filtrar == 0)
            {
                // Filtrar por elementos activos
                categorias = categorias.Where(c => c.EstadoCategoria == 1).ToList();
                marcas = marcas.Where(m => m.EstadoMarca == 1).ToList();
                presentaciones = presentaciones.Where(p => p.EstadoPresentacion == 1).ToList();
            }
            if (asociarcategoria != null)
            {
                if (asociar == 1)
                {
                    // Filtrar categorías asociadas a la unidad específica
                    var marcasAsociadasIds = categoriasxmarcas
                        .Where(cu => cu.CategoriaId == asociarcategoria.Value)
                        .Select(cu => cu.MarcaId)
                        .ToList();

                    marcas = marcas.Where(c => marcasAsociadasIds.Contains(c.MarcaId)).ToList();

                    var presentacionesAsociadasIds = categoriasxpresentaciones
                        .Where(cu => cu.CategoriaId == asociarcategoria.Value)
                        .Select(cu => cu.PresentacionId)
                        .ToList();

                    presentaciones = presentaciones.Where(c => presentacionesAsociadasIds.Contains(c.PresentacionId)).ToList();
                }

            }



            // Retornar los registros filtrados o todos los registros según corresponda
            return Json(new { Categorias = categorias, Marcas = marcas, Presentaciones = presentaciones });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] ProductoCrearYActualizar producto)
        {
            if (!ModelState.IsValid)
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

            try
            {
                // Verificar que todos los campos estén llenos
                if (string.IsNullOrEmpty(producto.NombreProducto) ||
                    producto.PresentacionId <= 0 ||
                    producto.MarcaId <= 0 ||
                    producto.CategoriaId <= 0)
                {
                    MensajeSweetAlert("error", "Error", "Por favor, complete todos los campos obligatorios con *.", "false", null);
                    return RedirectToAction("Index");
                }

                var productos = await _client.GetProductoAsync();

                // Normalizar el nombre del producto para la comparación
                string Normalize(string? input)
                {
                    if (input == null)
                    {
                        return string.Empty; // O cualquier otro valor predeterminado que desees
                    }
                    return input.ToLowerInvariant().Replace(" ", "");
                }

                var normalizedProductoNombre = Normalize(producto.NombreProducto);
                var productExist = productos.FirstOrDefault(p =>
                    Normalize(p.NombreProducto) == normalizedProductoNombre &&
                    p.PresentacionId == producto.PresentacionId &&
                    p.MarcaId == producto.MarcaId &&
                    p.CategoriaId == producto.CategoriaId);

                if (productExist != null)
                {
                    MensajeSweetAlert("error", "Error", $"Ya hay un producto con los mismos datos. ID: {productExist.ProductoId}", "false", null);
                    return RedirectToAction("Index");
                }

                // Concatenar el nombre completo del producto
                var productoConNombreCompleto = await _productoService.ProductosParaConcatenar(new List<ProductoCrearYActualizar> { producto });
                var nuevoProducto = productoConNombreCompleto.FirstOrDefault();

                if (nuevoProducto == null)
                {
                    MensajeSweetAlert("error", "Error", "No se pudo construir el nombre completo del producto.", "false", null);
                    return RedirectToAction("Index");
                }

                // Crear el nuevo producto
                var response = await _client.CreateProductoAsync(nuevoProducto);
                if (response.IsSuccessStatusCode)
                {
                    MensajeSweetAlert("success", "Éxito", "Se ha registrado exitosamente el producto", "false", 3000);
                    return RedirectToAction("Index");
                }
                else
                {
                    MensajeSweetAlert("error", "Error", "Hubo un problema al crear el producto.", "false", null);
                    return RedirectToAction("Index");
                }
            }
            catch (Exception ex)
            {
                // Log the exception (consider using a logging framework)
                Console.WriteLine($"An error occurred: {ex.Message}");
                // Return a 500 Internal Server Error response with the error message
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<JsonResult> FindProducto(int productoId)
        {
            var producto = await _client.FindProductoAsync(productoId);
            return Json(producto);
        }
        public async Task<IActionResult> Details(int? id, int? page)
        {
            int pageSize = 4; // Número máximo de elementos por página
            int pageNumber = page ?? 1;

            if (id == null)
            {
                return NotFound();
            }

            var producto = await _client.FindDatosProductoAsync(id.Value);
            if (producto == null)
            {
                return NotFound();
            }

            var lotesInfo = await _client.GetLotesByProductIdAsync(id.Value); // Utilizar el valor de id en lugar de productoid

            // Filtrar los lotes con EstadoLote igual a 1
            var listaLotesVista = lotesInfo.Where(loteInfo => loteInfo.EstadoLote == 1).Select(loteInfo => new LoteVista
            {
                LoteId = loteInfo.LoteId,
                DetalleCompraId = loteInfo.DetalleCompraId,
                ProductoId = loteInfo.ProductoId,
                NumeroLote = loteInfo.NumeroLote,
                PrecioCompra = FormatearPrecio(loteInfo.PrecioCompra),
                PrecioPorPresentacion = FormatearPrecio(loteInfo.PrecioPorPresentacion),
                PrecioPorUnidadProducto = FormatearPrecio(loteInfo.PrecioPorUnidadProducto),
                FechaVencimiento = loteInfo.FechaVencimiento,
                Cantidad = loteInfo.Cantidad,
                EstadoLote = loteInfo.EstadoLote,
                DetalleCompra = loteInfo.DetalleCompra,
                Producto = loteInfo.Producto,
                FechaCaducidad = FormatearFechaVencimiento(loteInfo.FechaVencimiento)
            }).ToList();

            var primerLote = listaLotesVista.FirstOrDefault();
            bool precioPorProductoIgual = listaLotesVista.All(lote => lote.PrecioPorPresentacion == primerLote?.PrecioPorPresentacion);
            bool precioPorUnidadProductoIgual = listaLotesVista.All(lote => lote.PrecioPorUnidadProducto == primerLote?.PrecioPorUnidadProducto);

            ViewData["PrecioPorUnidadProductoIgual"] = precioPorUnidadProductoIgual;
            ViewData["PrecioPorProductoIgual"] = precioPorProductoIgual;
            ViewData["CantidadPorPresentacionMasDeuno"] = producto.CantidadPorPresentacion > 1 ? true:false;


            // Concatenar nombres completos y calcular cantidad total
            var productoConcatenado = await _productoService.ConcatenarNombreCompletoProducto(producto.ProductoId);

            var pagedLote = listaLotesVista.ToPagedList(pageNumber, pageSize);
            ViewData["Pagina"] = pageNumber;
            ViewData["Producto"] = productoConcatenado;
            ViewData["Lotes"] = pagedLote; // Se cambia a pagedLote para reflejar paginación

            return View(pagedLote); // Se pasa pagedLote a la vista en lugar de listaLotesVista
        }

        [HttpPost]
        public async Task<JsonResult> FindProductos()
        {
            var productos = await _client.GetProductoAsync();
            return Json(productos);
        }
        [HttpPost]
        public async Task<IActionResult> Update([FromForm] ProductoEnd producto)
        {
            try
            {
                // Verificar que todos los campos estén llenos
                if (string.IsNullOrEmpty(producto.NombreProducto) ||
                    producto.PresentacionId <= 0 ||
                    producto.MarcaId <= 0 ||
                    producto.CategoriaId <= 0)
                {
                    TempData["SweetAlertIcon"] = "error";
                    TempData["SweetAlertTitle"] = "Error";
                    TempData["SweetAlertMessage"] = "Por favor, complete todos los campos obligatorios con *.";
                    TempData["EstadoAlerta"] = "false";
                    return RedirectToAction("Index");
                }
                var productos = await _client.GetProductoAsync();

                string Normalize(string? input)
                {
                    if (input == null)
                    {
                        return string.Empty; // O cualquier otro valor predeterminado que desees
                    }

                    return input.ToLowerInvariant().Replace(" ", "");
                }

                var normalizedProductoNombre = Normalize(producto.NombreProducto);
                var productExist = productos.FirstOrDefault(p =>
                    p.ProductoId != producto.ProductoId &&
                    Normalize(p.NombreProducto) == normalizedProductoNombre &&
                    p.PresentacionId == producto.PresentacionId &&
                    p.CategoriaId == producto.CategoriaId);

                if (productExist != null)
                {
                    TempData["SweetAlertIcon"] = "error";
                    TempData["SweetAlertTitle"] = "Error";
                    TempData["SweetAlertMessage"] = $"Ya hay un producto con los mismos datos. ID: {productExist.ProductoId}";
                    TempData["EstadoAlerta"] = "false";
                    return RedirectToAction("Index");
                }
                else
                {
                    // Crear el nuevo producto
                    var response = await _client.UpdateProductoAsync(new Producto
                    {
                        ProductoId = producto.ProductoId,
                        NombreProducto = producto.NombreProducto,
                        PresentacionId = producto.PresentacionId,
                        MarcaId = producto.MarcaId,
                        CategoriaId = producto.CategoriaId,
                        CantidadTotal = producto.CantidadTotal ?? 0,
                        CantidadReservada = 0,
                        CantidadAplicarPorMayor = producto.CantidadAplicarPorMayor,
                        DescuentoAplicarPorMayor = producto.DescuentoAplicarPorMayor,
                        Estado = producto.Estado
                    });

                    if (response.IsSuccessStatusCode)
                    {
                        TempData["SweetAlertIcon"] = "success";
                        TempData["SweetAlertTitle"] = "Exito";
                        TempData["SweetAlertMessage"] = "Se ha Actualizado exitosamente el producto";
                        TempData["EstadoAlerta"] = "false";
                        TempData["Tiempo"] = 2000;

                        return RedirectToAction("Index");
                    }
                    else
                    {
                        // Si hubo un error al crear el producto, mostrar un mensaje de error
                        TempData["SweetAlertIcon"] = "error";
                        TempData["SweetAlertTitle"] = "Error";
                        TempData["SweetAlertMessage"] = "Hubo un problema al actualizar el producto.";
                        TempData["EstadoAlerta"] = "false";
                        return RedirectToAction("Index");
                    }
                }
            }
            catch (Exception ex)
            {
                // Manejo de errores
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { success = false, message = "Ocurrió un error." });
            }

        }

        public async Task<IActionResult> Delete(int productoId)
        {
            Console.WriteLine($"ID recibido desde el formulario: {productoId}");
            // Resto del código...
            var producto = await _client.FindProductoAsync(productoId);

            if (producto == null)
            {
                MensajeSweetAlert("error", "Error", "El producto a eliminar no existe.", null, null);
                return RedirectToAction("Index");
            }
            Console.WriteLine(producto);

            // Verificar si el producto está asociado a algún detalle de compra, detalle de pedido o lote
            bool tieneDetallesAsociados = await VerificarDetallesAsociados(producto);

            if (tieneDetallesAsociados)
            {
                MensajeSweetAlert("error", "Error", "No se puede eliminar el producto porque tiene detalles asociados.", null, null);
                return RedirectToAction("Index");
            }
            // Si no tiene detalles asociados, procede con la eliminación del producto
            var response = await _client.DeleteProductoAsync(productoId);
            if (response == null)
            {
                MensajeSweetAlert("error", "Error", "Error al eliminar el Producto.", null, null);
            }
            else if (response.IsSuccessStatusCode)
            {
                MensajeSweetAlert("success", "Éxito", "Producto eliminado correctamente.", null, null);
            }
            else if (response.StatusCode == HttpStatusCode.NotFound)
            {
                MensajeSweetAlert("error", "Error", "El Producto no se encontró en el servidor.", null, null);
            }
            else
            {
                MensajeSweetAlert("error", "Error", "Error desconocido al eliminar el Producto.", null, null);
            }
            return RedirectToAction("Index");
        }
        private async Task<bool> VerificarDetallesAsociados(Producto producto)
        {
            var detallesC = await _client.GetDetallecompraAsync();
            var detallesP = await _client.GetDetallepedidoAsync();
            var lotes = await _client.GetLoteAsync();

            // Verificar si el producto está asociado a algún detalle de compra
            if (detallesC.Any(detalle => detalle.ProductoId == producto.ProductoId))
            {
                return true;
            }

            // Verificar si el producto está asociado a algún detalle de pedido
            if (detallesP.Any(detalle => detalle.ProductoId == producto.ProductoId))
            {
                return true;
            }

            // Verificar si el producto está asociado a algún lote
            if (lotes.Any(lote => lote.ProductoId == producto.ProductoId))
            {
                return true;
            }

            return false; // No tiene detalles asociados
        }

        [HttpPatch("Productos/UpdateEstadoProducto/{id}")]
        public async Task<IActionResult> CambiarEstadoProducto(int id)
        {
            try
            {
                // Llama al método del servicio para cambiar el estado del producto
                var response = await _client.CambiarEstadoProductoAsync(id);

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
            catch (Exception ex)
            {
                // Manejar cualquier excepción y devolver una respuesta de error
                return StatusCode(500, $"Error al actualizar el estado del producto: {ex.Message}");
            }
        }
        [HttpPost]
        public async Task<IActionResult> RedondearPrecios(int id)
        {
            try
            {
                var producto = await _client.FindProductoAsync(id);

                if (producto == null)
                {
                    MensajeSweetAlert("error", "Error", "El producto no existe.", "false", null);
                    return Json(new { success = false, message = "El producto no existe." });
                }

                var lotes = await _client.GetLotesByProductIdAsync(id);
                var lotesFiltrados = lotes
                    .Where(u => u.EstadoLote == 1 && u.Cantidad > 0)
                    .ToList();

                if (lotesFiltrados.Any())
                {
                    decimal? precioPorPresentacionRedondeado;
                    decimal? sumaPrecioPorPresentacion = lotesFiltrados.Sum(l => l.PrecioPorPresentacion);
                    decimal? precioPorUnidadDeProductoRedondeado;
                    decimal? sumaPrecioPorUnidadDeProducto = lotesFiltrados.Sum(l => l.PrecioPorUnidadProducto);

                    if (sumaPrecioPorPresentacion != null && sumaPrecioPorPresentacion.HasValue && lotesFiltrados.Count > 0)
                    {
                        precioPorPresentacionRedondeado = Math.Round((decimal)(sumaPrecioPorPresentacion.Value / lotesFiltrados.Count));
                    }
                    else
                    {
                        precioPorPresentacionRedondeado = 0; // O el valor por defecto que desees
                    }

                    if (sumaPrecioPorUnidadDeProducto != null && sumaPrecioPorUnidadDeProducto.HasValue && lotesFiltrados.Count > 0)
                    {
                        precioPorUnidadDeProductoRedondeado = Math.Round((decimal)(sumaPrecioPorUnidadDeProducto.Value / lotesFiltrados.Count));
                    }
                    else
                    {
                        precioPorUnidadDeProductoRedondeado = 0; // O el valor por defecto que desees
                    }

                    var PrecioPorPresentacionRedondeado = FormatearPrecio(precioPorPresentacionRedondeado); // Convertir a string
                    var PrecioPorUnidadDeProductoRedondeado = FormatearPrecio(precioPorUnidadDeProductoRedondeado);

                    return Json(new { success = true, message = "Precios redondeados correctamente.", productoId = producto.ProductoId, precioProducto = PrecioPorPresentacionRedondeado , precioUnidad = PrecioPorUnidadDeProductoRedondeado});
                }
                else
                {
                    TempData["SweetAlertIcon"] = "warning";
                    TempData["SweetAlertTitle"] = "Advertencia";
                    TempData["SweetAlertMessage"] = "El producto no tiene lotes válidos para calcular precios redondeados.";
                    TempData["Tiempo"] = 3000;

                    return Json(new { success = false, message = "El producto no tiene lotes válidos para calcular precios redondeados." });
                }
            }
            catch (Exception ex)
            {
                // Log the exception (consider using a logging framework)
                Console.WriteLine($"An error occurred: {ex.Message}");
                // Return a 500 Internal Server Error response with the error message
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> CambiarPrecios(int productoId, decimal precioProducto, decimal precioUnidad)
        {
            try
            {
                var lotes = await _client.GetLotesByProductIdAsync(productoId);

                lotes = lotes.Where(lote => lote.EstadoLote == 1);

                // Verificar si los precios están dentro del rango permitido por los lotes
                var precioMinimoPorUnidadDeProducto = lotes.Min(lote => lote.PrecioPorUnidadProducto);
                var precioMaximoPorUnidadDeProducto = lotes.Max(lote => lote.PrecioPorUnidadProducto);
                var precioMinimoPorProducto = lotes.Min(lote => lote.PrecioPorPresentacion);
                var precioMaximoPorProducto = lotes.Max(lote => lote.PrecioPorPresentacion);

                if (precioProducto < precioMinimoPorProducto || precioProducto > precioMaximoPorProducto)
                {
                    // Los precios por producto están fuera del rango permitido por los lotes
                    string mensajeError = $"Minimo: {precioMinimoPorProducto} y\n" +
                                          $"Maximo: {precioMaximoPorProducto}";

                    MensajeSweetAlertPersonalizada("error", "El precio por producto debe estar entre:", mensajeError, "false", 0);

                    return RedirectToAction("Details", new { id = productoId });
                }
               
                if (precioUnidad < precioMinimoPorUnidadDeProducto || precioUnidad > precioMaximoPorUnidadDeProducto)
                {
                    string mensajeError = $"Minimo: {precioMinimoPorUnidadDeProducto} y\n" +
                                          $"Maximo: {precioMaximoPorUnidadDeProducto}";

                    MensajeSweetAlertPersonalizada("error", "El precio por unidad debe estar entre:", mensajeError, "false", 0);

                    return RedirectToAction("Details", new { id = productoId });
                }

     
                // Consumir el servicio para actualizar los precios de los lotes
                var response = await _client.UpdatePrecioLotesAsync(productoId, precioUnidad, precioProducto);

                // Verificar si la solicitud fue exitosa
                if (response.IsSuccessStatusCode)
                {
                    // Redirigir a la acción Index
                    return RedirectToAction("Details", new { id = productoId });
                }
                else
                {
                    // Si la solicitud no fue exitosa, manejar el error aquí
                    // Por ejemplo, puedes mostrar un mensaje de error
                    MensajeSweetAlert("error", "Error", "Por favor, complete todos los campos obligatorios con *.", "false", null);
                    return RedirectToAction("Details", new { id = productoId });
                }
            }
            catch (Exception ex)
            {
                // Puedes registrar la excepción o mostrar detalles en un mensaje de error
                Console.WriteLine($"Ocurrió una excepción: {ex.Message}");

                // Puedes redirigir a una vista de error o mostrar un mensaje de error
                return RedirectToAction("Error");
            }
        }

        public async Task<IActionResult> CambiarPrecio(int productoId, decimal precioProducto, decimal precioUnidad, string numeroLote, DateTime fechaVencimiento)
        {
            // Obtener lotes asociados al producto
            var lotes = await _client.GetLotesByProductIdAsync(productoId);
            // Filtrar los lotes con estado 1 (asumiendo que el estado 1 significa activo)
            lotes = lotes.Where(lote => lote.EstadoLote == 1);

            // Encontrar el precio más alto y más bajo entre los lotes
            decimal? precioMasAltoProducto = lotes.Max(lote => lote.PrecioPorPresentacion);
            decimal? precioMasBajoProducto = lotes.Min(lote => lote.PrecioPorPresentacion);
            decimal? precioMasAltoUnidadProducto = lotes.Max(lote => lote.PrecioPorUnidadProducto);
            decimal? precioMasBajoUnidadProducto = lotes.Min(lote => lote.PrecioPorUnidadProducto);

            // Crear variables con valores basados en los precios encontrados
            decimal? tripleDelPrecioMasAltoProducto = precioMasAltoProducto * 3;
            decimal? cuarentaPorCientoDelPrecioMasBajoProducto = precioMasBajoProducto * 0.4m;
            decimal? tripleDelPrecioMasAltoUnidadProducto = precioMasAltoUnidadProducto * 3;
            decimal? cuarentaPorCientoDelPrecioMasBajoUnidadProducto = precioMasBajoUnidadProducto * 0.4m;

            // Verificar si el precio por producto está dentro del rango permitido
            if (precioProducto < cuarentaPorCientoDelPrecioMasBajoProducto || precioProducto > tripleDelPrecioMasAltoProducto)
            {
                // Los precios por producto están fuera del rango permitido por el admin
                string mensajeError = $"Mínimo 40% del precio del producto: {cuarentaPorCientoDelPrecioMasBajoProducto} y\n" +
                                      $"Máximo triple del producto: {tripleDelPrecioMasAltoProducto}";

                MensajeSweetAlertPersonalizada("error", "El precio por producto debe estar entre:", mensajeError, "false", 0);

                return RedirectToAction("Details", new { id = productoId });
            }

            // Verificar si el precio por unidad está dentro del rango permitido
            if (precioUnidad < cuarentaPorCientoDelPrecioMasBajoUnidadProducto || precioUnidad > tripleDelPrecioMasAltoUnidadProducto)
            {
                // Los precios por unidad están fuera del rango permitido por el admin
                string mensajeError = $"Mínimo 40% del precio por unidad: {cuarentaPorCientoDelPrecioMasBajoUnidadProducto} y\n" +
                                      $"Máximo triple del precio por unidad: {tripleDelPrecioMasAltoUnidadProducto}";

                MensajeSweetAlertPersonalizada("error", "El precio por unidad debe estar entre:", mensajeError, "false", 0);

                return RedirectToAction("Details", new { id = productoId });
            }

            // Lógica para actualizar el precio aquí

            return RedirectToAction("Details", "Productos", new { id = productoId });
        }
        private void MensajeSweetAlert(string icon, string title, string message, string? estado, int? tiempo)
        {
            TempData["SweetAlertIcon"] = icon;
            TempData["SweetAlertTitle"] = title;
            TempData["SweetAlertMessage"] = message;
            TempData["EstadoAlerta"] = !string.IsNullOrEmpty(estado) ? estado: "true";
            TempData["Tiempo"] = tiempo.HasValue ? tiempo.Value.ToString() : 0;
        }
        private void MensajeSweetAlertPersonalizada(string icon, string title, string message, string estado, int? tiempo)
        {
            TempData["SweetAlertMessagePersonalizado"] = "true";
            TempData["SweetAlertIcon"] = icon;
            TempData["SweetAlertTitle"] = title;
            TempData["SweetAlertMessage"] = message;
            TempData["EstadoAlerta"] = !string.IsNullOrEmpty(estado) ? estado: "true";
            TempData["Tiempo"] = tiempo.HasValue ? tiempo.Value.ToString() : 0;
        }
        private string FormatearFechaVencimiento(DateTime? fechaVencimiento)
        {
            if (fechaVencimiento.HasValue)
            {
                DateTime fechaSinHora = fechaVencimiento.Value.Date; // Obtiene solo la fecha sin la hora

                // Verifica si el día es menor que 10 y agrega un cero al principio si es así
                string diaFormateado = fechaSinHora.Day < 10 ? $"0{fechaSinHora.Day}" : fechaSinHora.Day.ToString();
                
                string mesFormateado = fechaSinHora.Month < 10 ? $"0{fechaSinHora.Month}" : fechaSinHora.Month.ToString();

                // Formatea la fecha sin la hora en el formato "yyyyMMdd"
                string fechaFormateada = $"{fechaSinHora.Year}/{mesFormateado}/{diaFormateado}";

                return fechaFormateada;
            }
            else
            {
                return string.Empty; // Si la fecha es nula, retorna una cadena vacía o puedes manejarlo de otra manera
            }
        }
        private string FormatearPrecio(decimal? precio)
        {
            if (precio.HasValue)
            {
                string precioFormateado = precio.Value.ToString("#,##0"); // Formatea el precio con puntos de mil
                return precioFormateado;
            }
            else
            {
                return string.Empty;
            }
        }

        public async Task<IActionResult> GenerarPDF()
        {
            var productos = await _client.GetProductoAsync(); // Obtener la lista de productos desde el servicio

            // Crear el documento PDF
            using (MemoryStream memoryStream = new MemoryStream())
            {
                Document document = new Document();
                PdfWriter writer = PdfWriter.GetInstance(document, memoryStream);
                document.Open();

                // Título del documento
                Paragraph title = new Paragraph("Reporte de Productos", FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 18, BaseColor.BLACK));
                title.Alignment = Element.ALIGN_CENTER;
                document.Add(title);

                // Agregar tabla de productos
                PdfPTable table = new PdfPTable(4); // 4 columnas para Categoría, Marca, Nombre Producto, Cantidad
                table.WidthPercentage = 100;
                table.SpacingBefore = 10f;
                table.SpacingAfter = 10f;

                // Encabezados de tabla
                PdfPCell cell = new PdfPCell(new Phrase("Categoría", FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 12, BaseColor.WHITE)));
                cell.BackgroundColor = BaseColor.GRAY;
                table.AddCell(cell);

                cell = new PdfPCell(new Phrase("Marca", FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 12, BaseColor.WHITE)));
                cell.BackgroundColor = BaseColor.GRAY;
                table.AddCell(cell);

                cell = new PdfPCell(new Phrase("Nombre Producto", FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 12, BaseColor.WHITE)));
                cell.BackgroundColor = BaseColor.GRAY;
                table.AddCell(cell);

                cell = new PdfPCell(new Phrase("Cantidad", FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 12, BaseColor.WHITE)));
                cell.BackgroundColor = BaseColor.GRAY;
                table.AddCell(cell);

                // Llenar tabla con datos de productos
                foreach (var producto in productos)
                {
                    string categoriaNombre = producto.Categoria != null ? producto.Categoria.NombreCategoria : ""; // Ajustar según la propiedad correcta de Categoria
                    string marcaNombre = producto.Marca != null ? producto.Marca.NombreMarca : ""; // Ajustar según la propiedad correcta de Marca
                    string nombreProducto = producto.NombreProducto ?? "";
                    string cantidadTotal = producto.CantidadTotal.ToString();

                    table.AddCell(categoriaNombre);
                    table.AddCell(marcaNombre);
                    table.AddCell(nombreProducto);
                    table.AddCell(cantidadTotal);
                }

                // Agregar tabla al documento
                document.Add(table);

                document.Close();

                // Devolver el archivo PDF como FileResult
                return File(memoryStream.ToArray(), "application/pdf", "ReporteProductos.pdf");
            }
        }






    }
}