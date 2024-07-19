using API_OPTIMUS.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace API_OPTIMUS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MovimientosController : ControllerBase
    {
        private readonly OptimusContext _context;

        public MovimientosController(OptimusContext context)
        {
            _context = context;
        }


        [HttpGet("GetMoviemientos")]
        public async Task<ActionResult<List<Movimiento>>> GetMovimientos()
        {
            var List = await _context.Movimientos.Select(
                s => new Movimiento
                {
                    MovimientoId = s.MovimientoId,
                    TipoAccion = s.TipoAccion,
                    TipoMovimiento = s.TipoMovimiento,
                    BuscarId=s.BuscarId,
                    FechaMovimiento = s.FechaMovimiento,
                }
            ).ToListAsync();



            return List;

        }

        [HttpGet("GetMovimientoById")]
        public async Task<ActionResult<Movimiento>> GetMovimientoById(int Id)
        {

            Movimiento movimiento = await _context.Movimientos.Select(
                    s => new Movimiento
                    {
                        MovimientoId = s.MovimientoId,
                        TipoAccion = s.TipoAccion,
                        TipoMovimiento = s.TipoMovimiento,
                        BuscarId = s.BuscarId,

                        FechaMovimiento = s.FechaMovimiento,
                    })
                .FirstOrDefaultAsync(s => s.MovimientoId == Id);

            if (movimiento == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(movimiento);
            }
        }


        [HttpPost("InsertarMovimiento")]
        public async Task<ActionResult<Movimiento>> InsertarCategoria(Movimiento movimiento)
        {
            try
            {
                if (movimiento == null)
                {
                    return BadRequest("Los datos del movimiento no pueden ser nulos.");
                }

                _context.Movimientos.Add(movimiento);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetMovimientoById), new { id = movimiento.MovimientoId }, movimiento);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al insertar el movimiento en la base de datos: " + ex.Message);
            }
        }


        [HttpPut("UpdateMovimientos")]
        public async Task<ActionResult> UpdateMovimientos(Movimiento movimiento)
        {
            var movimientos = await _context.Movimientos.FirstOrDefaultAsync(s => s.MovimientoId == movimiento.MovimientoId);

            if (movimiento == null)
            {
                return NotFound();
            }
            movimientos.MovimientoId = movimiento.MovimientoId;
            movimientos.TipoAccion = movimiento.TipoAccion;
            movimientos.TipoMovimiento = movimiento.TipoMovimiento;
          movimiento.BuscarId=movimiento.BuscarId;
            movimientos.FechaMovimiento = movimiento.FechaMovimiento;

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("DeleteMovimiento/{Id}")]
        public async Task<HttpStatusCode> DeleteMovimiento(int Id)
        {
            var movimiento = new Movimiento()
            {
                MovimientoId = Id
            };
            _context.Movimientos.Attach(movimiento);
            _context.Movimientos.Remove(movimiento);
            await _context.SaveChangesAsync();
            return HttpStatusCode.OK;
        }
    }
}
