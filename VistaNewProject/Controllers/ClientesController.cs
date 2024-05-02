using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Models;
using VistaNewProject.Services;
using X.PagedList;


namespace VistaNewProject.Controllers
{
    public class ClientesController : Controller
    {


        private readonly IApiClient _client;


        public ClientesController(IApiClient client)
        {
            _client = client;
        }


        public async Task<IActionResult> Index(int? page)
        {
            int pageSize = 5; // Cambiado a 5 para que la paginación se haga cada 5 registros
            int pageNumber = page ?? 1; // Número de página actual (si no se especifica, es 1)

            var clientes = await _client.GetClientesAsync(); // Obtener todas las marcas

            if (clientes == null)
            {
                return NotFound("error");
            }

            var pageCliente = await clientes.ToPagedListAsync(pageNumber, pageSize);
            if (!pageCliente.Any() && pageCliente.PageNumber > 1)
            {
                pageCliente = await clientes.ToPagedListAsync(pageCliente.PageCount, pageSize);
            }

            int contador = (pageNumber - 1) * pageSize + 1; // Calcular el valor inicial del contador

            ViewBag.Contador = contador;

            // Código del método Index que querías integrar
            string mensaje = HttpContext.Session.GetString("Message");
            TempData["Message"] = mensaje;

            try
            {
                ViewData["Clientes"] = clientes;
                return View(pageCliente);
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
        public async Task<IActionResult> Create([FromForm] string identificacion, string nombreEntidad, string nombreCompleto, string tipoCliente, string telefono, string correo, string direccion, ulong estadoCliente)
        {
            if (ModelState.IsValid)
            {

                // Si ya existe una categoría con el mismo nombre, mostrar un mensaje de error
               

                // Resto del código para crear la nueva marca
                var cliente = new Cliente
                {
                    Identificacion = identificacion,
                    NombreEntidad = nombreEntidad,
                    NombreCompleto = nombreCompleto,
                    TipoCliente = tipoCliente,
                    Telefono = telefono,
                    Correo = correo,
                    Direccion = direccion,
                    EstadoCliente = estadoCliente
                };

                if (cliente == null)
                {
                    ViewBag.MensajeError = "No se pudieron campos  los datos.";
                    return View("Index");
                }

                var response = await _client.CreateClienteAsync(cliente);


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








