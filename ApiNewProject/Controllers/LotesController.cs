using ApiNewProject.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace ApiNewProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LotesController : ControllerBase
    {
        private readonly NewOptimusContext _context;

        public LotesController(NewOptimusContext context)
        {
            _context = context;
        }


        [HttpGet("GetLotes")]
        public async Task<ActionResult<List<Lote>>> GetLote()
        {
            var List = await _context.Lotes.Select(
                s => new Lote
                {
                    LoteId = s.LoteId,
                    DetalleCompraId = s.DetalleCompraId,
                    ProductoId = s.ProductoId,
                    NumeroLote = s.NumeroLote,
                    PrecioCompra = s.PrecioCompra,
                    PrecioPorUnidadProducto = s.PrecioPorUnidadProducto,
                    PrecioPorPresentacion = s.PrecioPorPresentacion,
                    FechaVencimiento = s.FechaVencimiento,
                    Cantidad = s.Cantidad,
                    EstadoLote = s.EstadoLote,
                }
            ).ToListAsync();



            return List;

        }

        [HttpGet("GetLoteById")]
        public async Task<ActionResult<Lote>> GetLoteById(int Id)
        {

            Lote? lote = await _context.Lotes.Select(
                    s => new Lote
                    {
                        LoteId = s.LoteId,
                        DetalleCompraId = s.DetalleCompraId,
                        ProductoId = s.ProductoId,
                        NumeroLote = s.NumeroLote,
                        PrecioCompra = s.PrecioCompra,
                        PrecioPorUnidadProducto = s.PrecioPorUnidadProducto,
                        PrecioPorPresentacion = s.PrecioPorPresentacion,
                        FechaVencimiento = s.FechaVencimiento,
                        Cantidad = s.Cantidad,
                        EstadoLote = s.EstadoLote,
                    })
                .FirstOrDefaultAsync(s => s.LoteId == Id);

            if (lote == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(lote);
            }
        }

        [HttpGet("GetLotesByProductId")]
        public async Task<ActionResult<IEnumerable<Lote>>> GetLotesByProductId(int productId)
        {
            var lotes = await _context.Lotes
                .Where(l => l.ProductoId == productId)
                .Select(l => new Lote
                {
                    LoteId = l.LoteId,
                    DetalleCompraId = l.DetalleCompraId,
                    ProductoId = l.ProductoId,
                    NumeroLote = l.NumeroLote,
                    PrecioCompra = l.PrecioCompra,
                    PrecioPorUnidadProducto = l.PrecioPorUnidadProducto,
                    PrecioPorPresentacion = l.PrecioPorPresentacion,
                    FechaVencimiento = l.FechaVencimiento,
                    Cantidad = l.Cantidad,
                    EstadoLote = l.EstadoLote
                })
                .ToListAsync();

            if (lotes == null || !lotes.Any())
            {
                return Ok(new List<Lote>()); // Devolver objeto vacío si no se encuentran lotes
            }

            return Ok(lotes);
        }


        [HttpPost("InsertarLote")]
        public async Task<ActionResult<Lote>> InsertarLote(Lote lote)
        {
            try
            {
                if (lote == null)
                {
                    return BadRequest("Los datos del lote no pueden ser nulos.");
                }

                _context.Lotes.Add(lote);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetLoteById), new { id = lote.LoteId }, lote);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al insertar el lote en la base de datos: " + ex.Message);
            }
        }
        [HttpPut("UpdateLotes")]
        public async Task<ActionResult> UpdateLotes(Lote lote)
        {
            var loteExistente = await _context.Lotes.FirstOrDefaultAsync(s => s.LoteId == lote.LoteId);

            if (loteExistente == null)
            {
                return NotFound();
            }

            // Actualizar los campos del lote existente con los valores del lote recibido
            loteExistente.DetalleCompraId = lote.DetalleCompraId;
            loteExistente.ProductoId = lote.ProductoId;
            loteExistente.NumeroLote = lote.NumeroLote;
            loteExistente.PrecioCompra = lote.PrecioCompra;
            loteExistente.PrecioPorUnidadProducto = lote.PrecioPorUnidadProducto;
            loteExistente.PrecioPorPresentacion = lote.PrecioPorPresentacion;
            loteExistente.FechaVencimiento = lote.FechaVencimiento;
            loteExistente.Cantidad = lote.Cantidad;
            loteExistente.EstadoLote = lote.EstadoLote;

            // Guardar los cambios en la base de datos
            await _context.SaveChangesAsync();

            return Ok();
        }
        [HttpPut("UpdatePrecioLotes")]
        public async Task<ActionResult> UpdatePreciosLotes(int productoId, decimal precioPorUnidadProducto, decimal precioPorPresentacion)
        {
            // Buscar todos los lotes activos asociados al productoId
            var lotes = await _context.Lotes.Where(l => l.ProductoId == productoId && l.EstadoLote == 1).ToListAsync();

            if (lotes == null || !lotes.Any())
            {
                return NotFound($"No se encontraron lotes activos para el producto con ID {productoId}");
            }

            // Actualizar los precios en todos los lotes encontrados
            foreach (var lote in lotes)
            {
                lote.PrecioPorUnidadProducto = precioPorUnidadProducto;
                lote.PrecioPorPresentacion = precioPorPresentacion;
            }

            // Guardar los cambios en la base de datos
            await _context.SaveChangesAsync();

            return Ok($"Se actualizaron los precios en {lotes.Count} lotes asociados al producto con ID {productoId}");
        }

        [HttpPut("UpdatePrecioLote")]
        public async Task<ActionResult> UpdatePrecioLote(int loteId, string numeroLote, decimal precioPorUnidadProducto, decimal precioPorPresentacion)
        {
            // Buscar el lote con el ID proporcionado
            var loteExistente = await _context.Lotes.FirstOrDefaultAsync(s => s.LoteId == loteId && s.NumeroLote == numeroLote);

            if (loteExistente == null)
            {
                return NotFound($"No se encontró un lote con ID {loteId}");
            }

            // Actualizar los precios del lote
            loteExistente.PrecioPorUnidadProducto = precioPorUnidadProducto;
            loteExistente.PrecioPorPresentacion = precioPorPresentacion;

            // Guardar los cambios en la base de datos
            await _context.SaveChangesAsync();

            return Ok($"Se actualizó el precio del lote con ID {loteId}");
        }
       
        [HttpPut("AddCantidadALote/{id}")]
        public async Task<ActionResult> AddCantidadALote(int id, int? cantidad)
        {
            // Buscar el producto por su ID
            var lote = await _context.Lotes.FirstOrDefaultAsync(p => p.LoteId == id);

            if (lote == null)
            {
                return NotFound();
            }
            // Actualizar la cantidad reservada del producto
            lote.Cantidad += cantidad;

            // Guardar los cambios en la base de datos
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("SustraerCantidadALote/{id}")]
        public async Task<ActionResult> SustraerCantidadALote(int id, int? cantidad)
        {
            // Buscar el producto por su ID
            var lote = await _context.Lotes.FirstOrDefaultAsync(p => p.LoteId == id);

            if (lote == null)
            {
                return NotFound();
            }

            // Verificar si la cantidad a restar es válida
            if (lote.Cantidad < cantidad)
            {
                return BadRequest("La cantidad a restar es mayor que la cantidad en lote actual.");
            }

            lote.Cantidad -= cantidad; ;

            // Guardar los cambios en la base de datos
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("DeleteLote/{Id}")]
        public async Task<HttpStatusCode> DeleteLote(int Id)
        {
            var lote = new Lote()
            {
                LoteId = Id
            };
            _context.Lotes.Attach(lote);
            _context.Lotes.Remove(lote);
            await _context.SaveChangesAsync();
            return HttpStatusCode.OK;
        }
        [HttpPatch("UpdateEstadoLote/{id}")]

        public async Task<IActionResult> UpdateEstadoLote(int id)
        {
            try
            {
                // Buscar el lote por su ID
                var lote = await _context.Lotes.FindAsync(id);

                // Si no se encuentra el lote, devolver un error 404 Not Found
                if (lote == null)
                {
                    return NotFound();
                }

                lote.EstadoLote = lote.EstadoLote == 0 ? 1UL : 0UL;

                // Guardar los cambios en la base de datos
                await _context.SaveChangesAsync();

                // Devolver una respuesta exitosa
                return Ok();
            }
            catch (Exception ex)
            {
                // Si ocurre algún error, devolver un error 500 Internal Server Error
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al actualizar el estado del lote: " + ex.Message);
            }
        }

    }
}
