using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Net.Http;
using VistaNewProject.Models;
using VistaNewProject.Services;

namespace VistaNewProject.Controllers
{
    [Route("CategoriasxTabla")]
    public class CategoriasxTablaController : Controller
    {
        private readonly IApiClient _client;

        public CategoriasxTablaController(IApiClient client)
        {
            _client = client;
        }

        [HttpPost("CrearCategoriaxUnidad")]
        public async Task<IActionResult> CrearCategoriaxUnidad([FromBody] CategoriaxUnidad categoriaxunidad)
        {
            if (categoriaxunidad == null || categoriaxunidad.CategoriaId <= 0 || categoriaxunidad.UnidadId <= 0)
            {
                return BadRequest(new { message = "Datos inválidos." });
            }

            var response = await _client.CreateCategoriaxUnidadAsync(categoriaxunidad);

            if (response.IsSuccessStatusCode)
            {
                return Ok(new { message = "Asociación creada correctamente." });
            }
            else
            {
                return StatusCode((int)response.StatusCode, new { message = await response.Content.ReadAsStringAsync() });
            }
        }
        [HttpPost("CrearUnidadxProducto")]
        public async Task<IActionResult> CrearUnidadxProducto([FromBody] UnidadxProductoAsosiacion unidadxProducto)
        {
            if (unidadxProducto == null || unidadxProducto.UnidadId <= 0 || unidadxProducto.ProductoId <= 0)
            {
                return BadRequest(new { message = "Datos inválidos." });
            }

            var response = await _client.CreateUnidadxProductoAsync(unidadxProducto);

            if (response.IsSuccessStatusCode)
            {
                return Ok(new { message = "Asociación creada correctamente." });
            }
            else
            {
                return StatusCode((int)response.StatusCode, new { message = await response.Content.ReadAsStringAsync() });
            }
        }

        [HttpPost("CrearCategoriaxPresentacion")]
        public async Task<IActionResult> CrearCategoriaxPresentacion([FromBody] CategoriaxPresentacionAsosiacion categoriaxunidad)
        {
            if (categoriaxunidad == null || categoriaxunidad.CategoriaId <= 0 || categoriaxunidad.PresentacionId <= 0)
            {
                return BadRequest(new { message = "Datos inválidos." });
            }

            var response = await _client.CreateCategoriaxPresentacionAsync(categoriaxunidad);

            if (response.IsSuccessStatusCode)
            {
                return Ok(new { message = "Asociación creada correctamente." });
            }
            else
            {
                return StatusCode((int)response.StatusCode, new { message = await response.Content.ReadAsStringAsync() });
            }
        }

        [HttpPost("CrearCategoriaxMarca")]
        public async Task<IActionResult> CrearCategoriaxMarca([FromBody] CategoriaxMarcaAsosiacion categoriaxmarca)
        {
            if (categoriaxmarca == null || categoriaxmarca.CategoriaId <= 0 || categoriaxmarca.MarcaId <= 0)
            {
                return BadRequest(new { message = "Datos inválidos." });
            }

            var response = await _client.CreateCategoriaxMarcaAsync(categoriaxmarca);

            if (response.IsSuccessStatusCode)
            {
                return Ok(new { message = "Asociación creada correctamente." });
            }
            else
            {
                return StatusCode((int)response.StatusCode, new { message = await response.Content.ReadAsStringAsync() });
            }
        }

        [HttpDelete("DeleteCategoriaxUnidad")]
        public async Task<IActionResult> DeleteCategoriaxUnidad([FromBody] CategoriaxUnidad categoriaxunidad)
        {
            if (categoriaxunidad == null || categoriaxunidad.CategoriaId <= 0 || categoriaxunidad.UnidadId <= 0)
            {
                return BadRequest(new { message = "Datos inválidos." });
            }

            var response = await _client.DeleteCategoriaxUnidadAsync(categoriaxunidad.CategoriaId, categoriaxunidad.UnidadId);

            if (response.IsSuccessStatusCode)
            {
                return Ok(new { message = "Asociación eliminada correctamente." });
            }
            else
            {
                return StatusCode((int)response.StatusCode, new { message = await response.Content.ReadAsStringAsync() });
            }
        }

        [HttpDelete("DeleteCategoriaxPresentacion")]
        public async Task<IActionResult> DeleteCategoriaxPresentacion([FromBody] CategoriaxPresentacion categoriaxpresentacion)
        {
            if (categoriaxpresentacion == null || categoriaxpresentacion.CategoriaId <= 0 || categoriaxpresentacion.PresentacionId <= 0)
            {
                return BadRequest(new { message = "Datos inválidos." });
            }

            var response = await _client.DeleteCategoriaxPresentacionAsync(categoriaxpresentacion.CategoriaId, categoriaxpresentacion.PresentacionId);

            if (response.IsSuccessStatusCode)
            {
                return Ok(new { message = "Asociación eliminada correctamente." });
            }
            else
            {
                return StatusCode((int)response.StatusCode, new { message = await response.Content.ReadAsStringAsync() });
            }
        }

        [HttpDelete("DeleteCategoriaxMarca")]
        public async Task<IActionResult> DeleteCategoriaxMarca([FromBody] CategoriaxMarca categoriaxmarca)
        {
            if (categoriaxmarca == null || categoriaxmarca.CategoriaId <= 0 || categoriaxmarca.MarcaId <= 0)
            {
                return BadRequest(new { message = "Datos inválidos." });
            }

            var response = await _client.DeleteCategoriaxMarcaAsync(categoriaxmarca.CategoriaId, categoriaxmarca.MarcaId);

            if (response.IsSuccessStatusCode)
            {
                return Ok(new { message = "Asociación eliminada correctamente." });
            }
            else
            {
                return StatusCode((int)response.StatusCode, new { message = await response.Content.ReadAsStringAsync() });
            }
        }
        [HttpDelete("DeleteUnidadxProducto")]
        public async Task<IActionResult> DeleteUnidadxProducto([FromBody] UnidadxProducto unidadxProducto)
        {
            if (unidadxProducto == null || unidadxProducto.ProductoId <= 0 || unidadxProducto.UnidadId <= 0)
            {
                return BadRequest(new { message = "Datos inválidos." });
            }

            var response = await _client.DeleteUnidadxProductoAsync(unidadxProducto.UnidadId, unidadxProducto.ProductoId);

            if (response.IsSuccessStatusCode)
            {
                return Ok(new { message = "Asociación eliminada correctamente." });
            }
            else
            {
                return StatusCode((int)response.StatusCode, new { message = await response.Content.ReadAsStringAsync() });
            }
        }

    }
}
