using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Models;
using VistaNewProject.Services;
using X.PagedList;

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

            var presentacion = await _client.GetPresentacionAsync();
            var marca = await _client.GetMarcaAsync();
            var unidad = await _client.GetUnidadAsync();
            var categoria = await _client.GetCategoriaAsync();

            if (productos == null)
            {
                return NotFound("error");
            }

            var pageProducto = await productos.ToPagedListAsync(pageNumber, pageSize);
            if (!pageProducto.Any() && pageProducto.PageNumber > 1)
            {
                pageProducto = await productos.ToPagedListAsync(pageProducto.PageCount, pageSize);
            }

            int contador = (pageNumber - 1) * pageSize + 1; // Calcular el valor inicial del contador



            ViewBag.Presentaciones = presentacion;
            ViewBag.Categorias = categoria;
            ViewBag.Unidades = unidad;
            ViewBag.Marcas = marca;

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
        public async Task<IActionResult> Create([FromForm] string producto)
        {
            if (ModelState.IsValid)
            {
                var productos = await _client.GetProductoAsync();
                var existeProducto= productos.FirstOrDefault(c => string.Equals(c.NombreProducto, producto, StringComparison.OrdinalIgnoreCase));

                // Si ya existe una categoría con el mismo nombre, mostrar un mensaje de error
                if (existeProducto != null)
                {
                    TempData["SweetAlertIcon"] = "error";
                    TempData["SweetAlertTitle"] = "Error";
                    TempData["SweetAlertMessage"] = "Ya hay un producto registrado con este nombre.";
                    return RedirectToAction("Index");
                }

                // Resto del código para crear la nueva marca
                var producto = new Producto
                {
                    NombreProducto = producto
                };

                if (producto == null)
                {
                    ViewBag.MensajeError = "No se pudieron campos  los datos.";
                    return View("Index");
                }

                var response = await _client.CreateMarcaAsync(marca);


                if (response.IsSuccessStatusCode)
                {
                    // Guardar un mensaje en TempData para mostrar en el Index
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

    }
}