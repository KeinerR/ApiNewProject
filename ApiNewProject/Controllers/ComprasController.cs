using ApiNewProject.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace ApiNewProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ComprasController : ControllerBase
    {
        private readonly NewOptimusContext _context;

        public ComprasController(NewOptimusContext context)
        {
            _context = context;
        }


        [HttpGet("GetCompras")]
        public async Task<ActionResult<List<Compra>>> GetCompras()
        {
            var List = await _context.Compras.Select(
                s => new Compra
                {
                    CompraId = s.CompraId,
                    ProveedorId = s.ProveedorId,
                    NumeroFactura = s.NumeroFactura,
                    FechaCompra = s.FechaCompra,
                    EstadoCompra = s.EstadoCompra
                }
            ).ToListAsync();



            return List;

        }

        [HttpGet("GetCompraById")]
        public async Task<ActionResult<Cliente>> GetCompraById(int Id)
        {

            Compra compra = await _context.Compras.Select(
                     s => new Compra
                     {
                         CompraId = s.CompraId,
                         ProveedorId = s.ProveedorId,
                         NumeroFactura = s.NumeroFactura,
                         FechaCompra = s.FechaCompra,
                         EstadoCompra = s.EstadoCompra
                     })
                .FirstOrDefaultAsync(s => s.CompraId == Id);

            if (compra == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(compra);
            }
        }


        [HttpPost("InsertarCompra")]
        public async Task<ActionResult<Compra>> InsertarCompra(Compra compra)
        {
            try
            {
                if (compra == null)
                {
                    return BadRequest("Los datos de la compra no pueden ser nulos.");
                }

                _context.Compras.Add(compra);
                await _context.SaveChangesAsync();

                // Make sure GetCompraById method exists and is accessible
                return CreatedAtAction(nameof(GetCompraById), new { id = compra.CompraId }, compra);
            }
            catch (Exception ex)
            {
                // Return a more specific error message
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al insertar compra en la base de datos. Detalles: " + ex.Message);
            }
        }



        [HttpPut("UpdateCompras")]
        public async Task<ActionResult> UpdateCompras(Compra compra)
        {
            var compras = await _context.Compras.FirstOrDefaultAsync(s => s.CompraId == compra.CompraId);

            if (compras == null)
            {
                return NotFound();
            }
            compras.CompraId= compra.CompraId;
            compras.ProveedorId = compra.ProveedorId;
            compras.NumeroFactura = compra.NumeroFactura;
            compras.FechaCompra = compra.FechaCompra;
            compras.EstadoCompra = compra.EstadoCompra;


            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("DeleteCompra/{Id}")]
        public async Task<HttpStatusCode> DeleteCompra(int Id)
        {
            var compra = new Compra()
            {
                CompraId = Id
            };
            _context.Compras.Attach(compra);
            _context.Compras.Remove(compra);
            await _context.SaveChangesAsync();
            return HttpStatusCode.OK;
        }
    }
}
