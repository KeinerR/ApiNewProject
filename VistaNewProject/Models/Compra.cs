namespace VistaNewProject.Models
{
    public class Compra
    {
        public int CompraId { get; set; }
        public int? ProveedorId { get; set; }
        public int? NumeroFactura { get; set; }
        public DateTime? FechaCompra { get; set; }
        public decimal? ValorTotal { get; set; }
        public ulong? EstadoCompra { get; set; }
    }
}
