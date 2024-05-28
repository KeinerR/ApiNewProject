using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Net;
using VistaNewProject.Models;
using VistaNewProject.Services;
using X.PagedList;

namespace VistaNewProject.Controllers
{

    public class UsuariosController : Controller
    {
        private readonly IApiClient _client;


        public UsuariosController(IApiClient client)
        {
            _client = client;
        }


        public async Task<ActionResult> Index(int? page)
        {
            int pageSize = 5; // Número máximo de elementos por página
            int pageNumber = page ?? 1;

            var roles = await _client.GetRolAsync();

            var usuarios = await _client.GetUsuarioAsync();

            //if (usuarios == null || !usuarios.Any()) // Verificar si la lista de usuarios está vacía
            //{
            //    return NotFound("No se encontraron usuarios.");
            //}

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

                // Si no hay usuarios con los mismos datos, proceder con el registro
                var nuevoUsuario = new Usuario
                {
                    RolId = usuario.RolId,
                    Nombre = usuario.Nombre,
                    Apellido = usuario.Apellido,
                    Usuario1 = usuario.Usuario1,
                    Contraseña = usuario.Contraseña,
                    Telefono = usuario.Telefono,
                    Correo = usuario.Correo,
                    EstadoUsuario = usuario.EstadoUsuario
                };

                var response = await _client.CreateUsuarioAsync(nuevoUsuario);

                if (response.IsSuccessStatusCode)
                {
                    TempData["SweetAlertIcon"] = "sucess";
                    TempData["SweetAlertTitle"] = "Exito";
                    TempData["EstadoAlerta"] = "true";
                    TempData["SweetAlertMessage"] = "¡Usuario guardado correctamente!";
                    return RedirectToAction("Index");
                }
                else
                {
                    ViewBag.MensajeError = "No se pudieron guardar los datos.";
                    return View("Index");
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







    }
}



