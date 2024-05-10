using ApiNewProject.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace ApiNewProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DetallecomprasController : ControllerBase
    {
        private readonly NewOptimusContext _context;

        public DetallecomprasController(NewOptimusContext context)
        {
            _context = context;
        }


        [HttpGet("GetDetallecompras")]
        public async Task<ActionResult<List<Detallecompra>>> GetDetallecompras()
        {
            var List = await _context.Detallecompras.Select(
                s => new Detallecompra
                {
                    DetalleCompraId = s.DetalleCompraId,
                    CompraId = s.CompraId,
                    UnidadId = s.UnidadId,
                    ProductoId = s.ProductoId,
                    Cantidad = s.Cantidad
                }
            ).ToListAsync();



            return List;

        }

        [HttpGet("GetDetallecompraById")]
        public async Task<ActionResult<Detallecompra>> GetDetallecompraById(int Id)
        {

            Detallecompra detallecompra = await _context.Detallecompras.Select(
                    s => new Detallecompra
                    {
                        DetalleCompraId = s.DetalleCompraId,
                        CompraId = s.CompraId,
                        ProductoId = s.ProductoId,
                        UnidadId = s.UnidadId,
                        Cantidad = s.Cantidad
                    })
                .FirstOrDefaultAsync(s => s.DetalleCompraId == Id);

            if (detallecompra == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(detallecompra);
            }
        }


        [HttpPost("InsertarDetallecompra")]
        public async Task<ActionResult<Detallecompra>> InsertarDetallecompra(Detallecompra detallecompra)
        {
            try
            {
                if (detallecompra == null)
                {
                    return BadRequest("Los datos del detallecompra no pueden ser nulos.");
                }

                _context.Detallecompras.Add(detallecompra);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetDetallecompraById), new { id = detallecompra.DetalleCompraId }, detallecompra);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al insertar el detallecompra en la base de datos: " + ex.Message);
            }
        }


        [HttpPut("UpdateDetallecompras")]
        public async Task<ActionResult> UpdateDetallecompras(Detallecompra detallecompra)
        {
            var detallecompras = await _context.Detallecompras.FirstOrDefaultAsync(s => s.DetalleCompraId == detallecompra.DetalleCompraId);

            if (detallecompra == null)
            {
                return NotFound();
            }
            detallecompras.DetalleCompraId = detallecompra.DetalleCompraId;
            detallecompras.CompraId = detallecompra.CompraId;
            detallecompras.ProductoId = detallecompra.ProductoId;
            detallecompras.UnidadId = detallecompra.UnidadId;
            detallecompras.Cantidad = detallecompra.Cantidad;

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("DeleteDetallecompra/{Id}")]
        public async Task<HttpStatusCode> DeleteDetallecompra(int Id)
        {
            var detallecompra = new Detallecompra()
            {
                DetalleCompraId = Id
            };
            _context.Detallecompras.Attach(detallecompra);
            _context.Detallecompras.Remove(detallecompra);
            await _context.SaveChangesAsync();
            return HttpStatusCode.OK;
        }


    }
}
