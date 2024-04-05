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
<<<<<<< HEAD
=======
        [JsonIgnore]
>>>>>>> 6a5dea06a22ba1f88640874d83d41e64702ffe89
        public virtual ICollection<Producto> Productos { get; set; }
    }
}
