using ApiNewProject.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace ApiNewProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LotesController : ControllerBase
    {
        private readonly NewOptimusContext _context;

        public LotesController(NewOptimusContext context)
        {
            _context = context;
        }


        [HttpGet("GetLotes")]
        public async Task<ActionResult<List<Lote>>> GetLote()
        {
            var Lotes = await _context.Lotes.ToListAsync();
            return Lotes;

        }

        [HttpGet("GetLoteById")]
        public async Task<ActionResult<Lote>> GetLoteById(int Id)
        {
            var lote = await _context.Lotes.FindAsync(Id);

            if (lote == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(lote);
            }
        }

        [HttpGet("GetLotesByProductId")]
        public async Task<ActionResult<IEnumerable<Lote>>> GetLotesByProductId(int productId)
        {
            var lotes = await _context.Lotes
                .Where(l => l.ProductoId == productId).ToListAsync();

            if (lotes == null || !lotes.Any())
            {
                return Ok(new List<Lote>()); // Devolver objeto vacío si no se encuentran lotes
            }

            return Ok(lotes);
        }


        [HttpPost("InsertarLote")]
        public async Task<ActionResult<Lote>> InsertarLote(Lote lote)
        {
            try
            {
                if (lote == null)
                {
                    return BadRequest("Los datos del lote no pueden ser nulos.");
                }

                _context.Lotes.Add(lote);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetLoteById), new { id = lote.LoteId }, lote);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al insertar el lote en la base de datos: " + ex.Message);
            }
        }
        [HttpPut("UpdateLotes")]
        public async Task<ActionResult> UpdateLotes(Lote lote)
        {
            var loteExistente = await _context.Lotes.FirstOrDefaultAsync(s => s.LoteId == lote.LoteId);

            if (loteExistente == null)
            {
                return NotFound();
            }

            // Actualizar los campos del lote existente con los valores del lote recibido
            loteExistente.DetalleCompraId = lote.DetalleCompraId;
            loteExistente.ProductoId = lote.ProductoId;
            loteExistente.NumeroLote = lote.NumeroLote;
            loteExistente.PrecioCompra = lote.PrecioCompra;
            loteExistente.PrecioPorUnidadProducto = lote.PrecioPorUnidadProducto;
            loteExistente.PrecioPorPresentacion = lote.PrecioPorPresentacion;
            loteExistente.FechaVencimiento = lote.FechaVencimiento;
            loteExistente.Cantidad = lote.Cantidad;
            loteExistente.EstadoLote = lote.EstadoLote;

            // Guardar los cambios en la base de datos
            await _context.SaveChangesAsync();

            return Ok();
        }
        [HttpPut("UpdatePrecioLotes")]
        public async Task<ActionResult> UpdatePreciosLotes(int productoId, decimal precioPorUnidadProducto, decimal precioPorPresentacion)
        {
            // Buscar todos los lotes activos asociados al productoId
            var lotes = await _context.Lotes.Where(l => l.ProductoId == productoId && l.EstadoLote == 1).ToListAsync();

            if (lotes == null || !lotes.Any())
            {
                return NotFound($"No se encontraron lotes activos para el producto con ID {productoId}");
            }

            // Actualizar los precios en todos los lotes encontrados
            foreach (var lote in lotes)
            {
                lote.PrecioPorUnidadProducto = precioPorUnidadProducto;
                lote.PrecioPorPresentacion = precioPorPresentacion;
            }

            // Guardar los cambios en la base de datos
            await _context.SaveChangesAsync();

            return Ok($"Se actualizaron los precios en {lotes.Count} lotes asociados al producto con ID {productoId}");
        }

        [HttpPut("UpdatePrecioLote")]
        public async Task<ActionResult> UpdatePrecioLote(int loteId, string numeroLote, decimal precioPorUnidadProducto, decimal precioPorPresentacion)
        {
            // Buscar el lote con el ID proporcionado
            var loteExistente = await _context.Lotes.FirstOrDefaultAsync(s => s.LoteId == loteId && s.NumeroLote == numeroLote);

            if (loteExistente == null)
            {
                return NotFound($"No se encontró un lote con ID {loteId}");
            }

            // Actualizar los precios del lote
            loteExistente.PrecioPorUnidadProducto = precioPorUnidadProducto;
            loteExistente.PrecioPorPresentacion = precioPorPresentacion;

            // Guardar los cambios en la base de datos
            await _context.SaveChangesAsync();

            return Ok($"Se actualizó el precio del lote con ID {loteId}");
        }
        [HttpPut("AddCantidadALote/{id}")]
        public async Task<ActionResult> AddCantidadALote(int id, int? cantidad)
        {
            // Buscar el producto por su ID
            var lote = await _context.Lotes.FirstOrDefaultAsync(p => p.LoteId == id);

            if (lote == null)
            {
                return NotFound();
            }
            if (cantidad > lote.CantidadCompra)
            {
                return Conflict("La a agregar al lote no puede ser mayor a la cantidad cuando se compro el lote.");
            }
            var producto = await _context.Productos.FindAsync(lote.ProductoId);
            if (producto == null)
            {
                return NotFound();
            }
            var presentacion = await _context.Presentaciones.FindAsync(producto.ProductoId);
            int? agregarACantidadPorUnidad = 0;

            if (presentacion != null)
            {
                agregarACantidadPorUnidad = presentacion.CantidadPorPresentacion * cantidad;
            }

            lote.Cantidad += cantidad;
            lote.CantidadPorUnidad += agregarACantidadPorUnidad;
            if (lote.Cantidad > lote.CantidadCompra) {
                return Conflict("La suma de la cantidad agregada y la cantidad en lote no puede ser mayor a la cantidad cuando se compro el lote.");
            }

            // Guardar los cambios en la base de datos
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("SustraerCantidadALote/{id}")]
        public async Task<ActionResult> SustraerCantidadALote(int id, int? cantidad)
        {
            // Buscar el producto por su ID
            var lote = await _context.Lotes.FirstOrDefaultAsync(p => p.LoteId == id);

            if (lote == null)
            {
                return NotFound();
            }
            var producto = await _context.Productos.FirstOrDefaultAsync(p => p.ProductoId == lote.ProductoId);
            var presentacion = await _context.Presentaciones.FindAsync(producto?.PresentacionId);
            var cantidadValida = cantidad * presentacion?.CantidadPorPresentacion;

            if (producto == null || presentacion == null)
            {
                return NotFound();
            }
            
            // Verificar si la cantidad a restar es válida
            if (cantidad == null || cantidad <= 0)
            {
                return BadRequest("Cantidad no válida.");
            }

            if (lote.Cantidad < cantidad)
            {
                return BadRequest("La cantidad a restar es mayor que la cantidad total actual en lote.");
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

            lote.Cantidad -= cantidad;
            lote.CantidadPorUnidad -= agregarACantidadPorUnidad;
            // Guardar los cambios en la base de datos
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("AddCantidadPorUnidadALote/{id}")]
        public async Task<ActionResult> AddCantidadPorUnidadLote(int id, int? cantidad)
        {
            try
            {
                var lote = await _context.Lotes.FirstOrDefaultAsync(p => p.LoteId == id);
                if (lote == null)
                {
                    return NotFound();
                }
                // Validar la entrada
                if (cantidad == null || cantidad <= 0)
                {
                    return BadRequest("Cantidad no válida.");
                }

                // Obtener el producto y la presentación
                var producto = await _context.Productos
                    .Include(p => p.Presentacion)
                    .FirstOrDefaultAsync(p => p.ProductoId == lote.ProductoId);

                if (producto == null || producto.Presentacion == null)
                {
                    return NotFound();
                }
                // Calcular la cantidad por presentación y el resto
                var cantidadPorPresentacion = producto.Presentacion.CantidadPorPresentacion;
                var nuevaCantidadTotalPorUnidad = lote.CantidadPorUnidad + cantidad;
                int? loteCantidadTotal = 0;
                var numeroPar = nuevaCantidadTotalPorUnidad % 2;
                var restar = nuevaCantidadTotalPorUnidad % cantidadPorPresentacion;
                var presentacion = producto.Presentacion;
                if (nuevaCantidadTotalPorUnidad > lote.CantidadPorUnidadCompra) {
                    return Conflict("La cantidad a retornar a lote no puede ser mayor que la cantidad total por unidad que se compro al momento de generar el lote.");
                }
                if (presentacion == null)
                {
                    return NotFound("Presentación no encontrada para el producto.");
                }
               
                if (numeroPar == 0)
                {
                    var cantidadLotes = nuevaCantidadTotalPorUnidad / cantidadPorPresentacion;
                    lote.Cantidad = cantidadLotes;
                }
                else
                {
                    loteCantidadTotal = (nuevaCantidadTotalPorUnidad - restar) / cantidadPorPresentacion;
                    lote.Cantidad = loteCantidadTotal;
                }

                lote.CantidadPorUnidad= nuevaCantidadTotalPorUnidad;
                if (lote.CantidadPorUnidad > lote.CantidadPorUnidadCompra) {
                    return Conflict("La cantidad a retornar mas la cantidad en lote por uniadad no puede ser mayor que la cantidad total por unidad al momento de generar el lote.");

                }
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

        [HttpPut("SustraerCantidadPorUnidadALote/{id}")]
        public async Task<ActionResult> SustraerCantidadPorUnidadALote(int id, int? cantidad)
        {
            try
            {
                var lote = await _context.Lotes.FirstOrDefaultAsync(p => p.LoteId == id);
                if (lote == null)
                {
                    return NotFound();
                }
                // Validar la entrada
                if (cantidad == null || cantidad <= 0)
                {
                    return BadRequest("Cantidad no válida.");
                }
                if (cantidad > lote.CantidadPorUnidad)
                {
                    return BadRequest("La cantidad a restar es mayor que la cantidad por unidad disponible en el  lote.");
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
                var nuevaCantidadTotalPorUnidad = lote.CantidadPorUnidad - cantidad;
                int? loteCantidadTotal = 0;
                var numeroPar = nuevaCantidadTotalPorUnidad % 2;
                var restar = nuevaCantidadTotalPorUnidad % cantidadPorPresentacion;
                if (numeroPar == 0)
                {
                    var cantidadLotes = nuevaCantidadTotalPorUnidad / cantidadPorPresentacion;
                    lote.Cantidad = cantidadLotes;
                }
                else
                {
                    loteCantidadTotal = (nuevaCantidadTotalPorUnidad - restar) / cantidadPorPresentacion;
                    lote.Cantidad = loteCantidadTotal;
                }

                lote.CantidadPorUnidad = nuevaCantidadTotalPorUnidad;

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

        [HttpDelete("DeleteLote/{Id}")]
        public async Task<HttpStatusCode> DeleteLote(int Id)
        {
            var lote = new Lote()
            {
                LoteId = Id
            };
            _context.Lotes.Attach(lote);
            _context.Lotes.Remove(lote);
            await _context.SaveChangesAsync();
            return HttpStatusCode.OK;
        }
        [HttpPatch("UpdateEstadoLote/{id}")]
        public async Task<IActionResult> UpdateEstadoLote(int id)
        {
            try
            {
                // Buscar el lote por su ID
                var lote = await _context.Lotes.FindAsync(id);

                // Si no se encuentra el lote, devolver un error 404 Not Found
                if (lote == null)
                {
                    return NotFound();
                }

                lote.EstadoLote = lote.EstadoLote == 0 ? 1UL : 0UL;

                // Guardar los cambios en la base de datos
                await _context.SaveChangesAsync();

                // Devolver una respuesta exitosa
                return Ok();
            }
            catch (Exception ex)
            {
                // Si ocurre algún error, devolver un error 500 Internal Server Error
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al actualizar el estado del lote: " + ex.Message);
            }
        }

    }
}
