using System.Text.Json.Serialization;

namespace VistaNewProject.Models
{
    public class Detallepedido
    {
        public int DetallePedidoId { get; set; }
        public int? PedidoId { get; set; }
        public int? ProductoId { get; set; }
        public int? UnidadId { get; set; }

        public int? LoteId { get; set; }
        public int? Cantidad { get; set; }
        public decimal? PrecioUnitario { get; set; }
        public decimal? Subtotal { get; set; }

        
        public virtual Pedido? Pedidos { get; set; }
        public virtual Producto? Productos { get; set; }

        public virtual Unidad? Unidades { get; set; }
         public virtual Cliente? Clientes { get; set; }

        public virtual Lote? Lotes { get; set; }


    }
}
