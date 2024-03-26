using VistaNewProject.Models;

namespace VistaNewProject.Services
{
    public interface IApiClient
    {

        Task<IEnumerable<Cliente>> GetClientesAsync();

        Task<HttpResponseMessage> CreateClienteAsync(Cliente cliente);

        Task<Cliente> FindClienteAsync(int id);
        Task<HttpResponseMessage> UpdateClienteAsync(Cliente clienet);

        Task<HttpResponseMessage> DeleteClienteAsync(int id);

        // compras  

        Task<IEnumerable<Compra>> GetCompraAsync();

        Task<HttpResponseMessage> CreateCompraAsync(Compra compra);

        Task<Compra> FindCompraAsync(int id);
        Task<HttpResponseMessage> UpdateCompraAsync(Compra compra);

        Task<HttpResponseMessage> DeleteCompraAsync(int id);

        // Marcas

        Task<IEnumerable<Marca>> GetMarcaAsync();

        Task<HttpResponseMessage> CreateMarcaAsync(Marca marca);

        Task<Marca> FindMarcaAsync(int id);
        Task<HttpResponseMessage> UpdateMarcaAsync(Marca marca);

        Task<HttpResponseMessage> DeleteMarcaAsync(int id);

        // Categoria

        Task<IEnumerable<Categoria>> GetCategoriaAsync();

        Task<HttpResponseMessage> CreateCategoriaAsync(Categoria categoria);

        Task<Categoria> FindCategoriaAsync(int id);
        Task<HttpResponseMessage> UpdateCategoriaAsync(Categoria categoria);

        Task<HttpResponseMessage> DeleteCategoriaAsync(int id);

        // Unidad

        Task<IEnumerable<Unidad>> GetUnidadAsync();

        Task<HttpResponseMessage> CreateUnidadAsync(Unidad unidad);

        Task<Unidad> FindUnidadAsync(int id);
        Task<HttpResponseMessage> UpdateUnidadAsync(Unidad unidad);

        Task<HttpResponseMessage> DeleteUnidadAsync(int id);

        // Presentacion

        Task<IEnumerable<Presentacion>> GetPresentacionAsync();

        Task<HttpResponseMessage> CreatePresentacionAsync(Presentacion presentacion);

        Task<Presentacion> FindPresentacionAsync(int id);
        Task<HttpResponseMessage> UpdatePresentacionAsync(Presentacion presentacion);

        Task<HttpResponseMessage> DeletePresentacionAsync(int id);

    }
}
