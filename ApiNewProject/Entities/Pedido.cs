using System;
using System.Collections.Generic;

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
        public ulong? EstadoPedido { get; set; }

        
        public virtual Cliente? Cliente { get; set; }
        public virtual ICollection<Detallepedido> Detallepedidos { get; set; }
        public virtual ICollection<Domicilio> Domicilios { get; set; }
    }
}
