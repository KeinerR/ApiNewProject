namespace VistaNewProject.Models
{
    public class UsuarioAcceso
    {
        public int UsuarioId { get; set; }
        public int? RolId { get; set; }
        public string? Usuario1 { get; set; }
        public string? NombreRol { get; set; }
        public ulong? EstadoAcceso { get; set; }
        public virtual List<RolxpermisoAcceso>? RolxPermisoAcceso { get; set; }
    }

    public class RolxpermisoAcceso
    {
        public int? PermisoId { get; set; }
        public string? NombrePermiso { get; set; }
        public virtual List<RolxpermisoNombres>? RolxPermisoNombres { get; set; }
    }

    public class RolxpermisoNombres
    {
        public int RolxPermisoId { get; set; }
        public string? NombrePermisoxRol { get; set; }
    }
    public class RoleInfo
    {
        public int RolId { get; set; }
        public string ? Nombre { get; set; }
    }

}
