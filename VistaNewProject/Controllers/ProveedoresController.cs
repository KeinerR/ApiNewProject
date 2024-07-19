using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Net;
using System.Numerics;
using VistaNewProject.Models;
using VistaNewProject.Services;
using X.PagedList;

namespace VistaNewProject.Controllers
{
    public class ProveedoresController : Controller
    {
        private readonly IApiClient _client;
        public ProveedoresController(IApiClient client)
        {
            _client = client;
        }

        public async Task<IActionResult> Index(int? page, string order = "default")
        {
            int pageSize = 5;
            int pageNumber = page ?? 1;

            var proveedores = await _client.GetProveedorAsync(); // Obtener todas las proveedores

            proveedores = proveedores.Reverse().ToList();
            proveedores = proveedores.OrderByDescending(c => c.EstadoProveedor == 1).ToList();
            order = order?.ToLower() ?? "default";

            switch (order)
            {
                case "first":
                    proveedores = proveedores.Reverse(); // Se invierte el orden de las proveedores
                    proveedores = proveedores
                   .OrderByDescending(p => p.EstadoProveedor == 1)
                   .ToList();
                    break;
                case "reverse":
                    break;
                case "alfabetico":
                    proveedores = proveedores.OrderBy(p => p.NombreEmpresa).ToList(); // Se ordenan alfabéticamente por el nombre de la presentación
                    proveedores = proveedores
                    .OrderByDescending(p => p.EstadoProveedor == 1)
                    .ToList();
                    break;
                case "name_desc":
                    proveedores = proveedores.OrderByDescending(p => p.NombreEmpresa).ToList(); // Se ordenan alfabéticamente por el nombre de la presentación
                    proveedores = proveedores
                    .OrderByDescending(p => p.EstadoProveedor == 1)
                    .ToList();
                    break;
                default:
                    break;
            }

            if (proveedores == null)
            {
                return NotFound("error");
            }

            var pageProveedor = await proveedores.ToPagedListAsync(pageNumber, pageSize);

            if (!pageProveedor.Any() && pageProveedor.PageNumber > 1)
            {
                pageProveedor = await proveedores.ToPagedListAsync(pageProveedor.PageCount, pageSize);
            }

            int contador = (pageNumber - 1) * pageSize + 1; // Calcular el valor inicial del contador

            ViewBag.Contador = contador;
            ViewBag.Order = order; // Pasar el criterio de orden a la vistav
            ViewData["Proveedores"] = proveedores;
            return View(pageProveedor);

        }

