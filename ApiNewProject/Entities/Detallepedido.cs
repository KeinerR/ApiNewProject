using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace ApiNewProject.Entities
{
    public partial class Detallepedido
    {
        public int DetallePedidoId { get; set; }
        public int? PedidoId { get; set; }
        public int? LoteId { get; set; }

        public int? ProductoId { get; set; }
        public int? UnidadId { get; set; }
        public int? Cantidad { get; set; }
        public decimal? PrecioUnitario { get; set; }
        public decimal? Subtotal { get; set; }

        [JsonIgnore]
        public virtual Pedido? Pedido { get; set; }
        [JsonIgnore]    
        public virtual Producto? Producto { get; set; }
        [JsonIgnore]
        public virtual Unidad? Unidad { get; set; }
    }
}
