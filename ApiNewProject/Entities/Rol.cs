using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace ApiNewProject.Entities
{
    public partial class Rol
    {
        public Rol()
        {
            Rolxpermisos = new HashSet<Rolxpermiso>();
            Usuarios = new HashSet<Usuario>();
        }

        public int RolId { get; set; }
        public string? NombreRol { get; set; }

        [JsonIgnore]
        public virtual ICollection<Rolxpermiso> Rolxpermisos { get; set; }
        [JsonIgnore]
        public virtual ICollection<Usuario> Usuarios { get; set; }
    }
}
