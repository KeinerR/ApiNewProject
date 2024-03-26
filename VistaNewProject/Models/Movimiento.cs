namespace VistaNewProject.Models
{
    public class Movimiento
    {
        public int MovimientoId { get; set; }
        public int? ProductoId { get; set; }
        public string? TipoAccion { get; set; }
        public string? TipoMovimiento { get; set; }
        public int? CantidadMovimiento { get; set; }
        public string? Descripcion { get; set; }
        public DateTime? FechaMovimiento { get; set; }

        public virtual Producto? Producto { get; set; }
    }
}
