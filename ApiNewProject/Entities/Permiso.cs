using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace ApiNewProject.Entities
{
    public partial class Permiso
    {
        public Permiso()
        {
            Rolxpermisos = new HashSet<Rolxpermiso>();
        }

        public int PermisoId { get; set; }
        public string? NombrePermiso { get; set; }
        public string? Descripcion { get; set; }
        public ulong? EstadoPermiso { get; set; }

        public virtual ICollection<Rolxpermiso> Rolxpermisos { get; set; }
    }
}
