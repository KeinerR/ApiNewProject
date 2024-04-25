using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace ApiNewProject.Entities
{
    public partial class Categoria
    {
        public Categoria()
        {
            Productos = new HashSet<Producto>();
        }

        public int CategoriaId { get; set; }
   
        public string? NombreCategoria { get; set; }
        public ulong? EstadoCategoria { get; set; }
        [JsonIgnore]

        public virtual ICollection<Producto> Productos { get; set; }
    }
}
