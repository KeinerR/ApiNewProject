namespace VistaNewProject.Models
{
    public class Cliente
    {
        public int ClienteId { get; set; }
        public string? Identificacion { get; set; }
        public string? NombreEntidad { get; set; }
        public string? NombreCompleto { get; set; }
        public string? TipoCliente { get; set; }
        public string? Telefono { get; set; }
        public string? Correo { get; set; }
        public string? Direccion { get; set; }
        public ulong? EstadoCliente { get; set; }
        
        public virtual ICollection<Pedido>? Pedidos { get; set; }
    }
}
