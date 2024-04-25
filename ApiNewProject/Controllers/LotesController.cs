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
                    PrecioCompraPorUnidad = s.PrecioCompraPorUnidad,
                    PrecioPorUnidad = s.PrecioPorUnidad,
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

            Lote lote = await _context.Lotes.Select(
                    s => new Lote
                    {
                        LoteId = s.LoteId,
                        DetalleCompraId = s.DetalleCompraId,
                        ProductoId = s.ProductoId,
                        NumeroLote = s.NumeroLote,
                        PrecioCompra = s.PrecioCompra,
                        PrecioCompraPorUnidad = s.PrecioCompraPorUnidad,
                        PrecioPorUnidad = s.PrecioPorUnidad,
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
            var lotes = await _context.Lotes.FirstOrDefaultAsync(s => s.LoteId == lote.LoteId);

            if (lotes == null)
            {
                return NotFound();
            }
            lotes.LoteId = lote.LoteId;
            lotes.DetalleCompraId = lote.DetalleCompraId;
            lotes.ProductoId = lote.ProductoId;
            lotes.NumeroLote = lote.NumeroLote;
            lotes.PrecioCompra = lote.PrecioCompra;
            lotes.PrecioCompraPorUnidad = lote.PrecioCompraPorUnidad;
            lotes.PrecioPorUnidad = lote.PrecioPorUnidad;
            lotes.PrecioPorPresentacion = lote.PrecioPorPresentacion;
            lotes.FechaVencimiento = lote.FechaVencimiento;
            lotes.Cantidad = lote.Cantidad;
            lotes.EstadoLote = lote.EstadoLote;

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

    }
}
