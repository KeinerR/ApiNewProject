using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Models;
using VistaNewProject.Services;
using X.PagedList;
using System;
using Microsoft.AspNetCore.Http;
using System.Net;


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
            var marcas = await _client.GetMarcaAsync();
            var unidades = await _client.GetUnidadAsync();
            var categorias = await _client.GetCategoriaAsync();

            // Concatenar nombre DEL PRODUCTO controlador
            foreach (var presentacion in presentaciones)
            {
                var presentacionEncontrada = presentaciones.FirstOrDefault(p => p.PresentacionId== presentacion.PresentacionId);
                var nombrepresentacion= presentacionEncontrada != null ? presentacionEncontrada.NombrePresentacion : "Sin nombre";
                var contenido = presentacionEncontrada != null ? presentacionEncontrada.Contenido : "Sin contennido";
                var cantidad = presentacionEncontrada != null ? presentacionEncontrada.CantidadPorPresentacion : 0;
             


                presentacion.NombreCompleto= $"{nombrepresentacion} {cantidad}x{contenido}";
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

            int contador = (pageNumber - 1) * pageSize + 1; // Calcular el valor inicial del contador

            ViewBag.Presentaciones = presentaciones;
            ViewBag.Categorias = categorias;
            ViewBag.Unidades = unidades;
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
        public IActionResult Create([FromForm] Producto producto)
        {
            // Imprimir los valores por consola
            Console.WriteLine("Datos recibidos del formulario:");
            Console.WriteLine($"Producto ID: {producto.ProductoId}");
            Console.WriteLine($"Marca ID: {producto.MarcaId}");
            Console.WriteLine($"Categoria ID: {producto.CategoriaId}");
            Console.WriteLine($"Presentacion ID: {producto.PresentacionId}");
            Console.WriteLine($"Nombre Producto: {producto.NombreProducto}");
            Console.WriteLine($"Cantidad Total: {producto.CantidadTotal}");
            Console.WriteLine($"Estado Producto: {producto.Estado}");

            // Regresar a la vista sin realizar ninguna operación adicional
            return RedirectToAction("Index");
        }

    }
}