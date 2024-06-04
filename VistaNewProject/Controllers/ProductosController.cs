using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Models;
using VistaNewProject.Services;
using X.PagedList;
using System;
using Microsoft.AspNetCore.Http;
using System.Net;
using Microsoft.CodeAnalysis.Operations;
using System.Collections.Immutable;


namespace VistaNewProject.Controllers
{
    public class ProductosController : Controller
    {

        private readonly IApiClient _client;
        public ProductosController(IApiClient client)
        {
            _client = client;
        }

        public async Task<ActionResult> Index(int? page, string order = "default")
        {
            int pageSize = 5; // Número máximo de elementos por página
            int pageNumber = page ?? 1;
            var productos = await _client.GetProductoAsync();
            var presentaciones = await _client.GetPresentacionAsync();
            var lotes = await _client.GetLoteAsync();
            var categorias = await _client.GetCategoriaAsync();
            var marcas = await _client.GetMarcaAsync();

            // Filtrar y ordenar productos
            productos = productos.Where(p => p.Estado == 1).ToList(); // Filtrar productos activos

            switch (order.ToLower())
            {
                case "first":
                    productos = productos.Reverse().ToList();
                    break;
                case "alfabetico":
                    productos = productos.OrderBy(p => p.NombreCompleto).ToList();
                    break;
                case "name_desc":
                    productos = productos.OrderByDescending(p => p.NombreCompleto).ToList();
                    break;
                default:
                    break;
            }


            // Calcular cantidad total de lotes por ProductoId y estado activo
            var cantidadTotalPorProducto = lotes
                .Where(l => l.EstadoLote == 1) // Filtrar por estado activo
                .GroupBy(l => l.ProductoId ?? 0) // Convertir ProductoId a int no anulable
                .ToDictionary(
                    grp => grp.Key,
                    grp => grp.Sum(l => l.Cantidad) // Sumar la cantidad de cada grupo
                );


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
                    $"{nombrePresentacion} de {producto.NombreProducto} x {cantidad} {contenido}" :
                    $"{nombrePresentacion} de {producto.NombreProducto} {nombreMarca} de {contenido}";
            }

            var pageProductos= await productos.ToPagedListAsync(pageNumber, pageSize);

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
        public async Task<ActionResult> ProductosInactivos(int? page, string order = "default")
        {
            int pageSize = 5; // Número máximo de elementos por página
            int pageNumber = page ?? 1;
            var productos = await _client.GetProductoAsync();
            var presentaciones = await _client.GetPresentacionAsync();
            var lotes = await _client.GetLoteAsync();
            var categorias = await _client.GetCategoriaAsync();
            var marcas = await _client.GetMarcaAsync();

            // Filtrar y ordenar productos
            productos = productos.Where(p => p.Estado == 0).ToList(); // Filtrar productos activos

            switch (order.ToLower())
            {
                case "first":
                    productos = productos.Reverse().ToList();
                    break;
                case "alfabetico":
                    productos = productos.OrderBy(p => p.NombreCompleto).ToList();
                    break;
                case "name_desc":
                    productos = productos.OrderByDescending(p => p.NombreCompleto).ToList();
                    break;
                default:
                    break;
            }


            // Calcular cantidad total de lotes por ProductoId y estado activo
            var cantidadTotalPorProducto = lotes
                .Where(l => l.EstadoLote == 1) // Filtrar por estado activo
                .GroupBy(l => l.ProductoId ?? 0) // Convertir ProductoId a int no anulable
                .ToDictionary(
                    grp => grp.Key,
                    grp => grp.Sum(l => l.Cantidad) // Sumar la cantidad de cada grupo
                );


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
                    $"{nombrePresentacion} de {producto.NombreProducto} x {cantidad} {contenido}" :
                    $"{nombrePresentacion} de {producto.NombreProducto} {nombreMarca} de {contenido}";
            }

            var pageProductos= await productos.ToPagedListAsync(pageNumber, pageSize);

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

