using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Linq;
using System.Threading.Tasks;
using VistaNewProject.Models;
using VistaNewProject.Services;
using X.PagedList;


namespace VistaNewProject.Controllers
{
    [Authorize(Policy = "Administrador")]
    public class UsuariosController : Controller
    {
        private readonly IApiClient _client;
        private readonly PasswordHasherService _passwordHasherService;

        public UsuariosController(IApiClient client, PasswordHasherService passwordHasherService)
        {
            _client = client;
            _passwordHasherService = passwordHasherService;
        }


        public async Task<ActionResult> Index(int? page, string order = "default")
        {
            int pageSize = 5; // Número máximo de elementos por página
            int pageNumber = page ?? 1;

            var roles = await _client.GetRolAsync();
            if (roles == null)
            {
                roles = new List<Rol>(); // O maneja el caso donde roles es null según tus necesidades
            }
            var usuarios = await _client.GetUsuarioAsync();

            usuarios = usuarios.Reverse().ToList();
            usuarios = usuarios.OrderByDescending(c => c.EstadoUsuario == 1).ToList();

            switch (order.ToLower())
            {
                case "first":
                    usuarios = usuarios.Reverse();
                    usuarios = usuarios.OrderByDescending(c => c.EstadoUsuario == 1).ToList();
                    break;
                case "reverse":
                    break;
                case "alfabetico":
                    usuarios = usuarios
                        .OrderBy(p => p.Nombre)
                        .ThenBy(p => p.Apellido)
                        .ToList();
                    usuarios = usuarios.OrderByDescending(c => c.EstadoUsuario == 1).ToList();
                    break;

                case "name_desc":
                    usuarios = usuarios
                        .OrderByDescending(p => p.Nombre)
                        .ThenByDescending(p => p.Apellido)
                        .ToList();
                    usuarios = usuarios.OrderByDescending(c => c.EstadoUsuario == 1).ToList();
                    break;

                default:
                    break;
            }

            var pageUsuarios = await usuarios.ToPagedListAsync(pageNumber, pageSize);

            // Si la página solicitada no tiene elementos y no es la primera página, redirigir a la última página
            if (!pageUsuarios.Any() && pageUsuarios.PageNumber > 1)
            {
                return RedirectToAction("Index", new { page = pageUsuarios.PageCount });
            }

            int contador = (pageNumber - 1) * pageSize + 1; // Calcular el valor inicial del contador

            ViewBag.Contador = contador;
            ViewBag.Roles = roles;
            ViewData["Usuarios"] = usuarios;
            ViewBag.Order = order; // Pasar el criterio de orden a la vista
            return View(pageUsuarios);
        }

        [HttpPost]
        public async Task<JsonResult> FindUsuario(int usuarioId)
        {
            var usuario = await _client.FindUsuarioAsync(usuarioId);
            return Json(usuario);
        }

        [HttpPost]
        public async Task<JsonResult> FindUsuarios()
        {
            var usuarios = await _client.GetUsuarioAsync();
            return Json(usuarios);
        }

        public async Task<IActionResult> Details(int? id)
        {
            var usuarios = await _client.GetUsuarioAsync();
            var roles = await _client.GetRolAsync();
            if (id == null || usuarios == null)
            {
                return NotFound();
            }

            var usuario = usuarios.FirstOrDefault(u => u.UsuarioId == id);

            if (usuario == null)
            {
                return NotFound();
            }
            ViewBag.roles = roles;
            return View(usuario);
        }


