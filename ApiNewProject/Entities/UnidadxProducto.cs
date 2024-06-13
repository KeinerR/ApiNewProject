using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace ApiNewProject.Entities
{
    public partial class UnidadxProducto
    {
        public int UnidadId { get; set; }
        public int ProductoId { get; set; }
        public virtual Producto ? Producto{ get; set; }
        public virtual Unidad ? Unidad{ get; set; }
    }
}
