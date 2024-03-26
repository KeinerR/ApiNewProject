namespace VistaNewProject.Models
{
    public class Pedido
    {
        public int PedidoId { get; set; }
        public int? ClienteId { get; set; }
        public string? TipoServicio { get; set; }
        public DateTime? FechaPedido { get; set; }
        public decimal? TotalPedido { get; set; }
        public ulong? EstadoPedido { get; set; }

    }
}
