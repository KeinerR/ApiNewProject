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
                var allClients = await _client.GetClientesAsync();

                // Verificar si existe algún cliente con el mismo nombre de entidad y nombre de contacto
                var existingClient = allClients.FirstOrDefault(c => c.NombreEntidad == nombreEntidad && c.NombreCompleto == nombreCompleto);

                if (existingClient != null)
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
                    TempData["Mensaje"] = "No se pudieron campos  los datos.";
                    return RedirectToAction("Index");
                }

                var response = await _client.CreateClienteAsync(cliente);

                if (response.IsSuccessStatusCode)
                {
                    TempData["SweetAlertIcon"] = "success"; // Puede ser "success", "error", "warning", "info", etc.
                    TempData["SweetAlertTitle"] = "Éxito"; // Título de la alerta
                    TempData["SweetAlertMessage"] = "¡Registro guardado correctamente!"; // Mensaje de la alerta

                    return RedirectToAction("Index");
                }
                else
                {
                    TempData["Mensaje"] = "No se pudieron guardar los datos.";
                    return RedirectToAction("Index");
                }
            }

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








