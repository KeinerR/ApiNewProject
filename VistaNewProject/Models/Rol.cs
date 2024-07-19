namespace VistaNewProject.Models
{
    public class Rol
    {
        public int RolId { get; set; }
        public string NombreRol { get; set; } = "";

        public ulong ? EstadoRol { get; set; }
        public virtual ICollection<Rolxpermiso> ?Rolxpermisos { get; set; }
        public virtual ICollection<Usuario>? Usuarios { get; set; }
    }
    public partial class RolxpermisoCrear
    {
        public int RolxPermisoId { get; set; }
        public int? PermisoId { get; set; }
        public int? RolId { get; set; }
        public string? NombrePermisoxRol { get; set; }

    }
    public class RolAcceso
    {
        public int? RolId { get; set; }
        public string? NombreRol { get; set; }
        public ulong? EstadoRol { get; set; }
        public virtual List<RolxpermisoAcceso>? RolxPermisoAcceso { get; set; }

    }
}