        public async Task<IActionResult> Create([FromForm] Usuario usuario)
        {
            try
            {
                // Verificar que todos los campos estén llenos
                if (string.IsNullOrEmpty(usuario.Nombre) ||
                    usuario.RolId <= 0 ||
                    string.IsNullOrEmpty(usuario.Apellido) ||
                    string.IsNullOrEmpty(usuario.Usuario1) ||
                    string.IsNullOrEmpty(usuario.Contraseña) ||
                    string.IsNullOrEmpty(usuario.Telefono) ||
                    string.IsNullOrEmpty(usuario.Correo))
                {
                    MensajeSweetAlert("error", "Error", "Por favor, complete todos los campos obligatorios con *.", "false", null);
                    return RedirectToAction("Index");
                }

                var usuarios = await _client.GetUsuarioAsync();

                // Verificar si hay algún usuario con el mismo nombre, apellido y usuario1
                var usuarioExistente = usuarios.FirstOrDefault(c =>
                    string.Equals(c.Nombre, usuario.Nombre, StringComparison.OrdinalIgnoreCase) &&
                    string.Equals(c.Apellido, usuario.Apellido, StringComparison.OrdinalIgnoreCase) &&
                    string.Equals(c.Usuario1, usuario.Usuario1, StringComparison.OrdinalIgnoreCase));

                // Verificar si hay algún usuario con el mismo nombre de usuario1
                var usuarioMismoUsuario = usuarios.FirstOrDefault(c =>
                    string.Equals(c.Usuario1, usuario.Usuario1, StringComparison.OrdinalIgnoreCase));

                var usuarioExistenteOne = usuarios.FirstOrDefault(c =>
                 string.Equals(c.Nombre, usuario.Nombre, StringComparison.OrdinalIgnoreCase) &&
                 string.Equals(c.Apellido, usuario.Apellido, StringComparison.OrdinalIgnoreCase));

                var CorreoExistente = usuarios.FirstOrDefault(c =>
                 string.Equals(c.Correo, usuario.Correo, StringComparison.OrdinalIgnoreCase));


                if (usuarioExistente != null)
                {
                    TempData["SweetAlertIcon"] = "error";
                    TempData["SweetAlertTitle"] = "Error";
                    TempData["SweetAlertMessage"] = $"Ya hay un usuario registrado con el nombre {usuarioExistente.Nombre}, apellido {usuarioExistente.Apellido}, y usuario {usuarioExistente.UsuarioId}";
                    TempData["EstadoAlerta"] = "false";
                    return RedirectToAction("Index");
                }

                if (usuarioMismoUsuario != null)
                {
                    TempData["SweetAlertIcon"] = "error";
                    TempData["SweetAlertTitle"] = "Error";
                    TempData["SweetAlertMessage"] = $"Ya hay un usuario registrado con el mismo nombre de usuario: {usuarioMismoUsuario.Nombre} {usuarioMismoUsuario.Apellido}";
                    TempData["EstadoAlerta"] = "false";
                    return RedirectToAction("Index");
                }
                if (usuarioExistenteOne != null)
                {
                    TempData["SweetAlertIcon"] = "error";
                    TempData["SweetAlertTitle"] = "Error";
                    TempData["SweetAlertMessage"] = $"Ya hay un usuario registrado con los mismos datos, Id de usuario: {usuarioExistenteOne.UsuarioId}";
                    TempData["EstadoAlerta"] = "false";
                    return RedirectToAction("Index");
                }
                if (CorreoExistente != null && (CorreoExistente.Correo != "Correo@gmmailcom" && CorreoExistente.Correo != "correo@gmmailcom"))
                {
                    TempData["SweetAlertIcon"] = "error";
                    TempData["SweetAlertTitle"] = "Error";
                    TempData["SweetAlertMessage"] = $"Ya esta el correo registrado por otro usuario: {CorreoExistente.Nombre} {CorreoExistente.Apellido}";
                    TempData["EstadoAlerta"] = "false";
                    return RedirectToAction("Index");
                }

                //encriptar la contraseña antes de guardarla
                byte[] salt = _passwordHasherService.GenerateSalt();
                string hashedPassword = _passwordHasherService.HashPassword(usuario.Contraseña, salt);

                // Si no hay usuarios con los mismos datos, proceder con el registro
                var nuevoUsuario = new Usuario
                {
                    RolId = usuario.RolId,
                    Nombre = usuario.Nombre,
                    Apellido = usuario.Apellido,
                    Usuario1 = usuario.Usuario1,
                    Contraseña = hashedPassword, // Guardar la contraseña hasheada
                    Telefono = usuario.Telefono,
                    Correo = usuario.Correo,
                    EstadoUsuario = usuario.EstadoUsuario
                };
               
                var response = await _client.CreateUsuarioAsync(nuevoUsuario);

                if (response.IsSuccessStatusCode)
                {
                    MensajeSweetAlert("sucess", "Exito", "¡Usuario guardado correctamente!", "false", null);
                    return RedirectToAction("Index");
                }
                else
                {
                    MensajeSweetAlert("error", "Error", "¡Problemas al registrar el usuario!", "true", null);

                    return RedirectToAction("Index");
                }
            }
            catch (Exception ex)
            {
                // Manejar cualquier excepción que ocurra durante el proceso
                Console.WriteLine($"Error al crear usuario: {ex.Message}");
                TempData["SweetAlertIcon"] = "error";
                TempData["SweetAlertTitle"] = "Error";
                TempData["SweetAlertMessage"] = "Ocurrió un error al crear el usuario.";
                TempData["EstadoAlerta"] = "false";
                return RedirectToAction("Index");
            }
        }


