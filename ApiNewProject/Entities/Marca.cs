using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

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
        [JsonIgnore]
        public virtual ICollection<Producto> Productos { get; set; }
    }
}
