using Microsoft.AspNetCore.Mvc;

namespace VistaNewProject.Models
{
       public class CategoriaxMarca
    {
        public int CategoriaId { get; set; }
        public string NombreCategoria { get; set; }
        public int MarcaId { get; set; }
        public bool EstaAsociada { get; set; } // Nuevo atributo para indicar si la categoría está asociada o no
    }
    public class CategoriaxMarcaAsosiacion
    {
        public int CategoriaId { get; set; }
        public int MarcaId { get; set; }
    }
    public class CategoriaxPresentacion
    {
        public int CategoriaId { get; set; }
        public int PresentacionId { get; set; }
        public string? NombreCategoria { get; set; } = "No aplica";
        public bool EstaAsociada { get; set; } // Nuevo atributo para indicar si la categoría está asociada o no
    }
    public class CategoriaxPresentacionAsosiacion
    {
        public int CategoriaId { get; set; }
        public int PresentacionId { get; set; }
    }

}
