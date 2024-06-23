﻿using VistaNewProject.Models;

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

        Task<HttpResponseMessage> UpdatePedidoAsync(Pedido pedido);
        Task<Pedido> FindPedidosAsync(int id);

        Task<HttpResponseMessage> CreatePediiosAsync(Pedido pedido);

        // presentacion

        Task<IEnumerable<Presentacion>> GetPresentacionAsync();
        Task<HttpResponseMessage> CreatePresentacionAsync(PresentacionCrearYActualizar presentacion);
        Task<Presentacion> FindPresentacionAsync(int id);
        Task<Presentacion> FindnombrePresentacionAsync(int id);
        Task<HttpResponseMessage> UpdatePresentacionAsync(PresentacionCrearYActualizar presentacion);
        Task<HttpResponseMessage> CambiarEstadoPresentacionAsync(int id);

        Task<HttpResponseMessage> DeletePresentacionAsync(int id);



        // compra

        Task<IEnumerable<Compra>> GetCompraAsync();
        Task<HttpResponseMessage> CreateComprasAsync(Compra compra);
        Task<Compra> FinComprasAsync(int id);
        Task<HttpResponseMessage> UpdateComprasAsync(Compra compra);

        Task<HttpResponseMessage> DeleteComprasAsync(int id);



        // marca
        Task<IEnumerable<Marca>> GetMarcaAsync();
        Task<HttpResponseMessage> CreateMarcaAsync( Marca marca);
        Task<Marca> FindMarcaAsync(int? id);
        Task<Marca> FindNombreMarcasAsync(string nombreMarca);
        Task<HttpResponseMessage> UpdateMarcaAsync(MarcaUpdate marca);
        Task<HttpResponseMessage> CambiarEstadoMarcaAsync(int id);
        Task<HttpResponseMessage> DeleteMarcaAsync(int id);

        // categoria

        Task<IEnumerable<Categoria>> GetCategoriaAsync();

        Task<HttpResponseMessage> CreateCategoriaAsync(Categoria categoria);
        Task<Categoria> FindCategoriaAsync(int id);
        Task<Categoria> FindnombreCategoriaAsync(string nombreCategoria);
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
        Task<Producto> FindnombreProductoAsync(int productoId);
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
        Task<Proveedor> FindnombreProveedorAsync(int proveedorId);
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
        Task<HttpResponseMessage> UpdateLoteAsync(Lote lote);
        Task<HttpResponseMessage> DeleteLoteAsync(int id);
        Task<HttpResponseMessage> UpdatePrecioLotesAsync(int productoId, decimal precioxunidad, decimal precioxproducto );
        Task<HttpResponseMessage> UpdatePrecioLoteAsync(int productoId, string numeroLote, decimal precioxunidad, decimal precioxproducto );



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


        // rol

        Task<IEnumerable<Rol>> GetRolAsync();

       

        // rolxpermiso

        Task<UsuarioAcceso> GetAccesoAsync(int id);
        //Task<IEnumerable<Rolxpermiso>> GetRolesxPermisosAsync();
        //Task<HttpResponseMessage> CreateRolxPermisoAsync(Rolxpermiso rolxpermiso);
        //Task<HttpResponseMessage> DeleteRolxPermisoAsync(int rolId, int permisoId);


        // categoria x unidad
        Task<IEnumerable<CategoriaxUnidad>> GetCategoriaxUnidadesAsync();
        Task<HttpResponseMessage> CreateCategoriaxUnidadAsync(CategoriaxUnidad categoriaxunidad);
        Task<HttpResponseMessage> DeleteCategoriaxUnidadAsync(int categoriaId, int unidadId);

        // categoria x presentacion
        Task<IEnumerable<CategoriaxPresentacion>> GetCategoriaxPresentacionesAsync();
        Task<IEnumerable<CategoriaxPresentacion>> GetCategoriasxPresentacionByIdAsync(int presentacionId);
        Task<HttpResponseMessage> CreateCategoriaxPresentacionAsync(CategoriaxPresentacionAsosiacion categoriaxpresentacion);

        Task<HttpResponseMessage> DeleteCategoriaxPresentacionAsync(int categoriaId, int presentacionId);

        // categoria x marca
        Task<IEnumerable<CategoriaxMarca>> GetCategoriaxMarcasAsync();
        Task<HttpResponseMessage> CreateCategoriaxMarcaAsync(CategoriaxMarcaAsosiacion categoriaxmarca);

        Task<HttpResponseMessage> DeleteCategoriaxMarcaAsync(int categoriaId, int marcaId);


        // producto  x unidad
        Task<IEnumerable<UnidadxProducto>> GetUnidadesxProductosAsync();
        Task<HttpResponseMessage> CreateUnidadxProductoAsync(UnidadxProductoAsosiacion productoxunidad);
        Task<HttpResponseMessage> DeleteUnidadxProductoAsync(int unidadId, int productoId);
        Task<(IEnumerable<FacturaDTO>, IEnumerable<LoteDTO>)> GetFacturasYLotesAsync();

    }
}
