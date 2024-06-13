using Microsoft.AspNetCore.Mvc;

namespace ApiNewProject.Entities
{

    public partial class CategoriaxUnidad
    {
        public int CategoriaId { get; set; }
        public int UnidadId { get; set; }
        public string? NombreCategoria { get; set; }
        public ulong? EstadoCategoria { get; set; }


    }
}
