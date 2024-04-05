using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;


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
        [JsonIgnore]
        public virtual ICollection<Producto> Productos { get; set; }
    }
}
