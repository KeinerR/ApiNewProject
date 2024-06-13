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
            var List = await _context.Categorias.Select(
                s => new Categoria
                {
                    CategoriaId = s.CategoriaId,
                    NombreCategoria = s.NombreCategoria,
                    EstadoCategoria = s.EstadoCategoria
                }
            ).ToListAsync();



            return List;

        }

        [HttpGet("GetCategoriaById")]
        public async Task<ActionResult<Categoria>> GetCategoriaById(int Id)
        {

            Categoria? categoria = await _context.Categorias.Select(
                    s => new Categoria
                    {
                        CategoriaId = s.CategoriaId,
                        NombreCategoria = s.NombreCategoria,
                        EstadoCategoria = s.EstadoCategoria
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

                _context.Categorias.Add(categoria);
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
            if (categoria == null)
            {
                return NotFound();
            }

            var categorias = await _context.Categorias.FirstOrDefaultAsync(s => s.CategoriaId == categoria.CategoriaId);

            if (categorias == null)
            {
                return NotFound();
            }

            categorias.CategoriaId = categoria.CategoriaId;
            categorias.NombreCategoria = categoria.NombreCategoria;
            categorias.EstadoCategoria = categoria.EstadoCategoria;

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
            _context.Categorias.Attach(categoria);
            _context.Categorias.Remove(categoria);
            await _context.SaveChangesAsync();
            return HttpStatusCode.OK;
        }

        [HttpPatch("UpdateEstadoCategoria/{id}")]
        public async Task<IActionResult> UpdateEstadoCategoria(int id)
        {
            try
            {
                // Buscar el categoria por su ID
                var categoria = await _context.Categorias.FindAsync(id);

                // Si no se encuentra el categoria, devolver un error 404 Not Found
                if (categoria == null)
                {
                    return NotFound();
                }

                categoria.EstadoCategoria = categoria.EstadoCategoria == 0 ? 1UL : 0UL;

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

        [HttpGet("GetNombreCategoriaById")]
        public async Task<ActionResult<Categoria>> GetNombreCategoriaById(string nombreCategoria)
        {
            Categoria? categoria = await _context.Categorias.Select(
                    s => new Categoria
                    {
                        CategoriaId = s.CategoriaId,
                        NombreCategoria = s.NombreCategoria,
                        EstadoCategoria = s.EstadoCategoria
                    })
                .FirstOrDefaultAsync(s => s.NombreCategoria == nombreCategoria);

            if (categoria == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(categoria);
            }
        }

    }




}

