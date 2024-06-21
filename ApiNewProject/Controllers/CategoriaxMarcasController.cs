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

        [HttpGet("GetCategoriasxMarcas")]
        public async Task<ActionResult<List<CategoriaxMarca>>> GetCategoriasxMarcas()
        {
            var lista = await _context.CategoriaxMarcas.Select(
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
            return lista;
        }

        [HttpGet("GetCategoriasxMarcaById")]
        public async Task<ActionResult<List<CategoriaxMarca>>> GetCategoriasxMarcaById(int id)
        {
            try
            {
                var categoriasxMarcas = await _context.CategoriaxMarcas
                 .Where(cm => cm.MarcaId == id)
                .ToListAsync();

                return categoriasxMarcas;
            }
            catch (Exception ex)
            {
                // Considera registrar el error en un log aquí
                return StatusCode(StatusCodes.Status500InternalServerError,
                                 "Error al obtener las asociaciones categoría-marca: " + ex.Message);
            }
        }



        [HttpPost("InsertarCategoriaxMarca")]
        public async Task<ActionResult<CategoriaxMarcaAsosiacion>> InsertarCategoriaxMarca(CategoriaxMarcaAsosiacion CategoriaxMarcaAsosiacion)
        {
            try
            {
                if (CategoriaxMarcaAsosiacion == null)
                {
                    return BadRequest("Los datos de la categoría no pueden ser nulos.");
                }
                if (CategoriaxPresentacionExists(CategoriaxMarcaAsosiacion.CategoriaId, CategoriaxMarcaAsosiacion.MarcaId))
                {
                    return Conflict("La relación entre esta categoría y esta marca ya existe.");
                }

                var categoria = await _context.Categorias.FirstOrDefaultAsync(s => s.CategoriaId == CategoriaxMarcaAsosiacion.CategoriaId);
                var marca = await _context.Marcas.FirstOrDefaultAsync(m => m.MarcaId == CategoriaxMarcaAsosiacion.MarcaId);

                // Validación adicional: Asegurarse de que la categoría y la marca existen
                if (categoria == null || marca == null)
                {
                    return BadRequest("La categoría o la marca especificadas no existen.");
                }

                // Crear instancia de CategoriaxMarca y llenar con datos
                var categoriaxMarca = new CategoriaxMarca
                {
                    CategoriaId = CategoriaxMarcaAsosiacion.CategoriaId,
                    MarcaId = CategoriaxMarcaAsosiacion.MarcaId,
                    NombreCategoria = categoria.NombreCategoria,
                    EstadoCategoria = categoria.EstadoCategoria,
                    NombreMarca = marca.NombreMarca,
                    EstadoMarca = marca.EstadoMarca
                };

                _context.CategoriaxMarcas.Add(categoriaxMarca);
                await _context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                // Considera registrar el error en un log aquí
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al insertar la relación categoría-marca: " + ex.Message);
            }
        }

        // DELETE: api/CategoriaxMarca/DeleteUnidadxProducto/5
        [HttpDelete("DeleteCategoriaxMarca/{categoriaId}/{marcaId}")]
        public async Task<IActionResult> DeleteUnidadxProducto(int categoriaId, int marcaId)
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

        private bool CategoriaxPresentacionExists(int categoriaId, int marcaId)
        {
            return _context.CategoriaxMarcas.Any(e => e.CategoriaId == categoriaId && e.MarcaId == marcaId);
        }

       
    }
}