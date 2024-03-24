using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using VistaNewProject.Models;

namespace VistaNewProject.Services
{
    public class ApiClient : IApiClient
    {
        private readonly HttpClient _httpClient;
        public ApiClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress = new Uri("https://localhost:7013/api/");
        }

        public async Task<IEnumerable<Cliente>> GetClientesAsync()
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<Cliente>>("Clientes/GetClientes");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró el cliente con el ID especificado.");
            }
            return response;
        }
        public async Task<HttpResponseMessage> CreateClienteAsync(Cliente cliente)
        {
            var response = await _httpClient.PostAsJsonAsync("Clientes/InsertarCliente", cliente);
            return response;
        }
        public async Task<Cliente> FindClienteAsync(int id)
        {
            var response = await _httpClient.GetFromJsonAsync<Cliente>($"Clientes/GetClienetById?={id}");

        

            return response;
        }

        public async Task<HttpResponseMessage> UpdateClienteAsync(Cliente cliente)
        {
            var response = await _httpClient.PutAsJsonAsync("Clientes/UpdateClientes", cliente);
            return response;
        }
        public async Task<HttpResponseMessage> DeleteClienteAsync(int  id)
        {
            var response = await _httpClient.DeleteAsync($"Clientes/DeleteUser/{id}");
            return response;
        }



    }
}
