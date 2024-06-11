using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.ModelBinding;
namespace VistaNewProject.Models
{
    public class CategoriaUpdate
    {
        public int CategoriaId { get; set; }

        [Required(ErrorMessage = "El nombre de la categoría es obligatorio.")]
        [StringLength(40, ErrorMessage = "El nombre de la categoría no puede exceder los 40 caracteres.")]
        public string? NombreCategoria { get; set; }
        public ulong? EstadoCategoria { get; set; }

    }
}
