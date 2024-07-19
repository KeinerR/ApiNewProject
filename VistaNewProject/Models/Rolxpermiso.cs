namespace VistaNewProject.Models
{ 
    public partial class Rolxpermiso
    {
        public int RolxPermisoId { get; set; }
        public int? PermisoId { get; set; }
        public int? RolId { get; set; }
        public string? NombrePermisoxRol { get; set; }
    }
}

//public class Rolxpermiso
//{
//    public int RolxPermisoId { get; set; }
//    public int? PermisoId { get; set; }
//    public int? RolId { get; set; }
//    public virtual Permiso? Permiso { get; set; }
//    public virtual Rol? Rol { get; set; }
//}