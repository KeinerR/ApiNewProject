using ApiNewProject.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace ApiNewProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly NewOptimusContext _context;

        public UsuariosController(NewOptimusContext context)
        {
            _context = context;
        }


        [HttpGet("GetUsuarios")]
        public async Task<ActionResult<List<Usuario>>> GetUsuarios()
        {
            var List = await _context.Usuarios.Select(
                s => new Usuario
                {
                    UsuarioId = s.UsuarioId,
                    RolId = s.RolId,
                    Nombre = s.Nombre,
                    Apellido = s.Apellido,
                    Usuario1 = s.Usuario1,
                    Contraseña = s.Contraseña,
                    Telefono = s.Telefono,
                    Correo = s.Correo,
                    EstadoUsuario = s.EstadoUsuario
                  
                }
            ).ToListAsync();



            return List;

        }
        [HttpGet("GetUsuarioById")]
        public async Task<ActionResult<Usuario>> GetUsuarioById(int Id)
        {

            Usuario usuario = await _context.Usuarios.Select(
                    s => new Usuario
                    {
                        UsuarioId = s.UsuarioId,
                        RolId = s.RolId,
                        Nombre = s.Nombre,
                        Apellido = s.Apellido,
                        Usuario1 = s.Usuario1,
                        Contraseña = s.Contraseña,
                        Telefono = s.Telefono,
                        Correo = s.Correo,
                        EstadoUsuario = s.EstadoUsuario
                    })
                .FirstOrDefaultAsync(s => s.UsuarioId == Id);

            if (usuario == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(usuario);
            }
        }


        [HttpPost("InsertUsuario")]
        public async Task<ActionResult<Usuario>> InsertarUsuario(Usuario usuario)
        {
            try
            {
                if (usuario == null)
                {
                    return BadRequest("Los datos del usuario no pueden ser nulos.");
                }

                _context.Usuarios.Add(usuario);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetUsuarioById), new { id = usuario.UsuarioId}, usuario);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al insertar el usuario en la base de datos: " + ex.Message);
            }
        }


        [HttpPut("UpdateUsuarios")]
        public async Task<ActionResult> UpdateUsuarios(Usuario usuario)
        {
            var usuarios = await _context.Usuarios.FirstOrDefaultAsync(s => s.UsuarioId == usuario.UsuarioId);

            if (usuarios == null)
            {
                return NotFound();
            }
            usuarios.UsuarioId = usuario.UsuarioId;
            usuarios.RolId = usuario.RolId;
            usuarios.Nombre = usuario.Nombre;
            usuarios.Apellido = usuario.Apellido;
            usuarios.Usuario1 = usuario.Usuario1;
            usuarios.Contraseña = usuario.Contraseña;
            usuarios.Telefono = usuario.Telefono;
            usuarios.Correo = usuario.Correo;
            usuarios.EstadoUsuario= usuario.EstadoUsuario;

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("DeleteUser/{Id}")]
        public async Task<HttpStatusCode> DeleteUser(int Id)
        {
            var usuario = new Usuario()
            {
                UsuarioId = Id
            };
            _context.Usuarios.Attach(usuario);
            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();
            return HttpStatusCode.OK;
        }


        [HttpPatch("UpdateEstadoUsuario/{id}")]
        public async Task<IActionResult> UpdateEstadoUsuario(int id)
        {
            try
            {
                // Buscar el usuario por su ID
                var usuario = await _context.Usuarios.FindAsync(id);

                // Si no se encuentra el usuario, devolver un error 404 Not Found
                if (usuario == null)
                {
                    return NotFound();
                }

                // Invertir el valor del estado del usuario
                usuario.EstadoUsuario = usuario.EstadoUsuario == 0 ? 1UL : 0UL;

                // Guardar los cambios en la base de datos
                await _context.SaveChangesAsync();

                // Devolver una respuesta exitosa
                return Ok();
            }
            catch (Exception ex)
            {
                // Si ocurre algún error, devolver un error 500 Internal Server Error
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al actualizar el estado del usuario: " + ex.Message);
            }
        }


    }
}
