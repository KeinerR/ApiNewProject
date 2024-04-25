using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace ApiNewProject.Entities
{
    public partial class Rolxpermiso
    {
        public int RolxPermisoId { get; set; }
        public int? PermisoId { get; set; }
        public int? RolId { get; set; }
        public int? NivelAcceso { get; set; }
        [JsonIgnore]
        public virtual Permiso? Permiso { get; set; }
        [JsonIgnore]
        public virtual Rol? Rol { get; set; }
    }
}
