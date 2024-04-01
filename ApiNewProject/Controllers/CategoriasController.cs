using ApiNewProject.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace ApiNewProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriasController : ControllerBase
    {
        private readonly NewOptimusContext _context;

        public CategoriasController(NewOptimusContext context)
        {
            _context = context;
        }


        [HttpGet("GetCategorias")]
        public async Task<ActionResult<List<Categoria>>> GetCategoria()
        {
            var List = await _context.Categoria.Select(
                s => new Categoria
                {
                    CategoriaId = s.CategoriaId,
                    NombreCategoria = s.NombreCategoria,
                }
            ).ToListAsync();



            return List;

        }

        [HttpGet("GetCategoriaById")]
        public async Task<ActionResult<Categoria>> GetCategoriaById(int Id)
        {

            Categoria categoria = await _context.Categoria.Select(
                    s => new Categoria
                    {
                        CategoriaId = s.CategoriaId,
                        NombreCategoria = s.NombreCategoria,
                    })
                .FirstOrDefaultAsync(s => s.CategoriaId == Id);

            if (categoria == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(categoria);
            }
        }


        [HttpPost("InsertarCategoria")]
        public async Task<ActionResult<Categoria>> InsertarCategoria(Categoria categoria)
        {
            try
            {
                if (categoria == null)
                {
                    return BadRequest("Los datos de la categoria no pueden ser nulos.");
                }

                _context.Categoria.Add(categoria);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetCategoriaById), new { id = categoria.CategoriaId }, categoria);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al insertar la categoria en la base de datos: " + ex.Message);
            }
        }


        [HttpPut("UpdateCategorias")]
        public async Task<ActionResult> UpdateCategorias(Categoria categoria)
        {
            var categorias = await _context.Categoria.FirstOrDefaultAsync(s => s.CategoriaId == categoria.CategoriaId);

            if (categoria == null)
            {
                return NotFound();
            }
            categorias.CategoriaId = categoria.CategoriaId;
            categorias.NombreCategoria = categoria.NombreCategoria;
  
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("DeleteCategoria/{Id}")]
        public async Task<HttpStatusCode> DeleteCategoria(int Id)
        {
            var categoria = new Categoria()
            {
                CategoriaId = Id
            };
            _context.Categoria.Attach(categoria);
            _context.Categoria.Remove(categoria);
            await _context.SaveChangesAsync();
            return HttpStatusCode.OK;
        }

    }
}
