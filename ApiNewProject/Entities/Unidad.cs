using System;
using System.Collections.Generic;


namespace ApiNewProject.Entities
{
    public partial class Unidad
    {
        public Unidad()
        {
            Productos = new HashSet<Producto>();
        }

        public int UnidadId { get; set; }
        public string? DescripcionUnidad { get; set; }
        public virtual ICollection<Producto> Productos { get; set; }
    }
}
