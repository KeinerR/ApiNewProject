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


        // presentacion

        Task<IEnumerable<Presentacion>> GetPresentacionAsync();

        Task<HttpResponseMessage> CreatePresentacionAsync(Presentacion presentacion);

        Task<Presentacion> FindPresentacionAsync(int id);
        Task<HttpResponseMessage> UpdatePresentacionAsync(Presentacion presentacion);

        Task<HttpResponseMessage> DeletePresentacionAsync(int id);

        // compra

        Task<IEnumerable<Compra>> GetCompraAsync();

        Task<HttpResponseMessage> CreateCompraAsync(Compra compra);

        Task<Compra> FindCompraAsync(int id);
        Task<HttpResponseMessage> UpdateCompraAsync(Compra compra);

        Task<HttpResponseMessage> DeleteCompraAsync(int id);

        // marca

        Task<IEnumerable<Marca>> GetMarcaAsync();

        Task<HttpResponseMessage> CreateMarcaAsync(Marca marca);

        Task<Marca> FindMarcaAsync(int id);
        Task<HttpResponseMessage> UpdateMarcaAsync(Marca marca);

        Task<HttpResponseMessage> DeleteMarcaAsync(int id);

        // categoria

        Task<IEnumerable<Categoria>> GetCategoriaAsync();

        Task<HttpResponseMessage> CreateCategoriaAsync(Categoria categoria);

        Task<Categoria> FindCategoriaAsync(int id);
        Task<HttpResponseMessage> UpdateCategoriaAsync(Categoria categoria);

        Task<HttpResponseMessage> DeleteCategoriaAsync(int id);

        // unidad

        Task<IEnumerable<Unidad>> GetUnidadAsync();

        Task<HttpResponseMessage> CreateUnidadAsync(Unidad unidad);

        Task<Unidad> FindUnidadAsync(int id);
        Task<HttpResponseMessage> UpdateUnidadAsync(Unidad unidad);

        Task<HttpResponseMessage> DeleteUnidadAsync(int id);

        // producto

        Task<IEnumerable<Producto>> GetProductoAsync();

        Task<HttpResponseMessage> CreateProductoAsync(Producto producto);

        Task<Producto> FindProductoAsync(int id);
        Task<HttpResponseMessage> UpdateProductoAsync(Producto producto);

        Task<HttpResponseMessage> DeleteProductoAsync(int id);

        // proveedor

        Task<IEnumerable<Proveedor>> GetProveedorAsync();

        Task<HttpResponseMessage> CreateProveedorAsync(Proveedor proveeedor);

        Task<Proveedor> FindProveedorAsync(int id);
        Task<HttpResponseMessage> UpdateProveedorAsync(Proveedor proveedor);

        Task<HttpResponseMessage> DeleteProveedorAsync(int id);

        // usuario

        Task<IEnumerable<Usuario>> GetUsuarioAsync();

        Task<HttpResponseMessage> CreateUsuarioAsync(Usuario usuario);

        Task<Usuario> FindUsuarioAsync(int id);
        Task<HttpResponseMessage> UpdateUsuarioAsync(Usuario usuario);

        Task<HttpResponseMessage> DeleteUsuarioAsync(int id);

        // movimiento

        Task<IEnumerable<Movimiento>> GetMovimientoAsync();

        Task<HttpResponseMessage> CreateMovimientoAsync(Movimiento movimiento);

        Task<Movimiento> FindMovimientoAsync(int id);
        Task<HttpResponseMessage> UpdateMovimientoAsync(Movimiento movimiento);

        Task<HttpResponseMessage> DeleteMovimientoAsync(int id);

        // lote

        Task<IEnumerable<Lote>> GetLoteAsync();

        Task<HttpResponseMessage> CreateLoteAsync(Lote lote);

        Task<Lote> FindLoteAsync(int id);
        Task<HttpResponseMessage> UpdateLoteAsync(Lote lote);

        Task<HttpResponseMessage> DeleteLoteAsync(int id);

        // domicilio

        Task<IEnumerable<Domicilio>> GetDomicilioAsync();

        Task<HttpResponseMessage> CreateDomicilioAsync(Domicilio domicilio);

        Task<Domicilio> FindDomicilioAsync(int id);
        Task<HttpResponseMessage> UpdateDomicilioAsync(Domicilio domicilio);

        Task<HttpResponseMessage> DeleteDomicilioAsync(int id);

    }
}
