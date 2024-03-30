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


        [HttpPost("InsertarMarca")]
        public async Task<ActionResult<Marca>> InsertarMarca(Marca marca)
        {
            try
            {
                if (marca == null)
                {
                    return BadRequest("Los datos de la categoria no pueden ser nulos.");
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
        public async Task<ActionResult> UpdateMarcas(Marca marca)
        {
            var marcas = await _context.Marcas.FirstOrDefaultAsync(s => s.MarcaId == marca.MarcaId);

            if (marca == null)
            {
                return NotFound();
            }
            marcas.MarcaId = marcas.MarcaId;
            marcas.NombreMarca = marcas.NombreMarca;

            await _context.SaveChangesAsync();
            return Ok();
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