        [HttpGet]
        public async Task<JsonResult> FindProveedor(int proveedorId)
        {
            try
            {
                var proveedor = await _client.FindProveedorAsync(proveedorId);
                return Json(proveedor);
            }
            catch (HttpRequestException ex)
            {
                if (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
                {
                    // Devuelve un objeto vacío si se recibe un 404
                    return Json(new { });
                }
                else
                {
                    // Maneja otras excepciones HTTP
                    throw;
                }
            }
            catch (Exception)
            {
                // Maneja otras excepciones no HTTP
                throw;
            }
        }

        [HttpGet]
        public async Task<JsonResult> FindProveedores()
        {
            var proveedores = await _client.GetProveedorAsync();
            return Json(proveedores);
        }
        public async Task<IActionResult> Details(int? id, int? page)
        {
            // Obtener todos los proveedores y filtrar por el proveedor específico
            var proveedores = await _client.GetProveedorAsync();
            var proveedor = proveedores.FirstOrDefault(u => u.ProveedorId == id);
            if (proveedor == null)
            {
                return NotFound();
            }

            // Obtener todas las compras y filtrar por el proveedor específico
            var comprasProveedor = (await _client.GetCompraAsync())
                                   .Where(c => c.ProveedorId == proveedor.ProveedorId);

            // Obtener todos los detalles de compra
            var detallesCompras = await _client.GetDetallecompraAsync();

            // Filtrar los detalles de compra por las compras del proveedor
            var detallesComprasFiltrados = detallesCompras
                                           .Where(d => comprasProveedor.Any(c => c.CompraId == d.CompraId))
                                           .ToList();

            // Calcular la cantidad total de productos
            var cantidadTotalProductosDict = detallesComprasFiltrados
                .GroupBy(d => d.ProductoId)
                .ToDictionary(g => g.Key ?? 0, g => g.Sum(d => d.Cantidad ?? 0));

            // Obtener todos los productos
            var productos = await _client.GetProductoAsync();

            // Crear la lista de productos con cantidad
            var productosConCantidad = new List<ProductoConCantidad>();
            foreach (var kvp in cantidadTotalProductosDict)
            {
                // Buscar el producto correspondiente en la lista de todos los productos
                var producto = productos.FirstOrDefault(p => p.ProductoId == kvp.Key);
                if (producto != null)
                {
                    // Concatenar el nombre completo del producto
                    producto = await ConcatenarNombreCompletoProductoAsync(producto.ProductoId);

                    productosConCantidad.Add(new ProductoConCantidad
                    {
                        ProductoId = kvp.Key,
                        NombreCompletoProducto = producto,
                        Cantidad = kvp.Value
                    });
                }
            }

            // Convertir la lista de productos con cantidad a IPagedList
            var pageNumber = page ?? 1;
            var pageSize = 4;
            var pagedProductos = productosConCantidad.ToPagedList(pageNumber, pageSize);

            // Actualizar la cantidad total de productos comprados en el proveedor
            ViewBag.CantidadTotalProductos = productosConCantidad.Sum(p => p.Cantidad);
            ViewBag.CantidadProductosAsociados = productosConCantidad.Count;
            if (productosConCantidad.Count == 0)
            {
                ViewBag.Message = "No hay productos adquiridos mediante este proveedor.";
            }

            ViewBag.Proveedor = proveedor;
            return View(pagedProductos);
        }

        public class ProductoConCantidad
        {
            public int ? ProductoId { get; set; }
            public Producto ? NombreCompletoProducto { get; set; }
            public int ? Cantidad { get; set; }
        }

        public async Task<IActionResult> Create([FromForm] Proveedor proveedor)
        {
            if (ModelState.IsValid)
            {
                var nombreEmpresaNormalizado = proveedor.NombreEmpresa?.Trim().ToLower();
                var nombreContactoNormalizado = proveedor.NombreContacto?.Trim().ToLower();
                var correoNormalizado = proveedor.Correo?.Trim().ToLower();
                var telefonoNormalizado = proveedor.Telefono?.Trim().ToLower();
                var direccionNormalizada = proveedor.Direccion?.Trim().ToLower();

                var correoPorDefault = "correo@gmail.com";
                var proveedores = await _client.GetProveedorAsync();
                var proveedorExistente = proveedores.FirstOrDefault(c =>
                    c.NombreEmpresa.Trim().ToLower() == nombreEmpresaNormalizado &&
                    c.NombreContacto.Trim().ToLower() == nombreContactoNormalizado &&
                    c.Correo.Trim().ToLower() == correoNormalizado &&
                    c.Telefono.Trim().ToLower() == telefonoNormalizado &&
                    c.Direccion.Trim().ToLower() == direccionNormalizada
                );

                var correoExistente = proveedores.FirstOrDefault(c =>
                    c.Correo.Trim().ToLower() == correoNormalizado &&
                    c.NombreEmpresa.Trim().ToLower() != nombreEmpresaNormalizado &&
                    c.Correo.Trim().ToLower() != correoPorDefault
                );

                var telefonoExistente = proveedores.FirstOrDefault(c =>
                    c.Telefono.Trim().ToLower() == telefonoNormalizado &&
                    c.NombreEmpresa.Trim().ToLower() != nombreEmpresaNormalizado
                );

                if (correoExistente != null)
                {
                    // El correo ya está siendo utilizado por otro proveedor con un nombre de empresa diferente
                    MensajeSweetAlert("error", "Error", "Ya hay un proveedor registrado con ese correo electrónico.", "true", null);
                    return RedirectToAction("Index");
                }

                if (telefonoExistente != null)
                {
                    // El teléfono ya está siendo utilizado por otro proveedor con un nombre de empresa diferente
                    MensajeSweetAlert("error", "Error", "Ya hay un proveedor registrado con ese número de teléfono.", "true", null);
                    return RedirectToAction("Index");
                }

                if (proveedorExistente != null)
                {
                    // Ya existe un proveedor registrado con estos datos
                    MensajeSweetAlert("error", "Error", $"Ya hay un proveedor registrado con estos datos. ID: {proveedorExistente.ProveedorId}", "true", null);
                    return RedirectToAction("Index");
                }

                var response = await _client.CreateProveedorAsync(proveedor);

                if (response.IsSuccessStatusCode)
                {
                    MensajeSweetAlert("success", "Éxito", "¡Proveedor registrado correctamente!", "false", null);
                    return RedirectToAction("Index");
                }
                else
                {
                    MensajeSweetAlert("error", "Error", "¡Problemas al registrar la proveedor!", "true", null);
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
        public async Task<IActionResult> Update([FromForm] ProveedorUpdate proveedor)
        {
            if (ModelState.IsValid)
            {
                var nombreEmpresaNormalizado = proveedor.NombreEmpresa?.Trim().ToLower();
                var nombreContactoNormalizado = proveedor.NombreContacto?.Trim().ToLower();
                var correoNormalizado = proveedor.Correo?.Trim().ToLower();
                var telefonoNormalizado = proveedor.Telefono?.Trim().ToLower();
                var direccionNormalizada = proveedor.Direccion?.Trim().ToLower();

                var correoPorDefault = "correo@gmail.com";
                var proveedores = await _client.GetProveedorAsync();

                var proveedorExistente = proveedores.FirstOrDefault(c =>
             c.NombreEmpresa.Trim().ToLower() == nombreEmpresaNormalizado &&
             c.NombreContacto.Trim().ToLower() == nombreContactoNormalizado &&
             c.Correo.Trim().ToLower() == correoNormalizado &&
             c.Telefono.Trim().ToLower() == telefonoNormalizado &&
             c.Direccion.Trim().ToLower() == direccionNormalizada &&
             c.ProveedorId != proveedor.ProveedorId
         );

                var correoExistente = proveedores.FirstOrDefault(c =>
                    c.Correo.Trim().ToLower() == correoNormalizado &&
                    c.NombreEmpresa.Trim().ToLower() != nombreEmpresaNormalizado &&
                    c.Correo.Trim().ToLower() != correoPorDefault &&
                    c.ProveedorId != proveedor.ProveedorId
                );

                var telefonoExistente = proveedores.FirstOrDefault(c =>
                    c.Telefono.Trim().ToLower() == telefonoNormalizado &&
                    c.NombreEmpresa.Trim().ToLower() != nombreEmpresaNormalizado &&
                    c.ProveedorId != proveedor.ProveedorId
                );

                if (correoExistente != null)
                {
                    // El correo ya está siendo utilizado por otro proveedor con un nombre de empresa diferente
                    MensajeSweetAlert("error", "Error", "Ya hay un proveedor registrado con ese correo electrónico.", "true", null);
                    return RedirectToAction("Index");
                }

                if (telefonoExistente != null)
                {
                    // El teléfono ya está siendo utilizado por otro proveedor con un nombre de empresa diferente
                    MensajeSweetAlert("error", "Error", "Ya hay un proveedor registrado con ese número de teléfono.", "true", null);
                    return RedirectToAction("Index");
                }

                if (proveedorExistente != null)
                {
                    // Ya existe un proveedor registrado con estos datos
                    MensajeSweetAlert("error", "Error", $"Ya hay un proveedor registrado con estos datos. ID: {proveedorExistente.ProveedorId}", "true", null);
                    return RedirectToAction("Index");
                }

                var response = await _client.UpdateProveedorAsync(proveedor);

                if (response == null)
                {
                    MensajeSweetAlert("error", "Error", "Error al realizar la solicitud de actualización.", "true", null);
                    return RedirectToAction("Index");
                }

                if (response.IsSuccessStatusCode)
                {
                    MensajeSweetAlert("success", "Éxito", "¡Proveedor actualizado correctamente!", "false", null);
                    return RedirectToAction("Index");
                }
                else
                {
                    MensajeSweetAlert("error", "Error", "¡Problemas al actualizar el proveedor!", "true", null);
                    return RedirectToAction("Index");
                }
            }
            else
            {
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

        public async Task<IActionResult> Delete(int proveedorId)
        {
                var response = await _client.DeleteProveedorAsync(proveedorId);
                if (response.IsSuccessStatusCode)
                {
                    MensajeSweetAlert("success", "Éxito", "Proveedor eliminado correctamente.", "true", 3000);

                }
                else if (response.StatusCode == HttpStatusCode.NotFound)
                {
                    MensajeSweetAlert("error", "Error", "La Proveedor no se encontró en el servidor.", "true", null);

                }
                else
                {
                    MensajeSweetAlert("error", "Error", "Error desconocido al eliminar la Proveedor.", "true", null);

                }

            return RedirectToAction("Index");
        }
        [HttpPatch("Proveedores/UpdateEstadoProveedor/{id}")]
        public async Task<IActionResult> CambiarEstadoProveedor(int id)
        {
            // Llama al método del servicio para cambiar el estado del usuario
            var response = await _client.CambiarEstadoProveedorAsync(id);

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

        private async Task<Producto> ConcatenarNombreCompletoProductoAsync(int productoId)
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
