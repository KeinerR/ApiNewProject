namespace VistaNewProject.Models
{
    public class Movimiento
    {
        public int MovimientoId { get; set; }
        public string? TipoAccion { get; set; }
        public string? TipoMovimiento { get; set; }
        public int? BuscarId { get; set; } = 0;
        public DateTime? FechaMovimiento { get; set; }

      
    }
}
