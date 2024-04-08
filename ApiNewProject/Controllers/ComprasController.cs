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
        public async Task<IActionResult> InsertarCompra(Compra compra)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    // Agregar la compra
                    _context.Compras.Add(compra);
                    await _context.SaveChangesAsync();

                    // Iterar sobre los detalles de compra
                    foreach (var detalleCompra in compra.Detallecompras)
                    {
                        // Asignar el ID de la compra al detalle de compra
                        detalleCompra.CompraId = compra.CompraId;

                        // Agregar el detalle de compra a la base de datos
                        _context.Detallecompras.Add(detalleCompra);
                        await _context.SaveChangesAsync();

                        // Crear un nuevo producto
                        var producto = new Producto
                        {
                            PresentacionId = detalleCompra.Producto.PresentacionId,
                            MarcaId = detalleCompra.Producto.MarcaId,
                            CategoriaId = detalleCompra.Producto.CategoriaId,
                            UnidadId = detalleCompra.Producto.UnidadId,
                            NombreProducto = detalleCompra.Producto.NombreProducto,
                            CantidadTotal = detalleCompra.Producto.CantidadTotal,
                            Estado = detalleCompra.Producto.Estado
                        };

                        // Agregar el producto a la base de datos
                        _context.Productos.Add(producto);
                        await _context.SaveChangesAsync();
                    }

                    // Commit de la transacción
                    await transaction.CommitAsync();

                    return Ok(compra);
                }
                catch (Exception ex)
                {
                    // Rollback de la transacción en caso de error
                    await transaction.RollbackAsync();
                    return StatusCode(StatusCodes.Status500InternalServerError, "Error al insertar compra en la base de datos. Detalles: " + ex.Message);
                }
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
