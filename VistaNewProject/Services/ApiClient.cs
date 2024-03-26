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

        /// COMPRAS
        /// 
        public async Task<IEnumerable<Compra>> GetCompraAsync()
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<Compra>>("");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró la compra con el ID especificado.");
            }
            return response;
        }
        public async Task<HttpResponseMessage> CreateCompraAsync(Compra compra)
        {
            var response = await _httpClient.PostAsJsonAsync("", compra);
            return response;
        }
        public async Task<Compra> FindCompraAsync(int id)
        {
            var response = await _httpClient.GetFromJsonAsync<Compra>($"?={id}");



            return response;
        }

        public async Task<HttpResponseMessage> UpdateCompraAsync(Compra compra)
        {
            var response = await _httpClient.PutAsJsonAsync("", compra);
            return response;
        }
        public async Task<HttpResponseMessage> DeleteCompraAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($"/{id}");
            return response;
        }

        /// MARCAS
        /// 
        public async Task<IEnumerable<Marca>> GetMarcaAsync()
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<Marca>>("");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró la marca con el ID especificado.");
            }
            return response;
        }
        public async Task<HttpResponseMessage> CreateMarcaAsync(Marca marca)
        {
            var response = await _httpClient.PostAsJsonAsync("", marca);
            return response;
        }
        public async Task<Marca> FindMarcaAsync(int id)
        {
            var response = await _httpClient.GetFromJsonAsync<Marca>($"?={id}");



            return response;
        }

        public async Task<HttpResponseMessage> UpdateMarcaAsync(Marca marca)
        {
            var response = await _httpClient.PutAsJsonAsync("", marca);
            return response;
        }
        public async Task<HttpResponseMessage> DeleteMarcaAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($"/{id}");
            return response;
        }

        /// CATEGORIA
        /// 
        public async Task<IEnumerable<Categoria>> GetCategoriaAsync()
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<Categoria>>("");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró la categoria con el ID especificado.");
            }
            return response;
        }
        public async Task<HttpResponseMessage> CreateCategoriaAsync(Categoria categoria)
        {
            var response = await _httpClient.PostAsJsonAsync("", categoria);
            return response;
        }
        public async Task<Categoria> FindCategoriaAsync(int id)
        {
            var response = await _httpClient.GetFromJsonAsync<Categoria>($"?={id}");



            return response;
        }

        public async Task<HttpResponseMessage> UpdateCategoriaAsync(Categoria categoria)
        {
            var response = await _httpClient.PutAsJsonAsync("", categoria);
            return response;
        }
        public async Task<HttpResponseMessage> DeleteCategoriaAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($"/{id}");
            return response;
        }

        /// UNIDAD
        /// 
        public async Task<IEnumerable<Unidad>> GetUnidadAsync()
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<Unidad>>("");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró la unidad con el ID especificado.");
            }
            return response;
        }
        public async Task<HttpResponseMessage> CreateUnidadAsync(Unidad unidad)
        {
            var response = await _httpClient.PostAsJsonAsync("", unidad);
            return response;
        }
        public async Task<Unidad> FindUnidadAsync(int id)
        {
            var response = await _httpClient.GetFromJsonAsync<Unidad>($"?={id}");



            return response;
        }

        public async Task<HttpResponseMessage> UpdateUnidadAsync(Unidad unidad)
        {
            var response = await _httpClient.PutAsJsonAsync("", unidad);
            return response;
        }
        public async Task<HttpResponseMessage> DeleteUnidadAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($"/{id}");
            return response;
        }

        /// PRESENTACION
        /// 
        public async Task<IEnumerable<Presentacion>> GetPresentacionAsync()
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<Presentacion>>("");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró la presentacion con el ID especificado.");
            }
            return response;
        }
        public async Task<HttpResponseMessage> CreatePresentacionAsync(Presentacion presentacion)
        {
            var response = await _httpClient.PostAsJsonAsync("", presentacion);
            return response;
        }
        public async Task<Presentacion> FindPresentacionAsync(int id)
        {
            var response = await _httpClient.GetFromJsonAsync<Presentacion>($"?={id}");



            return response;
        }

        public async Task<HttpResponseMessage> UpdatePresentacionAsync(Presentacion presentacion)
        {
            var response = await _httpClient.PutAsJsonAsync("", presentacion);
            return response;
        }
        public async Task<HttpResponseMessage> DeletePresentacionAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($"/{id}");
            return response;
        }

    }
   
}

