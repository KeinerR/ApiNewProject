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
        public async Task<ActionResult<List<Usuario>>> GetUsuarioss()
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


        [HttpPut("UpdateClientes")]
        public async Task<ActionResult> UpdateClientes(Cliente cliente)
        {
            var clientes = await _context.Clientes.FirstOrDefaultAsync(s => s.ClienteId == cliente.ClienteId);

            if (clientes == null)
            {
                return NotFound();
            }
            clientes.ClienteId = cliente.ClienteId;
            clientes.Identificacion = cliente.Identificacion;
            clientes.NombreEntidad = cliente.NombreEntidad;
            clientes.NombreCompleto = cliente.NombreCompleto;
            clientes.TipoCliente = cliente.TipoCliente;
            clientes.Telefono = cliente.Telefono;
            clientes.Correo = cliente.Correo;
            clientes.Direccion = cliente.Direccion;
            clientes.EstadoCliente = cliente.EstadoCliente;

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("DeleteUser/{Id}")]
        public async Task<HttpStatusCode> DeleteUser(int Id)
        {
            var cliente = new Cliente()
            {
                ClienteId = Id
            };
            _context.Clientes.Attach(cliente);
            _context.Clientes.Remove(cliente);
            await _context.SaveChangesAsync();
            return HttpStatusCode.OK;
        }

    }
}
