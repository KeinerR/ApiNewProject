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
                    ValorTotalCompra = s.ValorTotalCompra,
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
        [HttpPost("InsertCompras")]
        public async Task<IActionResult> InsertCompras(Compra compra)
        {
            Console.WriteLine(compra.FechaCompra);
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
                            if (!lote.Cantidad.HasValue || !lote.PrecioCompra.HasValue || !lote.FechaVencimiento.HasValue)
                            {
                                return BadRequest("Cantidad, PrecioCompra y FechaVencimiento son requeridos para el lote.");
                            }

                            newDetalleCompra.Lotes.Add(new Lote
                            {
                                DetalleCompraId = newDetalleCompra.DetalleCompraId,
                                ProductoId = lote.ProductoId,
                                NumeroLote = lote.NumeroLote,
                                PrecioCompra = lote.PrecioCompra,
                                PrecioPorUnidad = lote.PrecioPorUnidad,
                                PrecioPorUnidadProducto = lote.PrecioPorUnidadProducto,
                                PrecioPorPresentacion = lote.PrecioPorPresentacion,
                                FechaVencimiento = lote.FechaVencimiento,
                                Cantidad = lote.Cantidad,
                                EstadoLote = lote.EstadoLote
                            });

                            // Actualizar la cantidad total del producto en la compra
                            var producto = await _context.Productos.FindAsync(lote.ProductoId);
                            if (producto != null)
                            {
                                producto.CantidadTotal += lote.Cantidad.Value;
                            }
                            else
                            {
                                // Si el producto no existe, puedes crear uno nuevo o manejar el caso según tus requisitos
                                // Aquí simplemente lanzaremos una excepción, pero puedes cambiar esto según tus necesidades
                                throw new InvalidOperationException("El producto no existe.");
                            }
                        }
                    }

                    newCompra.Detallecompras.Add(newDetalleCompra);
                }

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
    }
}

