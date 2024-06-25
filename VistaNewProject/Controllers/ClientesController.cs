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


        public async Task<IActionResult> Index(string order, int? page)
        {
            int pageSize = 5; // Cambiado a 5 para que la paginación se haga cada 5 registros
            int pageNumber = page ?? 1; // Número de página actual (si no se especifica, es 1)

            var clientes = await _client.GetClientesAsync(); // Obtener todos los clientes

            if (clientes == null)
            {
                return NotFound("Error");
            }

            // Aplicar ordenamiento según la opción seleccionada
            switch (order)
            {
                case "alfabetico":
                    clientes = clientes.OrderBy(c => c.NombreEntidad);
                    break;
                case "name_desc":
                    clientes = clientes.OrderByDescending(c => c.NombreEntidad);
                    break;
                case "first":
                    clientes = clientes.OrderBy(c => c.EstadoCliente != 0).ThenBy(c => c.NombreEntidad);
                    break;
                case "reverse":
                    clientes = clientes.OrderByDescending(c => c.EstadoCliente != 0).ThenBy(c => c.NombreEntidad);
                    break;
                default:
                    break;
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
        public async Task<IActionResult> Create([FromForm] Cliente cliente)
        {

            Console.WriteLine(cliente);

                Console.WriteLine("el modelo esta mal");
            

            Console.WriteLine(cliente);
            var clientes = new Cliente
            {
                Identificacion = cliente.Identificacion,
                NombreEntidad = cliente.NombreEntidad,
                NombreCompleto = cliente.NombreCompleto,
                TipoCliente = cliente.TipoCliente,
                Telefono = cliente.Telefono,
                Correo = cliente.Correo,
                Direccion = cliente.Direccion,
                EstadoCliente = cliente.EstadoCliente
            };

            Console.WriteLine(clientes);
            if (clientes == null)
            {
                TempData["SweetAlertIcon"] = "erro";
                TempData["SweetAlertTitle"] = "Error";
                TempData["SweetAlertMessage"] = "Cliente no se pudo Registrar Correctamente.";
                return RedirectToAction("Index");
            }

            var response = await _client.CreateClienteAsync(clientes);

            if (response.IsSuccessStatusCode)
            {
                MensajeSweetAlert("success", "Éxito", "¡Cliente registrada correctamente!", true, null);
                return RedirectToAction("Index");

            }
            else
            {
                TempData["SweetAlertIcon"] = "erro";
                TempData["SweetAlertTitle"] = "Error";
                TempData["SweetAlertMessage"] = "Cliente no se pudo Registrar Correctamente.";
                return RedirectToAction("Index");
            }
        
        }

        private void MensajeSweetAlert(string icon, string title, string message, bool ?  estado , int? tiempo)
        {
            TempData["SweetAlertIcon"] = icon;
            TempData["SweetAlertTitle"] = title;
            TempData["SweetAlertMessage"] = message;
            TempData["Tiempo"] = tiempo.HasValue ? tiempo.Value : 3000;
            TempData["EstadoAlerta"] = false ? estado : "false";

        }

        public async Task<IActionResult> Update([FromForm] Cliente cliente)
        {
            if (!ModelState.IsValid)
            {
                return View("Index");
            }

            var clientes = await _client.GetClientesAsync();

            // Verificar si existe algún cliente con el mismo nombre de entidad y nombre de contacto (ignorando mayúsculas y minúsculas)
            var clienteExistente = clientes.FirstOrDefault(c =>
                string.Equals(c.NombreEntidad, cliente.NombreEntidad, StringComparison.OrdinalIgnoreCase) &&
                string.Equals(c.NombreCompleto, cliente.NombreCompleto, StringComparison.OrdinalIgnoreCase) &&
                c.ClienteId != cliente.ClienteId);

            // Verificar si es una actualización de cliente existente
            var esActualizacion = cliente.ClienteId != 0; // Asumiendo que ClienteId 0 significa que es un nuevo cliente

            // Si ya existe un cliente con el mismo nombre de entidad y nombre de contacto, y no es una actualización, mostrar un mensaje de error
            if (clienteExistente != null && !esActualizacion)
            {
                ModelState.AddModelError("NombreEntidad", $"Ya existe un cliente con el nombre de entidad {cliente.NombreEntidad} y nombre de contacto {cliente.NombreCompleto}. ID de cliente existente: {clienteExistente.ClienteId}.");
                return View("Index");
            }

            var updateclienet = new Cliente
            {
                ClienteId = cliente.ClienteId,
                NombreEntidad = cliente.NombreEntidad,
                NombreCompleto = cliente.NombreCompleto,
                Identificacion = cliente.Identificacion,
                Telefono = cliente.Telefono,
                Correo = cliente.Correo,
                TipoCliente = cliente.TipoCliente,
                Direccion = cliente.Direccion,
                EstadoCliente = cliente.EstadoCliente,

            };

            var response = await _client.UpdateClienteAsync(updateclienet);
            if (response != null)
            {
                if (response.IsSuccessStatusCode)
                {
                    TempData["SweetAlertIcon"] = "success";
                    TempData["SweetAlertTitle"] = "Éxito";
                    TempData["SweetAlertMessage"] = "Cliente actualizado correctamente.";
                }
                else if (response.StatusCode == HttpStatusCode.NotFound)
                {
                    TempData["SweetAlertIcon"] = "error";
                    TempData["SweetAlertTitle"] = "Error";
                    TempData["SweetAlertMessage"] = "El Cliente no se encontró en el servidor.";
                }
                else
                {
                    TempData["SweetAlertIcon"] = "error";
                    TempData["SweetAlertTitle"] = "Error";
                    TempData["SweetAlertMessage"] = "Error al actualizar el Cliente.";
                }
            }
            else
            {
                TempData["SweetAlertIcon"] = "error";
                TempData["SweetAlertTitle"] = "Error";
                TempData["SweetAlertMessage"] = "Error al actualizar el Cliente.";
            }

            return RedirectToAction("Index");
        }


        [HttpPost]
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

        [HttpPost]
        public async Task<JsonResult> FindCliente(int clienteId)
        {
            var cliente = await _client.FindClienteAsync(clienteId);
            return Json(cliente);
        }


        public async Task<IActionResult> GetClientes()
        {
            var cliente = await _client.GetClientesAsync();
            return Json(cliente);
        }

        public async Task<IActionResult> GetClienetById( int id)
        {
            var cliente = await _client.FindClienteAsync(id);
            return Json(cliente);
        }

        
        



        public async Task<IActionResult> Details(int? id, int? page)
        {
            if (id == null)
            {
                return NotFound();
            }

            var pedidos = await _client.GetPedidoAsync();
            var cliente = await _client.GetClientesAsync();
            var clientes = cliente.FirstOrDefault(u => u.ClienteId == id);

            if (clientes == null)
            {
                return NotFound();
            }

            ViewBag.Clientes = clientes;

            var pedidosCliente = pedidos.Where(p => p.ClienteId == id).ToList();

            // Load client details for each pedido
            foreach (var pedido in pedidosCliente)
            {
                pedido.clientes = await _client.FindClienteAsync(pedido.ClienteId.Value);
            }

            int pageSize = 2; // Número máximo de elementos por página
            int pageNumber = page ?? 1;

            var pagepedidos = pedidosCliente.ToPagedList(pageNumber, pageSize);

            return View(pagepedidos);
        }

        [HttpPatch]
        public async Task<IActionResult> CambiarEstadoCliente(int id)
        {
            // Llama al método del servicio para cambiar el estado del usuario
            var response = await _client.CambiarEstadoClienteAsync(id);

            // Devuelve una respuesta adecuada en función de la respuesta del servicio
            if (response.IsSuccessStatusCode)
            {
                return Ok();
            }
            else
            {
                return StatusCode((int)response.StatusCode, await response.Content.ReadAsStringAsync());
            }
        }

    }

}







