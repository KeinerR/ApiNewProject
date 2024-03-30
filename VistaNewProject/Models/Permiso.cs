namespace VistaNewProject.Models
{
    public class Permiso
    {
        public int PermisoId { get; set; }
        public string? NombrePermiso { get; set; }
        public string? Descripcion { get; set; }
        public ulong? EstadoPermiso { get; set; }

        public virtual ICollection<Rolxpermiso> Rolxpermisos { get; set; }
    }
}
