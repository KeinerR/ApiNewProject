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
        public int? UnidadId { get; set; }
        public string? NombreProducto { get; set; }
        public int? CantidadTotal { get; set; }
        public ulong? Estado { get; set; }
        public virtual Categoria? Categoria { get; set; }
        public virtual Marca? Marca { get; set; }
        public virtual Presentacion? Presentacion { get; set; }
        public virtual Unidad? Unidad { get; set; }
        public virtual ICollection<Detallecompra> Detallecompras { get; set; }
        public virtual ICollection<Detallepedido> Detallepedidos { get; set; }
        public virtual ICollection<Lote> Lotes { get; set; }
        public virtual ICollection<Movimiento> Movimientos { get; set; }
    }
}
