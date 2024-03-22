using System;
using System.Collections.Generic;

namespace ApiNewProject.Entities
{
    public partial class Rolxpermiso
    {
        public int RolxPermisoId { get; set; }
        public int? PermisoId { get; set; }
        public int? RolId { get; set; }
        public int? NivelAcceso { get; set; }

        public virtual Permiso? Permiso { get; set; }
        public virtual Rol? Rol { get; set; }
    }
}
