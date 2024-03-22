using System;
using System.Collections.Generic;

namespace ApiNewProject.Entities
{
    public partial class Marca
    {
        public Marca()
        {
            Productos = new HashSet<Producto>();
        }

        public int MarcaId { get; set; }
        public string? NombreMarca { get; set; }

        public virtual ICollection<Producto> Productos { get; set; }
    }
}
