using Microsoft.AspNetCore.Mvc;

namespace ApiNewProject.Entities
{
  
    public partial class CategoriaxPresentacion
    {
        public int CategoriaId { get; set; }
        public int PresentacionId { get; set; }
        public string ? NombreCategoria { get; set; }
        public ulong  ? EstadoCategoria { get; set; }
        public string ?  NombrePresentacion { get; set; }
        public string ? Contenido { get; set; }
        public int? CantidadPorPresentacion { get; set; }
        public ulong? EstadoPresentacion { get; set; }


    }
}
