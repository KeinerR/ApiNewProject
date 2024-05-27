using ApiNewProject.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace ApiNewProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly NewOptimusContext _context;

    public RolesController(NewOptimusContext context)
    {
        _context = context;
    }
        [HttpGet("GetRoles")]
        public async Task<ActionResult<List<Rol>>> GetRol()
        {
            var List = await _context.Rols.Select(
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

            Rol rol = await _context.Rols
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

                _context.Rols.Add(rol);
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
            var rols = await _context.Rols.FirstOrDefaultAsync(s => s.RolId == rol.RolId);

            if (rols == null)
            {
                return NotFound();
            }
            rols.RolId = rol.RolId;
            rols.NombreRol = rol.NombreRol;
            rols.EstadoRol = rol.EstadoRol;
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
            _context.Rols.Attach(rol);
            _context.Rols.Remove(rol);
            await _context.SaveChangesAsync();
            return HttpStatusCode.OK;
        }






    }
}
