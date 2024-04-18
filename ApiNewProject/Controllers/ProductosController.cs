using ApiNewProject.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace ApiNewProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductosController : ControllerBase
    {
        private readonly NewOptimusContext _context;

        public ProductosController(NewOptimusContext context)
        {
            _context = context;
        }


        [HttpGet("GetProductos")]
        public async Task<ActionResult<List<Producto>>> GetProducto()
        {
            var List = await _context.Productos.Select(
                s => new Producto
                {
                    ProductoId = s.ProductoId,
                    PresentacionId = s.PresentacionId,
                    MarcaId = s.MarcaId,
                    CategoriaId = s.CategoriaId,
                    NombreProducto = s.NombreProducto,
                    CantidadTotal = s.CantidadTotal,
                    Estado = s.Estado,
                }
            ).ToListAsync();



            return List;

        }

        [HttpGet("GetProductoById")]
        public async Task<ActionResult<Producto>> GetProductoById(int Id)
        {

            Producto producto = await _context.Productos.Select(
                    s => new Producto
                    {
                        ProductoId = s.ProductoId,
                        PresentacionId = s.PresentacionId,
                        MarcaId = s.MarcaId,
                        CategoriaId = s.CategoriaId,
                        NombreProducto = s.NombreProducto,
                        CantidadTotal = s.CantidadTotal,
                        Estado = s.Estado,
                    })
                .FirstOrDefaultAsync(s => s.ProductoId == Id);

            if (producto == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(producto);
            }
        }


        [HttpPost("InsertarProducto")]
        public async Task<ActionResult<Producto>> InsertarProducto(Producto producto)
        {
            try
            {
                if (producto == null)
                {
                    return BadRequest("Los datos del producto no pueden ser nulos.");
                }

                _context.Productos.Add(producto);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetProductoById), new { id = producto.ProductoId }, producto);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al insertar el producto en la base de datos: " + ex.Message);
            }
        }


        [HttpPut("UpdateProductos")]
        public async Task<ActionResult> UpdateProductos(Producto producto)
        {
            var productos = await _context.Productos.FirstOrDefaultAsync(s => s.ProductoId == producto.ProductoId);

            if (productos == null)
            {
                return NotFound();
            }
            productos.ProductoId = producto.ProductoId;
            productos.PresentacionId = producto.PresentacionId;
            productos.MarcaId = producto.MarcaId;
            productos.CategoriaId = producto.CategoriaId;
            productos.NombreProducto = producto.NombreProducto;
            productos.CantidadTotal = producto.CantidadTotal;
            productos.Estado = producto.Estado;

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("DeleteProducto/{Id}")]
        public async Task<HttpStatusCode> DeleteProducto(int Id)
        {
            var producto = new Producto()
            {
                ProductoId = Id
            };
            _context.Productos.Attach(producto);
            _context.Productos.Remove(producto);
            await _context.SaveChangesAsync();
            return HttpStatusCode.OK;
        }
    }
}
