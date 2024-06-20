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
        public int CompraId { get; set; }
        public int ProductoId { get; set; }
        public int UnidadId { get; set; }
        public int ?  Cantidad { get; set; }
        [JsonIgnore]
        public virtual Compra? Compra { get; set; }
        [JsonIgnore]
        public virtual Producto? Producto { get; set; }
        [JsonIgnore]
        public virtual Unidad? Unidad { get; set; }
        public virtual ICollection<Lote> Lotes { get; set; }
    }
}
