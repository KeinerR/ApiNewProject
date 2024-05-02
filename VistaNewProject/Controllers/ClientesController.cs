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


        public async Task<IActionResult> Index()
        {

            var cliente = await _client.GetClientesAsync();
            if (cliente == null) 

                {
                return NotFound("No se pudo encontra el cliente");
                }

            return View(cliente);
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








