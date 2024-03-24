using VistaNewProject.Models;

namespace VistaNewProject.Services
{
    public interface IApiClient
    {

        Task<IEnumerable<Cliente>> GetClientesAsync();

        Task<HttpResponseMessage>CreateClienteAsync(Cliente cliente);

        Task<Cliente> FindClienteAsync(int id);
        Task<HttpResponseMessage> UpdateClienteAsync(Cliente clienet);

        Task<HttpResponseMessage> DeleteClienteAsync(int id);
    }
}
