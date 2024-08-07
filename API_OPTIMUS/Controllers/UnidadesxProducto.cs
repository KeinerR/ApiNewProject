﻿using API_OPTIMUS.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API_OPTIMUS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UnidadesxProducto : ControllerBase
    {
        private readonly OptimusContext _context;

        public UnidadesxProducto(OptimusContext context)
        {
            _context = context;
        }


        [HttpGet("GetUnidadesxProducto")]
        public async Task<ActionResult<List<UnidadxProducto>>> GetUnidadesxProducto()
        {
            try
            {
                var list = await _context.UnidadesxProducto
                    .ToListAsync();

                return list;
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    "Error al obtener las asociaciones unidad-producto por ID de producto.");
            }
        }
       
        [HttpGet("GetUnidadesxProductoById")]
        public async Task<ActionResult<List<UnidadxProducto>>> GetUnidadesxProductoById(int Id)
        {
            try
            {
                var list = await _context.UnidadesxProducto
                    .Where(up => up.UnidadId == Id)
                    .ToListAsync();

                return list;
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    "Error al obtener las asociaciones unidad-producto por ID de producto.");
            }
        }

        [HttpGet("GetUnidadesxProductoByProductoId")]
        public async Task<ActionResult<List<UnidadxProducto>>> GetUnidadesxProductoByProductoId(int productoId)
        {
            try
            {
                var list = await _context.UnidadesxProducto
                    .Where(up => up.ProductoId == productoId)
                    .ToListAsync();

                return list;
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    "Error al obtener las asociaciones unidad-producto por ID de producto.");
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
                    NombreCompletoUnidad = unidad.NombreUnidad,
                    NombreCompletoProducto = producto.NombreCompletoProducto,
                    EstadoProducto = producto.Estado
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