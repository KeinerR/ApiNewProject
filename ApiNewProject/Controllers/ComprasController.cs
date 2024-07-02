using ApiNewProject.Entities;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Net;
using System.Numerics;

namespace ApiNewProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ComprasController : ControllerBase
    {
        private readonly NewOptimusContext _context;
        private readonly ProductosController _disparador;
        public ComprasController(NewOptimusContext context, ProductosController disparador)
        {
            _context = context;
            _disparador = disparador;
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
        [HttpGet("VerificarDuplicadosFacturas")]
        public async Task<ActionResult<string>> VerificarDuplicadosFacturas(string numeroF)
        {
            // Obtener los lotes basados en el número de factura
            var lotes = await _context.Compras
                .Where(l => l.NumeroFactura == numeroF)
                .ToListAsync();

            // Verificar si hay más de un lote encontrado
            bool duplicados = lotes.Count > 1;

            // Retornar "error" si hay duplicados, de lo contrario "ok"
            return duplicados ? "error" : "ok";
        }

        [HttpGet("VerificarDuplicadosLotes")]
        public async Task<ActionResult<string>> VerificarDuplicadosLotes(string numeroLote)
        {
            // Obtener los lotes basados en el número de lote
            var lotes = await _context.Lotes
                .Where(l => l.NumeroLote == numeroLote)
                .ToListAsync();

            // Verificar si hay duplicados basados en el número de lote
            var duplicados = lotes.GroupBy(l => l.NumeroLote)
                                   .Any(g => g.Count() > 1);

            // Retornar "error" si hay duplicados, de lo contrario "ok"
            return duplicados ? "error" : "ok";
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
            if (compra == null)
            {
                return BadRequest("La compra no puede ser nula.");
            }

            try
            {
                // Creación de una nueva compra
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
                    // Creación de un nuevo detalle de compra
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
                            var newLote = new Lote
                            {
                                DetalleCompraId = lote.DetalleCompraId,
                                ProductoId = lote.ProductoId,
                                NumeroLote = lote.NumeroLote,
                                PrecioCompra = lote.PrecioCompra,
                                PrecioPorUnidad = lote.PrecioPorUnidad.Value,
                                PrecioPorPresentacion = lote.PrecioPorPresentacion.Value,
                                PrecioPorUnidadProducto = lote.PrecioPorUnidadProducto.Value,
                                Cantidad = lote.Cantidad.Value,
                                CantidadPorUnidad = lote.CantidadPorUnidad.Value,
                                PrecioPorUnidadCompra = lote.PrecioPorUnidadCompra.Value,
                                PrecioPorPresentacionCompra = lote.PrecioPorPresentacionCompra.Value,
                                PrecioPorUnidadProductoCompra = lote.PrecioPorUnidadProductoCompra.Value,
                                CantidadCompra = lote.CantidadCompra.Value,
                                CantidadPorUnidadCompra = lote.CantidadPorUnidadCompra.Value,
                                FechaVencimiento = lote.FechaVencimiento.Value,
                                EstadoLote = lote.EstadoLote.Value
                            };

                            newDetalleCompra.Lotes.Add(newLote);
                        }
                    }

                    newCompra.Detallecompras.Add(newDetalleCompra);

                    // Actualización de la cantidad del producto en stock
                    foreach (var lote in newDetalleCompra.Lotes)
                    {
                        var producto = await _context.Productos.FindAsync(lote.ProductoId);
                        if (producto != null)
                        {
                            var result = await _disparador.AddCantidadTotal(lote.ProductoId, lote.Cantidad);
                            if (result == null)
                            {
                                return BadRequest($"Error al actualizar la cantidad del producto en stock para el producto ID: {lote.ProductoId}");
                            }
                        }
                        else
                        {
                            return BadRequest($"El producto con ID: {lote.ProductoId} no se encontró.");
                        }
                    }       
                }

                // Calcular el valor total de la compra
                decimal? totalCompraDecimal = newCompra.Detallecompras.Sum(detalle => detalle.Lotes.Sum(lote => lote.PrecioCompra * lote.Cantidad));
                long totalCompraLong = Convert.ToInt64(totalCompraDecimal);
                newCompra.ValorTotalCompra = totalCompraLong;

                // Guardar la compra en la base de datos
                _context.Compras.Add(newCompra);
                await _context.SaveChangesAsync();

                return Ok(newCompra);
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
                // Obtener los lotes asociados a la compra
                var lotesAsociados = await GetLotesPorCompraId(id);

                // Verificar la validación en los lotes
                if (!ValidarLotes(lotesAsociados))
                {
                    return BadRequest("Las cantidades totales y por unidad no son iguales en todos los lotes asociados a la compra.");
                }

                // Buscar el compra por su ID
                var compra = await _context.Compras.FindAsync(id);

                // Si no se encuentra el compra, devolver un error 404 Not Found
                if (compra == null)
                {
                    return NotFound();
                }

                compra.EstadoCompra = compra.EstadoCompra == 0UL ? 1UL : 0UL;

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

        private async Task<List<Lote>> GetLotesPorCompraId(int compraId)
        {
            var idsDetallesCompra = await _context.Detallecompras
                .Where(dc => dc.CompraId == compraId)
                .Select(dc => dc.DetalleCompraId)
                .ToListAsync();

            var lotesFiltrados = await _context.Lotes
                .Where(l => idsDetallesCompra.Contains(l.DetalleCompraId))
                .ToListAsync();

            return lotesFiltrados;
        }

        private bool ValidarLotes(List<Lote> lotes)
        {
            foreach (var lote in lotes)
            {
                if (lote.Cantidad != lote.CantidadCompra)
                {
                    return false;
                }
            }
            return true;
        }


    }
}

