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
    public class CategoriaxMarcaController : ControllerBase
    {
        private readonly NewOptimusContext _context;

        public CategoriaxMarcaController(NewOptimusContext context)
        {
            _context = context;
        }

        // GET: api/CategoriaxMarca/GetCategoriasxMarcaes
        [HttpGet("GetCategoriasxMarcaes")]
        public async Task<ActionResult<List<CategoriaxMarca>>> GetCategoriasxMarcaes()
        {
            var list = await _context.CategoriaxMarcas.Select(
                s => new CategoriaxMarca
                {
                    CategoriaId = s.CategoriaId,
                    MarcaId = s.MarcaId,
                    NombreCategoria = s.NombreCategoria,
                    EstadoCategoria = s.EstadoCategoria,
                    NombreMarca = s.NombreMarca,
                    EstadoMarca = s.EstadoMarca
                }
            ).ToListAsync();
            return list;
        }

        // GET: api/CategoriaxMarca/GetCategoriaxMarca/5
        [HttpGet("GetCategoriaxMarca/{categoriaId}/{marcaId}")]
        public async Task<ActionResult<CategoriaxMarca>> GetCategoriaxMarca(int categoriaId, int marcaId)
        {
            var categoriaxMarca = await _context.CategoriaxMarcas.FindAsync(categoriaId, marcaId);

            if (categoriaxMarca == null)
            {
                return NotFound();
            }

            return categoriaxMarca;
        }

        // POST: api/CategoriaxMarca/InsertarCategoria
        [HttpPost("InsertarCategoria")]
        public async Task<ActionResult<CategoriaxMarca>> InsertarCategoria(CategoriaxMarca categoriaxMarca)
        {
            try
            {
                if (categoriaxMarca == null)
                {
                    return BadRequest("Los datos de la categoria no pueden ser nulos.");
                }
                var categoria = await _context.Categorias.FirstOrDefaultAsync(s => s.CategoriaId == categoriaxMarca.CategoriaId);
                var marca = await _context.Marcas.FirstOrDefaultAsync(m=> m.MarcaId == categoriaxMarca.MarcaId);
                categoriaxMarca.NombreCategoria = categoria?.NombreCategoria;
                categoriaxMarca.EstadoCategoria = categoria?.EstadoCategoria;
                categoriaxMarca.NombreMarca= marca?.NombreMarca;
                categoriaxMarca.EstadoMarca = marca?.EstadoMarca;
                _context.CategoriaxMarcas.Add(categoriaxMarca);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetCategoriaxMarca), new { categoriaId = categoriaxMarca.CategoriaId, marcaId = categoriaxMarca.MarcaId }, categoriaxMarca);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al insertar la categoria en la base de datos: " + ex.Message);
            }
        }

        // DELETE: api/CategoriaxMarca/DeleteCategoriaxMarca/5
        [HttpDelete("DeleteCategoriaxMarca/{categoriaId}/{marcaId}")]
        public async Task<IActionResult> DeleteCategoriaxMarca(int categoriaId, int marcaId)
        {
            var categoriaxMarca = await _context.CategoriaxMarcas.FindAsync(categoriaId, marcaId);
            if (categoriaxMarca == null)
            {
                return NotFound();
            }

            _context.CategoriaxMarcas.Remove(categoriaxMarca);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CategoriaxMarcaExists(int categoriaId, int marcaId)
        {
            return _context.CategoriaxMarcas.Any(e => e.CategoriaId == categoriaId && e.MarcaId == marcaId);
        }

       
    }
}