        public async Task<IActionResult> Update([FromForm] Usuario usuario)
        {
            try
            {
                var usuarios = await _client.GetUsuarioAsync();

                // Verificar si hay algún usuario con el mismo nombre de usuario y diferente ID
                var usuarioExis = usuarios.FirstOrDefault(c =>
                    string.Equals(c.Usuario1, usuario.Usuario1, StringComparison.OrdinalIgnoreCase)
                    && c.UsuarioId != usuario.UsuarioId);

                // Si ya existe un usuario con el mismo nombre de usuario y diferente ID, mostrar un mensaje de error
                if (usuarioExis != null)
                {
                    TempData["SweetAlertIcon"] = "error";
                    TempData["SweetAlertTitle"] = "Error";
                    TempData["SweetAlertMessage"] = "Ya hay un usuario registrado con ese nombre de usuario.";
                    return RedirectToAction("Index");
                }

                // Verificar si hay algún usuario con el mismo nombre, apellido y usuario1
                var usuarioExistente = usuarios.FirstOrDefault(c =>
                    string.Equals(c.Nombre, usuario.Nombre, StringComparison.OrdinalIgnoreCase) &&
                    string.Equals(c.Apellido, usuario.Apellido, StringComparison.OrdinalIgnoreCase) &&
                    string.Equals(c.Usuario1, usuario.Usuario1, StringComparison.OrdinalIgnoreCase) &&
                    c.UsuarioId != usuario.UsuarioId);


                // Si ya existe un usuario con el mismo nombre, apellido y usuario1, mostrar un mensaje de error
                if (usuarioExistente != null)
                {
                    TempData["SweetAlertIcon"] = "error";
                    TempData["SweetAlertTitle"] = "Error";
                    TempData["SweetAlertMessage"] = $"Ya existe un usuario con el nombre {usuario.Nombre}, apellido {usuario.Apellido} y nombre de usuario {usuario.Usuario1} ID de usuario: {usuarioExistente.UsuarioId}..";
                    return RedirectToAction("Index");
                }

                // Verificar si hay algún usuario con el mismo nombre de usuario1
                var usuarioMismoUsuario = usuarios.FirstOrDefault(c =>
                    string.Equals(c.Usuario1, usuario.Usuario1, StringComparison.OrdinalIgnoreCase) &&
                    c.UsuarioId != usuario.UsuarioId);

                // Si ya existe un usuario con el mismo nombre de usuario1, mostrar un mensaje de error
                if (usuarioMismoUsuario != null)
                {
                    TempData["SweetAlertIcon"] = "error";
                    TempData["SweetAlertTitle"] = "Error";
                    TempData["SweetAlertMessage"] = $"Ya existe un usuario con el nombre de usuario {usuario.Usuario1} ID de usuario: {usuarioMismoUsuario.UsuarioId}.";
                    return RedirectToAction("Index");
                }

                // Verificar si hay algún usuario con el mismo nombre y apellido
                var usuarioExistenteOne = usuarios.FirstOrDefault(c =>
              string.Equals(c.Nombre, usuario.Nombre, StringComparison.OrdinalIgnoreCase) &&
              string.Equals(c.Apellido, usuario.Apellido, StringComparison.OrdinalIgnoreCase) &&
              c.UsuarioId != usuario.UsuarioId);

                // Si ya existe un usuario con el mismo nombre y apellido, mostrar un mensaje de error
                if (usuarioExistenteOne != null)
                {
                    TempData["SweetAlertIcon"] = "error";
                    TempData["SweetAlertTitle"] = "Error";
                    TempData["SweetAlertMessage"] = $"Ya existe un usuario con el nombre {usuario.Nombre} y apellido {usuario.Apellido} ID de usuario: {usuarioExistenteOne.UsuarioId}.";
                    return RedirectToAction("Index");
                }

                // Verificar si hay algún usuario con el mismo correo electrónico
                var correoExistente = usuarios.FirstOrDefault(c =>
                    string.Equals(c.Correo, usuario.Correo, StringComparison.OrdinalIgnoreCase) &&
                    c.UsuarioId != usuario.UsuarioId);

                // Si ya existe un usuario con el mismo correo electrónico, mostrar un mensaje de error
                if (correoExistente != null && (correoExistente.Correo != "Correo@gmmailcom" && correoExistente.Correo != "correo@gmmailcom"))
                {
                    TempData["SweetAlertIcon"] = "error";
                    TempData["SweetAlertTitle"] = "Error";
                    TempData["SweetAlertMessage"] = $"Ya hay un usuario registrado con el correo electrónico {usuario.Correo} ID de usuario: {correoExistente.UsuarioId}.";
                    return RedirectToAction("Index");
                }

                var Usuarios = new Usuario
                {
                    UsuarioId = usuario.UsuarioId,
                    RolId = usuario.RolId,
                    Nombre = usuario.Nombre,
                    Apellido = usuario.Apellido,
                    Usuario1 = usuario.Usuario1,
                    Contraseña = usuario.Contraseña,
                    Telefono = usuario.Telefono,
                    Correo = usuario.Correo,
                    EstadoUsuario = usuario.EstadoUsuario
                };

                var response = await _client.UpdateUsuarioAsync(Usuarios);

                if (response != null)
                {
                    if (response.IsSuccessStatusCode)
                    {
                        TempData["SweetAlertIcon"] = "success";
                        TempData["SweetAlertTitle"] = "Éxito";
                        TempData["SweetAlertMessage"] = "Usuario actualizado correctamente.";
                        return RedirectToAction("Index");
                    }
                    else if (response.StatusCode == HttpStatusCode.NotFound)
                    {
                        TempData["SweetAlertIcon"] = "error";
                        TempData["SweetAlertTitle"] = "Error";
                        TempData["SweetAlertMessage"] = "El Usuario no se encontró en el servidor.";
                        return RedirectToAction("Index");
                    }
                    else if (response.StatusCode == HttpStatusCode.BadRequest)
                    {
                        TempData["SweetAlertIcon"] = "error";
                        TempData["SweetAlertTitle"] = "Error";
                        TempData["SweetAlertMessage"] = "Nombre de Usuario duplicado.";
                        return RedirectToAction("Index");
                    }
                    else
                    {
                        TempData["SweetAlertIcon"] = "error";
                        TempData["SweetAlertTitle"] = "Error";
                        TempData["SweetAlertMessage"] = "Error al actualizar el Usuario.";
                        return RedirectToAction("Index");
                    }
                }
                else
                {
                    TempData["SweetAlertIcon"] = "error";
                    TempData["SweetAlertTitle"] = "Error";
                    TempData["SweetAlertMessage"] = "Error al actualizar el Usuario.";
                    return RedirectToAction("Index");
                }
            }
            catch (Exception ex)
            {
                // Manejar cualquier excepción que ocurra durante el proceso
                Console.WriteLine($"Error al actualizar usuario: {ex.Message}");
                TempData["SweetAlertIcon"] = "error";
                TempData["SweetAlertTitle"] = "Error";
                TempData["SweetAlertMessage"] = "Ocurrió un error al actualizar el usuario.";
                return RedirectToAction("Index");
            }
        }


