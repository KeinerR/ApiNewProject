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
        Task<HttpResponseMessage> CambiarEstadoClienteAsync(int id);

        Task<HttpResponseMessage> DeleteClienteAsync(int id);


        // pedido

        Task<IEnumerable<Pedido>> GetPedidoAsync();
        Task<HttpResponseMessage> CreatePedidoAsync(Pedido pedido);
        Task<HttpResponseMessage> DeletePedidoAsync(int id);
        Task<HttpResponseMessage> CambiarEstadoPedidoAsync(int id, string estado);

        Task<HttpResponseMessage> UpdatePedidoAsync(Pedido pedido);
        Task<Pedido> FindPedidosAsync(int id);

        Task<HttpResponseMessage> CreatePediiosAsync(Pedido pedido);

        // presentacion

        Task<IEnumerable<Presentacion>> GetPresentacionAsync();
        Task<HttpResponseMessage> CreatePresentacionAsync(PresentacionCrearYActualizar presentacion);
        Task<Presentacion> FindPresentacionAsync(int id);
        Task<HttpResponseMessage> UpdatePresentacionAsync(PresentacionCrearYActualizar presentacion);
        Task<HttpResponseMessage> CambiarEstadoPresentacionAsync(int id);
        Task<HttpResponseMessage> DeletePresentacionAsync(int id);



        // compra

        Task<IEnumerable<Compra>> GetCompraAsync();
        Task<HttpResponseMessage> CreateComprasAsync(CrearCompra compra);
        Task<Compra> FinComprasAsync(int id);
        Task<HttpResponseMessage> UpdateComprasAsync(Compra compra);
        Task<HttpResponseMessage> DeleteComprasAsync(int id);
        Task<(IEnumerable<FacturaDTO>, IEnumerable<LoteDTO>)> GetFacturasYLotesAsync();

        Task<string> VerificarDuplicadosFacturas(string numeroF);
        Task<string> VerificarDuplicadosLotes(string numeroLote);



        // marca
        Task<IEnumerable<Marca>> GetMarcaAsync();
        Task<HttpResponseMessage> CreateMarcaAsync(Marca marca);
        Task<Marca> FindMarcaAsync(int? id);
        Task<HttpResponseMessage> UpdateMarcaAsync(MarcaUpdate marca);
        Task<HttpResponseMessage> CambiarEstadoMarcaAsync(int id);
        Task<HttpResponseMessage> DeleteMarcaAsync(int id);

        // categoria

        Task<IEnumerable<Categoria>> GetCategoriaAsync();

        Task<HttpResponseMessage> CreateCategoriaAsync(Categoria categoria);
        Task<Categoria> FindCategoriaAsync(int id);
        Task<HttpResponseMessage> UpdateCategoriaAsync(CategoriaUpdate categoria);
        Task<HttpResponseMessage> CambiarEstadoCategoriaAsync(int id);
        Task<HttpResponseMessage> DeleteCategoriaAsync(int id);



        // unidad

        Task<IEnumerable<Unidad>> GetUnidadAsync();
        Task<HttpResponseMessage> CreateUnidadAsync(Unidad unidad);
        Task<Unidad> FindUnidadAsync(int id);
        Task<HttpResponseMessage> UpdateUnidadAsync(Unidad unidad);
        Task<HttpResponseMessage> DeleteUnidadAsync(int id);

        Task<HttpResponseMessage> CambiarEstadoUnidadAsync(int id);



        // producto
        Task<IEnumerable<Producto>> GetProductoAsync(string busqueda = null);
        Task<IEnumerable<Producto>> GetAllDatosProductosAsync(string busqueda = null);
        Task<HttpResponseMessage> CreateProductoAsync(ProductoCrearYActualizar producto);
        Task<Producto> FindProductoAsync(int id);
        Task<Producto> FindDatosProductoAsync(int id);
        Task<HttpResponseMessage> UpdateProductoAsync(ProductoCrearYActualizar producto);
        Task<HttpResponseMessage> AddCantidadReservadaAsync(int productoId, int? cantidad);
        Task<HttpResponseMessage> SustraerCantidadReservadaAsync(int productoId, int? cantidad);
        Task<HttpResponseMessage> AddCantidadPorUnidadReservadaAsync(int productoId, int? cantidad);
        Task<HttpResponseMessage> SustraerCantidadPorUnidadReservadaAsync(int productoId, int? cantidad);

        Task<HttpResponseMessage> QuitarCantidadReservada(int productoId, int? cantidad);
        Task<HttpResponseMessage> QuitarCantidadReservadaUnidad(int productoId, int? cantidad);


        Task<HttpResponseMessage> PedidosCancelados(int productoId, int? cantidad);
        Task<HttpResponseMessage> PedidosCanceladosUnidad(int productoId, int? cantidad);


        Task<HttpResponseMessage> AddCantidadTotalAsync(int productoId, int? cantidad);
        Task<HttpResponseMessage> SustraerCantidadTotalAsync(int productoId, int? cantidad);
        Task<HttpResponseMessage> AddCantidadTotalPorUnidadAsync(int productoId, int? cantidad);
        Task<HttpResponseMessage> SustraerCantidadTotalPorUnidadAsync(int productoId, int? cantidad);
        Task<HttpResponseMessage> DeleteProductoAsync(int id);
        Task<HttpResponseMessage> CambiarEstadoProductoAsync(int id);


        // proveedor
        Task<IEnumerable<Proveedor>> GetProveedorAsync();
        Task<HttpResponseMessage> CreateProveedorAsync(Proveedor proveedor);
        Task<Proveedor> FindProveedorAsync(int? id);
        Task<HttpResponseMessage> UpdateProveedorAsync(ProveedorUpdate proveedor);
        Task<HttpResponseMessage> CambiarEstadoProveedorAsync(int id);
        Task<HttpResponseMessage> DeleteProveedorAsync(int id);
        // usuario
        Task<IEnumerable<Usuario>> GetUsuarioAsync();
        Task<HttpResponseMessage> CreateUsuarioAsync(Usuario usuario);
        Task<Usuario> FindUsuarioAsync(int id);
        Task<HttpResponseMessage> UpdateUsuarioAsync(Usuario usuario);
        Task<HttpResponseMessage> DeleteUsuarioAsync(int id);
        Task<HttpResponseMessage> CambiarEstadoUsuarioAsync(int id);

        // movimiento

        Task<IEnumerable<Movimiento>> GetMovimientoAsync();
        Task<HttpResponseMessage> CreateMovimientoAsync(Movimiento movimiento);
        Task<Movimiento> FindMoviminetoAsync(int id);
        Task<HttpResponseMessage> UpdateMovimientoAsync(Movimiento movimiento);
        Task<HttpResponseMessage> DeleteMovimientoAsync(int id);



        // lote
        Task<IEnumerable<Lote>> GetLoteAsync();
        Task<HttpResponseMessage> CreateLoteAsync(Lote lote);
        Task<Lote> FindLoteAsync(int id);
        Task<IEnumerable<Lote>> GetLotesByProductIdAsync(int productId);
        Task<IEnumerable<Lote>> GetLotesByDetalleCompraIdAsync(int id);
        Task<HttpResponseMessage> UpdateLoteAsync(Lote lote);
        Task<HttpResponseMessage> DeleteLoteAsync(int id);
        Task<HttpResponseMessage> UpdatePrecioLotesAsync(int productoId, decimal precioxunidad, decimal precioxproducto);
        Task<HttpResponseMessage> UpdatePrecioLoteAsync(int productoId, string numeroLote, decimal precioxunidad, decimal precioxproducto);
        Task<HttpResponseMessage> AddCantidadALoteAsync(int loteId, int? cantidad);
        Task<HttpResponseMessage> SustraerCantidadALoteAsync(int loteId, int? cantidad);
        Task<HttpResponseMessage> AddCantidadPorUnidadALoteAsync(int loteId, int? cantidad);
        Task<HttpResponseMessage> SustraerCantidadPorUnidadALoteAsync(int loteId, int? cantidad);

        // domicilio

        Task<IEnumerable<Domicilio>> GetDomicilioAsync();
        Task<HttpResponseMessage> CreateDomicilioAsync(Domicilio domicilio);
        Task<Domicilio> FindDomicilioAsync(int id);
        Task<HttpResponseMessage> UpdateDomicilioAsync(Domicilio domicilio);


        // detallepedido


        Task<IEnumerable<Detallepedido>> GetDetallepedidoAsync();
        Task<HttpResponseMessage> CreateDetallesPedidosAsync(Detallepedido detallepedido);
        Task<Detallepedido> FindDetallesPedidoAsync(int id);
        Task<HttpResponseMessage> UpdateDetallepedidosAsync(Detallepedido detallepedido);
        Task<HttpResponseMessage> DeleteDetallePedidoAsync(int id);




        // detallecompra

        Task<IEnumerable<Detallecompra>> GetDetallecompraAsync();
        Task<HttpResponseMessage> CreateDetallesComprasAsync(Detallecompra detallecompra);
        Task<Detallecompra> FindDetallesComprasAsync(int id);
        Task<HttpResponseMessage> UpdateDetallesComprasAsync(Detallecompra detallecompra);
        Task<HttpResponseMessage> DeleteDetalleComprasAsync(int id);



        // permiso

        Task<IEnumerable<Permiso>> GetPermisoAsync();
        Task<HttpResponseMessage> CreatePermisoAsync(Permiso permiso);
        Task<Permiso> FindPermisoAsync(int id);
        Task<HttpResponseMessage> UpdatePermisoAsync(Permiso permiso);
        Task<HttpResponseMessage> DeletePermisoAsync(int id);


        // rol

        Task<IEnumerable<Rol>> GetRolAsync();
        Task<HttpResponseMessage> CreateRolAsync(Rol rol);
        Task<Rol> FindRolAsync(int id);
        Task<HttpResponseMessage> UpdateRolAsync(Rol rol);
        Task<HttpResponseMessage> DeleteRolAsync(int id);



        // rolxpermiso

        Task<IEnumerable<Rolxpermiso>> GetRolesxPermisosAsync();
        Task<UsuarioAcceso> GetAccesoAsync(int usuarioId);
        Task<Rolxpermiso> GetRolesxPermisosByIdAsync(int rolxPermisoId);
        Task<PermisoAcceso> GetPermisosByPermisoIdAsync(int permisoId);
        Task<RolAcceso> GetPermisosByRolIdAsync(int rolId);
        Task<HttpResponseMessage> CreateRolxPermisoAsync(RolxpermisoCrear rolxpermiso);
        Task<HttpResponseMessage> DeleteRolxPermisoAsync(int rolId, int permisoId, string NombreRolxpermiso);



        // categoria x unidad

        Task<IEnumerable<CategoriaxUnidad>> GetCategoriaxUnidadesAsync();
        Task<HttpResponseMessage> CreateCategoriaxUnidadAsync(CategoriaxUnidad categoriaxunidad);
        Task<IEnumerable<CategoriaxUnidad>> GetCategoriaxUnidadesByIdAsync(int categoriaId);
        Task<IEnumerable<CategoriaxUnidad>> GetCategoriasxUnidadByIdUnidadAsync(int unidadId);
        Task<HttpResponseMessage> DeleteCategoriaxUnidadAsync(int categoriaId, int unidadId);

        // categoria x presentacion
        Task<IEnumerable<CategoriaxPresentacion>> GetCategoriaxPresentacionesAsync();
        Task<IEnumerable<CategoriaxPresentacion>> GetCategoriaxPresentacionesByIdAsync(int categoriaId);
        Task<IEnumerable<CategoriaxPresentacion>> GetCategoriasxPresentacionByIdPresentacionAsync(int presentacionId);
        Task<HttpResponseMessage> CreateCategoriaxPresentacionAsync(CategoriaxPresentacionAsosiacion categoriaxpresentacion);
        Task<HttpResponseMessage> DeleteCategoriaxPresentacionAsync(int categoriaId, int presentacionId);

        // categoria x marca
        Task<IEnumerable<CategoriaxMarca>> GetCategoriaxMarcasAsync();
        Task<IEnumerable<CategoriaxMarca>> GetCategoriaxMarcasByIdAsync(int categoriaId);
        Task<IEnumerable<CategoriaxMarca>> GetCategoriasxMarcaByIdMarcaAsync(int marcaId);
        Task<HttpResponseMessage> CreateCategoriaxMarcaAsync(CategoriaxMarcaAsosiacion categoriaxmarca);
        Task<HttpResponseMessage> DeleteCategoriaxMarcaAsync(int categoriaId, int marcaId);


        // producto  x unidad
        Task<IEnumerable<UnidadxProducto>> GetUnidadesxProductosAsync();
        Task<IEnumerable<UnidadxProducto>> GetUnidadxProductosByIdAsync(int unidadId);
        Task<IEnumerable<UnidadxProducto>> GetUnidadesxProductosByIdProductoAsync(int productoId);
        Task<HttpResponseMessage> CreateUnidadxProductoAsync(UnidadxProductoAsosiacion productoxunidad);
        Task<HttpResponseMessage> DeleteUnidadxProductoAsync(int unidadId, int productoId);


    }
}
