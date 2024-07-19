
using System.Text.Json.Serialization;

namespace API_OPTIMUS.Entities
{
        public partial class Usuario
        {
            public Usuario()
            {
                Domicilios = new HashSet<Domicilio>();
            }

            public int UsuarioId { get; set; }
            public int? RolId { get; set; }
            public string? Nombre { get; set; }
            public string? Apellido { get; set; }
            public string? Usuario1 { get; set; }
            public string? Contraseña { get; set; }
            public string? Telefono { get; set; }
            public string? Correo { get; set; }
            public ulong? EstadoUsuario { get; set; }
            [JsonIgnore]

            public virtual Rol? Rol { get; set; }
            [JsonIgnore]
            public virtual ICollection<Domicilio> Domicilios { get; set; }
        }
        public partial class DatosUsuario
        {
            public DatosUsuario()
            {
                Domicilios = new HashSet<Domicilio>();
            }

            public int UsuarioId { get; set; }
            public int? RolId { get; set; }
            public string? Nombre { get; set; }
            public string? Apellido { get; set; }
            public string? Usuario1 { get; set; }
            public string? Contraseña { get; set; }
            public string? Telefono { get; set; }
            public string? Correo { get; set; }
            public ulong? EstadoUsuario { get; set; }
            public virtual Rol? Rol { get; set; }
            public virtual ICollection<Domicilio> Domicilios { get; set; }
        }
        public partial class Rolxpermiso
        {
            public int RolxPermisoId { get; set; }
            public int? PermisoId { get; set; }
            public int? RolId { get; set; }
            public string? NombrePermisoxRol { get; set; }
            [JsonIgnore]
            public virtual Permiso? Permiso { get; set; }
            [JsonIgnore]
            public virtual Rol? Rol { get; set; }
        }
        public partial class Rol
        {
            public Rol()
            {
                Rolxpermisos = new HashSet<Rolxpermiso>();
                Usuarios = new HashSet<Usuario>();
            }

            public int RolId { get; set; }
            public string? NombreRol { get; set; }
            public ulong? EstadoRol { get; set; }
            [JsonIgnore]
            public virtual ICollection<Rolxpermiso> Rolxpermisos { get; set; }
            [JsonIgnore]
            public virtual ICollection<Usuario> Usuarios { get; set; }
        }
        public partial class Permiso
        {
            public Permiso()
            {
                Rolxpermisos = new HashSet<Rolxpermiso>();
            }

            public int PermisoId { get; set; }
            public string? NombrePermiso { get; set; }
            public ulong? EstadoPermiso { get; set; }

            public virtual ICollection<Rolxpermiso> Rolxpermisos { get; set; }
        }
        public partial class PermisoCrearyActualizar
        {
            public int PermisoId { get; set; }
            public string? NombrePermiso { get; set; }
            public ulong? EstadoPermiso { get; set; }

        }

        public class RolAcceso
        {
            public int? RolId { get; set; }
            public string? NombreRol { get; set; }
            public ulong? EstadoRol { get; set; }
            public virtual List<RolxpermisoAcceso>? RolxPermisoAcceso { get; set; }

        }
        public class PermisoAcceso
        {
            public int? PermisoId { get; set; }
            public string? NombrePermiso { get; set; }
            public virtual List<RolxpermisoNombres>? RolxPermisoNombres { get; set; }

        }
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


}

