using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.ModelBinding;
namespace VistaNewProject.Models
{
    public class Marca
    {
        [BindNever]
        public int MarcaId { get; set; }
        [Required(ErrorMessage = "El nombre de la marca es obligatorio.")]
        [StringLength(40, ErrorMessage = "El nombre de la marca no puede exceder los 40 caracteres.")]
        public string? NombreMarca { get; set; }
        [BindNever]
        public ulong? EstadoMarca { get; set; }

    }
}
