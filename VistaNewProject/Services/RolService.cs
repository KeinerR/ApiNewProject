using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using VistaNewProject.Models;
using System.Text.Json;


public class RolService
{
    private readonly HttpClient _httpClient;

    public RolService(HttpClient httpClient)
    {
        _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
    }

    public async Task<List<RolList>> ObtenerRolesAsync()
    {
        try
        {
            var response = await _httpClient.GetAsync("https://localhost:7013/api/Roles/GetRoles");

            var responseContent = await response.Content.ReadAsStringAsync();
            var roles = JsonSerializer.Deserialize<IEnumerable<Rol>>(responseContent, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
            // Verificar si la respuesta es null o vacía
            if (roles != null && roles.Any())
            {
                var rolesList = roles.Select(r => new RolList
                {
                    NombreRol = r.NombreRol ?? "", // Asigna cadena vacía si NombreRol es null
                    RolId = r.RolId.ToString() ?? "" // Asigna cadena vacía si RolId es null
                }).ToList();
                return rolesList;
            }
            else
            {
                // Puedes manejar el caso en que no hay roles disponibles, por ejemplo, registrando un mensaje de advertencia
                Console.WriteLine("No se encontraron roles disponibles.");
                return new List<RolList>();
            }
        }
        catch (Exception ex)
        {
            // Manejar la excepción según sea necesario, por ejemplo, registrarla o lanzar una excepción personalizada
            throw new ApplicationException("Error al obtener los roles", ex);
        }
    }

    public class RolList
    {
        public string NombreRol { get; set; } = "";
        public string RolId { get; set; } = "";
    }
}
