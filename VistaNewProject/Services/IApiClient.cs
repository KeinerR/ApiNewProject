using VistaNewProject.Models;

namespace VistaNewProject.Services
{
    public interface IApiClient
    {
        //cliente
        Task<IEnumerable<Cliente>> GetClientesAsync();
        Task<HttpResponseMessage> CreateClienteAsync(Cliente cliente);
        Task<Cliente> FindClienteAsync(int id);
        Task<HttpResponseMessage> UpdateClienteAsync(Cliente cliente);
        Task<HttpResponseMessage> DeleteClienteAsync(int id);


        // pedido

        Task<IEnumerable<Pedido>> GetPedidoAsync();


        // presentacion

        Task<IEnumerable<Presentacion>> GetPresentacionAsync();
        Task<HttpResponseMessage> CreatePresentacionAsync(Presentacion presentacion);
        Task<Presentacion> FindPresentacionAsync(int id);
        Task<HttpResponseMessage> UpdatePresentacionAsync(Presentacion presentacion);
        Task<HttpResponseMessage> DeletePresentacionAsync(int id);



        // compra

        Task<IEnumerable<Compra>> GetCompraAsync();

       

        // marca

        Task<IEnumerable<Marca>> GetMarcaAsync();

        Task<HttpResponseMessage> CreateMarcaAsync( Marca marca);
        Task<Marca> FindMarcasAsync(int id);
        Task<Marca> FindnombreMarcasAsync(string nombreMarca);
        Task<HttpResponseMessage> UpdateMarcaAsync(Marca marca);
        Task<HttpResponseMessage> DeleteMarcaAsync(int id);

        // categoria

        Task<IEnumerable<Categoria>> GetCategoriaAsync();

        Task<HttpResponseMessage> CreateCategoriaAsync(Categoria categoria);
        Task<Categoria> FindCategoriaAsync(int id);
        Task<Categoria> FindnombreCategoriaAsync(string nombreCategoria);
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
        Task<HttpResponseMessage> DeleteProductuAsync(int id);




        // proveedor

        Task<IEnumerable<Proveedor>> GetProveedorAsync();
        Task<HttpResponseMessage> CreateProveedorAsync(Proveedor proveedor);
        Task<Proveedor> FindProveedorAsync(int id);
        Task<Proveedor> FindnombreProveedorAsync(string nombreEmpresa);

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

        

        // lote

        Task<IEnumerable<Lote>> GetLoteAsync();

        

        // domicilio

        Task<IEnumerable<Domicilio>> GetDomicilioAsync();

        
        // detallepedido

        Task<IEnumerable<Detallepedido>> GetDetallepedidoAsync();

       

        // detallecompra

        Task<IEnumerable<Detallecompra>> GetDetallecompraAsync();

        

        // permiso

        Task<IEnumerable<Permiso>> GetPermisoAsync();


        // rol

        Task<IEnumerable<Rol>> GetRolAsync();

       

        // rolxpermiso

        Task<IEnumerable<Rolxpermiso>> GetRolxpermisoAsync();

      

    }
}
