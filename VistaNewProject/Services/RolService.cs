using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using VistaNewProject.Models;

public class RolService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public RolService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _httpClient.BaseAddress = new Uri(_configuration["AppSettings:ApiBaseUrl"]);
    }

    public async Task<List<Rol>> ObtenerRolesAsync()
    {
        try
        {
            var roles = await _httpClient.GetFromJsonAsync<IEnumerable<Rol>>("Roles/GetRoles");
            return roles?.ToList() ?? new List<Rol>();
        }
        catch (Exception ex)
        {
            // Manejar la excepción según sea necesario, por ejemplo, registrarla o lanzar una excepción personalizada
            throw new ApplicationException("Error al obtener los roles", ex);
        }
    }
}
    