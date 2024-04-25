using ApiNewProject.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace ApiNewProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MarcasController : ControllerBase
    {
        private readonly NewOptimusContext _context;

        public MarcasController(NewOptimusContext context)
        {
            _context = context;
        }


        [HttpGet("GetMarcas")]
        public async Task<ActionResult<List<Marca>>> GetMarca()
        {
            var List = await _context.Marcas.Select(
                s => new Marca
                {
                    MarcaId = s.MarcaId,
                    NombreMarca = s.NombreMarca,
                    EstadoMarca = s.EstadoMarca
                }
            ).ToListAsync();



            return List;

        }

        [HttpGet("GetMarcaById")]
        public async Task<ActionResult<Marca>> GetMarcaById(int Id)
        {

            Marca marca = await _context.Marcas.Select(
                    s => new Marca
                    {
                        MarcaId = s.MarcaId,
                        NombreMarca = s.NombreMarca,
                        EstadoMarca = s.EstadoMarca
                    })
                .FirstOrDefaultAsync(s => s.MarcaId == Id);

            if (marca == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(marca);
            }
        }

        [HttpGet("GetNombreMarcaById")]
        public async Task<ActionResult<Marca>> GetNombreMarcaById(string nombreMarca)
        {

            Marca marca = await _context.Marcas.Select(
                    s => new Marca
                    {
                        MarcaId = s.MarcaId,
                        NombreMarca = s.NombreMarca,
                        EstadoMarca = s.EstadoMarca
                    })
                .FirstOrDefaultAsync(s => s.NombreMarca == nombreMarca );

            if (marca == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(marca);
            }
        }

        [HttpPost("InsertarMarca")]
        public async Task<ActionResult<Marca>> InsertarMarca(Marca marca)
        {
            try
            {
                if (marca == null)
                {
                    return BadRequest("Los datos de la marca no pueden ser nulos.");
                }

                _context.Marcas.Add(marca);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetMarcaById), new { id = marca.MarcaId }, marca);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al insertar la marca en la base de datos: " + ex.Message);
            }
        }


        [HttpPut("UpdateMarca")]
        public async Task<IActionResult> UpdateMarca([FromBody] Marca marca)
        {
            try
            {
                // Verificar si la marca ya existe
                var existingMarca = await _context.Marcas.FirstOrDefaultAsync(m => m.MarcaId == marca.MarcaId);

                if (existingMarca == null)
                {
                    return NotFound(new { message = "Marca no encontrada" });
                }

                // Verificar si el nombre de la marca ya está en uso por otra marca
                var isNombreDuplicated = await _context.Marcas.AnyAsync(m => m.NombreMarca.ToLower() == marca.NombreMarca.ToLower() && m.MarcaId != marca.MarcaId);

                if (isNombreDuplicated)
                {
                    return BadRequest(new { message = "Nombre de marca duplicado" });
                }

                // Actualizar los campos de la marca existente
                existingMarca.NombreMarca = marca.NombreMarca;
                existingMarca.EstadoMarca = marca.EstadoMarca;

                // Guardar los cambios en la base de datos
                await _context.SaveChangesAsync();

                return Ok(new { message = "Actualización exitosa", marcaId = existingMarca.MarcaId });
            }
            catch (Exception ex)
            {
                // Manejar cualquier error que pueda ocurrir al guardar los cambios
                return StatusCode(500, new { message = $"Error interno del servidor: {ex.Message}" });
            }
        }


        [HttpDelete("DeleteMarca/{Id}")]
        public async Task<IActionResult> DeleteMarca(int Id)
        {
            var marca = await _context.Marcas.FindAsync(Id);
            if (marca == null)
            {
                return NotFound(); // La marca no fue encontrada, puedes devolver un código de estado 404
            }

            // Verificar si la marca está asociada a algún producto
            bool marcaAsociadaAProducto = await _context.Productos.AnyAsync(p => p.MarcaId == Id);
            if (marcaAsociadaAProducto)
            {
                return BadRequest("No se puede eliminar la marca porque está asociada a un producto.");
            }

            _context.Marcas.Remove(marca);
            await _context.SaveChangesAsync();
            return Ok(); // Opcionalmente, puedes devolver un código de estado 200 OK
        }


        [HttpPatch("UpdateEstadoMarca/{id}")]
        public async Task<IActionResult> UpdateEstadoMarca(int id, [FromBody] Marca EstadoMarca)
        {
            try
            {
                var marca = await _context.Marcas.FindAsync(id);

                             if (marca == null)
                {
                    return NotFound();
                }

                // Actualizar el estado del cliente con el nuevo valor
                marca.EstadoMarca = EstadoMarca.EstadoMarca;

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

     
    }
}
