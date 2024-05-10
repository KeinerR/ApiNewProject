using ApiNewProject.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace ApiNewProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UnidadesController : ControllerBase
    {
        private readonly NewOptimusContext _context;

        public UnidadesController(NewOptimusContext context)
        {
            _context = context;
        }


        [HttpGet("GetUnidades")]
        public async Task<ActionResult<List<Unidad>>> GetUnidad()
        {
            var List = await _context.Unidades.Select(
                s => new Unidad
                {
                    UnidadId = s.UnidadId,
                    NombreUnidad = s.NombreUnidad,
                    CantidadPorUnidad = s.CantidadPorUnidad,
                    DescripcionUnidad = s.DescripcionUnidad,
                    EstadoUnidad = s.EstadoUnidad
                }
            ).ToListAsync();



            return List;

        }

        [HttpGet("GetUnidadById")]
        public async Task<ActionResult<Unidad>> GetUnidadById(int Id)
        {

            Unidad unidad = await _context.Unidades.Select(
                    s => new Unidad
                    {
                        UnidadId = s.UnidadId,
                        NombreUnidad = s.NombreUnidad,
                        CantidadPorUnidad = s.CantidadPorUnidad,
                        DescripcionUnidad = s.DescripcionUnidad,
                        EstadoUnidad = s.EstadoUnidad
                    })
                .FirstOrDefaultAsync(s => s.UnidadId == Id);

            if (unidad == null)
            {
                return NotFound( "No hay datos o a ocurrido un erro ");
            }
            else
            {
                return Ok(unidad);
            }
        }


        [HttpPost("InsertarUnidad")]
        public async Task<ActionResult<Unidad>> InsertarUnidad(Unidad unidad)
        {
            try
            {
                if (unidad == null)
                {
                    return BadRequest("Los datos de la unidad no pueden ser nulos.");
                }

                _context.Unidades.Add(unidad);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetUnidadById), new { id = unidad.UnidadId }, unidad);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al insertar la unidad en la base de datos: " + ex.Message);
            }
        }


        [HttpPut("UpdateUnidades")]
        public async Task<ActionResult> UpdateUnidades(Unidad unidad)
        {
            var unidades = await _context.Unidades.FirstOrDefaultAsync(s => s.UnidadId == unidad.UnidadId);

            if (unidades == null)
            {
                return NotFound();
            }
            unidades.UnidadId = unidad.UnidadId;
            unidades.NombreUnidad = unidad.NombreUnidad;
            unidades.DescripcionUnidad = unidad.DescripcionUnidad;
            unidades.CantidadPorUnidad = unidad.CantidadPorUnidad;
            unidades.EstadoUnidad = unidad.EstadoUnidad;

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("DeleteUnidad/{Id}")]
        public async Task<HttpStatusCode> DeleteUnidad(int Id)
        {
            var unidad = new Unidad()
            {
                UnidadId = Id
            };
            _context.Unidades.Attach(unidad);
            _context.Unidades.Remove(unidad);
            await _context.SaveChangesAsync();
            return HttpStatusCode.OK;
        }


        [HttpPatch("UpdateEstadoUnidad/{id}")]
        public async Task<IActionResult> UpdateEstadoUnidad(int id, [FromBody] Unidad EstadoUnidad)
        {
            try
            {
                var unidad = await _context.Unidades.FindAsync(id);

                if (unidad == null)
                {
                    return NotFound();
                }

                // Actualizar el estado del cliente con el nuevo valor
                unidad.EstadoUnidad = EstadoUnidad.EstadoUnidad;

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
