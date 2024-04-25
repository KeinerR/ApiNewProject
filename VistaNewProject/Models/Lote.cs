namespace VistaNewProject.Models
{
    public class Lote
    {
        public int LoteId { get; set; }
        public int? DetalleCompraId { get; set; }
        public int? ProductoId { get; set; }
        public string? NumeroLote { get; set; }
        public decimal? PrecioCompra { get; set; }
        public decimal? PrecioPorUnidad { get; set; }
        public decimal? PrecioPorPresentacion { get; set; }
        public decimal? PrecioPorUnidadProducto { get; set; }
        public DateTime? FechaVencimiento { get; set; }
        public int? Cantidad { get; set; }
        public ulong? EstadoLote { get; set; }

        public virtual Detallecompra? DetalleCompra { get; set; }


        public virtual Producto? Producto { get; set; }
    }
}
