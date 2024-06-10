using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Models;
using VistaNewProject.Services;
using X.PagedList;
using System;
using Microsoft.AspNetCore.Http;
using System.Net;
using Microsoft.CodeAnalysis.Operations;
using System.Collections.Immutable;
using System.Net.Http;


namespace VistaNewProject.Controllers
{
    public class ProductosController : Controller
    {
        private readonly IApiClient _client;
        private readonly ProductoService _productoService; // Agrega ProductoService como campo privado

        public ProductosController(IApiClient client, ProductoService productoService) // Añade ProductoService al constructor
        {
            _client = client;
            _productoService = productoService; // Inicializa ProductoService
        }

        public async Task<ActionResult> Index(int? page, string order = "default")
        {
            int pageSize = 5; // Número máximo de elementos por página
            int pageNumber = page ?? 1;
            var productos = await _client.GetProductoAsync();
            productos = productos.Reverse().ToList();
            productos = productos.OrderByDescending(c => c.Estado == 1).ToList();

            var presentaciones = await _client.GetPresentacionAsync();
            var categorias = await _client.GetCategoriaAsync();
            var marcas = await _client.GetMarcaAsync();

            switch (order.ToLower())
            {
                case "first":
                    productos = productos.Reverse().ToList();
                    productos = productos.OrderByDescending(c => c.Estado == 1).ToList();
                    break;
                case "alfabetico":
                    productos = productos.OrderBy(p => p.NombreCompleto).ToList();
                    productos = productos.OrderByDescending(c => c.Estado == 1).ToList();
                    break;
                case "name_desc":
                    productos = productos.OrderByDescending(p => p.NombreCompleto).ToList();
                    productos = productos.OrderByDescending(c => c.Estado == 1).ToList();
                    break;
                default:
                    break;
            }

            // Concatenar nombres completos y calcular cantidad total
            var productosConcatenados = new List<Producto>();
            foreach (var producto in productos)
            {
                var productoConcatenado = await _productoService.ConcatenarNombreCompletoProducto(producto.ProductoId);
                productosConcatenados.Add(productoConcatenado);
            }


            // Concatenar nombre completo de presentaciones
            foreach (var presentacion in presentaciones)
            {
                var nombrePresentacion = presentacion.NombrePresentacion;
                var contenido = presentacion.Contenido;
                var cantidad = presentacion.CantidadPorPresentacion ?? 1;

                presentacion.NombreCompleto = cantidad > 1 ?
                    $"{nombrePresentacion} x {cantidad} unidades de {contenido}" :
                    $"{nombrePresentacion} de {contenido}";
            }
            var pageProductos = productosConcatenados.ToPagedList(pageNumber, pageSize);

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
            ViewData["Productos"] = productosConcatenados;
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
        public async Task<IActionResult> Create([FromForm] ProductoEnd producto)
        {
            try
            {
                // Verificar que todos los campos estén llenos
                if (string.IsNullOrEmpty(producto.NombreProducto) ||
                    producto.PresentacionId <= 0 ||
                    producto.MarcaId <= 0 ||
                    producto.CategoriaId <= 0)
                {
                    MensajeSweetAlert("error", "Error", "Por favor, complete todos los campos obligatorios con *.","false",null);  
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
                    MensajeSweetAlert("error", "Error", $"Ya hay un producto con los mismos datos. ID: {productExist.ProductoId}", "false",null);
                    return RedirectToAction("Index");
                }
                else
                {
                    // Crear el nuevo producto
                    var response = await _client.CreateProductoAsync(new Producto
                    {
                        NombreProducto = producto.NombreProducto,
                        PresentacionId = producto.PresentacionId,
                        MarcaId = producto.MarcaId,
                        ProductoId = producto.ProductoId,
                        CategoriaId = producto.CategoriaId,
                        CantidadTotal = producto.CantidadTotal,
                        CantidadReservada=0,
                        CantidadAplicarPorMayor = producto.CantidadAplicarPorMayor,
                        DescuentoAplicarPorMayor = producto.DescuentoAplicarPorMayor,
                        Estado = producto.Estado
                    });

                    if (response.IsSuccessStatusCode)
                    {
                        MensajeSweetAlert("success", "Exito", "Se ha registrado exitosamente el producto", "false",3000);
                        return RedirectToAction("Index");
                    }
                    else
                    {
                        MensajeSweetAlert("error", "Error", "Hubo un problema al crear el producto.", "false", null);
                        return RedirectToAction("Index");
                    }
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

            var productos = await _client.GetProductoAsync();
            var lotes = await _client.GetLoteAsync();

            var productoInfo = productos.FirstOrDefault(u => u.ProductoId == id);
            if (productoInfo == null)
            {
                return NotFound();
            }

            // Concatenar nombres completos y calcular cantidad total
            var productoConcatenado = await _productoService.ConcatenarNombreCompletoProducto(productoInfo.ProductoId);

            var lotesInfo = lotes
                .Where(u => u.ProductoId == productoInfo.ProductoId && u.Cantidad > 0 && u.EstadoLote == 1)
                .ToList();

            // Crear una lista de LoteVista y asignar los valores de lotesInfo
            var listaLotesVista = lotesInfo.Select(loteInfo => new LoteVista
            {
                LoteId = loteInfo.LoteId,
                DetalleCompraId = loteInfo.DetalleCompraId,
                ProductoId = loteInfo.ProductoId,
                NumeroLote = loteInfo.NumeroLote,
                PrecioCompra = loteInfo.PrecioCompra,
                PrecioPorPresentacion = loteInfo.PrecioPorPresentacion,
                PrecioPorUnidadProducto = loteInfo.PrecioPorUnidadProducto,
                FechaVencimiento = loteInfo.FechaVencimiento,
                Cantidad = loteInfo.Cantidad,
                EstadoLote = loteInfo.EstadoLote,
                DetalleCompra = loteInfo.DetalleCompra,
                Producto = loteInfo.Producto,
                FechaCaducidad = FormatearFechaVencimiento(loteInfo.FechaVencimiento)
            }).ToList();

            var pagedLote = listaLotesVista.ToPagedList(pageNumber, pageSize);

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
                        CantidadTotal = producto.CantidadTotal,
                        CantidadReservada=0,
                        CantidadAplicarPorMayor = producto.CantidadAplicarPorMayor,
                        DescuentoAplicarPorMayor = producto.DescuentoAplicarPorMayor,
                        Estado = producto.Estado
                    });

                    if (response.IsSuccessStatusCode)
                    {
                        // Mostrar datos entrantes en la consola
                        Console.WriteLine($"ProductoId: {producto.ProductoId}");
                        Console.WriteLine($"NombreProducto: {producto.NombreProducto}");
                        Console.WriteLine($"EstadoProducto: {producto.Estado}");

                        // Aquí puedes agregar lógica adicional como guardar en la base de datos


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
                SetTempData("error", "Error", "El producto a eliminar no existe.");
                return RedirectToAction("Index");
            }
            Console.WriteLine(producto);

            // Verificar si el producto está asociado a algún detalle de compra, detalle de pedido o lote
            bool tieneDetallesAsociados = await VerificarDetallesAsociados(producto);

            if (tieneDetallesAsociados)
            {
                SetTempData("error", "Error", "No se puede eliminar el producto porque tiene detalles asociados.");
                return RedirectToAction("Index");
            }
            // Si no tiene detalles asociados, procede con la eliminación del producto
                var response = await _client.DeleteProductoAsync(productoId);
            if (response == null)
            {
                SetTempData("error", "Error", "Error al eliminar el Producto.");
            }
            else if (response.IsSuccessStatusCode)
            {
                SetTempData("success", "Éxito", "Producto eliminado correctamente.");
            }
            else if (response.StatusCode == HttpStatusCode.NotFound)
            {
                SetTempData("error", "Error", "El Producto no se encontró en el servidor.");
            }
            else
            {
                SetTempData("error", "Error", "Error desconocido al eliminar el Producto.");
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
                    MensajeSweetAlert("error", "Error", "El producto no existe.", "false",null);
                    return RedirectToAction("Index");
                }

                var lotes = await _client.GetLoteAsync();
                var lotesFiltrados = lotes
                    .Where(u => u.ProductoId == producto.ProductoId && u.Cantidad > 0 && u.EstadoLote == 1)
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

                    TempData["Producto"] = producto.ProductoId;
                    TempData["PrecioPorPresentacionRedondeado"] = precioPorPresentacionRedondeado?.ToString(); // Convertir a string
                    TempData["PrecioPorUnidadDeProductoRedondeado"] = precioPorUnidadDeProductoRedondeado?.ToString();
                    TempData["TiempoAct"] = false;
                    TempData["EstadoAlertaAct"] = "true";
                    return RedirectToAction("Details", "Productos", new { id = id });


                }
                else
                {
                    TempData["SweetAlertIcon"] = "warning";
                    TempData["SweetAlertTitle"] = "Advertencia";
                    TempData["SweetAlertMessage"] = "El producto no tiene lotes válidos para calcular precios redondeados.";
                    TempData["Tiempo"] = 3000;


                    return RedirectToAction("Details", "Productos", new { id = id });

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

        private void SetTempData(string icon, string title, string message)
        {
            TempData["SweetAlertIcon"] = icon;
            TempData["SweetAlertTitle"] = title;
            TempData["SweetAlertMessage"] = message;
            TempData["Tiempo"] = 3000;
            TempData["EstadoAlerta"] = "false";
        }

        private void MensajeSweetAlert(string icon, string title, string message, string estado ,int ? tiempo)
        {
            TempData["SweetAlertIcon"] = icon;
            TempData["SweetAlertTitle"] = title;
            TempData["SweetAlertMessage"] = message; 
            TempData["EstadoAlerta"] = estado;
            TempData["Tiempo"] = tiempo.HasValue ? tiempo.Value:3000;
            TempData["EstadoAlerta"] = "false";

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

    }
}