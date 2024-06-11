using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace ApiNewProject.Entities
{
    public partial class CategoriaxMarca
    {
        public int CategoriaId { get; set; }
        public int MarcaId { get; set; }
    }
}
