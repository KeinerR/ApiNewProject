using Microsoft.AspNetCore.Mvc;
using System.Net;
using VistaNewProject.Models;
using VistaNewProject.Services;
using X.PagedList;

namespace VistaNewProject.Controllers
{
    public class PresentacionesController : Controller
    {
        private readonly IApiClient _client;


        public PresentacionesController(IApiClient client)
        {
            _client = client;
        }

        public async Task<IActionResult> Index(int? page)
        {
            int pageSize = 5; // Número máximo de elementos por página
            int pageNumber = page ?? 1;

            var presentaciones = await _client.GetPresentacionAsync();

            if (presentaciones == null)
            {
                return NotFound("error");
            }

            var pagedPresentaciones = await presentaciones.ToPagedListAsync(pageNumber, pageSize);

            // Verifica si la página actual está vacía y redirige a la última página que contiene registros
            if (!pagedPresentaciones.Any() && pagedPresentaciones.PageNumber > 1)
            {
                pagedPresentaciones = await presentaciones.ToPagedListAsync(pagedPresentaciones.PageCount, pageSize);
            }
            int contador = 1;
            if (page.HasValue && page > 1)
            {
                // Obtener el valor actual del contador de la sesión si estamos en una página diferente a la primera
                contador = HttpContext.Session.GetInt32("Contador") ?? 1;
            }

            // Establecer el valor del contador en la sesión para su uso en la siguiente página
            HttpContext.Session.SetInt32("Contador", contador + pagedPresentaciones.Count);

            ViewBag.Contador = contador;
            return View(pagedPresentaciones);
        }
        public async Task<IActionResult> Details(int? id, int? page)
        {
            if (id == null)
            {
                return NotFound();
            }

            var presentaciones = await _client.GetPresentacionAsync();
            var presentacion = presentaciones.FirstOrDefault(u => u.PresentacionId == id);
            if (presentacion == null)
            {
                return NotFound();
            }

            ViewBag.Presentacion = presentacion;

            var productos = await _client.GetProductoAsync();
            var productosDePresentacion = productos.Where(p => p.PresentacionId == id);

            int pageSize = 1; // Número máximo de elementos por página
            int pageNumber = page ?? 1;

            var pagedProductos = productosDePresentacion.ToPagedList(pageNumber, pageSize);

            return View(pagedProductos);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] string nombrePresentacion,string contenido,int cantidadPorPresentacion, string descripcionPresentacion)
        {
            if (ModelState.IsValid)
            {
                var presentaciones = await _client.GetPresentacionAsync();
                var presentacionesexist = presentaciones.FirstOrDefault(c => string.Equals(c.NombrePresentacion, nombrePresentacion, StringComparison.OrdinalIgnoreCase));

                // Si ya existe una categoría con el mismo nombre, mostrar un mensaje de error
                if (presentacionesexist != null)
                {
                    TempData["SweetAlertIcon"] = "error";
                    TempData["SweetAlertTitle"] = "Error";
                    TempData["SweetAlertMessage"] = "Ya hay una presentacion registrada con ese nombre.";
                    return RedirectToAction("Index");
                }

                var presentacion = new Presentacion
                {
                    NombrePresentacion=nombrePresentacion,  
                    Contenido=contenido,
                    CantidadPorPresentacion= cantidadPorPresentacion,
                    DescripcionPresentacion= descripcionPresentacion

                    
                };
                var response= await _client.CreatePresentacionAsync(presentacion);

                if (response.IsSuccessStatusCode)
                {

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


        public async Task<IActionResult> Update([FromForm] int presentacionIdAct, string nombrepresentacionAct, string contenidoAct, int cantidadPorPresentacionAct, string descripcionPresentacionAct , ulong estadoPresentacionAct)
        {

            var presentaciones = await _client.GetPresentacionAsync();
            var presentacionesexist = presentaciones.FirstOrDefault(c => string.Equals(c.NombrePresentacion, nombrepresentacionAct, StringComparison.OrdinalIgnoreCase));

            // Si ya existe una categoría con el mismo nombre, mostrar un mensaje de error
            if (presentacionesexist != null)
            {
                TempData["SweetAlertIcon"] = "error";
                TempData["SweetAlertTitle"] = "Error";
                TempData["SweetAlertMessage"] = "Ya hay una presentacion registrada con ese nombre.";
                return RedirectToAction("Index");
            }


            var presentacion = new Presentacion
            {
                PresentacionId=presentacionIdAct,
                NombrePresentacion=nombrepresentacionAct,
                Contenido=contenidoAct,
                CantidadPorPresentacion=cantidadPorPresentacionAct,
                DescripcionPresentacion=descripcionPresentacionAct,
                EstadoPresentacion = estadoPresentacionAct == 1 ? 1ul : 0ul

            };

            var response= await _client.UpdatePresentacionAsync(presentacion);

            if (response!=null){


                if (response.IsSuccessStatusCode)
                {
                    if (response.IsSuccessStatusCode)
                    {
                        TempData["SweetAlertIcon"] = "success";
                        TempData["SweetAlertTitle"] = "Éxito";
                        TempData["SweetAlertMessage"] = "Presentacion actualizada correctamente.";
                        return RedirectToAction("Index");
                    }
                    else if (response.StatusCode == HttpStatusCode.NotFound)
                    {
                        TempData["SweetAlertIcon"] = "error";
                        TempData["SweetAlertTitle"] = "Error";
                        TempData["SweetAlertMessage"] = "La Presentacion no se encontró en el servidor.";
                        return RedirectToAction("Index");
                    }
                   
                    else
                    {
                        TempData["SweetAlertIcon"] = "error";
                        TempData["SweetAlertTitle"] = "Error";
                        TempData["SweetAlertMessage"] = "Error al actualizar la Presentacion.";
                        return RedirectToAction("Index");
                    }
                    
                    
               
                }

            }
            return RedirectToAction("Index");

        }

     public async Task<IActionResult> Delete(int id)
{
    // Verificar si hay datos asociados antes de intentar eliminar la presentación
    var productos = await _client.GetProductoAsync();
    var productosDePresentacion = productos.Where(p => p.PresentacionId == id);
    
    if (productosDePresentacion.Any())
    {
        // Si hay productos asociados, redirigir con un mensaje de error
        TempData["SweetAlertIcon"] = "error";
        TempData["SweetAlertTitle"] = "Error";
        TempData["SweetAlertMessage"] = "No se puede eliminar la Presentación porque tiene productos asociados.";
        return RedirectToAction("Index");
    }

    // Si no hay productos asociados, proceder con la eliminación de la presentación
    var response = await _client.DeletePresentacionAsync(id);
    if (response == null)
    {
        // No se recibió una respuesta válida del servidor
        TempData["SweetAlertIcon"] = "error";
        TempData["SweetAlertTitle"] = "Error";
        TempData["SweetAlertMessage"] = "Error al eliminar la Presentación.";
    }
    else if (response.IsSuccessStatusCode)
    {
        // La solicitud fue exitosa (código de estado 200 OK)
        TempData["SweetAlertIcon"] = "success";
        TempData["SweetAlertTitle"] = "Éxito";
        TempData["SweetAlertMessage"] = "Presentación eliminada correctamente.";
    }
    else if (response.StatusCode == HttpStatusCode.NotFound)
    {
        // La marca no se encontró en el servidor
        TempData["SweetAlertIcon"] = "error";
        TempData["SweetAlertTitle"] = "Error";
        TempData["SweetAlertMessage"] = "La Presentación no se encontró en el servidor.";
    }
    else
    {
        // Otro tipo de error no manejado específicamente
        TempData["SweetAlertIcon"] = "error";
        TempData["SweetAlertTitle"] = "Error";
        TempData["SweetAlertMessage"] = "Error desconocido al eliminar la Presentación.";
    }

    return RedirectToAction("Index");
}

    }

}
