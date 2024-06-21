using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using VistaNewProject.Models;
using System.Collections.Generic;

namespace VistaNewProject.Services
{
    public class AccesoController : Controller
    {
        private readonly IApiClient _client; // Asegúrate de que IApiClient está registrado en el contenedor de servicios

        public AccesoController(IApiClient client)
        {
            _client = client;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetAcceso(int usuarioId)
        {
            var datosDeAcceso = await _client.GetAccesoAsync(usuarioId);

            if (datosDeAcceso == null)
            {
                return NotFound("Datos de acceso no encontrados");
            }

            return Ok(datosDeAcceso); // Devuelve los datos de acceso como respuesta JSON
        }

    }
}
