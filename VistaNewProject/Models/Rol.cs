namespace VistaNewProject.Models
{
    public class Rol
    {
        public int RolId { get; set; }
        public string? NombreRol { get; set; }

        public ulong ? EstadoRol { get; set; }
        public virtual ICollection<Rolxpermiso> ?Rolxpermisos { get; set; }
        public virtual ICollection<Usuario>? Usuarios { get; set; }
    }
}
