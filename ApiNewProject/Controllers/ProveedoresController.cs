using ApiNewProject.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace ApiNewProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProveedoresController : ControllerBase
    {
        private readonly NewOptimusContext _context;

        public ProveedoresController(NewOptimusContext context)
        {
            _context = context;
        }


        [HttpGet("GetProveedores")]
        public async Task<ActionResult<List<Proveedor>>> GetProveedor()
        {
            var List = await _context.Proveedores.Select(
                s => new Proveedor
                {
                    ProveedorId = s.ProveedorId,
                    NombreEmpresa = s.NombreEmpresa,
                    NombreContacto = s.NombreContacto,
                    Direccion = s.Direccion,
                    Telefono = s.Telefono,
                    Correo = s.Correo,
                    EstadoProveedor = s.EstadoProveedor,
                }
            ).ToListAsync();



            return List;

        }

        [HttpGet("GetProveedorById")]
        public async Task<ActionResult<Proveedor>> GetProveedorById(int Id)
        {

            Proveedor proveedor = await _context.Proveedores.Select(
                    s => new Proveedor
                    {
                        ProveedorId = s.ProveedorId,
                        NombreEmpresa = s.NombreEmpresa,
                        NombreContacto = s.NombreContacto,
                        Direccion = s.Direccion,
                        Telefono = s.Telefono,
                        Correo = s.Correo,
                        EstadoProveedor = s.EstadoProveedor,
                    })
                .FirstOrDefaultAsync(s => s.ProveedorId == Id);

            if (proveedor == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(proveedor);
            }
        }


        [HttpPost("InsertarProveedor")]
        public async Task<ActionResult<Proveedor>> InsertarProveedor(Proveedor proveedor
            )
        {
            try
            {
                if (proveedor == null)
                {
                    return BadRequest("Los datos del proveedor no pueden ser nulos.");
                }

                _context.Proveedores.Add(proveedor);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetProveedorById), new { id = proveedor.ProveedorId }, proveedor);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al insertar el proveedor en la base de datos: " + ex.Message);
            }
        }


        [HttpPut("UpdateProveedores")]
        public async Task<ActionResult> UpdateProveedores(Proveedor proveedor)
        {
            var proveedores = await _context.Proveedores.FirstOrDefaultAsync(s => s.ProveedorId == proveedor.ProveedorId);

            if (proveedor == null)
            {
                return NotFound();
            }
            proveedores.ProveedorId = proveedor.ProveedorId;
            proveedores.NombreEmpresa = proveedor.NombreEmpresa;
            proveedores.NombreContacto = proveedor.NombreContacto;
            proveedores.Direccion = proveedor.Direccion;
            proveedores.Telefono = proveedor.Telefono;
            proveedores.Correo = proveedor.Correo;
            proveedores.EstadoProveedor = proveedor.EstadoProveedor;


            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("DeleteProveedor/{Id}")]
        public async Task<HttpStatusCode> DeleteProveedor(int Id)
        {
            var proveedor = new Proveedor()
            {
                ProveedorId = Id
            };
            _context.Proveedores.Attach(proveedor);
            _context.Proveedores.Remove(proveedor);
            await _context.SaveChangesAsync();
            return HttpStatusCode.OK;
        }
    }
}
