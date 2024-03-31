using ApiNewProject.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MySqlX.XDevAPI;
using System.Net;
using System.Threading.Tasks;

namespace ApiNewProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientesController : ControllerBase
    {
        private readonly NewOptimusContext _context;

        public ClientesController(NewOptimusContext context)
        {
            _context = context;
        }


        [HttpGet("GetClientes")]
        public async Task<ActionResult<List<Cliente>>> GetClientes()
        {
            var List = await _context.Clientes.Select(
                s => new Cliente
                {
                    ClienteId = s.ClienteId,
                    Identificacion = s.Identificacion,
                    NombreEntidad = s.NombreEntidad,
                    NombreCompleto = s.NombreCompleto,
                    TipoCliente = s.TipoCliente,
                    Telefono = s.Telefono,
                    Correo = s.Correo,
                    Direccion = s.Direccion,
                    EstadoCliente = s.EstadoCliente
                }
            ).ToListAsync();



            return List;

        }

        [HttpGet("GetClienetById")]
        public async Task<ActionResult<Cliente>> GetClienteById(int Id)
        {
          
            Cliente cliente = await _context.Clientes.Select(
                    s => new Cliente
                    {
                        ClienteId = s.ClienteId,
                        Identificacion = s.Identificacion,
                        NombreEntidad = s.NombreEntidad,
                        NombreCompleto = s.NombreCompleto,
                        TipoCliente = s.TipoCliente,
                        Telefono = s.Telefono,
                        Correo = s.Correo,
                        Direccion = s.Direccion,
                        EstadoCliente = s.EstadoCliente
                    })
                .FirstOrDefaultAsync(s => s.ClienteId == Id);

            if (cliente == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(cliente);
            }
        }


    [HttpPost("InsertUsuario")]
public async Task<ActionResult<Usuario>> InsertUsaurio(Usuario usuario)
{
    try
    {
        if (usuario == null)
        {
            return BadRequest("Los datos del usuario no pueden ser nulos.");
        }

        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetClienteById), new { id = usuario.UsuarioId}, usuario);
    }
    catch (Exception ex)
    {
        return StatusCode(StatusCodes.Status500InternalServerError, "Error al insertar el usuario en la base de datos: " + ex.Message);
    }
}


        [HttpPut("UpdateUsuario")]
        public async Task<ActionResult> UpdateUsuario(Usuario usuario)
        {
            var usuarios = await _context.Usuarios.FirstOrDefaultAsync(s => s.UsuarioId == usuario.UsuarioId);

           if(usuarios == null)
            {
                return NotFound();
            }
            usuarios.UsuarioId= usuario.UsuarioId;
            usuarios.Nombre = usuario.Nombre;
            usuarios.Apellido = usuario.Apellido;
            usuarios.Usuario1 = usuario.Usuario1;
            usuarios.Contraseña = usuario.Contraseña;
            usuarios.Telefono = usuario.Telefono;
            usuarios.Correo = usuario.Correo;
            usuarios.EstadoUsuario =usuario.EstadoUsuario;

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("DeleteUsuario/{Id}")]
        public async Task<HttpStatusCode> DeleteUsuario(int Id)
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


    }
}
