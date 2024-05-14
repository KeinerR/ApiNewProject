using System.Text.Json.Serialization;

namespace VistaNewProject.Models
{
    public class Detallepedido
    {
        public int DetallePedidoId { get; set; }
        public int? PedidoId { get; set; }
        public int? ProductoId { get; set; }
        public int? UnidadId { get; set; }
        public int? Cantidad { get; set; }
        public decimal? PrecioUnitario { get; set; }
        public decimal? Subtotal { get; set; }

        [JsonIgnore]
        public virtual Pedido? Pedido { get; set; }
        [JsonIgnore]
        public virtual Producto? Producto { get; set; }


    }
}
