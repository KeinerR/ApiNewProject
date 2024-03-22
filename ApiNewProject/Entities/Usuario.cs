using System;
using System.Collections.Generic;

namespace ApiNewProject.Entities
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

        public virtual Rol? Rol { get; set; }
        public virtual ICollection<Domicilio> Domicilios { get; set; }
    }
}
