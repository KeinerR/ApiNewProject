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
    public class CategoriaxPresentacionController : ControllerBase
    {
        private readonly NewOptimusContext _context;

        public CategoriaxPresentacionController(NewOptimusContext context)
        {
            _context = context;
        }

        // GET: api/CategoriaxPresentacion/GetCategoriasxPresentaciones
        [HttpGet("GetCategoriasxPresentaciones")]
        public async Task<ActionResult<List<CategoriaxPresentacion>>> GetCategoriasxPresentaciones()
        {
            var list = await _context.CategoriaxPresentaciones.Select(
                s => new CategoriaxPresentacion
                {
                    CategoriaId = s.CategoriaId,
                    PresentacionId = s.PresentacionId
                }
            ).ToListAsync();
            return list;
        }

        // GET: api/CategoriaxPresentacion/GetCategoriaxPresentacion/5
        [HttpGet("GetCategoriaxPresentacion/{categoriaId}/{presentacionId}")]
        public async Task<ActionResult<CategoriaxPresentacion>> GetCategoriaxPresentacion(int categoriaId, int presentacionId)
        {
            var categoriaxPresentacion = await _context.CategoriaxPresentaciones.FindAsync(categoriaId, presentacionId);

            if (categoriaxPresentacion == null)
            {
                return NotFound();
            }

            return categoriaxPresentacion;
        }

        // POST: api/CategoriaxPresentacion/InsertarCategoria
        [HttpPost("InsertarCategoria")]
        public async Task<ActionResult<CategoriaxPresentacion>> InsertarCategoria(CategoriaxPresentacion categoriaxPresentacion)
        {
            try
            {
                if (categoriaxPresentacion == null)
                {
                    return BadRequest("Los datos de la categoria no pueden ser nulos.");
                }

                _context.CategoriaxPresentaciones.Add(categoriaxPresentacion);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetCategoriaxPresentacion), new { categoriaId = categoriaxPresentacion.CategoriaId, presentacionId = categoriaxPresentacion.PresentacionId }, categoriaxPresentacion);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al insertar la categoria en la base de datos: " + ex.Message);
            }
        }


        // DELETE: api/CategoriaxPresentacion/DeleteCategoriaxPresentacion/5
        [HttpDelete("DeleteCategoriaxPresentacion/{categoriaId}/{presentacionId}")]
        public async Task<IActionResult> DeleteCategoriaxPresentacion(int categoriaId, int presentacionId)
        {
            var categoriaxPresentacion = await _context.CategoriaxPresentaciones.FindAsync(categoriaId, presentacionId);
            if (categoriaxPresentacion == null)
            {
                return NotFound();
            }

            _context.CategoriaxPresentaciones.Remove(categoriaxPresentacion);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CategoriaxPresentacionExists(int categoriaId, int presentacionId)
        {
            return _context.CategoriaxPresentaciones.Any(e => e.CategoriaId == categoriaId && e.PresentacionId == presentacionId);
        }

       
    }
}