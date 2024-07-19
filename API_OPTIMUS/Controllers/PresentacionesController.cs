using API_OPTIMUS.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using ZstdSharp.Unsafe;

namespace API_OPTIMUS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PresentacionesController : ControllerBase
    {
        private readonly OptimusContext _context;

        public PresentacionesController(OptimusContext context)
        {
            _context = context;
        }


        [HttpGet("GetPresentaciones")]
        public async Task<ActionResult<List<Presentacion>>> GetPresentacion()
        {
            var List = await _context.Presentaciones.Select(
                s => new Presentacion
                {
                    PresentacionId = s.PresentacionId,
                    NombrePresentacion = s.NombrePresentacion,
                    NombreCompletoPresentacion = s.NombreCompletoPresentacion,
                    Contenido = s.Contenido,
                    CantidadPorPresentacion = s.CantidadPorPresentacion,
                    DescripcionPresentacion = s.DescripcionPresentacion,
                    EstadoPresentacion = s.EstadoPresentacion
                }
            ).ToListAsync();



            return List;

        }

        [HttpGet("GetPresentacionById")]
        public async Task<ActionResult<Presentacion>> GetPresentacionById(int id)
        {
            var presentacion = await _context.Presentaciones.FirstOrDefaultAsync(c => c.PresentacionId == id);

            if (presentacion == null)
            {
                return NotFound(); // 404 Not Found si no se encuentra la presentación
            }
            else
            {
                return Ok(presentacion); // 200 OK con la presentación si se encuentra
            }
        }

        [HttpPost("InsertarPresentacion")]
        public async Task<ActionResult<Presentacion>> InsertarPresentacion(Presentacion presentacion)
        {
            try
            {
                if (presentacion == null)
                {
                    return BadRequest("Los datos de la presentacion no pueden ser nulos.");
                }

                _context.Presentaciones.Add(presentacion);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetPresentacionById), new { id = presentacion.PresentacionId }, presentacion);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al insertar la presentacion en la base de datos: " + ex.Message);
            }
        }

        [HttpPut("UpdatePresentaciones")]
        public async Task<ActionResult> UpdatePresentaciones(Presentacion presentacion)
        {
            var presentaciones = await _context.Presentaciones.FirstOrDefaultAsync(s => s.PresentacionId == presentacion.PresentacionId);

            if (presentaciones == null)
            {
                return NotFound();
            }
            presentaciones.PresentacionId = presentacion.PresentacionId;
            presentaciones.NombrePresentacion = presentacion.NombrePresentacion;
            presentaciones.NombreCompletoPresentacion = presentacion.NombreCompletoPresentacion;
            presentaciones.DescripcionPresentacion = presentacion.DescripcionPresentacion;
            presentaciones.CantidadPorPresentacion = presentacion.CantidadPorPresentacion;
            presentaciones.Contenido = presentacion.Contenido; 
            presentaciones.EstadoPresentacion = presentacion.EstadoPresentacion;

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("DeletePresentacion/{Id}")]
        public async Task<HttpStatusCode> DeletePresentacion(int Id)
        {
            var presentacion = new Presentacion()
            {
                PresentacionId = Id
            };
            _context.Presentaciones.Attach(presentacion);
            _context.Presentaciones.Remove(presentacion);
            await _context.SaveChangesAsync();
            return HttpStatusCode.OK;
        }

        [HttpPatch("UpdateEstadoPresentacion/{id}")]
        public async Task<IActionResult> UpdateEstadoPresentacion(int id)
        {
            try
            {
                // Buscar el categoria por su ID
                var categoria = await _context.Presentaciones.FindAsync(id);

                // Si no se encuentra el categoria, devolver un error 404 Not Found
                if (categoria == null)
                {
                    return NotFound();
                }

                categoria.EstadoPresentacion = categoria.EstadoPresentacion == 0 ? 1UL : 0UL;

                // Guardar los cambios en la base de datos
                await _context.SaveChangesAsync();

                // Devolver una respuesta exitosa
                return Ok();
            }
            catch (Exception ex)
            {
                // Si ocurre algún error, devolver un error 500 Internal Server Error
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al actualizar el estado del categoria: " + ex.Message);
            }
        }
    }
}

