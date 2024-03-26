using VistaNewProject.Models;

namespace VistaNewProject.Services
{
    public interface IApiClient
    {

        Task<IEnumerable<Cliente>> GetClientesAsync();

        Task<HttpResponseMessage> CreateClienteAsync(Cliente cliente);

        Task<Cliente> FindClienteAsync(int id);
        Task<HttpResponseMessage> UpdateClienteAsync(Cliente cliente);

        Task<HttpResponseMessage> DeleteClienteAsync(int id);

        // pedido

        Task<IEnumerable<Pedido>> GetPedidosAsync();

        Task<HttpResponseMessage> CreatePedidoAsync(Pedido pedido);

        Task<Pedido> FindPedidoAsync(int id);
        Task<HttpResponseMessage> UpdatePedidoAsync(Pedido pedido);

        Task<HttpResponseMessage> DeletePedidoAsync(int id);


    }
}
