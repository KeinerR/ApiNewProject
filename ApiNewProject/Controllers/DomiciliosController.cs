using ApiNewProject.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace ApiNewProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DomiciliosController : ControllerBase
    {
        private readonly NewOptimusContext _context;

        public DomiciliosController(NewOptimusContext context)
        {
            _context = context;
        }
        [HttpGet("GetDomicilios")]
        public async Task<ActionResult<List<Domicilio>>> GetDomicilios()
        {
            var List = await _context.Domicilios.Select(
                s => new Domicilio
                {
                    DomicilioId = s.DomicilioId,
                    PedidoId = s.PedidoId,
                    UsuarioId = s.UsuarioId,
                    Observacion = s.Observacion,
                    FechaEntrega = s.FechaEntrega,
                    DireccionDomiciliario = s.DireccionDomiciliario,
                    EstadoDomicilio     = s.EstadoDomicilio
                }
            ).ToListAsync();

            return List;

        }


        [HttpGet("GetDomicilioById")]
        public async Task<ActionResult<Domicilio>> GetDomicilioById(int Id)
        {

            Domicilio domicilio = await _context.Domicilios.Select(
                    s => new Domicilio
                    {
                        DomicilioId = s.DomicilioId,
                        PedidoId = s.PedidoId,
                        UsuarioId = s.UsuarioId,
                        Observacion = s.Observacion,
                        FechaEntrega = s.FechaEntrega,
                        DireccionDomiciliario = s.DireccionDomiciliario,
                        EstadoDomicilio = s.EstadoDomicilio
                    })
                .FirstOrDefaultAsync(s => s.DomicilioId == Id);

            if (domicilio == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(domicilio);
            }
        }

        [HttpPost("InsertDomicilio")]
        public async Task<ActionResult<Domicilio>> InsertDomicilio(Domicilio domicilio)
        {
            try
            {
                if (domicilio == null)
                {
                    return BadRequest("Los datos del domicilio no pueden ser nulos.");
                }

                _context.Domicilios.Add(domicilio);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetDomicilioById), new { id = domicilio.DomicilioId}, domicilio);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al insertar el domicilio en la base de datos: " + ex.Message);
            }
        }


        [HttpPut("UpdateDomicilios")]
        public async Task<ActionResult> UpdateDomicilios(Domicilio domicilio)
        {
            var domicilios = await _context.Domicilios.FirstOrDefaultAsync(s => s.DomicilioId == domicilio.DomicilioId);

            if (domicilios == null)
            {
                return NotFound();
            }
            domicilios.DomicilioId = domicilio.DomicilioId;
            domicilios.PedidoId = domicilio.PedidoId;
            domicilios.UsuarioId = domicilio.UsuarioId;
            domicilios.Observacion = domicilio.Observacion;
            domicilios.FechaEntrega = domicilio.FechaEntrega;
            domicilios.DireccionDomiciliario = domicilio.DireccionDomiciliario;
            domicilios.EstadoDomicilio = domicilio.EstadoDomicilio;

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("DeleteDomicilio/{Id}")]
        public async Task<HttpStatusCode> DeleteDomicilio(int Id)
        {
            var domicilio = new Domicilio()
            {
                DomicilioId = Id
            };
            _context.Domicilios.Attach(domicilio);
            _context.Domicilios.Remove(domicilio);
            await _context.SaveChangesAsync();
            return HttpStatusCode.OK;
        }




    }
}
