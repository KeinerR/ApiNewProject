using ApiNewProject.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

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
        public async Task<ActionResult<List<Producto>>> GetProductos(string? busqueda = "")
        {
            IQueryable<Producto> query = _context.Productos;

            if (!string.IsNullOrEmpty(busqueda))
            {
                // Aplica filtros de búsqueda solo si se proporciona una consulta de búsqueda
                query = query.Where(p =>
                    p.NombreProducto.Contains(busqueda) ||
                    p.Categoria.NombreCategoria.Contains(busqueda) ||
                    p.Marca.NombreMarca.Contains(busqueda));
            }

            var productList = await query
                .Select(s => new Producto
                {
                    ProductoId = s.ProductoId,
                    PresentacionId = s.PresentacionId,
                    MarcaId = s.MarcaId,
                    CategoriaId = s.CategoriaId,
                    NombreProducto = s.NombreProducto,
                    CantidadTotal = s.CantidadTotal,
                    CantidadReservada = s.CantidadReservada,
                    CantidadAplicarPorMayor = s.CantidadAplicarPorMayor,
                    DescuentoAplicarPorMayor = s.DescuentoAplicarPorMayor,
                    Estado = s.Estado
                })
                .ToListAsync();

            return productList;
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
                        CantidadReservada = s.CantidadReservada,
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
        [HttpGet("GetAllDatosProductos")]
        public async Task<ActionResult<List<DatosProducto>>> GetAllDatosProductos(string? busqueda = "")
        {
            IQueryable<Producto> query = _context.Productos; // Cambio a IQueryable<Producto>
            if (!string.IsNullOrEmpty(busqueda))
            {
                // Aplica filtros de búsqueda solo si se proporciona una consulta de búsqueda
                query = query.Where(p =>
                    p.NombreProducto.Contains(busqueda) ||
                    p.Categoria.NombreCategoria.Contains(busqueda) ||
                    p.Marca.NombreMarca.Contains(busqueda));
            }

            var productos = await query
                .Include(p => p.Categoria)
                .Include(p => p.Marca)
                .Include(p => p.Presentacion)
                .ToListAsync();

            var datosProductosList = productos.Select(p => new DatosProducto
            {
                ProductoId = p.ProductoId,
                PresentacionId = p.PresentacionId,
                MarcaId = p.MarcaId,
                CategoriaId = p.CategoriaId,
                NombreProducto = p.NombreProducto,
                CantidadTotal = p.CantidadTotal,
                CantidadReservada = p.CantidadReservada,
                CantidadAplicarPorMayor = p.CantidadAplicarPorMayor,
                DescuentoAplicarPorMayor = p.DescuentoAplicarPorMayor,
                Estado = p.Estado,
                NombreCategoria = p.Categoria != null ? p.Categoria.NombreCategoria : null,
                NombreMarca = p.Marca != null ? p.Marca.NombreMarca : null,
                NombrePresentacion = p.Presentacion != null ? p.Presentacion.NombrePresentacion : null,
                CantidadPorPresentacion = p.Presentacion != null ? p.Presentacion.CantidadPorPresentacion : 0,
                Contenido = p.Presentacion != null ? p.Presentacion.Contenido : null
                // Asegúrate de agregar las propiedades adicionales que desees cargar
            }).ToList();

            return datosProductosList;
        }

        [HttpGet("GetDatosProductoById")]
        public async Task<ActionResult<DatosProducto>> GetDatosProductoById(int id)
        {
            var producto = await _context.Productos
                .Where(p => p.ProductoId == id)
                .Include(p => p.Categoria)
                .Include(p => p.Marca)
                .Include(p => p.Presentacion)
                .FirstOrDefaultAsync();

            if (producto == null)
            {
                return NotFound();
            }

            var datosProducto = new DatosProducto
            {
                ProductoId = producto.ProductoId,
                PresentacionId = producto.PresentacionId,
                MarcaId = producto.MarcaId,
                CategoriaId = producto.CategoriaId,
                NombreProducto = producto.NombreProducto,
                CantidadTotal = producto.CantidadTotal,
                CantidadReservada = producto.CantidadReservada,
                CantidadAplicarPorMayor = producto.CantidadAplicarPorMayor,
                DescuentoAplicarPorMayor = producto.DescuentoAplicarPorMayor,
                Estado = producto.Estado,
                NombreCategoria = producto.Categoria != null ? producto.Categoria.NombreCategoria : null,
                NombreMarca = producto.Marca != null ? producto.Marca.NombreMarca : null,
                NombrePresentacion = producto.Presentacion != null ? producto.Presentacion.NombrePresentacion : null,
                CantidadPorPresentacion = producto.Presentacion != null ? producto.Presentacion.CantidadPorPresentacion : 0,
                Contenido = producto.Presentacion != null ? producto.Presentacion.Contenido : null
                // Asegúrate de agregar las propiedades adicionales que desees cargar
            };

            return datosProducto;
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
            productos.CantidadReservada = producto.CantidadReservada;
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
        public async Task<IActionResult> UpdateEstadoProductoAsync(int id)
        {

            try
            {
                // Buscar el producto por su ID
                var producto = await _context.Productos.FindAsync(id);

                // Si no se encuentra el producto, devolver un error 404 Not Found
                if (producto == null)
                {
                    return NotFound();
                }

                // Invertir el valor del estado del producto
                producto.Estado = producto.Estado == 0 ? 1UL : 0UL;

                // Guardar los cambios en la base de datos
                await _context.SaveChangesAsync();

                // Devolver una respuesta exitosa
                return Ok();
            }
            catch (Exception ex)
            {
                // Si ocurre algún error, devolver un error 500 Internal Server Error
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al actualizar el estado del producto: " + ex.Message);
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
                        CantidadReservada = p.CantidadReservada,    
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

        [HttpGet("GetNombreProductoPorId/{id}")]
        public async Task<ActionResult<string>> GetNombreProductoPorId(int id)
        {
            try
            {
                // Buscar el producto por su ID
                var producto = await _context.Productos.FindAsync(id);

                // Verificar si el producto existe
                if (producto == null)
                {
                    // Devolver un error 404 Not Found si el producto no se encuentra
                    return NotFound("Producto no encontrado");
                }

                // Devolver el nombre del producto
                return Ok(producto.NombreProducto);
            }
            catch (Exception ex)
            {
                // Si ocurre algún error, devolver un error 500 Internal Server Error
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al obtener el nombre del producto: " + ex.Message);
            }
        }

    }
}
