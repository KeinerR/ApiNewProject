using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
namespace ApiNewProject.Entities
{
    public partial class Unidad
    {
        public Unidad()
        {
            Detallecompras = new HashSet<Detallecompra>();
            Detallepedidos = new HashSet<Detallepedido>();
        }

        public int UnidadId { get; set; }
        public string? NombreUnidad { get; set; }
        public int? CantidadPorUnidad { get; set; }
        public string? DescripcionUnidad { get; set; }
        public ulong? EstadoUnidad { get; set; }
        [JsonIgnore]

        public virtual ICollection<Detallecompra> Detallecompras { get; set; }
        [JsonIgnore]
        
        public virtual ICollection<Detallepedido> Detallepedidos { get; set; }
    }
}
