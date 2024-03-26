using ApiNewProject.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiNewProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PedidosController : ControllerBase
    {
        private readonly NewOptimusContext _context;

        public PedidosController(NewOptimusContext context)
        {
            _context = context;
        }


        [HttpPost("InsertPedidos")]
        public async Task<IActionResult> InsertPedidos(Pedido pedido)
        {
            try
            {
                var vlPedido = new Pedido
                {
                    ClienteId = pedido.ClienteId,
                    TipoServicio = pedido.TipoServicio,
                    FechaPedido = pedido.FechaPedido,
                    EstadoPedido = pedido.EstadoPedido,
                    Detallepedidos = new List<Detallepedido>(),
                    Domicilios = new List<Domicilio>()
                };

                foreach (var item in pedido.Detallepedidos)
                {
                    if (!item.Cantidad.HasValue || !item.PrecioUnitario.HasValue)
                    {
                        return BadRequest("Cantidad y PrecioUnitario son requeridos.");
                    }

                    vlPedido.Detallepedidos.Add(new Detallepedido
                    {
                        PedidoId = vlPedido.PedidoId,
                        ProductoId = item.ProductoId,
                        Cantidad = item.Cantidad.Value,
                        PrecioUnitario = item.PrecioUnitario.Value
                    });
                }

                if (pedido.TipoServicio == "Domicilio")
                {
                    foreach (var item in pedido.Domicilios)
                    {
                        vlPedido.Domicilios.Add(new Domicilio
                        {
                            PedidoId = vlPedido.PedidoId,
                            UsuarioId = item.UsuarioId,
                            Observacion = item.Observacion,
                            FechaEntrega = item.FechaEntrega,
                            DireccionDomiciliario = item.DireccionDomiciliario,
                            EstadoDomicilio = item.EstadoDomicilio
                        });
                    }
                }

                _context.Pedidos.Add(vlPedido);
                await _context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest("Error al insertar el pedido: " + ex.Message);
            }
        }
        [HttpGet("GetPedidos")]
        public async Task<ActionResult<Pedido>> GetPedidos(int id)
        {
            try
            {
                var pedido=await _context.Pedidos
                    .Include(p=>p.Detallepedidos)
                     .Include(p=>p.Domicilios)
                     .FirstOrDefaultAsync(p=>p.PedidoId== id);
                if (pedido == null)
                {
                    return NotFound();
                }
                return pedido;
            }
            catch (Exception ex)
            {
                return StatusCode(500, "error del servidor");
            }
        }


    }
}
  