            var producto = await _client.GetProductoAsync();
            var presentacion = await _client.GetPresentacionAsync();
            var marca = await _client.GetMarcaAsync();
            var categoria = await _client.GetCategoriaAsync();
            var lotes = await _client.GetLoteAsync();

            if (producto == null || presentacion == null || marca == null || categoria == null || lotes == null)
            {
                return NotFound();
            }

            var productoInfo = producto.FirstOrDefault(u => u.ProductoId == id);
            if (productoInfo == null)
            {
                return NotFound();
            }

            var presentacionInfo = presentacion.FirstOrDefault(u => u.PresentacionId == productoInfo.PresentacionId);
            var nombrePresentacion = presentacionInfo?.NombrePresentacion;
            var cantidad = presentacionInfo?.CantidadPorPresentacion; // Valor predeterminado en caso de que CantidadPorPresentacion sea nulo
            var contenido = presentacionInfo?.Contenido;
            var marcaInfo = marca.FirstOrDefault(u => u.MarcaId == productoInfo.MarcaId);
            var nombreMarca = marcaInfo?.NombreMarca;
            var categoriaInfo = categoria.FirstOrDefault(u => u.CategoriaId == productoInfo.CategoriaId);

            if (cantidad > 1)
            {
                productoInfo.NombreCompleto = $"{nombrePresentacion} de {productoInfo.NombreProducto} x {cantidad} {contenido}";
            }
            else
            {
                productoInfo.NombreCompleto = $"{nombrePresentacion} de {productoInfo.NombreProducto} {nombreMarca} de {contenido}";
            }

            var lotesInfo = lotes
                .Where(u => u.ProductoId == productoInfo.ProductoId && u.Cantidad > 0 && u.EstadoLote == 1)
                .ToList();

        
            // Crear una lista de LoteVista y asignar los valores de lotesInfo
            List<LoteVista> listaLotesVista = new List<LoteVista>();
            foreach (var loteInfo in lotesInfo)
            {
                listaLotesVista.Add(new LoteVista
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
                    Producto = loteInfo.Producto
                });
            }
            foreach (var lote in listaLotesVista)
            {
                lote.FechaCaducidad = FormatearFechaVencimiento(lote.FechaVencimiento);
            }

            var pagedLote = listaLotesVista.ToPagedList(pageNumber, pageSize);
            ViewData["Producto"] = productoInfo;
            ViewData["Lotes"] = listaLotesVista; // Ahora pasamos la lista de LoteVista a la vista

            return View(pagedLote);
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
                    TempData["SweetAlertIconAct"] = "info";
                    TempData["SweetAlertTitleAct"] = "¡Atencion!";
                    TempData["SweetAlertMessageAct"] = "Valor Producto"; // Nuevo TempData para el mensaje
                    TempData["PrecioPorPresentacionRedondeado"] = precioPorPresentacionRedondeado?.ToString(); // Convertir a string
                    TempData["PrecioPorUnidadDeProductoRedondeado"] = precioPorUnidadDeProductoRedondeado?.ToString();
                    TempData["TiempoAct"] = 20000;
                    TempData["EstadoAlertaAct"] = "true";
                    Console.WriteLine(precioPorPresentacionRedondeado);
                    Console.WriteLine(precioPorUnidadDeProductoRedondeado);
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
        //Pendiente
        //[HttpPost]
        //public async Task<IActionResult> CambiarPrecios(int id, decimal precioProducto, decimal precioUnidad)
        //{
        //    try
        //    {
        //        Console.WriteLine(precioProducto);
        //        Console.WriteLine(precioProducto + 3444444444444);
        //        // Aquí puedes utilizar el ID y los precios recibidos para realizar las operaciones necesarias

        //        // Redireccionar a alguna acción después de procesar los datos
        //        return RedirectToAction("Index");
        //    }
        //    catch (Exception ex)
        //    {
        //        // Puedes registrar la excepción o mostrar detalles en un mensaje de error
        //        Console.WriteLine($"Ocurrió una excepción: {ex.Message}");

        //        // Puedes redirigir a una vista de error o mostrar un mensaje de error
        //        return RedirectToAction("Error");
        //    }

        //}

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