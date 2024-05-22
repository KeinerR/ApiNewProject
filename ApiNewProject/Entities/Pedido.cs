using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace ApiNewProject.Entities
{
    public partial class Pedido
    {
        public Pedido()
        {
            Detallepedidos = new HashSet<Detallepedido>();
            Domicilios = new HashSet<Domicilio>();
        }

        public int PedidoId { get; set; }
        public int? ClienteId { get; set; }
        public string? TipoServicio { get; set; }
        public DateTime? FechaPedido { get; set; }
        public decimal? ValorTotalPedido { get; set; }
        public string? EstadoPedido { get; set; }
        [JsonIgnore]
        public virtual Cliente? Cliente { get; set; }

        [JsonIgnore]
        public virtual ICollection<Detallepedido> Detallepedidos { get; set; }
        [JsonIgnore]
        public virtual ICollection<Domicilio> Domicilios { get; set; }
    }
}
