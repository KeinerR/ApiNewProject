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
         
        public List<Lote> Loteres { get; set; }
    }
}
