using Microsoft.AspNetCore.Mvc;
using System.Net;
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

                var allClients = await _client.GetClientesAsync();

                // Verificar si existe algún cliente con el mismo nombre de entidad y nombre de contacto
                var existingClient = allClients.FirstOrDefault(c => c.NombreEntidad == nombreEntidad && c.NombreCompleto == nombreCompleto );

                if (existingClient != null )
                {
                    // Si existe un cliente diferente con el mismo nombre de entidad y nombre de contacto
                    // Mostrar un mensaje de error y redireccionar a la página de índice
                    TempData["SweetAlertIcon"] = "error";
                    TempData["SweetAlertTitle"] = "Error";
                    TempData["SweetAlertMessage"] = "Ya existe un cliente con el mismo nombre de entidad y nombre de contacto.";
                    return RedirectToAction("Index");
                }

                

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
       
           
      
        public async Task<IActionResult> Update([FromForm] int clienteIdAct, string identificacionAct, string nombreEntidadAct, string nombreCompletoAct, string tipoClienteAct, string telefonoAct, string correoAct, string direccionAct, ulong estadoClienetAct)
        {


            // Obtener todos los clientes
           

            var cliente = new Cliente
            {

                ClienteId = clienteIdAct,
                Identificacion=identificacionAct,
                NombreEntidad=nombreEntidadAct,
                NombreCompleto=nombreCompletoAct,   
                TipoCliente=tipoClienteAct,
                Telefono=telefonoAct,
                Correo=correoAct,
                Direccion=direccionAct,
                EstadoCliente=estadoClienetAct
            };



            var response = await _client.UpdateClienteAsync(cliente);
            if (response != null)
            {

                if (response.IsSuccessStatusCode)
                {


                    TempData["SweetAlertIcon"] = "success";
                    TempData["SweetAlertTitle"] = "Éxito";
                    TempData["SweetAlertMessage"] = "Clienet actualizada correctamente.";
                    return RedirectToAction("Index");
                }
                else if (response.StatusCode == HttpStatusCode.NotFound)
                {
                    TempData["SweetAlertIcon"] = "error";
                    TempData["SweetAlertTitle"] = "Error";
                    TempData["SweetAlertMessage"] = "El Cliente no se encontró en el servidor.";
                    return RedirectToAction("Index");
                }
              
                else
                {
                    TempData["SweetAlertIcon"] = "error";
                    TempData["SweetAlertTitle"] = "Error";
                    TempData["SweetAlertMessage"] = "Error al actualizar el Cliente.";
                    return RedirectToAction("Index");
                }
            }

            return RedirectToAction("Index");

        }

        public async Task<IActionResult> Delete(int id)
        {

            var pedido = await _client.GetPedidoAsync();
            var productosDeCategoria = pedido.Where(p => p.ClienteId == id);

            if (productosDeCategoria.Any())
            {
                TempData["SweetAlertIcon"] = "error";
                TempData["SweetAlertTitle"] = "Error";
                TempData["SweetAlertMessage"] = "No se puede eliminar el cliente porque tiene pedidos asociados.";
                return RedirectToAction("Index");
            }

            var response = await _client.DeleteClienteAsync(id);

            if (response == null)
            {
                TempData["SweetAlertIcon"] = "error";
                TempData["SweetAlertTitle"] = "Error";
                TempData["SweetAlertMessage"] = "Error al eliminar el cliente.";
            }
            else if (response.IsSuccessStatusCode)
            {
                TempData["SweetAlertIcon"] = "success";
                TempData["SweetAlertTitle"] = "Éxito";
                TempData["SweetAlertMessage"] = "cliente eliminada correctamente.";
            }
            else if (response.StatusCode == HttpStatusCode.NotFound)
            {
                TempData["SweetAlertIcon"] = "error";
                TempData["SweetAlertTitle"] = "Error";
                TempData["SweetAlertMessage"] = "el cliente no se encontró en el servidor.";
            }
            else
            {
                TempData["SweetAlertIcon"] = "error";
                TempData["SweetAlertTitle"] = "Error";
                TempData["SweetAlertMessage"] = "Error desconocido al eliminar el cliente.";
            }

            return RedirectToAction("Index");
        }
    }
}








