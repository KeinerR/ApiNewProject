using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

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
        public string? NumeroFactura { get; set; }
        public DateTime? FechaCompra { get; set; }
        public decimal? ValorTotalCompra { get; set; }
        public ulong? EstadoCompra { get; set; }
        [JsonIgnore]

        public virtual Proveedor? Proveedor { get; set; }
        [JsonIgnore]
        public virtual ICollection<Detallecompra> Detallecompras { get; set; }
    }
}
