using Microsoft.AspNetCore.Mvc;
using ApiNewProject.Entities;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace ApiNewProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PermisosController : ControllerBase
    {
        private readonly NewOptimusContext _context;

        public PermisosController(NewOptimusContext context)
        {
            _context = context;
        }

        // GET: api/Permisos
        [HttpGet("GetPermisos")]
        public async Task<ActionResult<List<Permiso>>> GetPermisos()
        {
            var list = await _context.Permisos.Select(s =>
                new PermisoCrearyActualizar
                {
                    PermisoId = s.PermisoId,
                    NombrePermiso = s.NombrePermiso,
                    EstadoPermiso = s.EstadoPermiso
                }).ToListAsync(); // Agrega ToListAsync para materializar la consulta
            return Ok(list); // Debes devolver el resultado usando Ok() para indicar que la solicitud fue exitosa
        }

        // GET: api/Permisos/GetPermisoById/5
        [HttpGet("GetPermisoById/{id}")]
        public async Task<ActionResult<Permiso>> GetPermisoById(int id)
        {
            if (id == 0)
            {
                return BadRequest("Id no puede ser cero.");
            }

            var permiso = await _context.Permisos
                .Include(p => p.Rolxpermisos)  // Incluir la relación con Rolxpermisos
                .FirstOrDefaultAsync(p => p.PermisoId == id);

            if (permiso == null)
            {
                return NotFound();
            }

            return Ok(permiso);
        }

        // POST: api/Permisos/InsertPermiso
        [HttpPost("InsertPermiso")]
        public async Task<ActionResult<PermisoCrearyActualizar>> InsertPermiso(PermisoCrearyActualizar permiso)
        {
            try
            {
                if (permiso == null)
                {
                    return BadRequest("Los datos del permiso no pueden ser nulos.");
                }
                var nuevoPermiso = new Permiso
                {
                    PermisoId = permiso.PermisoId,
                    NombrePermiso = permiso.NombrePermiso,
                    EstadoPermiso = permiso.EstadoPermiso

                };

                _context.Permisos.Add(nuevoPermiso);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetPermisoById), new { id = permiso.PermisoId }, permiso);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al insertar el permiso en la base de datos: {ex.Message}");
            }
        }

        // PUT: api/Permisos/UpdatePermiso
        [HttpPut("UpdatePermiso")]
        public async Task<ActionResult> UpdatePermiso(PermisoCrearyActualizar permiso)
        {
            var existingPermiso = await _context.Permisos.FirstOrDefaultAsync(p => p.PermisoId == permiso.PermisoId);

            if (existingPermiso == null)
            {
                return NotFound();
            }

            existingPermiso.NombrePermiso = permiso.NombrePermiso;
            existingPermiso.EstadoPermiso = permiso.EstadoPermiso;

            await _context.SaveChangesAsync();
            return Ok();
        }

        // DELETE: api/Permisos/DeletePermiso/5
        [HttpDelete("DeletePermiso/{id}")]
        public async Task<IActionResult> DeletePermiso(int id)
        {
            var permiso = await _context.Permisos.FindAsync(id);

            if (permiso == null)
            {
                return NotFound();
            }

            _context.Permisos.Remove(permiso);
            await _context.SaveChangesAsync();

            return StatusCode((int)HttpStatusCode.OK);
        }
    }
}
