using ApiNewProject.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Net.NetworkInformation;
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
            var lista = await _context.CategoriaxUnidades.Select(
                s => new CategoriaxUnidad
                {
                    CategoriaId = s.CategoriaId,
                    UnidadId = s.UnidadId,
                    NombreCategoria = s.NombreCategoria,
                    EstadoCategoria = s.EstadoCategoria,
                    NombreUnidad = s.NombreUnidad,
                    CantidadPorUnidad = s.CantidadPorUnidad,
                    EstadoUnidad = s.EstadoUnidad
                }
            ).ToListAsync();
            return lista;
        }

        [HttpGet("GetCategoriasxUnidadById")]
        public async Task<ActionResult<List<CategoriaxUnidad>>> GetCategoriasxUnidadById(int id)
        {
            try
            {
                var categoriasxUnidades = await _context.CategoriaxUnidades
                 .Where(cm => cm.UnidadId == id)
                .ToListAsync();

                return categoriasxUnidades;
            }
            catch (Exception ex)
            {
                // Considera registrar el error en un log aquí
                return StatusCode(StatusCodes.Status500InternalServerError,
                                 "Error al obtener las asociaciones categoría-marca: " + ex.Message);
            }
        }

        [HttpPost("InsertarCategoriaxUnidad")]
        public async Task<ActionResult<CategoriaxUnidadAsosiacion>> InsertarCategoriaxUnidad(CategoriaxUnidadAsosiacion categoriaxUnidadAsociacion)
        {
            try
            {
                if (categoriaxUnidadAsociacion == null)
                {
                    return BadRequest("Los datos de la categoria no pueden ser nulos.");
                }
                var categoria = _context.Categorias.FirstOrDefault(c => c.CategoriaId == categoriaxUnidadAsociacion.CategoriaId);
                var unidad = _context.Unidades.FirstOrDefault(c => c.UnidadId == categoriaxUnidadAsociacion.UnidadId);
                if(CategoriaxUnidadExists(categoriaxUnidadAsociacion.CategoriaId, categoriaxUnidadAsociacion.UnidadId))
                if (categoria == null || unidad == null) {
                    return Conflict("La categoria o unidad no existen");
                }
                // Crear instancia de CategoriaxMarca y llenar con datos
                var categoriaxUnidad = new CategoriaxUnidad
                {
                    CategoriaId = categoriaxUnidadAsociacion.CategoriaId,
                    UnidadId = categoriaxUnidadAsociacion.UnidadId,
                    NombreCategoria = categoria?.NombreCategoria,
                    EstadoCategoria = categoria?.EstadoCategoria,
                    NombreUnidad = unidad?.NombreUnidad,
                    CantidadPorUnidad =  unidad?.CantidadPorUnidad,
                    EstadoUnidad = unidad?.EstadoUnidad
                };

                _context.CategoriaxUnidades.Add(categoriaxUnidad);
                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al insertar la categoria en la base de datos: " + ex.Message);
            }
        }

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