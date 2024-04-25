using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace ApiNewProject.Entities
{
    public partial class Producto
    {
        public Producto()
        {
            Detallecompras = new HashSet<Detallecompra>();
            Detallepedidos = new HashSet<Detallepedido>();
            Lotes = new HashSet<Lote>();
            Movimientos = new HashSet<Movimiento>();
        }

        public int ProductoId { get; set; }
        public int? PresentacionId { get; set; }
        public int? MarcaId { get; set; }
        public int? CategoriaId { get; set; }
        public string? NombreProducto { get; set; }
        public int? CantidadTotal { get; set; }
        public ulong? Estado { get; set; }
        [JsonIgnore]

        public virtual Categoria? Categoria { get; set; }
        [JsonIgnore]
        public virtual Marca? Marca { get; set; }
        [JsonIgnore]
        public virtual Presentacion? Presentacion { get; set; }
        [JsonIgnore]
        public virtual ICollection<Detallecompra> Detallecompras { get; set; }
        [JsonIgnore]
        public virtual ICollection<Detallepedido> Detallepedidos { get; set; }
        [JsonIgnore]
        public virtual ICollection<Lote> Lotes { get; set; }
        [JsonIgnore]
        public virtual ICollection<Movimiento> Movimientos { get; set; }
    }
}
