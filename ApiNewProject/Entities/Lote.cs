using System;
using System.Collections.Generic;

namespace ApiNewProject.Entities
{
    public partial class Lote
    {
        public int LoteId { get; set; }
        public int? DetalleCompraId { get; set; }
        public int? ProductoId { get; set; }
        public string? NumeroLote { get; set; }
        public decimal? PrecioCompra { get; set; }
        public decimal? PrecioDetal { get; set; }
        public decimal? PrecioxMayor { get; set; }
        public DateTime? FechaVencimiento { get; set; }
        public int? Cantidad { get; set; }
        public ulong? EstadoLote { get; set; }

        public virtual Detallecompra? DetalleCompra { get; set; }
        public virtual Producto? Producto { get; set; }
    }
}
