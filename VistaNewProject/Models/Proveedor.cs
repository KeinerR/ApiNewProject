namespace VistaNewProject.Models
{
    public class Proveedor
    {
        public int ProveedorId { get; set; }
        public string? NombreEmpresa { get; set; }
        public string? NombreContacto { get; set; }
        public string? Direccion { get; set; }
        public string? Telefono { get; set; }
        public string? Correo { get; set; }
        public ulong? EstadoProveedor { get; set; }

        public virtual ICollection<Compra> Compras { get; set; }
    }
}
