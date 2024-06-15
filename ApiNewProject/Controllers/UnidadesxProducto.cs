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
    public class UnidadesxProducto : ControllerBase
    {
        private readonly NewOptimusContext _context;

        public UnidadesxProducto(NewOptimusContext context)
        {
            _context = context;
        }


        [HttpGet("GetUnidadesxProducto")]
        public async Task<ActionResult<List<UnidadxProducto>>> GetUnidadesxProducto()
        {
            try
            {
                // Incluir las entidades relacionadas (Producto y Unidad) para evitar consultas adicionales
                var list = await _context.UnidadesxProducto
                    .Include(up => up.Producto)
                    .Include(up => up.Unidad)
                    .ToListAsync();

                return list;
            }
            catch (Exception ex)
            {
                // Considera registrar el error en un log aquí
                return StatusCode(StatusCodes.Status500InternalServerError,
                                 "Error al obtener las asociaciones unidad-producto: " + ex.Message);
            }
        }

        [HttpPost("InsertarUnidad")]
        public async Task<ActionResult<UnidadxProducto>> InsertarUnidad(UnidadxProductoAsosiacion unidadxProductoAsociasion)
        {
            try
            {
                if (unidadxProductoAsociasion == null)
                {
                    return BadRequest("Los datos de la asociación unidad-producto no pueden ser nulos.");
                }

                if (UnidadxProductoExists(unidadxProductoAsociasion.UnidadId, unidadxProductoAsociasion.ProductoId))
                {
                    return Conflict("La relación entre esta unidad y este producto ya existe.");
                }

                // Buscar entidades completas (no solo el primer resultado)
                var unidad = await _context.Unidades.FindAsync(unidadxProductoAsociasion.UnidadId);
                var producto = await _context.Productos.FindAsync(unidadxProductoAsociasion.ProductoId);

                if (unidad == null || producto == null)
                {
                    return NotFound("No se encontró la unidad o el producto especificado.");
                }

                // Crear instancia de UnidadxProducto y llenar con datos, incluyendo las propiedades de navegación
                var unidadxProducto = new UnidadxProducto
                {
                    UnidadId = unidadxProductoAsociasion.UnidadId,
                    ProductoId = unidadxProductoAsociasion.ProductoId,
                    NombreUnidad = unidad.NombreUnidad,
                    EstadoUnidad = unidad.EstadoUnidad,
                    CantidadPorUnidad = unidad.CantidadPorUnidad,
                    Unidad = unidad, 
                    Producto = producto 
                };

                _context.UnidadesxProducto.Add(unidadxProducto);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetUnidadesxProducto),
                    new { unidadId = unidadxProducto.UnidadId, productoId = unidadxProducto.ProductoId },
                    unidadxProducto);
            }
            catch (Exception ex)
            {
                // Considera registrar el error en un log aquí
                return StatusCode(StatusCodes.Status500InternalServerError,
                                 "Error al insertar la relación unidad-producto: " + ex.Message);
            }
        }

        [HttpDelete("DeleteUnidadxProducto/{unidadId}/{productoId}")]
        public async Task<IActionResult> DeleteUnidadxProducto(int unidadId, int productoId)
        {
            var unidadxProducto = await _context.UnidadesxProducto.FindAsync(unidadId, productoId);
            if (unidadxProducto == null)
            {
                return NotFound();
            }

            _context.UnidadesxProducto.Remove(unidadxProducto);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool UnidadxProductoExists(int unidadId, int productoId )
        {
            return _context.UnidadesxProducto.Any(e => e.UnidadId == unidadId && e.ProductoId == productoId);
        }


    }
}