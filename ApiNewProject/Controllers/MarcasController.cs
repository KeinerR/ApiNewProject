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


        [HttpPut("UpdateMarcas")]
        public async Task<IActionResult> UpdateMarcas([FromBody] Marca marca)
        {
            // Verificar si la marca ya existe
            var existingMarca = await _context.Marcas.FirstOrDefaultAsync(m => m.MarcaId == marca.MarcaId);

            if (existingMarca == null)
            {
                return NotFound(); // Marca no encontrada
            }

            // Verificar si el nombre de la marca ya está en uso por otra marca
            var isNombreDuplicated = await _context.Marcas.AnyAsync(m => m.NombreMarca.ToLower() == marca.NombreMarca.ToLower() && m.MarcaId != marca.MarcaId);

            if (isNombreDuplicated)
            {
                return BadRequest(new { existe = true }); // Nombre de marca duplicado
            }

            // Actualizar los campos de la marca existente
            existingMarca.NombreMarca = marca.NombreMarca;
            existingMarca.EstadoMarca = marca.EstadoMarca;

            // Guardar los cambios en la base de datos
            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { existe = false }); // Actualización exitosa
            }
            catch (Exception ex)
            {
                // Manejar cualquier error que pueda ocurrir al guardar los cambios
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [HttpDelete("DeleteMarca/{Id}")]
        public async Task<HttpStatusCode> DeleteMarca(int Id)
        {
            var marca = new Marca()
            {
                MarcaId = Id
            };
            _context.Marcas.Attach(marca);
            _context.Marcas.Remove(marca);
            await _context.SaveChangesAsync();
            return HttpStatusCode.OK;
        }

    }
}
