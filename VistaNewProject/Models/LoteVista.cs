namespace VistaNewProject.Models
{
    public class LoteVista
    {
        public int LoteId { get; set; }
        public int? DetalleCompraId { get; set; }
        public int? ProductoId { get; set; }
        public string? NumeroLote { get; set; }
        public string? PrecioCompra { get; set; }
        public string? PrecioPorPresentacion { get; set; }
        public string? PrecioPorUnidadProducto { get; set; }
        public DateTime? FechaVencimiento { get; set; }
        public string? FechaCaducidad { get; set; }
        public int? Cantidad { get; set; }
        public ulong? EstadoLote { get; set; }

        public virtual Detallecompra? DetalleCompra { get; set; }


        public virtual Producto? Producto { get; set; }
    }
}
