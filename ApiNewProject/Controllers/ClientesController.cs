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


        [HttpPost("InsertarCliente")]
        public async Task<ActionResult<Cliente>> InsertarCliente(Cliente cliente)
        {
            try
            {
                if (cliente == null)
                {
                    return BadRequest("Los datos del cliente no pueden ser nulos.");
                }

                _context.Clientes.Add(cliente);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetClienteById), new { id = cliente.ClienteId }, cliente);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al insertar el cliente en la base de datos: " + ex.Message);
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
        // Método PATCH para actualizar el estado del cliente
        [HttpPatch("UpdateEstadoCliente/{id}")]
        public async Task<IActionResult> UpdateEstadoCliente(int id, [FromBody] Cliente EstadoCliente)
        {
            try
            {
                // Buscar el cliente por su ID
                var cliente = await _context.Clientes.FindAsync(id);

                // Si no se encuentra el cliente, devolver un error 404 Not Found
                if (cliente == null)
                {
                    return NotFound();
                }

                // Actualizar el estado del cliente con el nuevo valor
                cliente.EstadoCliente = EstadoCliente.EstadoCliente;

                // Guardar los cambios en la base de datos
                await _context.SaveChangesAsync();

                // Devolver una respuesta exitosa
                return Ok();
            }
            catch (Exception ex)
            {
                // Si ocurre algún error, devolver un error 500 Internal Server Error
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al actualizar el estado del cliente: " + ex.Message);
            }
        }


    }
}