        public async Task<IActionResult> Delete(int usuarioId)
        {
            var domicilios = await _client.GetDomicilioAsync();
            var domiciliosDelUsuario = domicilios.Where(d => d.UsuarioId == usuarioId);

            if (domiciliosDelUsuario.Any())
            {
                TempData["SweetAlertIcon"] = "error";
                TempData["SweetAlertTitle"] = "Error";
                TempData["SweetAlertMessage"] = "No se puede eliminar el Usuario  porque tiene Domicilios  asociados.";
                return RedirectToAction("Index");
            }

            var response = await _client.DeleteUsuarioAsync(usuarioId);
            if (response == null)
            {
                TempData["SweetAlertIcon"] = "error";
                TempData["SweetAlertTitle"] = "Error";
                TempData["SweetAlertMessage"] = "Error al eliminar el Usuario.";
            }
            else if (response.IsSuccessStatusCode)
            {
                TempData["SweetAlertIcon"] = "success";
                TempData["SweetAlertTitle"] = "Éxito";
                TempData["SweetAlertMessage"] = "Usuario eliminado correctamente.";
            }
            else if (response.StatusCode == HttpStatusCode.NotFound)
            {
                TempData["SweetAlertIcon"] = "error";
                TempData["SweetAlertTitle"] = "Error";
                TempData["SweetAlertMessage"] = "El Usuario no se encontró en el servusuarioIdor.";
            }
            else
            {
                TempData["SweetAlertIcon"] = "error";
                TempData["SweetAlertTitle"] = "Error";
                TempData["SweetAlertMessage"] = "Error desconocusuarioIdo al eliminar el usuario.";
            }

            return RedirectToAction("Index");
        }

        [HttpPatch("Usuarios/UpdateEstadoUsuario/{id}")]
        public async Task<IActionResult> CambiarEstadoUsuario(int id)
        {
            // Llama al método del servicio para cambiar el estado del usuario
            var response = await _client.CambiarEstadoUsuarioAsync(id);

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

        private void MensajeSweetAlert(string icon, string title, string message, string estado, int? tiempo)
        {
            TempData["SweetAlertIcon"] = icon;
            TempData["SweetAlertTitle"] = title;
            TempData["SweetAlertMessage"] = message;
            TempData["EstadoAlerta"] = estado;
            TempData["Tiempo"] = tiempo.HasValue ? tiempo.Value : 3000;
            TempData["EstadoAlerta"] = "false";

        }





    }
}



