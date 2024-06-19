using ApiNewProject.Entities;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Numerics;

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
                    ValorTotalCompra = s.ValorTotalCompra,
                    EstadoCompra = s.EstadoCompra
                }
            ).ToListAsync();



            return List;

        }

        [HttpGet("GetCompraById")]
        public async Task<ActionResult<Compra>> GetCompraById(int Id)
        {

            Compra? compra = await _context.Compras.Select(
                     s => new Compra
                     {
                         CompraId = s.CompraId,
                         ProveedorId = s.ProveedorId,
                         NumeroFactura = s.NumeroFactura,
                         FechaCompra = s.FechaCompra,
                         ValorTotalCompra = s.ValorTotalCompra,
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
        [HttpGet("FacturasYLotes")]
        public async Task<ActionResult<IEnumerable<object>>> GetFacturasYLotes()
        {
            var facturas = await _context.Compras
                .Select(f => new FacturaDTO
                {
                    NumeroFactura = f.NumeroFactura
                })
                .ToListAsync();

            var lotes = await _context.Lotes
                .Select(l => new LoteDTO
                {
                    NumeroLote = l.NumeroLote
                })
                .ToListAsync();

            return new List<object> { facturas, lotes };
        }
        [HttpPost("InsertCompras")]
        public async Task<IActionResult> InsertCompras(Compra compra)
        {
            try
            {
                var newCompra = new Compra
                {
                    ProveedorId = compra.ProveedorId,
                    NumeroFactura = compra.NumeroFactura,
                    FechaCompra = compra.FechaCompra,
                    ValorTotalCompra = compra.ValorTotalCompra,
                    EstadoCompra = compra.EstadoCompra,
                    Detallecompras = new List<Detallecompra>()
                };

                foreach (var detalleCompra in compra.Detallecompras)
                {
                    if (!detalleCompra.Cantidad.HasValue)
                    {
                        return BadRequest("La cantidad es requerida para el detalle de la compra.");
                    }

                    var newDetalleCompra = new Detallecompra
                    {
                        CompraId = newCompra.CompraId,
                        ProductoId = detalleCompra.ProductoId,
                        UnidadId = detalleCompra.UnidadId,
                        Cantidad = detalleCompra.Cantidad.Value,
                        Lotes = new List<Lote>()
                    };

                    if (detalleCompra.Lotes != null)
                    {
                        foreach (var lote in detalleCompra.Lotes)
                        {
                            if (!lote.Cantidad.HasValue || !lote.FechaVencimiento.HasValue)
                            {
                                return BadRequest("Cantidad, y FechaVencimiento son requeridos para el lote.");
                            }

                            newDetalleCompra.Lotes.Add(new Lote
                            {
                                DetalleCompraId = newDetalleCompra.DetalleCompraId,
                                ProductoId = lote.ProductoId,
                                NumeroLote = lote.NumeroLote,
                                PrecioCompra = lote.PrecioCompra,
                                PrecioPorPresentacion = lote.PrecioPorPresentacion,
                                PrecioPorUnidadProducto = lote.PrecioPorUnidadProducto,
                                FechaVencimiento = lote.FechaVencimiento,
                                Cantidad = lote.Cantidad,
                                EstadoLote = lote.EstadoLote
                            });
                        }
                    }

                    newCompra.Detallecompras.Add(newDetalleCompra);
                    foreach (var lote in newDetalleCompra.Lotes)
                    {
                        var producto = await _context.Productos.FindAsync(lote.ProductoId);
                        if (producto != null)
                        {
                            producto.CantidadTotal += lote.Cantidad;
                        }
                    }
                    await _context.SaveChangesAsync();
                }
                // Calcular el total de la compra como decimal
                decimal totalCompraDecimal = newCompra.Detallecompras.Sum(detalle => detalle.Lotes.Sum(lote => lote.PrecioCompra));

                long totalCompraLong = decimal.ToInt64(totalCompraDecimal);

                newCompra.ValorTotalCompra = totalCompraLong;

                // Guardar newCompra en la base de datos
                _context.Compras.Add(newCompra);
                await _context.SaveChangesAsync();

                return Ok();

            }
            catch (Exception ex)
            {
                return BadRequest("Error al insertar la compra: " + ex.Message);
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
            compras.CompraId = compra.CompraId;
            compras.ProveedorId = compra.ProveedorId;
            compras.NumeroFactura = compra.NumeroFactura;
            compras.FechaCompra = compra.FechaCompra;
            compras.ValorTotalCompra = compra.ValorTotalCompra;
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
        
        [HttpGet("GetComprasRealizada")]
        public async Task<ActionResult<List<Compra>>> GetComprasRealizada()
        {
            try
            {
                // Obtener solo los productos cuyo estado es diferente de cero
                var comprasRealizadas = await _context.Compras
                    .Where(p => p.EstadoCompra != 0)
                    .Select(p => new Compra
                    {
                        CompraId = p.CompraId,
                        ProveedorId = p.ProveedorId,
                        NumeroFactura = p.NumeroFactura,
                        FechaCompra = p.FechaCompra,
                        ValorTotalCompra = p.ValorTotalCompra,
                        EstadoCompra = p.EstadoCompra,
                       
                    })
                    .ToListAsync();

                return Ok(comprasRealizadas);
            }
            catch (Exception ex)
            {
                // Si ocurre algún error, devolver un error 500 Internal Server Error
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al obtener los productos activos: " + ex.Message);
            }
        }
        [HttpPatch("UpdateEstadoCompra/{id}")]
        public async Task<IActionResult> UpdateEstadoCompra(int id)
        {
            try
            {
                // Buscar el compra por su ID
                var compra = await _context.Compras.FindAsync(id);

                // Si no se encuentra el compra, devolver un error 404 Not Found
                if (compra == null)
                {
                    return NotFound();
                }

                compra.EstadoCompra = compra.EstadoCompra == 0 ? 1UL : 0UL;

                // Guardar los cambios en la base de datos
                await _context.SaveChangesAsync();

                // Devolver una respuesta exitosa
                return Ok();
            }
            catch (Exception ex)
            {
                // Si ocurre algún error, devolver un error 500 Internal Server Error
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al actualizar el estado del compra: " + ex.Message);
            }
        }


    }
}

