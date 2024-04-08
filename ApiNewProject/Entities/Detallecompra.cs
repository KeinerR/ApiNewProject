using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace ApiNewProject.Entities
{
    public partial class Detallecompra
    {
        public Detallecompra()
        {
            Lotes = new HashSet<Lote>();
        }

        public int DetalleCompraId { get; set; }
        public int? CompraId { get; set; }
        public int? ProductoId { get; set; }
        public int? Cantidad { get; set; }
        public virtual Compra? Compra { get; set; }
        public virtual Producto? Producto { get; set; }
        public virtual ICollection<Lote> Lotes { get; set; }
    }
}
