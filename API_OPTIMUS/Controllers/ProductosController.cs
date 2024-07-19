using API_OPTIMUS.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MySqlX.XDevAPI;
using System.Net;
using ZstdSharp.Unsafe;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace API_OPTIMUS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductosController : ControllerBase
    {
        private readonly OptimusContext _context;
        
        public ProductosController(OptimusContext context)
        {
            _context = context;
        }

        [HttpGet("GetProductos")]
        public async Task<ActionResult<List<Producto>>> GetProductos(string? busqueda = "")
        {
            IQueryable<Producto> query = _context.Productos;

            if (!string.IsNullOrEmpty(busqueda))
            {
                query = query.Where(p =>
                    (p.NombreProducto != null && p.NombreProducto.Contains(busqueda)) ||
                    (p.Categoria != null && p.Categoria.NombreCategoria != null && p.Categoria.NombreCategoria.Contains(busqueda)) ||
                    (p.Marca != null && p.Marca.NombreMarca != null && p.Marca.NombreMarca.Contains(busqueda)));
            }

            // Fetch presentaciones data if needed, assuming it's a collection in the context
            var presentaciones = await _context.Presentaciones.ToListAsync();

            var productList = await query
                .Select(s => new Producto
                {
                    ProductoId = s.ProductoId,
                    PresentacionId = s.PresentacionId,
                    MarcaId = s.MarcaId,
                    CategoriaId = s.CategoriaId,
                    NombreProducto = s.NombreProducto,
                    NombreCompletoProducto = s.NombreCompletoProducto,
                    CantidadTotal = s.CantidadTotal,
                    CantidadTotalPorUnidad = s.CantidadTotalPorUnidad,
                    CantidadReservada = s.CantidadReservada,
                    CantidadPorUnidadReservada = s.CantidadPorUnidadReservada,
                    CantidadAplicarPorMayor = s.CantidadAplicarPorMayor,
                    DescuentoAplicarPorMayor = s.DescuentoAplicarPorMayor,
                    AplicarFechaDeVencimiento = s.AplicarFechaDeVencimiento,
                    Estado = s.Estado
                })
                .ToListAsync();

            return Ok(productList);
        }

        [HttpGet("GetProductoById")]
        public async Task<ActionResult<Producto>> GetProductoById(int Id)
        {
            Producto? producto = await _context.Productos
                .Select(s => new Producto
                {
                    ProductoId = s.ProductoId,
                    PresentacionId = s.PresentacionId, 
                    MarcaId = s.MarcaId, 
                    CategoriaId = s.CategoriaId, 
                    NombreProducto = s.NombreProducto, 
                    NombreCompletoProducto = s.NombreCompletoProducto,
                    CantidadTotal = s.CantidadTotal,
                    CantidadTotalPorUnidad = s.CantidadTotalPorUnidad,
                    CantidadReservada = s.CantidadReservada,
                    CantidadPorUnidadReservada = s.CantidadPorUnidadReservada,
                    CantidadAplicarPorMayor = s.CantidadAplicarPorMayor, 
                    DescuentoAplicarPorMayor = s.DescuentoAplicarPorMayor,
                    AplicarFechaDeVencimiento = s.AplicarFechaDeVencimiento,
                    Estado = s.Estado, 
                })
                .FirstOrDefaultAsync(s => s.ProductoId == Id);

            return producto != null ? Ok(producto) : NotFound();
        }

        [HttpGet("GetAllDatosProductos")]
        public async Task<ActionResult<List<DatosProducto>>> GetAllDatosProductos(string? busqueda = "")
        {
            IQueryable<Producto> query = _context.Productos; // Cambio a IQueryable<Producto>
            if (!string.IsNullOrEmpty(busqueda))
            {
                query = query.Where(p =>
                    (p.NombreProducto != null && p.NombreProducto.Contains(busqueda)) ||
                    (p.Categoria != null && p.Categoria.NombreCategoria != null && p.Categoria.NombreCategoria.Contains(busqueda)) ||
                    (p.Marca != null && p.Marca.NombreMarca != null && p.Marca.NombreMarca.Contains(busqueda)));
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
                NombreCompletoProducto = p.NombreCompletoProducto,
                CantidadTotal = p.CantidadTotal, 
                CantidadTotalPorUnidad = p.CantidadTotalPorUnidad,
                CantidadReservada = p.CantidadReservada,
                CantidadPorUnidadReservada = p.CantidadPorUnidadReservada,
                CantidadAplicarPorMayor = p.CantidadAplicarPorMayor ?? 0,
                DescuentoAplicarPorMayor = p.DescuentoAplicarPorMayor ?? 0,
                AplicarFechaDeVencimiento = p.AplicarFechaDeVencimiento,
                Estado = p.Estado,
                NombreCategoria = p.Categoria != null ? p.Categoria.NombreCategoria : null,
                NombreMarca = p.Marca != null ? p.Marca.NombreMarca : null,
                NombrePresentacion = p.Presentacion != null ? p.Presentacion.NombrePresentacion : null, 
                NombreCompletoPresentacion = p.Presentacion != null ? p.Presentacion.NombreCompletoPresentacion : null,
                CantidadPorPresentacion = p.Presentacion != null ? p.Presentacion.CantidadPorPresentacion : 0,
                Contenido = p.Presentacion != null ? p.Presentacion.Contenido : null
                // Asegúrate de agregar las propiedades adicionales que desees cargar
            }).ToList();
            if (datosProductosList == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(datosProductosList);
            }
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
                NombreCompletoProducto = producto.NombreCompletoProducto,
                CantidadTotal = producto.CantidadTotal, 
                CantidadTotalPorUnidad = producto.CantidadTotalPorUnidad,
                CantidadReservada = producto.CantidadReservada,
                CantidadPorUnidadReservada = producto.CantidadPorUnidadReservada,
                CantidadAplicarPorMayor = producto.CantidadAplicarPorMayor ?? 0,
                DescuentoAplicarPorMayor = producto.DescuentoAplicarPorMayor ?? 0,
                AplicarFechaDeVencimiento = producto.AplicarFechaDeVencimiento,
                Estado = producto.Estado,
                NombreCategoria = producto.Categoria != null ? producto.Categoria.NombreCategoria : null,
                NombreMarca = producto.Marca != null ? producto.Marca.NombreMarca : null,
                NombrePresentacion = producto.Presentacion != null ? producto.Presentacion.NombrePresentacion : null,
                NombreCompletoPresentacion = producto.Presentacion != null ? producto.Presentacion.NombreCompletoPresentacion : null,
                CantidadPorPresentacion = producto.Presentacion != null ? producto.Presentacion.CantidadPorPresentacion : 0,
                Contenido = producto.Presentacion != null ? producto.Presentacion.Contenido : null
                // Asegúrate de agregar las propiedades adicionales que desees cargar
            };
            if (datosProducto == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(datosProducto);
            }
        }

        [HttpPost("InsertarProducto")]
        public async Task<ActionResult<ProductoCrearYActualizar>> InsertarProducto(ProductoCrearYActualizar producto)
        {
            try
            {
                if (producto == null)
                {
                    return BadRequest("Los datos del producto no pueden ser nulos.");
                }

                // Verificar si el producto ya existe con AsNoTracking to avoid tracking issues
                var existingProduct = await _context.Productos
                                                     .AsNoTracking()
                                                     .FirstOrDefaultAsync(p => p.ProductoId == producto.ProductoId);
                if (existingProduct != null)
                {
                    return Conflict("El producto ya existe en la base de datos.");
                }

                // Crear una nueva instancia del producto
                var nuevoProducto = new Producto
                {
                    ProductoId = producto.ProductoId,
                    MarcaId = producto.MarcaId,
                    PresentacionId = producto.PresentacionId,
                    CategoriaId = producto.CategoriaId,
                    NombreCompletoProducto = producto.NombreCompletoProducto,
                    NombreProducto = producto.NombreProducto,
                    CantidadAplicarPorMayor = producto.CantidadAplicarPorMayor,
                    DescuentoAplicarPorMayor = producto.DescuentoAplicarPorMayor,
                    AplicarFechaDeVencimiento = producto.AplicarFechaDeVencimiento,
                    Estado = producto.Estado
                };

                // Añadir el nuevo producto a la base de datos
                _context.Productos.Add(nuevoProducto);
                await _context.SaveChangesAsync();

                // Return the created product details
                return CreatedAtAction(nameof(GetProductoById), new { id = producto.ProductoId }, producto);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al insertar el producto en la base de datos: " + ex.Message);
            }
        }

        [HttpPut("UpdateProductos")]
        public async Task<ActionResult> UpdateProductos(ProductoCrearYActualizar productoDto)
        {
            // Fetch the existing product without tracking it
            var productoExiste = await _context.Productos.AsNoTracking().FirstOrDefaultAsync(s => s.ProductoId == productoDto.ProductoId);

            if (productoExiste == null)
            {
                return NotFound("El producto no se encontró en la base de datos.");
            }

            // Attach the existing product to the context
            _context.Productos.Attach(productoExiste);

            // Update the existing product's properties
            productoExiste.MarcaId = productoDto.MarcaId;
            productoExiste.PresentacionId = productoDto.PresentacionId;
            productoExiste.CategoriaId = productoDto.CategoriaId;
            productoExiste.NombreCompletoProducto = productoDto.NombreCompletoProducto;
            productoExiste.NombreProducto = productoDto.NombreProducto;
            productoExiste.CantidadAplicarPorMayor = productoDto.CantidadAplicarPorMayor;
            productoExiste.DescuentoAplicarPorMayor = productoDto.DescuentoAplicarPorMayor;
            productoExiste.AplicarFechaDeVencimiento = productoDto.AplicarFechaDeVencimiento;
            productoExiste.Estado = productoDto.Estado;

            // Mark the product as modified
            _context.Entry(productoExiste).State = EntityState.Modified;

            // Save changes to the database
            await _context.SaveChangesAsync();

            return Ok("El producto se ha actualizado correctamente.");
        }

        [HttpPut("AddCantidadTotal/{id}")]
        public async Task<ActionResult> AddCantidadTotal(int id, int ? cantidad)
        {
            // Buscar el producto por su ID
            var producto = await _context.Productos.FirstOrDefaultAsync(p => p.ProductoId == id);

            if (producto == null)
            {
                return NotFound();
            }
            var presentacion = await _context.Presentaciones.FindAsync(producto.PresentacionId);
            int? agregarACantidadPorUnidad = 0;

            if (presentacion != null)
            {
                agregarACantidadPorUnidad = presentacion.CantidadPorPresentacion * cantidad;
            }

            producto.CantidadTotal += cantidad;
            producto.CantidadTotalPorUnidad += agregarACantidadPorUnidad;

            // Guardar los cambios en la base de datos
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("SustraerCantidadTotal/{id}")]
        public async Task<ActionResult> SustraerCantidadTotal(int id, int? cantidad)
        {
            // Buscar el producto por su ID
            var producto = await _context.Productos.FirstOrDefaultAsync(p => p.ProductoId == id);
            var presentacion = await _context.Presentaciones.FindAsync(producto?.PresentacionId);
            var cantidadValida = cantidad * presentacion?.CantidadPorPresentacion;

            if (producto == null)
            {
                return NotFound();
            }
            // Verificar si la cantidad a restar es válida
            if (cantidad == null || cantidad <= 0)
            {
                return BadRequest("Cantidad no válida.");
            }

            if (producto.CantidadTotal < cantidad)
            {
                return BadRequest("La cantidad a restar es mayor que la cantidad total actual.");
            }
            if (cantidadValida < (cantidad * presentacion.CantidadPorPresentacion))
            {
                return BadRequest("La cantidad total por unidad no es suficiente.");
            }
            int? agregarACantidadPorUnidad = 0;

            if (presentacion != null)
            {
                agregarACantidadPorUnidad = presentacion.CantidadPorPresentacion * cantidad;
            }

            producto.CantidadTotal -= cantidad;
            producto.CantidadTotalPorUnidad -= agregarACantidadPorUnidad;
            // Guardar los cambios en la base de datos
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("AddCantidadTotalPorUnidad/{id}")]
        public async Task<ActionResult> AddCantidadTotalPorUnidad(int id, int? cantidad)
        {
            try
            {
                // Validar la entrada
                if (cantidad == null || cantidad <= 0)
                {
                    return BadRequest("Cantidad no válida.");
                }

                // Obtener el producto y la presentación
                var producto = await _context.Productos
                    .Include(p => p.Presentacion)
                    .FirstOrDefaultAsync(p => p.ProductoId == id);

                if (producto == null)
                {
                    return NotFound();
                }

                var presentacion = producto.Presentacion;
                if (presentacion == null)
                {
                    return NotFound("Presentación no encontrada para el producto.");
                }

                // Calcular la cantidad por presentación y el resto
                var cantidadPorPresentacion = presentacion.CantidadPorPresentacion;
                var nuevaCantidadTotalPorUnidad = producto.CantidadTotalPorUnidad + cantidad;
                int? productoCantidadTotal = 0;
                var numeroPar = nuevaCantidadTotalPorUnidad % 2;
                var restar = nuevaCantidadTotalPorUnidad % cantidadPorPresentacion;
                if (numeroPar == 0)
                {
                    var cantidadLotes = nuevaCantidadTotalPorUnidad / cantidadPorPresentacion;
                    producto.CantidadTotal = cantidadLotes;
                }
                else {
                    productoCantidadTotal = (nuevaCantidadTotalPorUnidad - restar) / cantidadPorPresentacion;
                    producto.CantidadTotal = productoCantidadTotal;
                }

                producto.CantidadTotalPorUnidad = nuevaCantidadTotalPorUnidad;

                // Guardar los cambios en la base de datos
                await _context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                // Manejar errores inesperados
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [HttpPut("SustraerCantidadTotalPorUnidadUnicamente/{id}")]
        public async Task<ActionResult> SustraerCantidadTotalPorUnidadUnicamente(int id, int? cantidad)
        {
            try
            {
                // Validar la entrada
                if (cantidad == null || cantidad <= 0)
                {
                    return BadRequest("Cantidad no válida.");
                }

                // Obtener el producto y la presentación
                var producto = await _context.Productos
                    .Include(p => p.Presentacion)
                    .FirstOrDefaultAsync(p => p.ProductoId == id);

                if (producto == null)
                {
                    return NotFound();
                }

                
                producto.CantidadTotalPorUnidad += cantidad;


                // Guardar los cambios en la base de datos
                await _context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                // Manejar errores inesperados
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
       

        [HttpPut("AddCantidadReservada/{id}")]
        public async Task<ActionResult> AddCantidadReservada(int id, int? cantidad)
        {
            // Buscar el producto por su ID
            var producto = await _context.Productos.FirstOrDefaultAsync(p => p.ProductoId == id);

            var cantidadTotalEnInventario = producto?.CantidadTotal - producto?.CantidadReservada;
            if (producto == null)
            {
                return NotFound();
            }

            if (cantidad > producto.CantidadTotal)
            {
                return BadRequest("La cantidad a reservar no puede ser mayor que la cantidad total");
            }
            if (cantidad > cantidadTotalEnInventario)
            {
                return BadRequest("La cantidad a reservar no puede ser mayor que la cantidad cantidadTotalEnInventario (cantidadTotal - cantidadReservada)");
            }
            // Actualizar la cantidad reservada del producto
            producto.CantidadReservada += cantidad;
            // Guardar los cambios en la base de datos
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("SustraerCantidadReservada/{id}")]
        public async Task<ActionResult> SustraerCantidadReservada(int id, int? cantidad)
        {
            // Buscar el producto por su ID
            var producto = await _context.Productos.FirstOrDefaultAsync(p => p.ProductoId == id);
            if (producto == null)
            {
                return NotFound("El producto no fue encontrado.");
            }
            if (cantidad > producto.CantidadReservada)
            {
                return BadRequest("La cantidad a sascar de reserva no puede ser mayor que la cantidad enn reserva.");
            }
            var presentacion = await _context.Presentaciones.FindAsync(producto.PresentacionId);
            int? agregarACantidadPorUnidad = 0;

            if (presentacion != null)
            {
                agregarACantidadPorUnidad = presentacion.CantidadPorPresentacion * cantidad;
            }

            producto.CantidadTotal -= cantidad;
            producto.CantidadTotalPorUnidad -= agregarACantidadPorUnidad;
            producto.CantidadReservada -= cantidad;
            // Guardar los cambios en la base de datos
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("AddCantidadPorUnidadReservada/{id}")]
        public async Task<ActionResult> AddCantidadPorUnidadReservada(int id, int? cantidad)
        {
            // Buscar el producto por su ID
            var producto = await _context.Productos.FirstOrDefaultAsync(p => p.ProductoId == id);

            var cantidadTotalEnInventario = producto?.CantidadTotalPorUnidad - producto?.CantidadPorUnidadReservada;
            if (producto == null)
            {
                return NotFound();
            }

            if (cantidad > producto.CantidadTotalPorUnidad)
            {
                return BadRequest("La cantidad a reservar no puede ser mayor que la cantidad total por unidad");
            }
            if (cantidad > cantidadTotalEnInventario)
            {
                return BadRequest("La cantidad a reservar no puede ser mayor que la cantidad cantidadTotalEnInventario (cantidadTotal - cantidadReservada)");
            }
            // Actualizar la cantidad reservada del producto
            producto.CantidadPorUnidadReservada += cantidad;
            // Guardar los cambios en la base de datos
            await _context.SaveChangesAsync();

            return Ok();
        }
        [HttpPut("SustraerCantidadPorUnidadReservada/{id}")]
        public async Task<ActionResult> SustraerCantidadPorUnidadReservada(int id, int? cantidad)
        {
            // Buscar el producto por su ID
            var producto = await _context.Productos.FirstOrDefaultAsync(p => p.ProductoId == id);
            if (producto == null)
            {
                return NotFound("El producto no fue encontrado.");
            }
            if (cantidad > producto.CantidadPorUnidadReservada)
            {
                return BadRequest("La cantidad a sascar de reserva no puede ser mayor que la cantidad por unidad en reserva.");
            }
            var presentacion = await _context.Presentaciones.FindAsync(producto.PresentacionId);
            int? agregarACantidadPorUnidad = 0;

            if (presentacion != null)
            {
                agregarACantidadPorUnidad = presentacion.CantidadPorPresentacion * cantidad;
            }
            producto.CantidadPorUnidadReservada -= cantidad;
            var cantidadPorPresentacion = presentacion?.CantidadPorPresentacion;
            var nuevaCantidadTotalPorUnidad = producto.CantidadTotalPorUnidad - cantidad;
            int? productoCantidadTotal = 0;
            var numeroPar = nuevaCantidadTotalPorUnidad % 2;
            var restar = nuevaCantidadTotalPorUnidad % cantidadPorPresentacion;
            if (numeroPar == 0)
            {
                var cantidadLotes = nuevaCantidadTotalPorUnidad / cantidadPorPresentacion;
                producto.CantidadTotal = cantidadLotes;
            }
            else
            {
                productoCantidadTotal = (nuevaCantidadTotalPorUnidad - restar) / cantidadPorPresentacion;
                producto.CantidadTotal = productoCantidadTotal;
            }

            producto.CantidadTotalPorUnidad = nuevaCantidadTotalPorUnidad;
            // Guardar los cambios en la base de datos
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("SustraerCantidadTotalPorUnidad/{id}")]
        public async Task<ActionResult> SustraerCantidadTotalPorUnidad(int id, int? cantidad)
        {
            try
            {
                // Validar la entrada
                if (cantidad == null || cantidad <= 0)
                {
                    return BadRequest("Cantidad no válida.");
                }

                // Obtener el producto y la presentación
                var producto = await _context.Productos
                    .Include(p => p.Presentacion)
                    .FirstOrDefaultAsync(p => p.ProductoId == id);

                if (producto == null)
                {
                    return NotFound();
                }

                var presentacion = producto.Presentacion;
                if (presentacion == null)
                {
                    return NotFound("Presentación no encontrada para el producto.");
                }

                // Calcular la cantidad por presentación y el resto
                var cantidadPorPresentacion = presentacion.CantidadPorPresentacion;
                var nuevaCantidadTotalPorUnidad = producto.CantidadTotalPorUnidad - cantidad;
                int? productoCantidadTotal = 0;
                var numeroPar = nuevaCantidadTotalPorUnidad % 2;
                var restar = nuevaCantidadTotalPorUnidad % cantidadPorPresentacion;
                if (numeroPar == 0)
                {
                    var cantidadLotes = nuevaCantidadTotalPorUnidad / cantidadPorPresentacion;
                    producto.CantidadTotal = cantidadLotes;
                }
                else
                {
                    productoCantidadTotal = (nuevaCantidadTotalPorUnidad - restar) / cantidadPorPresentacion;
                    producto.CantidadTotal = productoCantidadTotal;
                }

                producto.CantidadTotalPorUnidad = nuevaCantidadTotalPorUnidad;

                // Guardar los cambios en la base de datos
                await _context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                // Manejar errores inesperados
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
        [HttpPut("AddCantidadTotalPorUnidadUnicamente/{id}")]
        public async Task<ActionResult> AddCantidadTotalPorUnidadUnicamente(int id, int? cantidad)
        {
            try
            {
                // Validar la entrada
                if (cantidad == null || cantidad <= 0)
                {
                    return BadRequest("Cantidad no válida.");
                }

                // Obtener el producto y la presentación
                var producto = await _context.Productos
                    .Include(p => p.Presentacion)
                    .FirstOrDefaultAsync(p => p.ProductoId == id);

                if (producto == null)
                {
                    return NotFound();
                }

                producto.CantidadTotalPorUnidad += cantidad;


                // Guardar los cambios en la base de datos
                await _context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                // Manejar errores inesperados
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
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
                        AplicarFechaDeVencimiento = p.AplicarFechaDeVencimiento,
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
        [HttpPut("QuitarCantidadReservada/{id}")]
        public async Task<ActionResult> QuitarCantidadReservada(int id, int? cantidad)
        {
            // Buscar el producto por su ID
            var producto = await _context.Productos.FirstOrDefaultAsync(p => p.ProductoId == id);

            if (producto == null)
            {
                return NotFound();
            }

            // Verificar si la cantidad a restar es válida


            producto.CantidadReservada -= cantidad; ;

            // Guardar los cambios en la base de datos
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("QuitarCantidadReservadaUnidad/{id}")]
        public async Task<ActionResult> QuitarCantidadReservadaUnidad(int id, int? cantidad)
        {
            // Buscar el producto por su ID
            var producto = await _context.Productos.FirstOrDefaultAsync(p => p.ProductoId == id);

            if (producto == null)
            {
                return NotFound();
            }

            // Verificar si la cantidad a restar es válida


            producto.CantidadPorUnidadReservada -= cantidad; ;

            // Guardar los cambios en la base de datos
            await _context.SaveChangesAsync();

            return Ok();
        }


    }
}
