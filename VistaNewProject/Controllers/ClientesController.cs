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
            int pageSize = 5; // Número máximo de elementos por página
            int pageNumber = page ?? 1;

            var clientes = await _client.GetClientesAsync();

            if (clientes == null)
            {
                return NotFound("error");
            }

            var pagedClientes = await clientes.ToPagedListAsync(pageNumber, pageSize);

            // Verifica si la página actual está vacía y redirige a la última página que contiene registros
            if (!pagedClientes.Any() && pagedClientes.PageNumber > 1)
            {
                pagedClientes = await clientes.ToPagedListAsync(pagedClientes.PageCount, pageSize);
            }

            return View(pagedClientes);
        }
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] string identificacion, string nombreEntidad, string nombreCompleto, string tipoCliente, string telefono, string correo, string direccion, ulong estadoCliente)
        {
            if (ModelState.IsValid)
            {

                Console.WriteLine(nombreEntidad);
                try
                {
                    // Crear el nuevo cliente
                    var nuevoCliente = new Cliente
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

                    // Llamar al método del servicio para crear el cliente
                    var response = await _client.CreateClienteAsync(nuevoCliente);

                    // Verificar si la creación fue exitosa
                    if (response.IsSuccessStatusCode)
                    {
                        TempData["Mensaje"] = "¡Registro guardado correctamente!";
                        return RedirectToAction("Index");
                    }
                    else
                    {
                        // Mostrar un mensaje de error si la solicitud HTTP no fue exitosa
                        ViewBag.MensajeError = "No se pudieron guardar los datos.";
                    }
                }
                catch (Exception ex)
                {
                    // Manejar cualquier excepción que ocurra durante la creación del cliente
                    ViewBag.MensajeError = "Ocurrió un error al intentar guardar los datos: " + ex.Message;
                }
            }
            else
            {
                // El modelo no es válido, retornar la vista actual con los errores de validación
                return View("Index");
            }

            // Si llegamos aquí, significa que ocurrió un error, retornamos a la vista actual
            return View("Index");
        }

    }
}








