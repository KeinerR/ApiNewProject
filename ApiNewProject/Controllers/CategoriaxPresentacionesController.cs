using ApiNewProject.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Xml.XPath;

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

        [HttpGet("GetCategoriasxPresentaciones")]
        public async Task<ActionResult<List<CategoriaxPresentacion>>> GetCategoriasxPresentaciones()
        {
            try
            {
                var list = await _context.CategoriaxPresentaciones // Corrección en el nombre de la tabla
                    .Select(cp => new CategoriaxPresentacion
                    {
                        CategoriaId = cp.CategoriaId,
                        PresentacionId = cp.PresentacionId,
                        NombrePresentacion = cp.NombrePresentacion, 
                        NombreCategoria = cp.NombreCategoria,
                        NombreCompletoPresentacion = cp.NombreCompletoPresentacion,
                        CantidadPorPresentacion = cp.CantidadPorPresentacion,
                        Contenido = cp.Contenido,
                        EstadoPresentacion = cp.EstadoPresentacion, 
                        EstadoCategoria = cp.EstadoCategoria 
                    })
                    .ToListAsync();

                return list;
            }
            catch (Exception ex)
            {
                // Considera registrar el error en un log aquí
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al obtener las relaciones categoría-presentación: " + ex.Message);
            }
        }

        [HttpGet("GetCategoriasxPresentacionById")]
        public async Task<ActionResult<List<CategoriaxPresentacion>>> GetCategoriasxPresentacionById(int id)
        {
            try
            {
                var categoriasxPresentaciones = await _context.CategoriaxPresentaciones
                 .Where(cm => cm.PresentacionId == id)
                .ToListAsync();

                return categoriasxPresentaciones;
            }
            catch (Exception ex)
            {
                // Considera registrar el error en un log aquí
                return StatusCode(StatusCodes.Status500InternalServerError,
                                 "Error al obtener las asociaciones categoría-marca: " + ex.Message);
            }
        }

        [HttpGet("GetCategoriasxPresentacionByIdPresentacion/{id}")]
        public async Task<ActionResult<List<CategoriaxPresentacion>>> GetCategoriasxPresentacionByIdPresentacion(int id)
        {
            try
            {
                var categoriasxPresentacion = await _context.CategoriaxPresentaciones
                    .Where(cm => cm.PresentacionId == id)
                    .ToListAsync(); // Asegúrate de ejecutar la consulta con ToListAsync()

                return categoriasxPresentacion;
            }
            catch (Exception ex)
            {
                // Considera registrar el error en un log aquí
                return StatusCode(StatusCodes.Status500InternalServerError,
                                  "Error al obtener las asociaciones categoría-Presentacion: " + ex.Message);
            }
        }


        [HttpPost("InsertarCategoriaxPresentacion")]
        public async Task<ActionResult<CategoriaxPresentacion>> InsertarCategoria(CategoriaxPresentacionAsosiacion categoriaxPresentacionAsosiacion)
        {
            try
            {
                if (categoriaxPresentacionAsosiacion == null)
                {
                    return BadRequest("Los datos de la categoría no pueden ser nulos.");
                }
                if (CategoriaxPresentacionExists(categoriaxPresentacionAsosiacion.CategoriaId, categoriaxPresentacionAsosiacion.PresentacionId))
                {
                    return Conflict("La relación entre esta categoría y esta presentacion ya existe.");
                }

                var categoria = await _context.Categorias.FirstOrDefaultAsync(s => s.CategoriaId == categoriaxPresentacionAsosiacion.CategoriaId);
                var presentacion = await _context.Presentaciones.FirstOrDefaultAsync(p => p.PresentacionId == categoriaxPresentacionAsosiacion.PresentacionId);

                // Validación adicional: Asegurarse de que la categoría y la marca existen
                if (categoria == null || presentacion == null)
                {
                    return BadRequest("La categoría o la marca especificadas no existen.");
                }

                // Crear instancia de CategoriaxMarca y llenar con datos
                var categoriaxPresentacion = new CategoriaxPresentacion
                {
                    CategoriaId = categoriaxPresentacionAsosiacion.CategoriaId,
                    PresentacionId = categoriaxPresentacionAsosiacion.PresentacionId,
                    NombreCategoria = categoria.NombreCategoria,
                    EstadoCategoria = categoria.EstadoCategoria,
                    NombrePresentacion = presentacion.NombrePresentacion,
                    NombreCompletoPresentacion = presentacion.NombreCompletoPresentacion,
                    CantidadPorPresentacion = presentacion.CantidadPorPresentacion,
                    Contenido = presentacion.Contenido,
                    EstadoPresentacion = presentacion.EstadoPresentacion
                };

                _context.CategoriaxPresentaciones.Add(categoriaxPresentacion);
                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                // Considera registrar el error en un log aquí
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al insertar la relación categoría-marca: " + ex.Message);
            }
        }

        [HttpDelete("DeleteCategoriaxPresentacion/{categoriaId}/{presentacionId}")]
        public async Task<IActionResult> DeleteCategoriaxPresentacion(int categoriaId, int presentacionId)
        {
            try
            {
                // Usar FindAsync para buscar por la clave primaria compuesta
                var categoriaxPresentacion = await _context.CategoriaxPresentaciones.FindAsync(categoriaId, presentacionId);

                if (categoriaxPresentacion == null)
                {
                    return NotFound(); // Relación no encontrada
                }

                _context.CategoriaxPresentaciones.Remove(categoriaxPresentacion);
                await _context.SaveChangesAsync();

                return NoContent(); // Éxito, sin contenido que devolver
            }
            catch (Exception ex)
            {
                // Log the exception here (using your preferred logging mechanism)
                return StatusCode(StatusCodes.Status500InternalServerError,
                                 "Error al eliminar la relación categoría-presentación: " + ex.Message);
            }
        }

        private bool CategoriaxPresentacionExists(int categoriaId, int presentacionId)
        {
            return _context.CategoriaxPresentaciones.Any(e => e.CategoriaId == categoriaId && e.PresentacionId == presentacionId);
        }


    }
}