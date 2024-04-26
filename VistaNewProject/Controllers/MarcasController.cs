using Microsoft.AspNetCore.Mvc;
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



        public async Task<IActionResult> Index(int? page)
        {
            int pageSize = 5; // Cambiado a 5 para que la paginación se haga cada 5 registros
            int pageNumber = page ?? 1; // Número de página actual (si no se especifica, es 1)

            var marcas = await _client.GetMarcaAsync(); // Obtener todas las marcas

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

            return View(pageMarca); // Pasar la lista de marcas paginada a la vista
           
        }
        public async Task<IActionResult> Details(int? id, int? page)
        {
            if (id == null)
            {
                return NotFound();
            }

            var marcas = await _client.GetMarcaAsync();
            var marca = marcas.FirstOrDefault(u => u.MarcaId == id);
            if (marca == null)
            {
                return NotFound();
            }

            ViewBag.Marca = marca;

            var productos = await _client.GetProductoAsync();
            var productosDeMarca = productos.Where(p => p.MarcaId == id);

            int pageSize = 2; // Número máximo de elementos por página
            int pageNumber = page ?? 1;

            var pagedProductos = productosDeMarca.ToPagedList(pageNumber, pageSize);

            return View(pagedProductos);
        }

    [HttpPost]
        public async Task<IActionResult> Create([FromForm] string nombreMarca)
        {
            if (ModelState.IsValid)
            {
                var marcaexist = await _client.FindnombreMarcasAsync(nombreMarca);
                if (marcaexist != null)
                {
                    TempData["SweetAlertIcon"] = "error";
                    TempData["SweetAlertTitle"] = "Error";
                    TempData["SweetAlertMessage"] = "Ya hay una marca registrada con ese nombre.";
                    return RedirectToAction("Index");
                }

                // Resto del código para crear la nueva marca
                var marca = new Marca
                {
                    NombreMarca = nombreMarca
                };

                if ( marca==null)
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
        public async Task<IActionResult> Update([FromForm] int marcaIdAct, [FromForm] string nombreMarcaAct, [FromForm] int estadoMarcaAct)
        {
            try
            {
                // Obtener la marca existente para comparar el nombre
                var marcaExistente = await _client.FindMarcasAsync(marcaIdAct);

                // Verificar si ya existe una marca con el mismo nombre
                if (marcaExistente != null && marcaExistente.NombreMarca == nombreMarcaAct && marcaExistente.MarcaId != marcaIdAct )
                {
                    TempData["SweetAlertIcon"] = "error";
                    TempData["SweetAlertTitle"] = "Error";
                    TempData["SweetAlertMessage"] = "Ya hay una marca registrada con ese nombre.";
                    return RedirectToAction("Index");
                }

                // Continuar con la lógica de actualización de la marca si no hay una marca con el mismo nombre

                // Crear un objeto Marca con los datos recibidos del formulario
                var marca = new Marca
                {
                    MarcaId = marcaIdAct,
                    NombreMarca = nombreMarcaAct,
                    EstadoMarca = estadoMarcaAct == 1 ? 1ul : 0ul
                };

                // Llamar al método en el cliente para actualizar la marca
                var response = await _client.UpdateMarcaAsync(marca);

                if (response != null)
                {
                    if (response.IsSuccessStatusCode)
                    {
                        TempData["SweetAlertIcon"] = "success";
                        TempData["SweetAlertTitle"] = "Éxito";
                        TempData["SweetAlertMessage"] = "Marca actualizada correctamente.";
                        return RedirectToAction("Index");
                    }
                    else if (response.StatusCode == HttpStatusCode.NotFound)
                    {
                        TempData["SweetAlertIcon"] = "error";
                        TempData["SweetAlertTitle"] = "Error";
                        TempData["SweetAlertMessage"] = "La marca no se encontró en el servidor.";
                        return RedirectToAction("Index");
                    }
                    else if (response.StatusCode == HttpStatusCode.BadRequest)
                    {
                        TempData["SweetAlertIcon"] = "error";
                        TempData["SweetAlertTitle"] = "Error";
                        TempData["SweetAlertMessage"] = "Nombre de marca duplicado.";
                        return RedirectToAction("Index");
                    }
                    else
                    {
                        TempData["SweetAlertIcon"] = "error";
                        TempData["SweetAlertTitle"] = "Error";
                        TempData["SweetAlertMessage"] = "Error al actualizar la marca.";
                        return RedirectToAction("Index");
                    }
                }
                else
                {
                    TempData["SweetAlertIcon"] = "error";
                    TempData["SweetAlertTitle"] = "Error";
                    TempData["SweetAlertMessage"] = "Error al realizar la solicitud de actualización.";
                    return RedirectToAction("Index");
                }
            }
            catch (Exception ex)
            {
                // Manejar cualquier excepción que pueda ocurrir durante la actualización
                TempData["SweetAlertIcon"] = "error";
                TempData["SweetAlertTitle"] = "Error";
                TempData["SweetAlertMessage"] = "Error al actualizar la marca: " + ex.Message;
                return RedirectToAction("Index");
            }
        }

        public async Task<IActionResult> Delete(int id) 
        {
            var response = await _client.DeleteMarcaAsync(id);
            if (response == null)
            {
                // No se recibió una respuesta válida del servidor
                TempData["SweetAlertIcon"] = "error";
                TempData["SweetAlertTitle"] = "Error";
                TempData["SweetAlertMessage"] = "Error al eliminar la marca.";
            }
            else if (response.IsSuccessStatusCode)
            {
                // La solicitud fue exitosa (código de estado 200 OK)
                TempData["SweetAlertIcon"] = "success";
                TempData["SweetAlertTitle"] = "Éxito";
                TempData["SweetAlertMessage"] = "Marca eliminada correctamente.";
            }
            else if (response.StatusCode == HttpStatusCode.NotFound)
            {
                // La marca no se encontró en el servidor
                TempData["SweetAlertIcon"] = "error";
                TempData["SweetAlertTitle"] = "Error";
                TempData["SweetAlertMessage"] = "La marca no se encontró en el servidor.";
            }
            else if (response.StatusCode == HttpStatusCode.BadRequest)
            {
                // La solicitud fue incorrecta debido a una restricción
                TempData["SweetAlertIcon"] = "error";
                TempData["SweetAlertTitle"] = "Error";
                TempData["SweetAlertMessage"] = "No se puede eliminar la marca debido a una restricción (marca asociada a un producto).";
            }

            else
            {
                // Otro tipo de error no manejado específicamente
                TempData["SweetAlertIcon"] = "error";
                TempData["SweetAlertTitle"] = "Error";
                TempData["SweetAlertMessage"] = "Error desconocido al eliminar la marca.";
            }

            return RedirectToAction("Index");
        }





    }


}
