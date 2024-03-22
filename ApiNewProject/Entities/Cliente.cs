using System;
using System.Collections.Generic;

namespace ApiNewProject.Entities
{
    public partial class Cliente
    {
        public Cliente()
        {
            Pedidos = new HashSet<Pedido>();
        }

        public int ClienteId { get; set; }
        public string? Identificacion { get; set; }
        public string? NombreEntidad { get; set; }
        public string? NombreCompleto { get; set; }
        public string? TipoCliente { get; set; }
        public string? Telefono { get; set; }
        public string? Correo { get; set; }
        public string? Direccion { get; set; }
        public ulong? EstadoCliente { get; set; }

        public virtual ICollection<Pedido> Pedidos { get; set; }
    }
}
