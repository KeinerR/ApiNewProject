using ApiNewProject.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace ApiNewProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DetallepedidosController : ControllerBase
    {
        private readonly NewOptimusContext _context;

        public DetallepedidosController(NewOptimusContext context)
        {
            _context = context;
        }


        [HttpGet("GetDetallepedidos")]
        public async Task<ActionResult<List<Detallepedido>>> GetDetallepedidos()
        {
            var List = await _context.Detallepedidos.Select(
                s => new Detallepedido
                {
                    DetallePedidoId = s.DetallePedidoId,
                    PedidoId = s.PedidoId,
                    UnidadId = s.UnidadId,
                    LoteId = s.LoteId,
                    ProductoId = s.ProductoId,
                    Cantidad = s.Cantidad,
                    PrecioUnitario = s.PrecioUnitario,
                    Subtotal = s.Subtotal,
                }
            ).ToListAsync();



            return List;

        }

        [HttpGet("GetDetallepedidoById")]
        public async Task<ActionResult<Detallepedido>> GetDetallepedidoById(int Id)
        {

            Detallepedido detallepedido = await _context.Detallepedidos.Select(
                    s => new Detallepedido
                    {
                        DetallePedidoId = s.DetallePedidoId,
                        PedidoId = s.PedidoId,
                        UnidadId = s.UnidadId,
                        LoteId = s.LoteId,

                        ProductoId = s.ProductoId,
                        Cantidad = s.Cantidad,
                        PrecioUnitario = s.PrecioUnitario,
                        Subtotal = s.Subtotal,
                    })
                .FirstOrDefaultAsync(s => s.DetallePedidoId == Id);

            if (detallepedido == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(detallepedido);
            }
        }


        [HttpPost("InsertarDetallepedido")]
        public async Task<ActionResult<Detallepedido>> InsertarDetallepedido(Detallepedido detallepedido)
        {
            try
            {
                if (detallepedido == null)
                {
                    return BadRequest("Los datos del detallepedido no pueden ser nulos.");
                }

                _context.Detallepedidos.Add(detallepedido);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetDetallepedidoById), new { id = detallepedido.DetallePedidoId }, detallepedido);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al insertar el detallepedido en la base de datos: " + ex.Message);
            }
        }
        [HttpPut("UpdateDetallepedidos")]
        public async Task<ActionResult> UpdateDetallepedidos(Detallepedido detallepedido)
        {
            if (detallepedido == null)
            {
                return BadRequest(); // Devolver un código de estado BadRequest si el objeto detallepedido es nulo
            }

            var detallepedidos = await _context.Detallepedidos.FirstOrDefaultAsync(s => s.DetallePedidoId == detallepedido.DetallePedidoId);

            if (detallepedidos == null)
            {
                return NotFound(); // Devolver un código de estado NotFound si el detalle de pedido no se encuentra en la base de datos
            }

            // Actualizar las propiedades del detalle de pedido con los valores proporcionados
            detallepedidos.PedidoId = detallepedido.PedidoId;
            detallepedidos.ProductoId = detallepedido.ProductoId;
            detallepedidos.UnidadId = detallepedido.UnidadId;
            detallepedidos.LoteId = detallepedido.LoteId;

            detallepedidos.Cantidad = detallepedido.Cantidad;
            detallepedidos.PrecioUnitario = detallepedido.PrecioUnitario;

            // Guardar los cambios en la base de datos
            await _context.SaveChangesAsync();

            return Ok(); // Devolver un código de estado Ok para indicar que la actualización fue exitosa
        }


        [HttpDelete("DeleteDetallepedido/{Id}")]
        public async Task<HttpStatusCode> DeleteDetallepedido(int Id)
        {
            var detallepedido = new Detallepedido()
            {
                DetallePedidoId = Id
            };
            _context.Detallepedidos.Attach(detallepedido);
            _context.Detallepedidos.Remove(detallepedido);
            await _context.SaveChangesAsync();
            return HttpStatusCode.OK;
        }
    }
}
