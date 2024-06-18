using Microsoft.AspNetCore.Mvc;
using ApiNewProject.Entities;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace ApiNewProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesxPermisosController : ControllerBase
    {
        private readonly NewOptimusContext _context;

        public RolesxPermisosController(NewOptimusContext context)
        {
            _context = context;
        }
        [HttpGet("GetRolesxPermisos")]
        public async Task<ActionResult<List<Rolxpermiso>>> GetRolesxPermisos()
        {
            var list = await _context.Rolxpermisos.ToListAsync();
            return Ok(list);
        }
        // GET: api/Rolxpermisos/GetRolxPermisosById/5
        [HttpGet("GetRolxPermisosById/{id}")]
        public async Task<ActionResult<Rolxpermiso>> GetRolxPermisosById(int id)
        {
            if (id == 0)
            {
                return BadRequest("Id no puede ser cero.");
            }

            var rolxpermiso = await _context.Rolxpermisos
                .Include(rxp => rxp.Rol)  // Incluir la relación con Rol
                .Include(rxp => rxp.Permiso)  // Incluir la relación con Permiso
                .FirstOrDefaultAsync(rxp => rxp.RolxPermisoId == id);

            if (rolxpermiso == null)
            {
                return NotFound();
            }

            return Ok(rolxpermiso);
        }

        [HttpGet("GetRolxPermisosByUsuarioId/{id}")]
        public async Task<ActionResult<UsuarioAcceso>> GetRolxPermisosByUsuarioId(int id)
        {
            if (id == 0)
            {
                return BadRequest("Id no puede ser cero.");
            }

            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null)
            {
                return BadRequest("El usuario no fue encontrado en la BD");
            }

            var rol = await _context.Rols.FindAsync(usuario.RolId);
            if (rol == null)
            {
                return BadRequest("El rol asociado al usuario no fue encontrado.");
            }

            var permisosAlAplicativo = await _context.Rolxpermisos.Where(c => c.RolId == usuario.RolId).ToListAsync();
            var permisosIds = permisosAlAplicativo.Select(pa => pa.PermisoId).ToList(); // Agregar .ToList() aquí

            var permisos = await _context.Permisos.Where(p => permisosIds.Contains(p.PermisoId)).ToListAsync();

            bool estadoAcceso = usuario.EstadoUsuario == 1 && rol.EstadoRol == 1; // Cambiar a tipo ulong si es necesario

            var listaDenombresPermiso = await _context.Rolxpermisos.Where(p => permisosIds.Contains(p.PermisoId)).ToListAsync();

            var usuarioAcceso = new UsuarioAcceso
            {
                UsuarioId = usuario.UsuarioId,
                RolId = usuario.RolId,
                Usuario1 = usuario.Usuario1,
                NombreRol = rol.NombreRol,
                EstadoAcceso = estadoAcceso ? 1UL : 0UL, // Cambiar a tipo ulong si es necesario
                RolxPermisoAcceso = new List<RolxpermisoAcceso>()
            };

            foreach (var permiso in permisos)
            {
                var rolxPermisoAcceso = new RolxpermisoAcceso
                {
                    PermisoId = permiso.PermisoId,
                    NombrePermiso = permiso.NombrePermiso,
                    RolxPermisoNombres = new List<RolxpermisoNombres>()
                };

                usuarioAcceso.RolxPermisoAcceso.Add(rolxPermisoAcceso);

                foreach (var permisoNombre in listaDenombresPermiso.Where(p => p.PermisoId == permiso.PermisoId))
                {
                    rolxPermisoAcceso.RolxPermisoNombres.Add(new RolxpermisoNombres
                    {
                        RolxPermisoId = permisoNombre.RolxPermisoId,
                        NombrePermisoxRol = permisoNombre.NombrePermisoxRol
                    });
                }
            }

            return Ok(usuarioAcceso);
        }

        // POST: api/Rolxpermisos/InsertRolxpermiso
        [HttpPost("InsertRolxpermiso")]
        public async Task<ActionResult<Rolxpermiso>> InsertarRolxpermiso(Rolxpermiso rolxpermiso)
        {
            try
            {
                if (rolxpermiso == null)
                {
                    return BadRequest("Los datos del rol no pueden ser nulos.");
                }

                _context.Rolxpermisos.Add(rolxpermiso);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetRolxPermisosById), new { id = rolxpermiso.RolxPermisoId }, rolxpermiso);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al insertar el rolxpermiso en la base de datos: {ex.Message}");
            }
        }

        // PUT: api/Rolxpermisos/UpdateRolxpermiso
        [HttpPut("UpdateRolxpermiso")]
        public async Task<ActionResult> UpdateRolxpermiso(Rolxpermiso rolxpermiso)
        {
            var existingRolxpermiso = await _context.Rolxpermisos.FirstOrDefaultAsync(rxp => rxp.RolxPermisoId == rolxpermiso.RolxPermisoId);

            if (existingRolxpermiso == null)
            {
                return NotFound();
            }

            existingRolxpermiso.PermisoId = rolxpermiso.PermisoId;
            existingRolxpermiso.RolId = rolxpermiso.RolId;
            existingRolxpermiso.NombrePermisoxRol = rolxpermiso.NombrePermisoxRol;

            await _context.SaveChangesAsync();
            return Ok();
        }

        // DELETE: api/Rolxpermisos/DeleteRolxpermiso/5
        [HttpDelete("DeleteRolxpermiso/{id}")]
        public async Task<IActionResult> DeleteRolxpermiso(int id)
        {
            var rolxpermiso = await _context.Rolxpermisos.FindAsync(id);

            if (rolxpermiso == null)
            {
                return NotFound();
            }

            _context.Rolxpermisos.Remove(rolxpermiso);
            await _context.SaveChangesAsync();

            return StatusCode((int)HttpStatusCode.OK);
        }

    }
}
