namespace VistaNewProject.Models
{
    public class Home
    {
        public List<Producto> Productos { get; set; }
        public List<Detallepedido> detallepedidos { get; set; }
        public List<Compra> Compras { get; set; }
        public List<Proveedor> Proveedores { get; set; }
        public List<Cliente> Clientes { get; set; }
        public List<Pedido> Pedidos { get; set; }
        public List<NombresMarca> NombreMarcas {  get; set; }
        public List<Lote> Loteres { get; set; }
        public List<Detallecompra> detalleCompra { get; set; }
        public List<NombreProveedor> NombreProveedores { get; set; }
        public List<CompraID> CompraIDs { get; set; }
        public List<TotalCompras> ValorTotalCompras {  get; set; }
        
    }

    public class NombresMarca
    {
        public string Nombre { get; set; }
    }

    public class DetalleCompra
    {
        public int CompraId { get; set; }
    }

    public class TotalCompras
    {
        public decimal? TotalCompra { get; set; }
    }

    public class CompraID
    {
        public int IdCompra { get; set; } 
    }

    public class Lotes
    {
        public int DetalleCompraId { get; set; }
    }

    public class NombreProveedor
    {
        public string NombrePro {  get; set; }
    }

}
