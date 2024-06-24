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
        // GET: api/Rolxpermisos/GetRolxPermisosById/5
        [HttpGet("GetRolxPermisosByRolId/{id}")]
        public async Task<ActionResult<RolAcceso>> GetRolxPermisosByRolId(int id)
        {
            if (id == 0)
            {
                return BadRequest("Id no puede ser cero.");
            }

            var rol = await _context.Rols.FindAsync(id);
            if (rol == null)
            {
                return BadRequest("El rol asociado al usuario no fue encontrado.");
            }

            var permisosAlAplicativo = await _context.Rolxpermisos.Where(c => c.RolId == id).ToListAsync();
            var permisosIds = permisosAlAplicativo.Select(pa => pa.PermisoId).ToList();

            var permisos = await _context.Permisos.Where(p => permisosIds.Contains(p.PermisoId)).ToListAsync();

            var listaDenombresPermiso = await _context.Rolxpermisos.Where(p => permisosIds.Contains(p.PermisoId)).ToListAsync();

            var rolAcceso = new RolAcceso
            {
                RolId = rol.RolId,
                NombreRol = rol.NombreRol,
                EstadoRol = rol.EstadoRol,
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

                rolAcceso.RolxPermisoAcceso.Add(rolxPermisoAcceso);

                foreach (var permisoNombre in listaDenombresPermiso.Where(p => p.PermisoId == permiso.PermisoId))
                {
                    rolxPermisoAcceso.RolxPermisoNombres.Add(new RolxpermisoNombres
                    {
                        RolxPermisoId = permisoNombre.RolxPermisoId,
                        NombrePermisoxRol = permisoNombre.NombrePermisoxRol
                    });
                }
            }

            return Ok(rolAcceso);
        }

        // Método para obtener PermisoAcceso por ID
        [HttpGet("GetRolxPermisosByIdPermiso/{id}")]
        public async Task<ActionResult<PermisoAcceso>> GetRolxPermisosByIdPermiso(int id)
        {
            if (id == 0)
            {
                return BadRequest("Id no puede ser cero.");
            }

            // Recuperar el permiso
            var permiso = await _context.Permisos.FirstOrDefaultAsync(p => p.PermisoId == id);
            if (permiso == null)
            {
                return NotFound("Permiso no encontrado.");
            }

            // Recuperar los roles asociados con el permiso
            var rolesXPermiso = await _context.Rolxpermisos
                .Where(rxp => rxp.PermisoId == id)
                .ToListAsync();

            // Crear una lista de nombres de roles
            var rolxPermisoNombres = new List<RolxpermisoNombres>();
            foreach (var rolxpermiso in rolesXPermiso)
            {
                rolxPermisoNombres.Add(new RolxpermisoNombres
                {
                    RolxPermisoId = rolxpermiso.RolxPermisoId,
                    NombrePermisoxRol = rolxpermiso.NombrePermisoxRol
                });

            }

            // Crear el objeto PermisoAcceso
            var permisoAcceso = new PermisoAcceso
            {
                PermisoId = permiso.PermisoId,
                NombrePermiso = permiso.NombrePermiso,
                RolxPermisoNombres = rolxPermisoNombres
            };

            return Ok(permisoAcceso);
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

        // DELETE: api/Rolxpermisos/DeleteRolxpermiso/{rolId}/{permisoId}/{nombrePermisoxRol}
        [HttpDelete("DeleteRolxpermiso/{rolId}/{permisoId}/{nombrePermisoxRol}")]
        public async Task<IActionResult> DeleteRolxpermiso(int rolId, int permisoId, string nombrePermisoxRol)
        {
            var rolxpermiso = await _context.Rolxpermisos
                .FirstOrDefaultAsync(rp => rp.RolId == rolId && rp.PermisoId == permisoId && rp.NombrePermisoxRol == nombrePermisoxRol);

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
