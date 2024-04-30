using Microsoft.AspNetCore.Mvc;
using System.Net;
using VistaNewProject.Models;
using VistaNewProject.Services;
using X.PagedList;

namespace VistaNewProject.Controllers
{
    public class UnidadesController : Controller
    {
        private readonly IApiClient _client;


        public UnidadesController(IApiClient client)
        {
            _client = client;
        }
        public async Task<IActionResult> Index(int? page)
        {
            int pageSize = 5; // Número máximo de elementos por página
            int pageNumber = page ?? 1;

            var unidades = await _client.GetUnidadAsync();

            if (unidades == null)
            {
                return NotFound("error");
            }

            var pagedUnidades = await unidades.ToPagedListAsync(pageNumber, pageSize);

            // Verifica si la página actual está vacía y redirige a la última página que contiene registros
            if (!pagedUnidades.Any() && pagedUnidades.PageNumber > 1)
            {
                pagedUnidades = await unidades.ToPagedListAsync(pagedUnidades.PageCount, pageSize);
            }
            int contador = 1;
            if (page.HasValue && page > 1)
            {
                // Obtener el valor actual del contador de la sesión si estamos en una página diferente a la primera
                contador = HttpContext.Session.GetInt32("Contador") ?? 1;
            }

            // Establecer el valor del contador en la sesión para su uso en la siguiente página
            HttpContext.Session.SetInt32("Contador", contador + pagedUnidades.Count);

            ViewBag.Contador = contador;

            return View(pagedUnidades);
        }


        public async Task<IActionResult> Details(int? id, int? page)
        {
            if (id == null)
            {
                return NotFound();
            }

            var unidades = await _client.GetUnidadAsync();
            var unidad = unidades.FirstOrDefault(u => u.UnidadId == id);
            if (unidad == null)
            {
                return NotFound();
            }

            ViewBag.Unidad = unidad;

            var productos = await _client.GetProductoAsync();
            var productosDeMarca = productos.Where(p => p.MarcaId == id);

            int pageSize = 1; // Número máximo de elementos por página
            int pageNumber = page ?? 1;

            var pagedProductos = productosDeMarca.ToPagedList(pageNumber, pageSize);

            return View(pagedProductos);
        }

       [HttpPost]
public async Task<IActionResult> Create([FromForm] string nombreUnidad, int cantidadPorUnidad, string descripcionUnidad, ulong estadoUnidad)
{
    if (ModelState.IsValid)
    {
        var unidad = new Unidad
        {
            NombreUnidad = nombreUnidad,
            CantidadPorUnidad = cantidadPorUnidad,
            DescripcionUnidad = descripcionUnidad,
            EstadoUnidad = estadoUnidad
        };

        var response = await _client.CreateUnidadAsync(unidad);

        if (response.IsSuccessStatusCode)
        {
                  
                    TempData["Mensaje"] = "¡Registro guardado correctamente!";
                    return RedirectToAction("Index");
                }
        else
        {
            TempData["MensajeError"] = "No se pudieron guardar los datos.";
        }
    }
    else
    {
        // Manejar errores de validación del modelo aquí, si es necesario
    }

    return RedirectToAction("Index");
}


        public async Task<IActionResult> Update([FromForm] int unidadesIdAct,string nombreUnidadAct , int cantidadUnidadAct ,string descripcionUnidadAct, ulong estadoUnidadAct)
        {

            var unidades = new Unidad
            {
                UnidadId = unidadesIdAct,
                NombreUnidad= nombreUnidadAct,  
                CantidadPorUnidad= cantidadUnidadAct,
                DescripcionUnidad= descripcionUnidadAct,
                EstadoUnidad=estadoUnidadAct
            };


            var response= await _client.UpdateUnidadAsync(unidades);
            if(response !=null) {

                if (response.IsSuccessStatusCode)
                {


                    TempData["SweetAlertIcon"] = "success";
                    TempData["SweetAlertTitle"] = "Éxito";
                    TempData["SweetAlertMessage"] = "Unidad actualizada correctamente.";
                    return RedirectToAction("Index");
                }
                else if (response.StatusCode == HttpStatusCode.NotFound)
                {
                    TempData["SweetAlertIcon"] = "error";
                    TempData["SweetAlertTitle"] = "Error";
                    TempData["SweetAlertMessage"] = "La Unidad no se encontró en el servidor.";
                    return RedirectToAction("Index");
                }
                else if (response.StatusCode == HttpStatusCode.BadRequest)
                {
                    TempData["SweetAlertIcon"] = "error";
                    TempData["SweetAlertTitle"] = "Error";
                    TempData["SweetAlertMessage"] = "Nombre de Unidad duplicado.";
                    return RedirectToAction("Index");
                }
                else
                {
                    TempData["SweetAlertIcon"] = "error";
                    TempData["SweetAlertTitle"] = "Error";
                    TempData["SweetAlertMessage"] = "Error al actualizar la Unidad.";
                    return RedirectToAction("Index");
                }
            }

            return RedirectToAction("Index");
           
        }

        public async Task<IActionResult> Delete(int id)
        {
            var productos = await _client.GetProductoAsync();
            var productosDeUnidad = productos.Where(p => p.UnidadId == id);

            if (productosDeUnidad.Any())
            {
                TempData["SweetAlertIcon"] = "error";
                TempData["SweetAlertTitle"] = "Error";
                TempData["SweetAlertMessage"] = "No se puede eliminar la Unidad porque tiene productos asociados.";
                return RedirectToAction("Index");
            }

            var response = await _client.DeleteUnidadAsync(id);
            if (response == null)
            {
                TempData["SweetAlertIcon"] = "error";
                TempData["SweetAlertTitle"] = "Error";
                TempData["SweetAlertMessage"] = "Error al eliminar la Unidad.";
            }
            else if (response.IsSuccessStatusCode)
            {
                TempData["SweetAlertIcon"] = "success";
                TempData["SweetAlertTitle"] = "Éxito";
                TempData["SweetAlertMessage"] = "Unidad eliminada correctamente.";
            }
            else if (response.StatusCode == HttpStatusCode.NotFound)
            {
                TempData["SweetAlertIcon"] = "error";
                TempData["SweetAlertTitle"] = "Error";
                TempData["SweetAlertMessage"] = "La Unidad no se encontró en el servidor.";
            }
            else
            {
                TempData["SweetAlertIcon"] = "error";
                TempData["SweetAlertTitle"] = "Error";
                TempData["SweetAlertMessage"] = "Error desconocido al eliminar la Unidad.";
            }

            return RedirectToAction("Index");
        }
    }
}
