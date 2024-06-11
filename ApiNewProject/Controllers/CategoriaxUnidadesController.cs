using ApiNewProject.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiNewProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriaxUnidadController : ControllerBase
    {
        private readonly NewOptimusContext _context;

        public CategoriaxUnidadController(NewOptimusContext context)
        {
            _context = context;
        }

        // GET: api/CategoriaxUnidad/GetCategoriasxUnidades
        [HttpGet("GetCategoriasxUnidades")]
        public async Task<ActionResult<List<CategoriaxUnidad>>> GetCategoriasxUnidades()
        {
            var list = await _context.CategoriaxUnidades.Select(
                s => new CategoriaxUnidad
                {
                    CategoriaId = s.CategoriaId,
                    UnidadId = s.UnidadId
                }
            ).ToListAsync();
            return list;
        }

        // GET: api/CategoriaxUnidad/GetCategoriaxUnidad/
        [HttpGet("GetCategoriaxUnidad/{categoriaId}/{UnidadId}")]
        public async Task<ActionResult<CategoriaxUnidad>> GetCategoriaxUnidad(int categoriaId, int UnidadId)
        {
            var CategoriaxUnidad = await _context.CategoriaxUnidades.FindAsync(categoriaId, UnidadId);

            if (CategoriaxUnidad == null)
            {
                return NotFound();
            }

            return CategoriaxUnidad;
        }
      
        // POST: api/CategoriaxUnidad/InsertarCategoria
        [HttpPost("InsertarCategoria")]
        public async Task<ActionResult<CategoriaxUnidad>> InsertarCategoria(CategoriaxUnidad CategoriaxUnidad)
        {
            try
            {
                if (CategoriaxUnidad == null)
                {
                    return BadRequest("Los datos de la categoria no pueden ser nulos.");
                }

                _context.CategoriaxUnidades.Add(CategoriaxUnidad);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetCategoriaxUnidad), new { categoriaId = CategoriaxUnidad.CategoriaId, UnidadId = CategoriaxUnidad.UnidadId }, CategoriaxUnidad);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al insertar la categoria en la base de datos: " + ex.Message);
            }
        }
        // DELETE: api/CategoriaxUnidad/DeleteCategoriaxUnidad/5
        [HttpDelete("DeleteCategoriaxUnidad/{categoriaId}/{UnidadId}")]
        public async Task<IActionResult> DeleteCategoriaxUnidad(int categoriaId, int UnidadId)
        {
            var CategoriaxUnidad = await _context.CategoriaxUnidades.FindAsync(categoriaId, UnidadId);
            if (CategoriaxUnidad == null)
            {
                return NotFound();
            }

            _context.CategoriaxUnidades.Remove(CategoriaxUnidad);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CategoriaxUnidadExists(int categoriaId, int UnidadId)
        {
            return _context.CategoriaxUnidades.Any(e => e.CategoriaId == categoriaId && e.UnidadId == UnidadId);
        }


    }
}