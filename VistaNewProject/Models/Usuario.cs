namespace VistaNewProject.Models
{
    public class Usuario
    {
        public int UsuarioId { get; set; }
        public int? RolId { get; set; }
        public string? Nombre { get; set; }
        public string? Apellido { get; set; }
        public string? Usuario1 { get; set; }
        public string? Contraseña { get; set; }
        public string? Telefono { get; set; }
        public string? Correo { get; set; }
        public ulong? EstadoUsuario { get; set; }

        public virtual ICollection<Domicilio> Domicilios { get; set; }

    }
}
