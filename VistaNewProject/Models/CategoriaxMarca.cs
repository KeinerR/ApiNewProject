﻿namespace VistaNewProject.Models
{
    public class CategoriaxMarca
    {
        public int CategoriaId { get; set; }
        public string NombreCategoria { get; set; }
        public int MarcaId { get; set; }
        public bool EstaAsociada { get; set; } // Nuevo atributo para indicar si la categoría está asociada o no
    }
}