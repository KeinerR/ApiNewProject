using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Models;
using VistaNewProject.Services;
using X.PagedList;
using System;
using Microsoft.AspNetCore.Http;
using System.Net;
using Microsoft.CodeAnalysis.Operations;


namespace VistaNewProject.Controllers
{
    public class ProductosController : Controller
    {

        private readonly IApiClient _client;
        public ProductosController(IApiClient client)
        {
            _client = client;
        }

        public async Task<IActionResult> Index(int? page)
        {
            int pageSize = 5; // Número máximo de elementos por página
            int pageNumber = page ?? 1;

            var productos = await _client.GetProductoAsync();

            var presentaciones = await _client.GetPresentacionAsync();
            var Productos = await _client.GetProductoAsync();
            var categorias = await _client.GetCategoriaAsync();
            var marcas = await _client.GetMarcaAsync();

            // Concatenar nombre DEL PRODUCTO controlador
            foreach (var presentacion in presentaciones)
            {
                var presentacionEncontrada = presentaciones.FirstOrDefault(p => p.PresentacionId== presentacion.PresentacionId);
                var nombrepresentacion= presentacionEncontrada != null ? presentacionEncontrada.NombrePresentacion : "Sin nombre";
                var contenido = presentacionEncontrada != null ? presentacionEncontrada.Contenido : "Sin contennido";
                var cantidad = presentacionEncontrada != null ? presentacionEncontrada.CantidadPorPresentacion : 0;

                if (cantidad > 1) {
                    presentacion.NombreCompleto = $"{nombrepresentacion} x {cantidad} unidades de {contenido}";
                } else {
                    presentacion.NombreCompleto = $"{nombrepresentacion} de {contenido}";
                }
               
            }
            if (productos == null)
            {
                return NotFound("error");
            }

            var pageProducto = await productos.ToPagedListAsync(pageNumber, pageSize);
            if (!pageProducto.Any() && pageProducto.PageNumber > 1)
            {
                pageProducto = await productos.ToPagedListAsync(pageProducto.PageCount, pageSize);
            }
            // Concatenar nombre DEL PRODUCTO controlador
            foreach (var producto in productos)
            {
                var presentacionEncontrada = presentaciones.FirstOrDefault(p => p.PresentacionId == producto.PresentacionId);
                var nombrePresentacion = presentacionEncontrada != null ? presentacionEncontrada.NombrePresentacion : "Sin presentación";
                var contenido = presentacionEncontrada != null ? presentacionEncontrada.Contenido : "";
                int cantidad = presentacionEncontrada != null ? presentacionEncontrada.CantidadPorPresentacion ?? 0 : 0;

                var marcaEncontrada = marcas.FirstOrDefault(m => m.MarcaId == producto.MarcaId);
                var nombreMarca = marcaEncontrada != null ? marcaEncontrada.NombreMarca : "Sin marca";

               
                if (cantidad > 1)
                {
                    producto.NombreCompleto = $"{nombrePresentacion} de {producto.NombreProducto} x {cantidad} {contenido}";
                }
                else {
                    producto.NombreCompleto = $"{nombrePresentacion} de {producto.NombreProducto} {nombreMarca}  de {contenido}"; ;
                }
            }

            int contador = (pageNumber - 1) * pageSize + 1; // Calcular el valor inicial del contador
            ViewBag.Contador = contador;
            ViewBag.Presentaciones = presentaciones;
            ViewBag.Categorias = categorias;
            ViewBag.Productos = Productos;
            ViewBag.Marcas = marcas;

        

            // Código del método Index que querías integrar
            string mensaje = HttpContext.Session.GetString("Message");
            TempData["Message"] = mensaje;

            try
            {
                ViewData["Productos"] = productos;
                return View(pageProducto);
            }
            catch (HttpRequestException ex) when ((int)ex.StatusCode == 404)
            {
                HttpContext.Session.SetString("Message", "No se encontró la página solicitada");
                return RedirectToAction("Index", "Home");
            }
            catch
            {
                HttpContext.Session.SetString("Message", "Error en el aplicativo");
                return RedirectToAction("LogOut", "Accesos");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] ProductoEnd producto)
        {
            try
            {
                var productos = await _client.GetProductoAsync();

                // Normalizar el nombre del producto para la comparación
                string Normalize(string input) => input?.ToLowerInvariant().Replace(" ", "");

                var normalizedProductoNombre = Normalize(producto.NombreProducto);
                var productExist = productos.FirstOrDefault(p =>
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
                    var response = await _client.CreateProductoAsync(new Producto
                    {
                        NombreProducto = producto.NombreProducto,
                        PresentacionId = producto.PresentacionId,
                        MarcaId = producto.MarcaId,
                        ProductoId = producto.ProductoId,
                        CategoriaId = producto.CategoriaId,
                        CantidadTotal = producto.CantidadTotal,
                        CantidadAplicarPorMayor = producto.CantidadAplicarPorMayor,
                        DescuentoAplicarPorMayor = producto.DescuentoAplicarPorMayor,
                        Estado = producto.Estado
                    });

                    if (response.IsSuccessStatusCode)
                    {
                        // Imprimir los valores por consola del servidor
                        Console.WriteLine("Nuevo producto creado:");
                        Console.WriteLine($"Nombre Producto: {producto.NombreProducto}");
                        Console.WriteLine($"Presentacion ID: {producto.PresentacionId}");
                        Console.WriteLine($"Producto ID: {producto.ProductoId}");
                        Console.WriteLine($"Categoria ID: {producto.CategoriaId}");
                        Console.WriteLine($"Cantidad Total: {producto.CantidadTotal}");
                        Console.WriteLine($"Estado Producto: {producto.Estado}");

                        TempData["SweetAlertIcon"] = "success";
                        TempData["SweetAlertTitle"] = "Exito";
                        TempData["SweetAlertMessage"] = "Se ha registrado exitosamente el producto";
                        TempData["EstadoAlerta"] = "false";
                        TempData["Tiempo"] = 2000;

                        return RedirectToAction("Index");
                    }
                    else
                    {
                        // Si hubo un error al crear el producto, mostrar un mensaje de error
                        TempData["SweetAlertIcon"] = "error";
                        TempData["SweetAlertTitle"] = "Error";
                        TempData["SweetAlertMessage"] = "Hubo un problema al crear el producto.";
                        TempData["EstadoAlerta"] = "false";
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


        public async Task<IActionResult> Details(int? id)
        {
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
            var marcaInfo = marca.FirstOrDefault(u => u.MarcaId == productoInfo.MarcaId);
            var categoriaInfo = categoria.FirstOrDefault(u => u.CategoriaId == productoInfo.CategoriaId);

            // Filtrar los lotes para obtener solo aquellos con una cantidad mayor que cero
            var lotesInfo = lotes
                .Where(u => u.ProductoId == productoInfo.ProductoId && u.Cantidad > 0 && u.EstadoLote == 1)
                .ToList();

            var nombrePresentacion = presentacionInfo.NombrePresentacion;
            var contenido = presentacionInfo.Contenido;
            int cantidad = 0; // Valor predeterminado en caso de que CantidadPorPresentacion sea nulo
            if (presentacionInfo.CantidadPorPresentacion.HasValue)
            {
                cantidad = presentacionInfo.CantidadPorPresentacion.Value;
            }

            var nombreMarca = marcaInfo.NombreMarca;

            if (cantidad > 1)
            {
                productoInfo.NombreCompleto = $"{nombrePresentacion} de {productoInfo.NombreProducto} x {cantidad} {contenido}";
            }
            else
            {
                productoInfo.NombreCompleto = $"{nombrePresentacion} de {productoInfo.NombreProducto} {nombreMarca}  de {contenido}";
            }

            ViewData["Producto"] = productoInfo;
            ViewData["Lotes"] = lotesInfo;

            return View();
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
                var productos = await _client.GetProductoAsync();

                // Normalizar el nombre del producto para la comparación
                string Normalize(string input) => input?.ToLowerInvariant().Replace(" ", "");

                var normalizedProductoNombre = Normalize(producto.NombreProducto);
                // Buscar productos que coincidan pero ignorar el producto actual por su ID
                var productExist = productos.FirstOrDefault(p =>
                    p.ProductoId != producto.ProductoId && // Ignorar el mismo producto por ID
                    Normalize(p.NombreProducto) == normalizedProductoNombre &&
                    p.PresentacionId == producto.PresentacionId &&
                    p.ProductoId == producto.ProductoId &&
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

        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var producto = await _client.FindProductoAsync(id);

                if (producto == null)
                {
                    TempData["SweetAlertIcon"] = "error";
                    TempData["SweetAlertTitle"] = "Error";
                    TempData["SweetAlertMessage"] = "El producto a eliminar no existe.";
                    TempData["Tiempo"] = 3000;
                    return RedirectToAction("Index");
                }

                // Verificar si el producto está asociado a algún detalle de compra, detalle de pedido o lote
                bool tieneDetallesAsociados = await VerificarDetallesAsociados(producto);

                if (tieneDetallesAsociados)
                {
                    TempData["SweetAlertIcon"] = "error";
                    TempData["SweetAlertTitle"] = "Error";
                    TempData["SweetAlertMessage"] = "No se puede eliminar el producto porque tiene detalles asociados.";
                    TempData["Tiempo"] = 3000;
                    return RedirectToAction("Index");
                }

                // Si no tiene detalles asociados, procede con la eliminación del producto
                // Código para eliminar el producto...
                var response = await _client.DeleteProductoAsync(id);
                if (response == null)
                {
                    TempData["SweetAlertIcon"] = "error";
                    TempData["SweetAlertTitle"] = "Error";
                    TempData["SweetAlertMessage"] = "Error al eliminar el Producto.";
                    TempData["Tiempo"] = 3000;
                }
                else if (response.IsSuccessStatusCode)
                {
                    TempData["SweetAlertIcon"] = "success";
                    TempData["SweetAlertTitle"] = "Éxito";
                    TempData["SweetAlertMessage"] = "Producto eliminado correctamente.";
                    TempData["Tiempo"] = 3000;
                }
                else if (response.StatusCode == HttpStatusCode.NotFound)
                {
                    TempData["SweetAlertIcon"] = "error";
                    TempData["SweetAlertTitle"] = "Error";
                    TempData["SweetAlertMessage"] = "El Producto no se encontró en el servidor.";
                    TempData["Tiempo"] = 3000;
                }
                else
                {
                    TempData["SweetAlertIcon"] = "error";
                    TempData["SweetAlertTitle"] = "Error";
                    TempData["SweetAlertMessage"] = "Error desconocido al eliminar el Producto.";
                    TempData["Tiempo"] = 3000;
                }
                return RedirectToAction("Index");
            }
            catch (Exception ex)
            {
                // Log de la excepción u otro manejo de errores
                TempData["SweetAlertIcon"] = "error";
                TempData["SweetAlertTitle"] = "Error";
                TempData["SweetAlertMessage"] = "Hubo un problema al eliminar el producto.";
                TempData["Tiempo"] = 3000;
                return RedirectToAction("Index");
            }
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






    }
}