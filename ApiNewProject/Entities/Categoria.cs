using System;
using System.Collections.Generic;

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

        public virtual ICollection<Producto> Productos { get; set; }
    }
}
