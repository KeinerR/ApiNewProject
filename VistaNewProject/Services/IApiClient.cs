using VistaNewProject.Models;

namespace VistaNewProject.Services
{
    public interface IApiClient
    {

        Task<IEnumerable<Cliente>> GetClientesAsync();


        // pedido

        Task<IEnumerable<Pedido>> GetPedidoAsync();


        // presentacion

        Task<IEnumerable<Presentacion>> GetPresentacionAsync();

        

        // compra

        Task<IEnumerable<Compra>> GetCompraAsync();

       

        // marca

        Task<IEnumerable<Marca>> GetMarcaAsync();

        Task<HttpResponseMessage> CreateMarcaAsync( Marca marca);





        // categoria

        Task<IEnumerable<Categoria>> GetCategoriaAsync();

        


        // unidad

        Task<IEnumerable<Unidad>> GetUnidadAsync();

       

        // producto

        Task<IEnumerable<Producto>> GetProductoAsync();

        

        // proveedor

        Task<IEnumerable<Proveedor>> GetProveedorAsync();

        

        // usuario

        Task<IEnumerable<Usuario>> GetUsuarioAsync();

        

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
