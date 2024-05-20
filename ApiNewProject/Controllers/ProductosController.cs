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
        public async Task<ActionResult<List<Producto>>> GetProductos()
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
                    CantidadAplicarPorMayor = s.CantidadAplicarPorMayor,
                    DescuentoAplicarPorMayor = s.DescuentoAplicarPorMayor,
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
                        CantidadAplicarPorMayor = s.CantidadAplicarPorMayor,
                        DescuentoAplicarPorMayor = s.DescuentoAplicarPorMayor,
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
            productos.CantidadAplicarPorMayor = producto.CantidadAplicarPorMayor;
            productos.DescuentoAplicarPorMayor = producto.DescuentoAplicarPorMayor;
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
        [HttpPatch("UpdateEstadoProducto/{id}")]
        public async Task<IActionResult> UpdateEstadoProducto(int id, [FromBody] Producto Estado)
        {
            try
            {
                // Buscar el cliente por su ID
                var producto = await _context.Productos.FindAsync(id);

                // Si no se encuentra el cliente, devolver un error 404 Not Found
                if (producto == null)
                {
                    return NotFound();
                }

                // Actualizar el estado del cliente con el nuevo valor
                producto.Estado = Estado.Estado;

                // Guardar los cambios en la base de datos
                await _context.SaveChangesAsync();

                // Devolver una respuesta exitosa
                return Ok();
            }
            catch (Exception ex)
            {
                // Si ocurre algún error, devolver un error 500 Internal Server Error
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al actualizar el estado del cliente: " + ex.Message);
            }
        }

        [HttpGet("GetProductosActivos")]
        public async Task<ActionResult<List<Producto>>> GetProductosActivos()
        {
            try
            {
                // Obtener solo los productos cuyo estado es diferente de cero
                var productosActivos = await _context.Productos
                    .Where(p => p.Estado != 0)
                    .Select(p => new Producto
                    {
                        ProductoId = p.ProductoId,
                        PresentacionId = p.PresentacionId,
                        MarcaId = p.MarcaId,
                        CategoriaId = p.CategoriaId,
                        NombreProducto = p.NombreProducto,
                        CantidadTotal = p.CantidadTotal,
                        CantidadAplicarPorMayor = p.CantidadAplicarPorMayor,
                        DescuentoAplicarPorMayor = p.DescuentoAplicarPorMayor,
                        Estado = p.Estado
                    })
                    .ToListAsync();

                return Ok(productosActivos);
            }
            catch (Exception ex)
            {
                // Si ocurre algún error, devolver un error 500 Internal Server Error
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al obtener los productos activos: " + ex.Message);
            }
        }

    }
}
