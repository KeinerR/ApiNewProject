using System;
using System.Collections.Generic;

namespace ApiNewProject.Entities
{
    public partial class Compra
    {
        public Compra()
        {
            Detallecompras = new HashSet<Detallecompra>();
        }

        public int CompraId { get; set; }
        public int? ProveedorId { get; set; }
        public int? NumeroFactura { get; set; }
        public DateTime? FechaCompra { get; set; }
        public decimal? ValorTotal { get; set; }
        public ulong? EstadoCompra { get; set; }

        public virtual Proveedor? Proveedor { get; set; }
        public virtual ICollection<Detallecompra> Detallecompras { get; set; }
    }
}
