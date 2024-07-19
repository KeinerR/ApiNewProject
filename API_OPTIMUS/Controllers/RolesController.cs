using API_OPTIMUS.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace API_OPTIMUS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly OptimusContext _context;

    public RolesController(OptimusContext context)
    {
        _context = context;
    }
        [HttpGet("GetRoles")]
        public async Task<ActionResult<List<Rol>>> GetRol()
        {
            var List = await _context.Roles.Select(
                s => new Rol
                {
                    RolId = s.RolId,
                    NombreRol = s.NombreRol,
                    EstadoRol = s.EstadoRol
                }
            ).ToListAsync();

            return List;

        }

        [HttpGet("GetRolById")]
        public async Task<ActionResult<Rol>> GetRolById(int Id)
        {
            if (Id == 0)
            {
                return NotFound();
            }

            Rol? rol = await _context.Roles
                .Select(s => new Rol
                {
                    RolId = s.RolId,
                    NombreRol = s.NombreRol,
                    EstadoRol= s.EstadoRol 
                })
                .FirstOrDefaultAsync(s => s.RolId == Id);

            if (rol == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(rol);
            }
        }


        [HttpPost("InsertRol")]
        public async Task<ActionResult<Usuario>> InsertarRol(Rol rol)
        {
            try
            {
                if (rol == null)
                {
                    return BadRequest("Los datos del usuario no pueden ser nulos.");
                }

                _context.Roles.Add(rol);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetRolById), new { id = rol.RolId}, rol);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al insertar el rol en la base de datos: " + ex.Message);
            }
        }


        [HttpPut("UpdateRol")]
        public async Task<ActionResult> UpdateRol(Rol rol)
        {
            var Roles = await _context.Roles.FirstOrDefaultAsync(s => s.RolId == rol.RolId);

            if (Roles == null)
            {
                return NotFound();
            }
            Roles.RolId = rol.RolId;
            Roles.NombreRol = rol.NombreRol;
            Roles.EstadoRol = rol.EstadoRol;
            await _context.SaveChangesAsync();
            return Ok();
        }


        [HttpDelete("DeleteRol/{Id}")]
        public async Task<HttpStatusCode> DeleteRol(int Id)
        {
            var rol = new Rol()
            {
                RolId = Id
            };
            _context.Roles.Attach(rol);
            _context.Roles.Remove(rol);
            await _context.SaveChangesAsync();
            return HttpStatusCode.OK;
        }






    }
}
