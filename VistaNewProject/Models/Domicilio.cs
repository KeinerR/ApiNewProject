namespace VistaNewProject.Models
{
    public class Domicilio
    {
        public int DomicilioId { get; set; }
        public int? PedidoId { get; set; }
        public int? UsuarioId { get; set; }
        public string? Observacion { get; set; }
        public DateTime? FechaEntrega { get; set; }
        public string? DireccionDomiciliario { get; set; }
        public string? EstadoDomicilio { get; set; }

        public virtual Pedido? Pedido { get; set; }
        public virtual Usuario? Usuario { get; set; }
    }
}
